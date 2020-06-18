import {IsNotEmpty, IsOptional} from "class-validator";

export class ItemDto {
    @IsOptional()
    @IsNotEmpty()
    public id: number;

    @IsNotEmpty()
    public catalogNumber: string;

    @IsOptional()
    @IsNotEmpty()
    public name: string;

    @IsOptional()
    @IsNotEmpty()
    public type: string;
}
