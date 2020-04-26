import {IsNotEmpty, IsOptional} from "class-validator";

export class GetSuppliersFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
