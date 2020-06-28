import {
    Body,
    Controller,
    Get,
    Post,
    Delete,
    ValidationPipe,
    UsePipes,
    Patch,
    ParseIntPipe,
    UseGuards,
    Logger,
    NotFoundException, Param, Query
} from "@nestjs/common";
import {SupplierService} from "./supplier.service";
import {SupplierDTO} from "./dto/supplier.dto";
import {Supplier} from "./supplier.entity";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
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
        @Query('search') search: string,
        @GetUser() user: User,
    ): Promise<Supplier[]> {
        this.logger.verbose(`User ${user.firstName} ${user.lastName} retrieving suppliers.`);
        return this.supplierService.getSuppliers(search, user);
    }

    @Get('id/:id')
    getSupplierById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Supplier> {
        return this.supplierService.getSupplierById(id, user);
    }

    @Get('name')
    getSupplierByName(
        @Query('name') name: string,
        @GetUser() user: User
    ): Promise<Supplier> {
        this.logger.verbose(`User ${user.firstName} ${user.lastName} retrieving supplier name ${ name }.`);
        return this.supplierService.getSupplierByName(name, user);
    }

    @Post('add')
    @UsePipes(ValidationPipe)
    addSupplier(
        @Body() supplierDTO: SupplierDTO,
        @GetUser() user: User,
    ): Promise<Supplier> {
        return this.supplierService.addSupplier(supplierDTO, user);
    }

    @Delete('id/:id/remove')
    @UsePipes(ValidationPipe)
    removeSupplier(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.supplierService.removeSupplier(id, user);
    }

    @Patch('id/:id/update')
    @UsePipes(ValidationPipe)
    updateSupplier(
        @Param('id', ParseIntPipe) id: number,
        @Body() supplierDto: SupplierDTO,
        @GetUser() user: User,
    ): Promise<Supplier> {
        return this.supplierService.updateSupplier(id, supplierDto, user);
    }

    @Get('types/id/:id')
    @UsePipes(ValidationPipe)
    getTypeById(
        @Param('id') id: number,
    ): Promise<SupplierType> {
        return this.supplierService.getTypeById(id);
    }

    @Get('types')
    @UsePipes(ValidationPipe)
    getTypes(
        @Query('search') search: string,
    ): Promise<SupplierType[]> {
        return this.supplierService.getTypes(search);
    }

    @Post('id/:id/contact/add')
    @UsePipes(ValidationPipe)
    async addContact(
        @Param('id', ParseIntPipe) id: number,
        @Body() contactDto: ContactDTO,
        @GetUser() user: User,
    ): Promise<Contact>{
        const supplier = await this.supplierService.getSupplierById(id, user);

        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${ id } not found.`);
        }

        return await this.contactService.addContact(contactDto, supplier, user);
    }

}
