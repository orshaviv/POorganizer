import {
    Body,
    Controller,
    Get,
    HttpException, HttpModule, HttpService,
    NotAcceptableException,
    NotFoundException,
    Post,
    Query, Redirect, Res
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {Supplier} from "./supplier.interface";
import {ContactService} from "../contacts/contact.service";
import {ContactDTO} from "../contacts/contact.dto";
import {Contact} from "../contacts/contact.interface";
import {setNewContact} from "../contacts/setNewContact";
import {errorObject} from "rxjs/internal-compatibility";
import {SupplierDTO} from "./supplier.dto";
import {Error} from "@nestjs/core/errors/exceptions/runtime.exception";

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService, private readonly contactService: ContactService) {}

    @Get()
    welcomeScreen(){
        return this.supplierService.welcomeScreen();
    }

    @Get('all')
    getAllSuppliers() {
        return this.supplierService.getAllSuppliers();
    }

    @Get('id')
    async getById(@Query('id') id: number){
        let supplier = await this.supplierService.getSupplierById(id);

        if (typeof supplier === 'undefined'){
            console.log('supplier controller: supplier not found.');
            throw new NotFoundException('supplier id not found');
        }

        /*
            .catch(exception => {
            console.log(`controller: supplier not found. Status code: ${exception.getStatus()}, msg: ${exception.getResponse().message}.`);
            return exception.getResponse();
        });
        */
        return supplier;
    }

    @Get('name')
    async getByName(@Query('name') name: string){
        let supplier = await this.supplierService.getSupplierByName(name);

        if (typeof supplier === 'undefined'){
            console.log('supplier controller: supplier not found.');
            throw new NotFoundException('supplier name not found');
        }

        return supplier;
    }

    @Post('add')
    async addNewSupplier(@Body() supplierDTO: SupplierDTO){
        return await this.supplierService.addSupplier(supplierDTO);
    }

    @Get('remove')
    async removeSupplier(@Query('name') name: string){
        if (name.length>45){
            throw new HttpException('Wrong input',422);
        }
        return await this.supplierService.removeSupplier(name).then(res => res);
    }

    @Post('addcontact')
    async addNewContact(@Body() contactDTO: ContactDTO){
        let contact = await this.contactService.addContact(contactDTO);
        return contact;
    }
}
