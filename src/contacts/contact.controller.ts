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
    async getById(@Query('name') name: string){
        const result = await this.contactService.getContactByFirstName(name);
        if (!result){
            throw new NotFoundException('no such contact name exists');
        }
        return result;
    }

    @Post('add')
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

    @Get('remove')
    async removeContact(@Query('id') id: number) {
        return await this.contactService.removeContact(id);
    }
}
