import {Module} from "@nestjs/common";
import {SupplierController} from "./supplier.controller";
import {SupplierService} from "./supplier.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Supplier} from "./supplier.interface";
import {Contact} from "../contacts/contact.interface";

@Module({
    imports: [TypeOrmModule.forFeature([Supplier,Contact])],
    controllers: [SupplierController],
    providers: [SupplierService],
})

export class SupplierModule {}