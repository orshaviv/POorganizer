import {
    BadRequestException,
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
import {ItemService} from "../items/item.service";
import {Supplier} from "../suppliers/supplier.entity";
import {SupplierDTO} from "../suppliers/dto/supplier.dto";
import {Contact} from "../contacts/contact.entity";
import {ContactDTO} from "../contacts/dto/contact.dto";
import {Item} from "../items/item.entity";
import {ItemDto} from "../items/dto/item-dto";
import {UpdatePurchaseOrderDto} from "./dto/update-purchase-order.dto";

@Injectable()
export class PurchaseOrderService {
    private logger = new Logger('PurchaseOrderService');

    private defaultTaxValue = 0.17;

    constructor(
        @InjectRepository(PurchaseOrderRepository)
        private purchaseOrderRepo: PurchaseOrderRepository,

        private readonly supplierService: SupplierService,
        private readonly contactService: ContactService,
        private readonly itemService: ItemService,
    ) {}

    getPurchaseOrders(
        user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderRepo.getPurchaseOrders(user);
    }

    getPurchaseOrderById(
        id: number, user: User
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderRepo.findOne({ id, userId: user.id });
    }

    async createPurchaseOrder(
        purchaseOrderDto: PurchaseOrderDto,
        user: User,
    ): Promise<PurchaseOrder> {
        let purchaseOrder = new PurchaseOrder();

        const supplier = await this.getOrCreateSupplierFromSupplierRepository(purchaseOrderDto, user);
        purchaseOrder.supplierName = supplier.name;

        const contact = await this.getOrCreateContactFromContactRepository(purchaseOrderDto, supplier, user);
        purchaseOrder.contactName = contact.first_name + ' ' + contact.last_name;

        const { catalogNumbers, itemsId, quantities, details, itemsCost } = purchaseOrderDto;

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
        purchaseOrder.catalogNumber = itemsList.map(item => item.catalogNumber);
        purchaseOrder.quantity = quantities.map(quantity => quantity.toString());
        purchaseOrder.details = details;
        purchaseOrder.itemCost = itemsCost.map(itemCost => itemCost.toString());
        purchaseOrder.totalCostBeforeTax = itemsCost.reduce( (a, b) => a + b, 0);
        purchaseOrder.taxPercentage = purchaseOrderDto.taxPercentage || this.defaultTaxValue;

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

        purchaseOrder.companyName = user.userPreferences.companyName || "";
        purchaseOrder.companyCode = user.userPreferences.companyCode || "";
        purchaseOrder.companyAddress = user.userPreferences.companyAddress || "";
        purchaseOrder.companyEmail = user.userPreferences.companyEmail || "";
        purchaseOrder.companyWebsite = user.userPreferences.companyWebsite || "";

        purchaseOrder.user = user;

        try{
            await purchaseOrder.save();
        }catch(error){
            throw new InternalServerErrorException('Error saving purchase order', error.stack);
        }

        delete purchaseOrder.user;
        return purchaseOrder;
    }

    async updatePurchaseOrderStatus(
        updatePurchaseOrderDto: UpdatePurchaseOrderDto,
        user: User
    ): Promise<PurchaseOrder> {
        const { id, poStatus, deliveryMethod, paymentMethod, paymentStatus, completionDate } = updatePurchaseOrderDto;

        const purchaseOrder = await this.getPurchaseOrderById(id, user);

        if(!purchaseOrder)
            throw new NotFoundException(`PO with ID ${ id } not found.`);

        if (poStatus)
            purchaseOrder.poStatus = this.updatePoStatus(poStatus);
        if (deliveryMethod)
            purchaseOrder.deliveryMethod = this.updateDeliveryMethod(deliveryMethod);
        if (paymentMethod)
            purchaseOrder.paymentMethod = paymentMethod;
        if (paymentStatus)
            purchaseOrder.paymentStatus = this.updatePaymentStatus(paymentStatus);
        if (completionDate)
            purchaseOrder.completionDate = new Date(completionDate);

        await purchaseOrder.save();

        delete purchaseOrder.user;
        return purchaseOrder;
    }

    private async getOrCreateSupplierFromSupplierRepository(
        purchaseOrderDto: PurchaseOrderDto,
        user: User
    ): Promise<Supplier> {
        const { supplierId, supplierName } = purchaseOrderDto;

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

    private async getOrCreateContactFromContactRepository(
        purchaseOrderDto: PurchaseOrderDto,
        supplier: Supplier,
        user: User
    ): Promise<Contact> {
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

        const yearlyPoCount = poTillNow.length - poTillLastYear.length;
        if (yearlyPoCount < 0)
            throw new ConflictException('Something went wrong counting the POs.');

        return currentDate.getFullYear().toString().substr(-2) + yearlyPoCount.toString().padStart(3, '0');
    }

    private updatePoStatus(poStatus: string): POStatus {
        if (poStatus.toUpperCase() === 'OPEN') {
            return POStatus.OPEN;
        }else if (poStatus.toUpperCase() === 'SENT') {
            return POStatus.SENT
        }else if (poStatus.toUpperCase() === 'CANCELED') {
            return POStatus.CANCELED;
        }
        throw new BadRequestException('PO status is not valid');
    }

    private updateDeliveryMethod(deliveryMethod: string): DeliveryMethod {
        if (deliveryMethod.toUpperCase() === 'PICKUP') {
            return DeliveryMethod.PICKUP;
        } else if (deliveryMethod.toUpperCase() === 'DELIVERY') {
            return DeliveryMethod.DELIVERY;
        }
        throw new BadRequestException('Delivery method is not valid');
    }

    private updatePaymentStatus(paymentStatus: string): PaymentStatus {
        if (paymentStatus.toUpperCase() === 'PAID') {
            return PaymentStatus.PAID;
        } else if (paymentStatus.toUpperCase() === 'REFUND') {
            return PaymentStatus.REFUND;
        }else if (paymentStatus.toUpperCase() === 'PENDING') {
            return PaymentStatus.PENDING;
        }
        throw new BadRequestException('Payment method is not valid');
    }
}
