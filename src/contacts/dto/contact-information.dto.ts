import {IsNotEmpty, IsOptional} from "class-validator";

export class ContactInformationDto {
    @IsNotEmpty()
    public phoneType: string;

    @IsOptional()
    @IsNotEmpty()
    public locale: string;

    @IsNotEmpty()
    public phoneNumber: string;

    @IsOptional()
    @IsNotEmpty()
    public contactId!: number;
}
