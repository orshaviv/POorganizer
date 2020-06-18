import {Body, Controller, Get, Logger, Post, UseGuards, ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseOrderService} from "./purchaseorder.service";
import {ItemService} from "../items/item.service";
import {SupplierService} from "../suppliers/supplier.service";
import {ContactService} from "../contacts/contact.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {PurchaseOrder} from "./purchaseorder.entity";
import {PurchaseOrderDto} from "./dto/purchase-order.dto";

@Controller('purchaseorders')
@UseGuards(AuthGuard())
export class PurchaseOrderController {
    private logger = new Logger('PurchaseOrderController');

    constructor(
        private readonly purchaseOrderService: PurchaseOrderService,
    ) {}

    @Get()
    getPurchaseOrders(
        @GetUser() user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderService.getPurchaseOrders(user);
    }

    @Post('create')
    createPurchaseOrder(
        @Body(ValidationPipe) purchaseOrderDto: PurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.createPurchaseOrder(purchaseOrderDto, user);
    }
}
