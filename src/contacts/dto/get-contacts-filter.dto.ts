import {IsNotEmpty, IsOptional} from "class-validator";

export class GetContactsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsOptional()
    @IsNotEmpty()
    supplierQuery: string;
}
