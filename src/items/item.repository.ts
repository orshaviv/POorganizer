import {EntityRepository, Repository} from "typeorm";
import {Item} from "./item.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {GetItemsFilterDto} from "./dto/get-items-filter.dto";
import {ItemDto} from "./dto/item-dto";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
    private logger = new Logger('ItemRepository');

    async getItems(
        filterDto: GetItemsFilterDto,
        user: User
    ): Promise<Item[]> {
        const { id, search } = filterDto;
        const query = this.createQueryBuilder('item')
            .leftJoinAndSelect('item.type', 'type');

        query.where('item.userId = :userId', { userId: user.id });

        if (id) {
            query.andWhere('item.id = :id', { id });
        }

        if (search) {
            query.andWhere(
                'item.catalogNumber LIKE :search OR ' +
                'item.name LIKE :search OR ' +
                'type.type LIKE :search'
                ,{search: `%${search}%`}
            );
        }

        try {
            const items = await query.getMany();
            return items;
        } catch (error) {
            this.logger.error(`Failed to get items for user ${user.firstName} ${user.lastName}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async getItemById(
        id: number,
        user: User
    ): Promise<Item> {
        const query = await this.createQueryBuilder('item')
            .leftJoinAndSelect('item.type','type')
            .where('item.userId = :userId', { userId: user.id });

        query.andWhere('item.id = :id', { id });

        return query.getOne();
    }

    async createOrFindItem(
        itemDto: ItemDto,
        user: User,
    ): Promise<Item> {
        const { catalogNumber, name, type } = itemDto;

        let item = await this.findOne( { catalogNumber, userId : user.id })

        if (item) {
            return item;
        }

        item = new Item();
        item.catalogNumber = catalogNumber;
        item.name = name;
        item.type = type;
        item.user = user;

        try {
            await item.save();
        }catch(error){
            this.logger.error('Error saving new item.', error.stack);
            throw error;
        }

        delete item.user;
        return item;
    }
}
