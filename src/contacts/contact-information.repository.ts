import {EntityRepository, Repository} from "typeorm";
import {ContactInformation} from "./contact-information.entity";
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";
import {User} from "../auth/user.entity";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {Contact} from "./contact.entity";


@Injectable()
@EntityRepository(ContactInformation)
export class ContactInformationRepository extends Repository<ContactInformation> {
    private logger = new Logger('ContactInformationRepository');

    async addContactInformation(
        contactInformationDto: ContactInformationDto,
        contact: Contact,
        user: User
    ): Promise<ContactInformation> {
        const { phoneType, locale, phoneNumber } = contactInformationDto;

        let contactInformation = new ContactInformation();
        contactInformation.setPhoneNumber(phoneType, locale, phoneNumber);
        contactInformation.contact = contact;
        contactInformation.user = user;

        this.logger.verbose(`Adding contact information to contact ID ${ contact.id }.`);

        try{
            await contactInformation.save();
        }catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                this.logger.verbose(`Contact with phone number "${ phoneNumber }" already exists`, error.code);
                throw new ConflictException(`Contact with phone number "${ phoneNumber }" already exists`);
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
        contactId: number,
        user: User
    ): Promise<void> {
        const res = await this.delete({id, contactId, userId: user.id});

        if (res.affected === 0){
            throw new NotFoundException(`Contact information with ID ${ id } for contact with ID ${ contactId } not found.`);
        }
    }
}
