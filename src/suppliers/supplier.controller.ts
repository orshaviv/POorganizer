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
        let supplier = await this.supplierService.getSupplierById(id).catch(err => {
            console.log('controller: supplier not found');
            return err;
        });
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
        return await this.supplierService.removeSupplier(name);
    }

    @Post('addcontact')
    async addNewContact(@Body() contactDTO: ContactDTO){
        return await this.contactService.addContact(contactDTO);
    }
}
