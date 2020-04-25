import {
    Body,
    Controller,
    Query,
    HttpException,
    NotFoundException,
    Get,
    Post, ServiceUnavailableException, BadRequestException, Put, Delete
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {SupplierDTO} from "./supplier.dto";

@Controller('suppliers')

export class SupplierController {
    constructor(
        private readonly supplierService: SupplierService,
        //private readonly contactService: ContactService
    ) {}

    @Get()
    welcomeScreen(){
        return this.supplierService.welcomeScreen();
    }

    @Get('all')
    getAllSuppliers() {
        return this.supplierService.getAllSuppliers().then(res => {
            console.log('suppliers data fetched.');
            return res;
        }).catch(() => {
            throw new ServiceUnavailableException('Cannot fetch suppliers data.');
        });
    }

    @Get('find')
    getSupplier(@Body() supplierDTO: SupplierDTO){
        return this.supplierService.findSupplier(supplierDTO).then(res => {
            if (!res){
                throw new BadRequestException('Supplier id or name does not exist.');
            }
            console.log('supplier data fetched by id or name.');
            return res;
        }).catch(err => {
            throw err;
        });
    }

    @Post('add')
    addNewSupplier(@Body() supplierDTO: SupplierDTO){
        return this.supplierService.addSupplier(supplierDTO).then(newSupplier => {
            console.log('Supplier ' + newSupplier.name + ' has been added.');
            return newSupplier;
        }).catch(err => {
            throw err;
        });
    }

    @Delete('remove')
    removeSupplier(@Body() supplierDTO: SupplierDTO){
        return this.supplierService.removeSupplier(supplierDTO).then(removedSupplier => {
            console.log('Supplier ' + removedSupplier.name + ' has been removed.');
            return removedSupplier;
        }).catch(err => {
            throw err;
        });
    }

    /*
    @Post('addcontact')
    async addNewContact(@Body() contactDTO: ContactDTO){
        let contact = await this.contactService.addContact(contactDTO);
        return contact;
    }
    */
}
