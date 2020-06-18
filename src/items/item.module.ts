import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {ItemRepository} from "./item.repository";
import {ItemService} from "./item.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ItemRepository,
        ]),
        AuthModule
    ],
    providers: [ItemService],
    controllers: [],
    exports: [ItemService]
})

export class ItemModule {}
