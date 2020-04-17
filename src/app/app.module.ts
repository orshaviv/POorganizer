import {Module} from "@nestjs/common";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";
import {SupplierModule} from "../suppliers/supplier.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        SupplierModule, //note: check if the imports sequence matters
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private connection: Connection) {}
}
