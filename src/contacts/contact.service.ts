import {HttpException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Contact} from "./contact.interface";
import {Repository} from "typeorm";

@Injectable()
export class ContactService {
    constructor(@InjectRepository(Contact) private repo: Repository<Contact>) {
    }

    welcomeScreen() {
        return 'Welcome to contacts screen. For all contacts go to /contacts/all. ';
    }

    getAllContacts() {
        return this.repo.find({});
    }

    getContactByFirstName(name: string) {
        return this.repo.find({first_name: name});
    }

    getContactBySupId(id: number) {
        return this.repo.find({supplier_id: id});
    }

    async addContact(contact: Contact) {
        await this.repo.save(contact);
        throw new HttpException('Contact has been added', 200);
    }

    async removeContact(id: number) {
        let contactToRemove = await this.repo.findOne({id: id});

        if (contactToRemove) {
            await this.repo.remove(contactToRemove);
            throw new HttpException('Contact has been removed', 200);
        } else {
            throw new HttpException('Contact id not found', 422);
        }
    }
}