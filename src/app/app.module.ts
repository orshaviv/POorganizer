import {Module} from "@nestjs/common";
import {SupplierModule} from "../suppliers/supplier.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmConfig} from "../config/typeorm.config";
import {AuthModule} from "../auth/auth.module";
import {ContactModule} from "../contacts/contact.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        SupplierModule,
        ContactModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

