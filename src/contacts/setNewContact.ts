import {ContactDTO} from "./contact.dto";
import {Contact} from "./contact.interface";

export function setNewContact(contactDTO: ContactDTO){
    let contact = new Contact();
    contact.first_name = contactDTO.first_name;
    contact.last_name = contactDTO.last_name;
    contact.email = contactDTO.email;
    contact.tel = contactDTO.tel;
    contact.supplier_id = contactDTO.supplier_id
    console.log(contactDTO);

    return contact;
}