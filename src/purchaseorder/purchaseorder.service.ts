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

import {docDesign, fonts} from "./document-design";

@Injectable()
export class PurchaseOrderService {
    private logger = new Logger('PurchaseOrderService');

    private defaultTaxValue = 17;

    constructor(
        @InjectRepository(PurchaseOrderRepository)
        private purchaseOrderRepo: PurchaseOrderRepository,

        private readonly supplierService: SupplierService,
        private readonly contactService: ContactService,
        private readonly itemService: ItemService,
    ) {}

    getPurchaseOrders(
        search: string,
        user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderRepo.getPurchaseOrders(search, user);
    }

    async getPurchaseOrderById(
        id: number, user: User
    ): Promise<PurchaseOrder> {
        try {
            return await this.purchaseOrderRepo.findOne({id, userId: user.id});
        } catch (error) {
            this.logger.error(`Failed to get supplier with ID ${ id } for user ${user.firstName} ${user.lastName}.`, error.stack);
            throw new InternalServerErrorException(error);
        }
    }

    async createPurchaseOrder(
        purchaseOrderDto: PurchaseOrderDto,
        user: User,
    ): Promise<PurchaseOrder> {
        let purchaseOrder = new PurchaseOrder();

        const { supplierId, supplierName } = purchaseOrderDto;
        const supplierDTO = new SupplierDTO();
        supplierDTO.id = supplierId;
        supplierDTO.name = supplierName
        const supplier = await this.supplierService.getOrCreateSupplier(supplierDTO, user);
        purchaseOrder.supplierName = supplier.name;

        const { contactId, contactFirstName, contactLastName } = purchaseOrderDto;
        const contactDTO = new ContactDTO();
        contactDTO.contact_id = contactId;
        contactDTO.first_name = contactFirstName;
        contactDTO.last_name = contactLastName;
        const contact = await this.contactService.getOrCreateContact(contactDTO, supplier, user);
        purchaseOrder.contactName = contact.first_name + ' ' + contact.last_name;

        const { catalogNumbers, itemsId, quantities, details, itemsCost } = purchaseOrderDto;

        const itemsList = await this.makeItemsList(catalogNumbers, itemsId, quantities, details, itemsCost, user);

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

        const { catalogNumbers, itemsId, quantities, details, itemsCost } = updatePurchaseOrderDto;
        if (catalogNumbers || itemsId){
            const itemsList = await this.makeItemsList(catalogNumbers, itemsId, quantities, details, itemsCost, user);

            purchaseOrder.catalogNumber = itemsList.map(item => item.catalogNumber);
            purchaseOrder.quantity = quantities.map(quantity => quantity.toString());
            purchaseOrder.details = details;
            purchaseOrder.itemCost = itemsCost.map(itemCost => itemCost.toString());
            purchaseOrder.totalCostBeforeTax = itemsCost.reduce( (a, b) => a + b, 0);
        }

        await purchaseOrder.save();

        delete purchaseOrder.user;
        return purchaseOrder;
    }

    async generatePdf(
        purchaseOrder: PurchaseOrder,
        user: User,
    ): Promise<any> {
        const PdfPrinter = require('pdfmake');
        const printer = new PdfPrinter(fonts);

        const headerLogo = user.userPreferences.headerLogo || '';
        const footerLogo = user.userPreferences.footerLogo || '';

        const docDefinition = docDesign(purchaseOrder, headerLogo, footerLogo);

        return await printer.createPdfKitDocument(docDefinition, {});
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

    private async makeItemsList(
        catalogNumbers: string[],
        itemsId: number[],
        quantities: number[],
        details: string[],
        itemsCost: number[],
        user: User,
    ): Promise<Item[]> {
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

        return itemsList;
    }
}
