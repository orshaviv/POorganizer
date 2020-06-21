import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PurchaseOrderRepository} from "../purchaseorder/purchaseorder.repository";
import {AuthModule} from "../auth/auth.module";
import {GeneratePdfService} from "./generate-pdf.service";
import {PurchaseOrderService} from "../purchaseorder/purchaseorder.service";
import {GeneratePdfController} from "./generate-pdf.controller";
import {ContactService} from "../contacts/contact.service";
import {ContactRepository} from "../contacts/contact.repository";
import {ContactInformationRepository} from "../contacts/contact-information.repository";
import {ItemRepository} from "../items/item.repository";
import {ItemService} from "../items/item.service";
import {SupplierRepository} from "../suppliers/supplier.repository";
import {SupplierTypeRepository} from "../suppliers/supplier-type.repository";
import {SupplierService} from "../suppliers/supplier.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            PurchaseOrderRepository,
            SupplierRepository,
            SupplierTypeRepository,
            ContactRepository,
            ContactInformationRepository,
            ItemRepository
        ]),
        AuthModule,
    ],
    providers: [
        GeneratePdfService,
        PurchaseOrderService,
        SupplierService,
        ContactService,
        ItemService,
    ],
    controllers: [GeneratePdfController],
    exports: [GeneratePdfService],
})

export class GeneratePdfModule {}
