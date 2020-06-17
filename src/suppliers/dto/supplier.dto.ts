import {IsArray, IsNotEmpty, IsOptional} from "class-validator";

export class SupplierDTO{
    @IsOptional()
    @IsNotEmpty()
    public id: number;

    @IsNotEmpty()
    public name: string;

    @IsOptional()
    @IsNotEmpty()
    public country: string;

    @IsOptional()
    @IsNotEmpty()
    public city: string;

    @IsOptional()
    @IsNotEmpty()
    public streetAddress: string;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    public types: string[];

    @IsOptional()
    @IsNotEmpty()
    public notes: string;

}
