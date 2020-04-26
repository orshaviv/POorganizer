import {
    Body,
    Controller,
    Get,
    Post, Delete, ValidationPipe, UsePipes, BadRequestException
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {SupplierDTO} from "./dto/supplier.dto";
import {Supplier} from "./supplier.interface";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";

@Controller('suppliers')

export class SupplierController {
    constructor(
        private readonly supplierService: SupplierService,
        //private readonly contactService: ContactService
    ) {}

    @Get()
    getAllSuppliers(@Body(ValidationPipe) filterDto: GetSuppliersFilterDto): Promise<Supplier[]> {
        if (Object.keys(filterDto).length){
            return this.supplierService.getSuppliers(filterDto);
        }else{
            return this.supplierService.getAllSuppliers();
        }
    }

    @Get('id')
    getSupplierById(@Body() search: {id: string}){
        let {id} = search;
        return this.supplierService.getSupplierById(id);
    }

    @Get('name')
    getSupplierByName(@Body() search: {name: string} ){
        let {name} = search;
        return this.supplierService.getSupplierByName(name);
    }

    @Post('add')
    @UsePipes(ValidationPipe)
    addNewSupplier(@Body() supplierDTO: SupplierDTO): Promise<Supplier> {
        return this.supplierService.addNewSupplier(supplierDTO);
    }

    @Delete('remove')
    @UsePipes(ValidationPipe)
    removeSupplier(@Body() filterDto: GetSuppliersFilterDto): Promise<Supplier> {
        if (filterDto.id !== undefined && filterDto.search !== undefined){
            throw new BadRequestException('Specify only ID or name of supplier.');
        }
        return this.supplierService.removeSupplier(filterDto);
    }

    /*
    @Post('addcontact')
    async addNewContact(@Body() contactDTO: ContactDTO){
        let contact = await this.contactService.addContact(contactDTO);
        return contact;
    }
    */
}
