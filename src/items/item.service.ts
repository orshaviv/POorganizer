import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ItemRepository} from "./item.repository";
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
        search: string,
        user: User
    ): Promise<Item[]> {
        return this.itemsRepo.getItems(search, user);
    }

    getItemById(
        id: number,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.findOne({ id, userId: user.id });
    }

    getItemByCatalogNumber(
        catalogNumber: string,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.findOne({ catalogNumber, userId: user.id });
    }

    addItem(
        itemDto: ItemDto,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.createOrFindItem(itemDto, user);
    }

    createOrFindItem(
        itemDto: ItemDto,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.createOrFindItem(itemDto, user);
    }

    async removeItem(
        id: number,
        user: User
    ): Promise<void> {
        const res = await this.itemsRepo.delete({ id, userId: user.id });

        if (res.affected === 0) {
            throw new NotFoundException('Item with ID ${ id } not found');
        }
    }

    updateItem(
        itemDto: ItemDto,
        user: User
    ): Promise<Item> {
        return this.itemsRepo.updateItem(itemDto, user);
    }
}
