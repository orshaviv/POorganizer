import {
    Body,
    Controller, Delete,
    Get, Logger, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe,
} from "@nestjs/common";
import {ContactService} from "./contact.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {GetContactsFilterDto} from "./dto/get-contacts-filter.dto";
import {Contact} from "./contact.entity";
import {ContactDTO} from "./dto/contact.dto";
import {Supplier} from "../suppliers/supplier.entity";
import {AuthGuard} from "@nestjs/passport";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {ContactInformation} from "./contact-information.entity";
import {GetContactInformationFilterDto} from "./dto/get-contact-information-filter.dto";

@Controller('contacts')
@UseGuards(AuthGuard())
export class ContactController {
    private logger = new Logger('ContactController');
    constructor(
        private readonly contactService: ContactService
    ) {}

    @Get()
    getContacts(
        @Body(ValidationPipe) filterDto: GetContactsFilterDto,
        @GetUser() user: User,
    ): Promise<Contact[]> {
        this.logger.verbose(`User ${user.firstName} ${user.lastName} retrieving contacts. Filters: ${JSON.stringify(filterDto)}.`);
        return this.contactService.getContacts(filterDto, user);
    }

    @Get('id')
    getContactById(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Contact> {
        return this.contactService.getContactById(id, user);
    }

    // @Post('add')
    // @UsePipes(ValidationPipe)
    // addContact(
    //     @Body() contactDto: ContactDTO,
    //     @Body() supplier: Supplier,
    //     @GetUser() user: User,
    // ): Promise<Contact> {
    //     return this.contactService.addContact(contactDto, supplier, user);
    // }

    @Post('addcontactinformation')
    @UsePipes(ValidationPipe)
    addContactInformation(
        @Body() contactInformationDto: ContactInformationDto,
        @GetUser() user: User,
    ): Promise<ContactInformation> {
        return this.contactService.addContactInformation(contactInformationDto,null, user);
    }

    @Delete('removecontactinformation')
    @UsePipes(ValidationPipe)
    removeContactInformation(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.contactService.removeContactInformation(id, user);
    }
}
