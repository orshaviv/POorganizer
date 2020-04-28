import {IsNotEmpty, IsOptional} from "class-validator";

export class GetSuppliersFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
