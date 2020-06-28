import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {ItemRepository} from "./item.repository";
import {ItemService} from "./item.service";
import {ItemController} from "./item.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ItemRepository,
        ]),
        AuthModule
    ],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService]
})

export class ItemModule {}
