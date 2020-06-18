import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {PurchaseOrderRepository} from "./purchaseorder.repository";
import {SupplierRepository} from "../suppliers/supplier.repository";
import {SupplierTypeRepository} from "../suppliers/supplier-type.repository";
import {ContactRepository} from "../contacts/contact.repository";
import {ItemRepository} from "../items/item.repository";
import {PurchaseOrderService} from "./purchaseorder.service";
import {SupplierService} from "../suppliers/supplier.service";
import {ContactService} from "../contacts/contact.service";
import {ItemService} from "../items/item.service";
import {PurchaseOrderController} from "./purchaseorder.controller";
import {ContactInformationRepository} from "../contacts/contact-information.repository";
import {UserPreferencesRepository} from "../user-preferences/user-preferences.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PurchaseOrderRepository,
            SupplierRepository,
            SupplierTypeRepository,
            ContactRepository,
            ContactInformationRepository,
            ItemRepository,
            UserPreferencesRepository
        ]),
        AuthModule
    ],
    providers: [
        PurchaseOrderService,
        SupplierService,
        ContactService,
        ItemService
    ],
    controllers: [PurchaseOrderController],
    exports: [],
})

export class PurchaseOrderModule {}
