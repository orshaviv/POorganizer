import {EntityRepository, Not, Repository} from "typeorm";
import {Item} from "./item.entity";
import {InternalServerErrorException, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {ItemDto} from "./dto/item-dto";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
    private logger = new Logger('ItemRepository');

    async getItems(
        search: string,
        user: User
    ): Promise<Item[]> {
        const query = this.createQueryBuilder('item')

        query.where('item.userId = :userId', { userId: user.id });

        if (search) {
            query.andWhere(
                'item.catalogNumber LIKE :search OR ' +
                'item.name LIKE :search OR ' +
                'item.type LIKE :search',{ search: `%${ search }%` });
        }

        try {
            const items = await query.getMany();
            return items;
        } catch (error) {
            this.logger.error(`Failed to get items for user ${ user.firstName } ${ user.lastName }. Filters: ${ JSON.stringify(search) }`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createOrFindItem(
        itemDto: ItemDto,
        user: User,
    ): Promise<Item> {
        const { catalogNumber, name, type } = itemDto;

        let item = await this.findOne( { catalogNumber, userId : user.id })

        if (item) {
            this.logger.verbose(`Item ${ catalogNumber } already exists in the database.`);
            return item;
        }

        this.logger.verbose(`Creating new item ${ catalogNumber }.`);
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

    async updateItem(
        itemDto: ItemDto,
        user: User
    ):Promise<Item> {
        const { catalogNumber, name, type, id } = itemDto;

        let item = await this.findOne( { catalogNumber, id: Not(id), userId: user.id })

        if (item) {
            this.logger.verbose(`Item ${ catalogNumber } already exists in the database.`);
            throw new UnauthorizedException(`Item ${ catalogNumber } already exists in the database.`);
        }

        item = await this.findOne({ id: id, userId: user.id })

        if (!item) {
            throw new NotFoundException(`Item with ID ${ id } not found.`);
        }

        if (catalogNumber)
            item.catalogNumber = catalogNumber;
        if (name)
            item.name = name;
        if (type)
            item.type = type;

        try {
            await item.save();
        }catch(error){
            this.logger.error('Error saving item.', error.stack);
            throw error;
        }

        delete item.user;

        return item;
    }
}
