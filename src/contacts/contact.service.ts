import {HttpException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Contact} from "./contact.interface";
import {Repository} from "typeorm";
import {ContactDTO} from "./contact.dto";
import {setNewContact} from "./setNewContact";
import {Supplier} from "../suppliers/supplier.interface";
import {SupplierService} from "../suppliers/supplier.service";
import {Injector} from "@nestjs/core/injector/injector";

@Injectable()
export class ContactService {
    constructor(@InjectRepository(Contact) private repo: Repository<Contact>, private supplierService: SupplierService) {
    }

    welcomeScreen() {
        return 'Welcome to contacts screen. For all contacts go to /contacts/all. ';
    }

    async getAllContacts() {
        return await this.repo.find({});
    }

    async getContactByFirstName(name: string) {
        return await this.repo.find({first_name: name});
    }

    async getContactBySupId(id: number) {
        return await this.repo.find({supplier_id: id});
    }

    async addContact(contactDTO: ContactDTO) {
        let supplier = await this.supplierService.getSupplierById(contactDTO.supplier_id).catch(err => {
            return undefined;
        });
        if (!supplier){
            throw new HttpException('Supplier is not valid', 404);
        }

        let contact = setNewContact(contactDTO);
        if (!contact) {
            throw new HttpException('Contact is not valid', 404);
        }
        await this.repo.save(contact);
        throw new HttpException('Contact has been added', 200);
        
        /*
        return this.supplierService.getSupplierById(contactDTO.supplier_id).then((supplier) => {
            if (!supplier){
                throw new HttpException('Supplier id is not valid', 422);
                //throw new Error('Supplier id is not valid');
            }else{
                let contact = setNewContact(contactDTO);
                if (!contact) {
                    throw new Error('Contact is not valid');
                }
                this.repo.save(contact);
                throw new HttpException('Contact has been added', 200);
            }
        }).catch(res => res);
        */
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