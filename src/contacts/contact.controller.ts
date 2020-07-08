import {
    Body,
    Controller, Delete,
    Get, Logger, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes, ValidationPipe,
} from "@nestjs/common";
import {ContactService} from "./contact.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {Contact} from "./contact.entity";
import {AuthGuard} from "@nestjs/passport";
import {ContactInformationDto} from "./dto/contact-information.dto";
import {ContactInformation} from "./contact-information.entity";

@Controller('contacts')
@UseGuards(AuthGuard())
export class ContactController {
    private logger = new Logger('ContactController');
    constructor(
        private readonly contactService: ContactService
    ) {}

    @Get()
    getContacts(
        @Query('search') search: string,
        @GetUser() user: User,
    ): Promise<Contact[]> {
        this.logger.verbose(`User ${ user.firstName } ${ user.lastName } retrieving contacts. Filters: ${ JSON.stringify(search) }.`);
        return this.contactService.getContacts(search, user);
    }

    @Get('id/:id')
    getContactById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Contact> {
        return this.contactService.getContactById(id, user);
    }

    @Get('supplierid/:id')
    getContactBySupplierId(
        @Param('id', ParseIntPipe) supplierId: number,
        @GetUser() user: User,
    ): Promise<Contact[]> {
        return this.contactService.getContactBySupplierId(supplierId, user);
    }

    @Post('id/:id/addinformation')
    @UsePipes(ValidationPipe)
    addContactInformation(
        @Param('id', ParseIntPipe) id: number,
        @Body() contactInformationDto: ContactInformationDto,
        @GetUser() user: User,
    ): Promise<ContactInformation> {
        contactInformationDto.contactId = id;
        return this.contactService.addContactInformation(contactInformationDto, null, user);
    }

    @Delete('id/:id/removeinformation')
    @UsePipes(ValidationPipe)
    removeContactInformation(
        @Param('id', ParseIntPipe) contactId: number,
        @Query('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.contactService.removeContactInformation(id, contactId, user);
    }
}
