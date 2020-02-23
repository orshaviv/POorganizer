import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Contact} from "./contact.interface";
import {ContactController} from "./contact.controller";
import {ContactService} from "./contact.service";

@Module({
    imports: [TypeOrmModule.forFeature([Contact])],
    controllers: [ContactController],
    providers: [ContactService],
})

export class ContactModule {}