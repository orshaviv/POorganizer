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
        // private readonly contactService: ContactService
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
        }).catch(err => {
            console.log('Error fetching suppliers data: ' + err);
            throw new ServiceUnavailableException({error: 'Cannot fetch suppliers data.'});
        });
    }

    @Get('id')
    getById(@Query('id') id: number){
        return this.supplierService.getSupplierById(id).then(res => {
            console.log('supplier data fetched by id.');
            return res;
        }).catch(err => {
            console.log('Error fetching supplier by id: ' + err);
            throw new ServiceUnavailableException({error: 'Cannot fetch supplier by id.'});
        });
    }

    @Get('name')
    getByName(@Body() supplier: {name: string}){
        console.log(supplier.name);
        return this.supplierService.getSupplierByName(supplier.name).then(res => {
            console.log('Data fetched by name for supplier id ' + res.id + '.');
            return res;
        }).catch(err => {
            console.log('Error fetching supplier by name: ' + err);
            throw new ServiceUnavailableException({error: 'Cannot fetch supplier by name.'});
        });
    }

    @Post('add')
    addNewSupplier(@Body() supplierDTO: SupplierDTO){
        return this.supplierService.addSupplier(supplierDTO).then(supplier => {
            console.log('Supplier ' + supplier.name + ' has been added.');
            return supplier;
        }).catch(err => {
            console.log('Error adding supplier: ' + err);
            throw new BadRequestException();
        });
    }

    @Delete('remove')
    removeSupplierByName(@Body() supplierDTO: {name: string, id: number}){
        return this.supplierService.findSupplier(supplierDTO).then(supplierToRemove => {
            console.log('removing supplier id ' + supplierToRemove.id + '. ');

            return this.supplierService.removeSupplier(supplierToRemove).then(res => {
                console.log('Supplier ' + res.name + ' has been removed.');
                return res;
            }).catch(err => {
                console.log('Error removing supplier: ' + err);
                throw new BadRequestException();
            });
        }).catch(err => {
            console.log('Supplier not found: ' + err);
            throw new ServiceUnavailableException({error: 'Supplier not found.'});
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
