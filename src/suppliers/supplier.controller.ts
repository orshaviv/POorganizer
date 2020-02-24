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
        const result = await this.supplierService.getSupplierById(id);
        if (!result){
            throw new NotFoundException('no such supplier id exists');
        }

        return result;
    }

    @Get('add')
    async addNewSupplier(@Query('name') name: string){
        if (name.length>45){
            throw new HttpException('Wrong input',422);
        }
        let supplier = new Supplier();
        supplier.supplier_name = name;

        return await this.supplierService.addSupplier(supplier);
    }

    @Get('remove')
    async removeSupplier(@Query('name') name: string){
        if (name.length>45){
            throw new HttpException('Wrong input',422);
        }
        return await this.supplierService.removeSupplier(name);
    }

    @Post('addcontact')
    async addNewContact(@Query('id') id: number, @Body() contactDTO: ContactDTO){
        let contact = new Contact();
        contact.first_name = contactDTO.first_name;
        contact.last_name = contactDTO.last_name;
        contact.email = contactDTO.email;
        contact.tel = contactDTO.tel;
        contact.supplier_id = id;
        console.log(contactDTO);

        return await this.contactService.addContact(contact);
    }
}
