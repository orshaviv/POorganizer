import {BadRequestException, Injectable, InternalServerErrorException, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ContactRepository} from "./contact.repository";
import {User} from "../auth/user.entity";
import {Contact} from "./contact.entity";
import {ContactDTO} from "./dto/contact.dto";
import {Supplier} from "../suppliers/supplier.entity";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {ContactInformationRepository} from "./contact-information.repository";
import {ContactInformation} from "./contact-information.entity";

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
        search: string,
        user: User
    ): Promise<Contact[]> {
        return this.contactsRepo.getContacts(search, user);
    }

    getContactById(
        id: number,
        user: User,
    ): Promise<Contact> {
        return this.contactsRepo.findOne( { id: id, userId: user.id });
    }

    getContactByName(
        name: string,
        user: User,
    ): Promise<Contact> {
        return this.contactsRepo.findOne( { name, userId: user.id });
    }

    getContactBySupplierId(
        supplierId: number,
        user: User,
    ): Promise<Contact[]> {
        return this.contactsRepo.find({ supplierId, userId: user.id });
    }

    async addContact(
        contactDto: ContactDTO,
        supplier: Supplier,
        user: User
    ): Promise<Contact> {
        try{
            const contact = await this.contactsRepo.addContact(contactDto, supplier, user);

            if (contact && contactDto.phoneNumber) {
                let contactInformationDto = new ContactInformationDto();
                contactInformationDto.phoneType = contactDto.phoneType;
                contactInformationDto.locale = contactDto.locale;
                contactInformationDto.phoneNumber = contactDto.phoneNumber;

                await this.addContactInformation(contactInformationDto, contact, user);
            }
            return contact;

        }catch(error){
            throw new InternalServerErrorException(error.stack);
        }
    }

    async getOrCreateContact(
        contactDto: ContactDTO,
        supplier: Supplier,
        user: User
    ): Promise<Contact> {
        const { contact_id: contactId, name } = contactDto;

        if (!contactId && !name) {
            throw new BadRequestException('Specify contact ID or name.');
        }

        let contact: Contact;
        if (contactId) {
            // this.logger.log('Find contact by ID.');
            contact = await this.getContactById(contactId, user);
        }

        if (!contact && name) {
            // this.logger.log('Find contact by name.');
            contact = await this.getContactByName(name, user);
        }

        if (!contact && name) {
            // this.logger.log('Creating new contact.');
            let contactDto = new ContactDTO();
            contactDto.name = name;
            contact = await this.addContact(contactDto, supplier, user);
        }

        if (!contact) {
            throw new InternalServerErrorException('Cannot find or create contact.');
        }

        return contact;
    }

    async addContactInformation(
        contactInformationDto: ContactInformationDto,
        contact: Contact,
        user: User,
    ): Promise<ContactInformation> {
        if (!contact) {
            contact = await this.getContactById(contactInformationDto.contactId, user);
        }
        return await this.contactsInformationRepo.addContactInformation(contactInformationDto, contact, user);
    }

    removeContactInformation(
        id: number,
        contactId: number,
        user: User
    ): Promise<void> {
        return this.contactsInformationRepo.removeContactInformation(id,contactId, user);
    }


}
