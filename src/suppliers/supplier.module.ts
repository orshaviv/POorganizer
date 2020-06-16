import {Module} from "@nestjs/common";
import {SupplierController} from "./supplier.controller";
import {SupplierService} from "./supplier.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SupplierRepository} from "./supplier.repository";
import {AuthModule} from "../auth/auth.module";
import {SupplierTypeRepository} from "./supplier-type.repository";
import {ContactService} from "../contacts/contact.service";
import {ContactRepository} from "../contacts/contact.repository";
import {ContactInformationRepository} from "../contacts/contact-information.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SupplierRepository,
            SupplierTypeRepository,
            ContactRepository,
            ContactInformationRepository
        ]),
        AuthModule,
    ],
    providers: [SupplierService, ContactService],
    controllers: [SupplierController],
    exports: [SupplierService],
})

export class SupplierModule {}
