import {IsNotEmpty, IsOptional} from "class-validator";

export class GetContactInformationFilterDto {
    @IsOptional()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsNotEmpty()
    search: string;

    @IsNotEmpty()
    contactId: number;
}
