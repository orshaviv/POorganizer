import {
    Body,
    Controller,
    Get,
    HttpException,
    NotAcceptableException,
    NotFoundException,
    Post,
    Query
} from "@nestjs/common";
import {ContactService} from "./contact.service";
import {Contact} from "./contact.interface";
import {ContactDTO} from "./contact.dto";
import {setNewContact} from "./setNewContact";

@Controller('contacts')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Get()
    welcomeScreen(){
        return this.contactService.welcomeScreen();
    }

    @Get('all')
    getAllContacts() {
        return this.contactService.getAllContacts();
    }

    @Get('first')
    async getByFirstName(@Query('name') name: string){
        const result = await this.contactService.getContactByFirstName(name);
        if (!result){
            throw new NotFoundException('no such contact name exists');
        }
        return result;
    }

    @Get('supplierid')
    async getBySupplierId(@Query('id') id: number){
        const result = await this.contactService.getContactBySupId(id);
        if (!result){
            throw new NotFoundException('no such suppliers id exists');
        }
        return result;
    }

    @Post('add')
    async addNewContact(@Body() contactDTO: ContactDTO){
        return await this.contactService.addContact(contactDTO);
    }

    @Get('remove')
    async removeContact(@Query('id') id: number) {
        return await this.contactService.removeContact(id);
    }
}
