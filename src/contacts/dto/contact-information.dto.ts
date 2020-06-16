import {IsNotEmpty, IsOptional} from "class-validator";

export class ContactInformationDto {
    public phoneType: string;
    public locale: string;
    public phone: string;

    public contactId!: number;
}
