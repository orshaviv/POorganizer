import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemRepository} from "./item.repository";
import {GetItemsFilterDto} from "./dto/get-items-filter.dto";
import {User} from "../auth/user.entity";
import {Item} from "./item.entity";
import {ItemDto} from "./dto/item-dto";

@Injectable()
export class ItemService {
    private logger = new Logger('ItemService');
    constructor(
        @InjectRepository(ItemRepository)
        private itemsRepo: ItemRepository,
    ) {}

    getItems(
        filterDto: GetItemsFilterDto,
        user: User
    ): Promise<Item[]> {
        return this.itemsRepo.getItems(filterDto, user);
    }

    async getItemById(
        id: number,
        user: User
    ): Promise<Item> {
        const item = await this.itemsRepo.getItemById(id, user);

        if (!item) {
            throw new NotFoundException(`Item with ID ${ id } not found.`)
        }
        return item;
    }

    async getItemByCatalogNumber(
        catalogNumber: string,
        user: User
    ): Promise<Item> {
        const item = await this.itemsRepo.findOne({ catalogNumber, userId: user.id });

        if (!item) {
            throw new NotFoundException(`Item with catalog number ${ catalogNumber } not found.`)
        }
        return item;
    }

    createOrFindItem(
        itemDto: ItemDto,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.createOrFindItem(itemDto, user);
    }
}
