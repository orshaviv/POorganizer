import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {PurchaseOrderRepository} from "./purchaseorder.repository";
import {User} from "../auth/user.entity";
import {DeliveryMethod, PaymentStatus, POStatus, PurchaseOrder} from "./purchaseorder.entity";
import {PurchaseOrderDto} from "./dto/purchase-order.dto";
import {SupplierService} from "../suppliers/supplier.service";
import {ContactService} from "../contacts/contact.service";
import {GetUser} from "../auth/get-user.decorator";
import {ItemService} from "../items/item.service";
import {Supplier} from "../suppliers/supplier.entity";
import {SupplierDTO} from "../suppliers/dto/supplier.dto";
import {Contact} from "../contacts/contact.entity";
import {ContactDTO} from "../contacts/dto/contact.dto";
import {Item} from "../items/item.entity";
import {ItemDto} from "../items/dto/item-dto";

@Injectable()
export class PurchaseOrderService {
    private logger = new Logger('PurchaseOrderService');

    constructor(
        @InjectRepository(PurchaseOrderRepository)
        private purchaseOrderRepo: PurchaseOrderRepository,

        private readonly supplierService: SupplierService,
        private readonly contactService: ContactService,
        private readonly itemService: ItemService,
    ) {}

    getPurchaseOrders(
        @GetUser() user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderRepo.getPurchaseOrders(user);
    }

    async createPurchaseOrder(
        purchaseOrderDto: PurchaseOrderDto,
        user: User,
    ): Promise<PurchaseOrder> {
        let purchaseOrder = new PurchaseOrder();

        const supplierId = purchaseOrderDto.supplierId ? purchaseOrderDto.supplierId : null;
        const supplierName = purchaseOrderDto.supplierName ? purchaseOrderDto.supplierName : null;

        const supplier = await this.getSupplierFromSupplierRepository(supplierId, supplierName, user);
        purchaseOrder.supplierName = supplier.name;

        const contact = await this.getContactFromContactRepository(purchaseOrderDto, supplier, user);
        purchaseOrder.contactName = contact.first_name + ' ' + contact.last_name;

        const { quantities, catalogNumbers, itemsId, details, itemsCost } = purchaseOrderDto;

        const itemsListLength = itemsId? itemsId.length : catalogNumbers.length;

        if (quantities.length != itemsListLength || details.length != itemsListLength || itemsCost.length != itemsListLength) {
            throw new UnauthorizedException('Some of the items details are missing.');
        }

        let itemsList: Item[] = [];
        for (let itemIndex = 0; itemIndex < itemsListLength; itemIndex++) {
            let item: Item;
            if (itemsId && itemsId[itemIndex]) {
                item = await this.itemService.getItemById(itemsId[itemIndex], user);
            }else{
                let itemDto = new ItemDto();
                itemDto.catalogNumber = catalogNumbers[itemIndex];
                item = await this.itemService.createOrFindItem(itemDto, user);
            }

            itemsList.push(item);
        }
        purchaseOrder.quantity = quantities.map(quantity => quantity.toString());
        purchaseOrder.catalogNumber = itemsList.map(item => item.catalogNumber);
        purchaseOrder.details = details;
        purchaseOrder.itemCost = itemsCost.map(itemCost => itemCost.toString());
        purchaseOrder.totalCostBeforeTax = itemsCost.reduce( (a, b) => a + b, 0);
        purchaseOrder.taxPercentage = purchaseOrderDto.taxPercentage? purchaseOrderDto.taxPercentage : 0.17;

        purchaseOrder.poId = await this.createPoId(user);
        purchaseOrder.poStatus = POStatus.OPEN;
        if (purchaseOrderDto.deliveryMethod.toUpperCase() === 'DELIVERY') {
            purchaseOrder.deliveryMethod = DeliveryMethod.DELIVERY;
        }else{
            purchaseOrder.deliveryMethod = DeliveryMethod.PICKUP;
        }
        purchaseOrder.paymentMethod = purchaseOrderDto.paymentMethod;
        purchaseOrder.paymentStatus = PaymentStatus.PENDING;
        purchaseOrder.completionDate = new Date(purchaseOrderDto.completionDate);

        purchaseOrder.companyCode = "companyCode";
        purchaseOrder.companyAddress = "companyAddress";
        purchaseOrder.companyEmail = "companyEmail";
        purchaseOrder.companyWebsite = "companyWebsite";

        purchaseOrder.user = user;

        try{
            await purchaseOrder.save();
        }catch(error){
            throw new InternalServerErrorException('Error saving purchase order', error.stack);
        }

        delete purchaseOrder.user;
        return purchaseOrder;
    }

    private async getSupplierFromSupplierRepository(supplierId: number, supplierName: string, user: User): Promise<Supplier> {
        let supplier: Supplier;

        if (supplierId) {
            this.logger.log('Find supplier by ID.');
            supplier = await this.supplierService.getSupplierById(supplierId, user);
        }

        if (!supplier){
            this.logger.log('Find supplier by name.');
            supplier = await this.supplierService.getSupplierByName(supplierName, user);
        }

        if (!supplier) {
            this.logger.log('Creating new supplier.');
            let supplierDto = new SupplierDTO();
            supplierDto.name = supplierName;
            supplier = await this.supplierService.addNewSupplier(supplierDto, user);
        }

        return supplier;
    }

    private async getContactFromContactRepository(purchaseOrderDto: PurchaseOrderDto, supplier: Supplier, user: User): Promise<Contact> {
        const { contactId, contactFirstName, contactLastName } = purchaseOrderDto;

        let contact: Contact;
        if (contactId) {
            contact = await this.contactService.getContactById(contactId, user);
        }else{
            try{
                contact = await this.contactService.getContactByName(contactFirstName, contactLastName, user);
            }catch(error){
                this.logger.error(error);
                let contactDto = new ContactDTO();
                contactDto.first_name = contactFirstName;
                contactDto.last_name = contactLastName;
                contact = await this.contactService.addContact(contactDto, supplier, user);
            }
        }

        return contact;
    }

    private async createPoId (user: User): Promise<string> {
        const currentDate = new Date();
        const lastYearDate = new Date();
        lastYearDate.setFullYear(currentDate.getFullYear() - 1);

        const poTillNow = await this.purchaseOrderRepo
            .getPurchaseOrdersUntilDate(currentDate, user);

        const poTillLastYear = await this.purchaseOrderRepo
            .getPurchaseOrdersUntilDate(lastYearDate, user);

        this.logger.log(`till now: ${poTillNow.length}. till last year: ${poTillLastYear.length}`);
        const yearlyPoCount = poTillNow.length - poTillLastYear.length;
        if (yearlyPoCount < 0)
            throw new ConflictException('Something went wrong counting the POs.');

        return currentDate.getFullYear().toString().substr(-2) + yearlyPoCount.toString().padStart(3, '0');
    }
}
