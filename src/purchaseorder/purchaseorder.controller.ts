import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    NotFoundException,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseOrderService} from "./purchaseorder.service";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";
import {POStatus, PurchaseOrder} from "./purchaseorder.entity";
import {PurchaseOrderDto} from "./dto/purchase-order.dto";
import {UpdatePurchaseOrderDto} from "./dto/update-purchase-order.dto";

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

    @Get('id')
    getPurchaseOrderById(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.getPurchaseOrderById(id, user);
    }

    @Post('create')
    createPurchaseOrder(
        @Body(ValidationPipe) purchaseOrderDto: PurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.createPurchaseOrder(purchaseOrderDto, user);
    }

    @Patch('update')
    updatePurchaseOrderStatus(
        @Body(ValidationPipe) updatePurchaseOrderDto: UpdatePurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.updatePurchaseOrderStatus(updatePurchaseOrderDto, user);
    }
}
