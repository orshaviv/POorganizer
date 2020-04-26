import {IsNotEmpty, IsOptional} from "class-validator";

export class SupplierDTO{
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
    public type: string;

    @IsOptional()
    @IsNotEmpty()
    public notes: string;
}
