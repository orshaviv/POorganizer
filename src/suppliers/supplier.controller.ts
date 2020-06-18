import {
    Body,
    Controller,
    Get,
    Post,
    Delete,
    ValidationPipe,
    UsePipes,
    BadRequestException,
    Patch,
    ParseIntPipe,
    UseGuards,
    Logger,
    NotFoundException
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
import {ContactService} from "../contacts/contact.service";
import {ContactDTO} from "../contacts/dto/contact.dto";
import {Contact} from "../contacts/contact.entity";
import {SupplierType} from "./supplier-type.entity";

@Controller('suppliers')
@UseGuards(AuthGuard())
export class SupplierController {
    private logger = new Logger('SupplierController');
    constructor(
        private readonly supplierService: SupplierService,
        private readonly contactService: ContactService
    ) {}

    @Get()
    getSuppliers(
        @Body(ValidationPipe) filterDto: GetSuppliersFilterDto,
        @GetUser() user: User,
    ): Promise<Supplier[]> {
        this.logger.verbose(`User ${user.firstName} ${user.lastName} retrieving suppliers. Filters: ${JSON.stringify(filterDto)}.`);
        return this.supplierService.getSuppliers(filterDto, user);
    }

    @Get('id')
    getSupplierById(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Supplier> {
        return this.supplierService.getSupplierById(id, user);
    }

    @Get('name')
    getSupplierByName(
        @Body('name') name: string,
        @GetUser() user: User
    ): Promise<Supplier> {
        return this.supplierService.getSupplierByName(name, user);
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
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.supplierService.removeSupplier(id, user);
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
    ): Promise<SupplierType[]> {
        return this.supplierService.findTypes(getSuppliersTypesFilterDto);
    }

    @Post('addcontact')
    @UsePipes(ValidationPipe)
    async addNewContact(
        @Body() contactDto: ContactDTO,
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Contact>{
        const supplier = await this.supplierService.getSupplierById(id, user);

        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${id} not found.`);
        }
        return await this.contactService.addContact(contactDto, supplier, user);
    }

}
