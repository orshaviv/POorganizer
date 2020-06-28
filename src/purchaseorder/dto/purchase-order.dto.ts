import {PaymentStatus} from "../purchaseorder.entity";
import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class PurchaseOrderDto {
    @IsNotEmpty()
    public deliveryMethod: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public paymentMethod: string

    @IsOptional()
    @IsNotEmpty()
    public paymentStatus: PaymentStatus;

    @IsOptional()
    @IsISO8601()
    public completionDate: string;

    @IsOptional()
    @IsString()
    public supplierName: string;

    @IsOptional()
    @IsNumber()
    public supplierId: number;

    @IsOptional()
    @IsString()
    public contactFirstName: string;

    @IsOptional()
    @IsString()
    public contactLastName: string;

    @IsOptional()
    public contactId: number;

    @IsNotEmpty()
    @IsArray()
    public quantities: number[];

    @IsNotEmpty()
    @IsArray()
    public catalogNumbers: string[];

    @IsOptional()
    @IsArray()
    public itemsId: number[];

    @IsOptional()
    @IsArray()
    public details: string[];

    @IsNotEmpty()
    @IsArray()
    public itemsCost: number[];

    @IsOptional()
    @IsNotEmpty()
    public taxPercentage: number;
}
