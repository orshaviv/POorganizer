import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class ContactDTO{
    @IsString()
    @IsNotEmpty()
    public name!: string;

    @IsOptional()
    @IsString()
    public phoneType!: string;

    @IsOptional()
    @IsString()
    public locale!: string;

    @IsOptional()
    @IsString()
    public phoneNumber!: string;

    @IsOptional()
    @IsNumber()
    public contact_id!: number;

    @IsOptional()
    @IsEmail()
    public email!: string;

    @IsOptional()
    @IsNumber()
    public supplier_id!: number;
}
