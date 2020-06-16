import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ContactRepository} from "./contact.repository";
import {GetContactsFilterDto} from "./dto/get-contacts-filter.dto";
import {User} from "../auth/user.entity";
import {Contact} from "./contact.entity";
import {ContactDTO} from "./dto/contact.dto";
import {Supplier} from "../suppliers/supplier.entity";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {ContactInformationRepository} from "./contact-information.repository";
import {ContactInformation} from "./contact-information.entity";
import {GetContactInformationFilterDto} from "./dto/get-contact-information-filter.dto";

@Injectable()
export class ContactService {
    private logger = new Logger('ContactService');
    constructor(
        @InjectRepository(ContactRepository)
        private contactsRepo: ContactRepository,
        @InjectRepository(ContactInformationRepository)
        private contactsInformationRepo: ContactInformationRepository
    ) {}

    getContacts(
        filterDto: GetContactsFilterDto,
        user: User
    ): Promise<Contact[]> {
        return this.contactsRepo.getContacts(filterDto, user);
    }

    async getContactById(
        id: number,
        user: User,
    ): Promise<Contact> {
        const contact = await this.contactsRepo.findOne( { id: id, userId: user.id });

        this.logger.verbose(`Contact found: ${JSON.stringify(contact)}`);
        if (!contact){
            throw new NotFoundException(`Contact with ID ${id} not found.`);
        }

        return contact;
    }

    async addContact(
        contactDto: ContactDTO,
        supplier: Supplier,
        user: User
    ): Promise<Contact> {
        const contact = await this.contactsRepo.addContact(contactDto, supplier, user);

        if (contact && contactDto.phone) {
            let contactInformationDto = new ContactInformationDto();
            contactInformationDto.phoneType = contactDto.phoneType;
            contactInformationDto.locale = contactDto.locale;
            contactInformationDto.phone = contactDto.phone;

            await this.addContactInformation(contactInformationDto, contact, user);
        }

        return contact;
    }

    async addContactInformation(
        contactInformationDto: ContactInformationDto,
        contact: Contact,
        user: User,
    ): Promise<ContactInformation> {
        const { phoneType, locale, phone, contactId } = contactInformationDto;

        if (!contact) {
            contact = await this.getContactById(contactInformationDto.contactId, user);
        }

        this.logger.verbose('Adding contact information.');
        return await this.contactsInformationRepo.addContactInformation(contactInformationDto, contact, user);
    }

    removeContactInformation(
        id: number,
        user: User
    ): Promise<void> {
        return this.contactsInformationRepo.removeContactInformation(id, user);
    }
}
