import {Module} from "@nestjs/common";
import {SupplierController} from "./supplier.controller";
import {SupplierService} from "./supplier.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Supplier} from "./supplier.interface";
import {Contact} from "../contacts/contact.interface";
import {ContactService} from "../contacts/contact.service";

@Module({
    imports: [TypeOrmModule.forFeature([Supplier,Contact])],
    controllers: [SupplierController],
    providers: [SupplierService, ContactService],
    exports: [SupplierService],
})

export class SupplierModule {}