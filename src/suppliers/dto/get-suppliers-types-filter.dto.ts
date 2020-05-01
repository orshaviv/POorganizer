import {IsNotEmpty, IsOptional} from "class-validator";

export class GetSuppliersTypesFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
