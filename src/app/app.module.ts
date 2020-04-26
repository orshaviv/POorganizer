import {Module} from "@nestjs/common";
import {SupplierModule} from "../suppliers/supplier.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {typeOrmConfig} from "../config/typeorm.config";

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        SupplierModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private connection: Connection) {}
}

