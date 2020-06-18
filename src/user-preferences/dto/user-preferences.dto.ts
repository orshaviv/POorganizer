import {IsEmail, IsOptional, IsString} from "class-validator";

export class UserPreferencesDto {
    @IsOptional()
    @IsString()
    public companyName: string;

    @IsOptional()
    @IsString()
    public companyCode: string;

    @IsOptional()
    @IsString()
    public companyAddress: string;

    @IsOptional()
    @IsEmail()
    public companyEmail: string;

    @IsOptional()
    @IsString()
    public companyWebsite: string;
}
