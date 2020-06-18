import {IsNotEmpty, IsOptional} from "class-validator";

export class GetItemsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
