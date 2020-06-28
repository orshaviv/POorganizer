import {
    BadRequestException,
    Body,
    Controller,
    Get, Header, HttpCode,
    Logger,
    NotFoundException, Param,
    ParseIntPipe,
    Patch,
    Post, Query, Res,
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
        @Query('search') search: string,
        @GetUser() user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderService.getPurchaseOrders(search, user);
    }

    @Get('id/:id')
    getPurchaseOrderById(
        @Param('id', ParseIntPipe) id: number,
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

    @Patch('id/:id/update')
    updatePurchaseOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updatePurchaseOrderDto: UpdatePurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        updatePurchaseOrderDto.id = id;
        return this.purchaseOrderService.updatePurchaseOrderStatus(updatePurchaseOrderDto, user);
    }

    @Get('/id/:id/generatepdf')
    @HttpCode(201)
    async generatePdf(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Res() res
    ): Promise<void> {
        const po = await this.purchaseOrderService.getPurchaseOrderById(id, user);
        if (!po)
            throw new NotFoundException('Purchase order with ID ${ id } not found.')

        const doc = await this.purchaseOrderService.generatePdf(po, user);

        const fileName = `PO-${ po.poId }.pdf`;

        res.setHeader('Content-Disposition', 'attachment;filename=' + fileName);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
        doc.end();
    }
}
