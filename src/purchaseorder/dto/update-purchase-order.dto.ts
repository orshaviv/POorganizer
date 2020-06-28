import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {PaymentStatus, POStatus} from "../purchaseorder.entity";

export class UpdatePurchaseOrderDto {
    @IsOptional()
    @IsNumber()
    public id: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public poStatus: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public deliveryMethod: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public paymentMethod: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public paymentStatus: string;

    @IsOptional()
    @IsISO8601()
    public completionDate: string;

    @IsOptional()
    @IsArray()
    public quantities: number[];

    @IsOptional()
    @IsArray()
    public catalogNumbers: string[];

    @IsOptional()
    @IsArray()
    public itemsId: number[];

    @IsOptional()
    @IsArray()
    public details: string[];

    @IsOptional()
    @IsArray()
    public itemsCost: number[];
}
