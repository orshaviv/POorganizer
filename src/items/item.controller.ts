import {Body, Controller, Get, Logger, Post, UseGuards, ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ItemService} from "./item.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {Item} from "./item.entity";
import {GetItemsFilterDto} from "./dto/get-items-filter.dto";
import {ItemDto} from "./dto/item-dto";


@Controller('items')
@UseGuards(AuthGuard())
export class ItemController {
    private logger = new Logger('ItemController');

    constructor(
        private readonly itemService: ItemService,
    ) {}

    @Get()
    getItems(
        @Body(ValidationPipe) filterDto: GetItemsFilterDto,
        @GetUser() user: User,
    ): Promise<Item[]> {
        return this.itemService.getItems(filterDto, user);
    }

    @Post('createitem')
    createOrFindItem(
        @Body(ValidationPipe) itemDto: ItemDto,
        @GetUser() user: User,
    ): Promise<Item> {
        return this.itemService.createOrFindItem(itemDto, user);
    }
}
