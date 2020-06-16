import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ContactController} from "./contact.controller";
import {ContactService} from "./contact.service";
import {SupplierService} from "../suppliers/supplier.service";
import {SupplierRepository} from "../suppliers/supplier.repository";
import {ContactRepository} from "./contact.repository";
import {SupplierTypeRepository} from "../suppliers/supplier-type.repository";
import {AuthModule} from "../auth/auth.module";
import {ContactInformationRepository} from "./contact-information.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContactRepository,
            ContactInformationRepository,
            SupplierRepository,
            SupplierTypeRepository
        ]),
        AuthModule
    ],
    controllers: [ContactController],
    providers: [ContactService, SupplierService],
    exports: [ContactService]
})

export class ContactModule {}
