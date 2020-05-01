import {
    Body,
    Controller,
    Get,
    Post, Delete, ValidationPipe, UsePipes, BadRequestException, Patch, Param, ParseIntPipe, UseGuards
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {SupplierDTO} from "./dto/supplier.dto";
import {Supplier} from "./supplier.entity";
import {GetSuppliersFilterDto} from "./dto/get-suppliers-filter.dto";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {GetSuppliersTypesFilterDto} from "./dto/get-suppliers-types-filter.dto";
import {IsNotEmpty} from "class-validator";

class SupplierTypes {
}

@Controller('suppliers')
@UseGuards(AuthGuard())
export class SupplierController {
    constructor(
        private readonly supplierService: SupplierService,
        //private readonly contactService: ContactService
    ) {}

    @Get()
    getSuppliers(
        @Body(ValidationPipe) filterDto: GetSuppliersFilterDto,
        @GetUser() user: User,
    ): Promise<Supplier[]> {
        return this.supplierService.getSuppliers(filterDto, user);
    }

    @Get('id')

    getSupplierById(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Supplier> {
        return this.supplierService.getSupplierById(id, user);
    }

    @Get('name')
    getSupplierByName(
        @Body('name') name: string,
    ): Promise<Supplier> {
        return this.supplierService.getSupplierByName(name);
    }

    @Post('add')
    @UsePipes(ValidationPipe)
    addNewSupplier(
        @Body() supplierDTO: SupplierDTO,
        @GetUser() user: User,
    ): Promise<Supplier> {
        return this.supplierService.addNewSupplier(supplierDTO, user);
    }

    @Delete('remove')
    @UsePipes(ValidationPipe)
    removeSupplier(
        @Body() filterDto: GetSuppliersFilterDto,
        @GetUser() user: User,
    ): Promise<Supplier> {
        if (filterDto.id !== undefined && filterDto.search !== undefined){
            throw new BadRequestException('Specify only ID or name of supplier.');
        }
        return this.supplierService.removeSupplier(filterDto, user);
    }

    @Patch('/update')
    @UsePipes(ValidationPipe)
    updateSupplier(
        @Body() supplierDto: SupplierDTO,
        @GetUser() user: User,
    ): Promise<Supplier> {
        return this.supplierService.updateSupplier(supplierDto, user);
    }

    @Get('suppliertypes')
    @UsePipes(ValidationPipe)
    findTypes(
        @Body() getSuppliersTypesFilterDto: GetSuppliersTypesFilterDto,
    ): Promise<SupplierTypes[]> {
        return this.supplierService.findTypes(getSuppliersTypesFilterDto);
    }

    /*
    @Post('addcontact')
    async addNewContact(@Body() contactDTO: ContactDTO){
        let contact = await this.contactService.addContact(contactDTO);
        return contact;
    }
    */
}
