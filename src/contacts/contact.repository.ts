import {EntityRepository, Repository} from "typeorm";
import {Contact} from "./contact.entity";
import {ConflictException, Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {GetContactsFilterDto} from "./dto/get-contacts-filter.dto";
import {ContactDTO} from "./dto/contact.dto";
import {Supplier} from "../suppliers/supplier.entity";

@Injectable()
@EntityRepository(Contact)
export class ContactRepository extends Repository<Contact> {
    private logger = new Logger('ContactRepository');

    async getContacts(
        filterDto: GetContactsFilterDto,
        user: User
    ): Promise<Contact[]> {
        const {id, search, supplierQuery} = filterDto;
        const query = this.createQueryBuilder('supplier_contact')
            .leftJoinAndSelect('supplier_contact.supplier', 'supplier')
            .leftJoinAndSelect('supplier_contact.contactInformation', 'contactInformation');

        query.where('supplier_contact.userId = :userId', { userId: user.id });

        if (id) {
            query.andWhere('supplier_contact.id = :id', { id });
        }

        if (search) {
            query.andWhere(
                'supplier_contact.first_name LIKE :search OR ' +
                'supplier_contact.last_name LIKE :search OR ' +
                'supplier_contact.email LIKE :search OR ' +
                'contactInformation.phoneType LIKE :search OR ' +
                'contactInformation.locale = :search OR ' +
                'contactInformation.cellphoneNumber LIKE :search OR ' +
                'contactInformation.phoneNumber LIKE :search'
                , {search: `%${search}%`}
            );
        }

        if (supplierQuery) {
            query.andWhere(
                'supplier.name LIKE :search OR ' +
                'supplier.country LIKE :search OR ' +
                'supplier.city LIKE :search OR ' +
                'supplier.streetAddress LIKE :search OR ' +
                'supplier.type LIKE :search OR ' +
                'supplier.notes LIKE :search',{search: `%${supplierQuery}%`}
            );
        }

        try {
            const contacts = await query.getMany();
            return contacts;
        } catch (error) {
            this.logger.error(`Failed to get contacts for user ${user.firstName} ${user.lastName}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async addContact(
        contactDto: ContactDTO,
        supplier: Supplier,
        user: User
    ): Promise<Contact> {
        let contact = new Contact();

        contact.first_name = contactDto.first_name;
        contact.last_name = contactDto.last_name;
        contact.email = contactDto.email;
        contact.supplier = supplier;
        contact.user = user;

        try{
            await contact.save();
            this.logger.verbose('Contact added.');
        }catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                this.logger.verbose(`Contact with the email address "${contactDto.email}" already exists`, error.code);
                throw new ConflictException(`Contact with the email address "${contactDto.email}" already exists`);
            }
            this.logger.error(`Cannot add contact`, error.stack);
            throw new InternalServerErrorException(`Cannot add contact.`);
        }

        delete contact.supplier;
        delete contact.user;

        return contact;
    }
}
