import {
    Body,
    Controller,
    Delete,
    Get,
    Logger, Param,
    ParseIntPipe, Patch,
    Post, Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ItemService} from "./item.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {Item} from "./item.entity";
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
        @Query('search') search: string,
        @GetUser() user: User,
    ): Promise<Item[]> {
        return this.itemService.getItems(search, user);
    }

    @Get('id/:id')
    getItemById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Item> {
        return this.itemService.getItemById(id, user);
    }

    @Get('catalognumber')
    getItemByCatalogNumber(
        @Query('catalognumber') catalogNumber: string,
        @GetUser() user: User,
    ): Promise<Item> {
        return this.itemService.getItemByCatalogNumber(catalogNumber, user);
    }

    @Post('add')
    addItem(
        @Body(ValidationPipe) itemDto: ItemDto,
        @GetUser() user: User,
    ): Promise<Item> {
        return this.itemService.addItem(itemDto, user);
    }

    @Delete('id/:id/remove')
    @UsePipes(ValidationPipe)
    removeItem(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.itemService.removeItem(id, user);
    }

    @Patch('id/:id/update')
    @UsePipes(ValidationPipe)
    updateItem(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) itemDto: ItemDto,
        @GetUser() user: User,
    ): Promise<Item> {
        itemDto.id = id;
        return this.itemService.updateItem(itemDto, user);
    }
}
