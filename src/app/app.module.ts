import {Module} from "@nestjs/common";
import {AppService} from "./app.service";
import {AppController} from "./app.controller";
import {SupplierModule} from "../suppliers/supplier.module";
import {Supplier} from "../suppliers/supplier.interface";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ContactModule} from "../contacts/contact.module";
import {Contact} from "../contacts/contact.interface";

@Module({
    imports: [
        SupplierModule, ContactModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1252',
            database: 'mydb',
            entities: [Supplier,Contact],
            synchronize: false,
            logging: "all"
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
