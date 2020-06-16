import {EntityRepository, Repository} from "typeorm";
import {ContactInformation} from "./contact-information.entity";
import {GetContactInformationFilterDto} from "./dto/get-contact-information-filter.dto";
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {ContactRepository} from "./contact.repository";
import {Contact} from "./contact.entity";
import {filter} from "rxjs/operators";

@Injectable()
@EntityRepository(ContactInformation)
export class ContactInformationRepository extends Repository<ContactInformation> {
    private logger = new Logger('ContactInformationRepository');

    async getContactInformation(
        filterDto: GetContactInformationFilterDto,
        user: User
    ): Promise<ContactInformation[]> {
        const {id, search, contactId} = filterDto;
        const query = this.createQueryBuilder('contact_information');

        query.where('contact_information.userId = :userId', {userId: user.id});

        if (id) {
            query.andWhere('contact_information.id = :id', { id });
        }

        if (search) {
            query.andWhere(
                'contact_information.locale LIKE :search OR ' +
                'contact_information.cellphoneNumber LIKE :search OR ' +
                'contact_information.phoneNumber LIKE :search OR ', {search: `%${search}%`}
            );
        }

        if (contactId) {
            query.andWhere('contact_information.contactId = :contactId', { contactId });
        }

        try {
            const contacts = await query.getMany();
            return contacts;
        } catch (error) {
            this.logger.error(`Failed to get contacts information for user ${user.firstName} ${user.lastName}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async addContactInformation(
        contactInformationDto: ContactInformationDto,
        contact: Contact,
        user: User
    ): Promise<ContactInformation> {
        const { phoneType, locale, phone } = contactInformationDto;

        let contactInformation = new ContactInformation();
        contactInformation.setPhoneNumber(phoneType, locale, phone);
        contactInformation.contact = contact;
        contactInformation.user = user;

        this.logger.verbose(JSON.stringify(contact));

        try{
            await contactInformation.save();
        }catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                this.logger.verbose(`Contact with phone number "${ phone }" already exists`, error.code);
                throw new ConflictException(`Contact with phone number "${ phone }" already exists`);
            }
            this.logger.error(`Cannot add contact information`, error.stack);
            throw new InternalServerErrorException(`Cannot add contact information.`);
        }

        delete contactInformation.contact;
        delete contactInformation.user;

        return contactInformation;
    }

    async removeContactInformation(
        id: number,
        user: User
    ): Promise<void> {
        const res = await this.delete({id, userId: user.id});
        if (res.affected === 0){
            throw new NotFoundException(`Contact information with ID "${id}" not found.`);
        }
    }
}
