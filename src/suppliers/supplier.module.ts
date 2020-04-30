import {Module} from "@nestjs/common";
import {SupplierController} from "./supplier.controller";
import {SupplierService} from "./supplier.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Supplier} from "./supplier.entity";
import {SupplierRepository} from "./supplier.repository";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([SupplierRepository]),
        AuthModule,
    ],
    providers: [SupplierService],
    controllers: [SupplierController],
    exports: [SupplierService],
})

export class SupplierModule {}
