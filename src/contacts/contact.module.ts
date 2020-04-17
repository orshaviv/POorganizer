import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Contact} from "./contact.interface";
import {ContactController} from "./contact.controller";
import {ContactService} from "./contact.service";
import {SupplierService} from "../suppliers/supplier.service";
import {Supplier} from "../suppliers/supplier.interface";

@Module({
    imports: [TypeOrmModule.forFeature([Contact, Supplier])],
    controllers: [ContactController],
    providers: [ContactService, SupplierService],
    exports: [ContactService]
})

export class ContactModule {}
