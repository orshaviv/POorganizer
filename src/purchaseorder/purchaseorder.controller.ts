import {
    Body,
    Controller,
    Get, HttpCode,
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
import {PaymentStatus, POStatus, PurchaseOrder} from "./purchaseorder.entity";
import {PurchaseOrderDto} from "./dto/purchase-order.dto";
import {UpdatePurchaseOrderDto} from "./dto/update-purchase-order.dto";
import {PaymentStatusValidationPipe} from "./pipes/payment-status-validation.pipe";
import {POStatusValidationPipe} from "./pipes/po-status-validation.pipe";



@Controller('purchaseorders')
@UseGuards(AuthGuard())
export class PurchaseOrderController {
    private logger = new Logger('PurchaseOrderController');

    constructor(
        private readonly purchaseOrderService: PurchaseOrderService,
    ) {}

    @Get()
    getPurchaseOrders(
        @Query('poStatus', POStatusValidationPipe) poStatus: POStatus,
        @Query('search') search: string,
        @GetUser() user: User,
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderService.getPurchaseOrders(search, poStatus, user);
    }

    @Get('id/:id')
    getPurchaseOrderById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.getPurchaseOrderById(id, user);
    }

    @Get('dates')
    getPurchaseOrdersBetweenDates(
        @Query('from') fromDateUnixTimeStamp: number,
        @Query('until') untilDateUnixTimeStamp: number,
        @GetUser() user: User
    ): Promise<PurchaseOrder[]> {
        const fromDate = new Date(fromDateUnixTimeStamp * 1000);
        const untilDate = new Date(untilDateUnixTimeStamp * 1000);
        return this.purchaseOrderService.getPurchaseOrdersBetweenDates(fromDate, untilDate, user);
    }

    @Post('create')
    createPurchaseOrder(
        @Body(ValidationPipe) purchaseOrderDto: PurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        this.logger.verbose(JSON.stringify(purchaseOrderDto));
        return this.purchaseOrderService.createPurchaseOrder(purchaseOrderDto, user);
    }

    @Patch('id/:id/update')
    updatePurchaseOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updatePurchaseOrderDto: UpdatePurchaseOrderDto,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        updatePurchaseOrderDto.id = id;
        return this.purchaseOrderService.updatePurchaseOrder(updatePurchaseOrderDto, user);
    }

    @Patch('id/:id/updatepaymentstatus')
    updatePaymentStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('paymentStatus', PaymentStatusValidationPipe) paymentStatus: PaymentStatus,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderService.updatePaymentStatus(id, paymentStatus, user);
    }

    @Patch('id/:id/updatepostatus')
    updatePoStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('poStatus', POStatusValidationPipe) poStatus: POStatus,
        @GetUser() user: User,
    ): Promise<PurchaseOrder> {
        this.logger.verbose((`updating po ${id} status to ${poStatus}`))
        return this.purchaseOrderService.updatePoStatus(id, poStatus, user);
    }

    @Get('/id/:id/generatepdf')
    @HttpCode(200)
    async generatePdf(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Res() res,
    ): Promise<any> {

        const po = await this.purchaseOrderService.getPurchaseOrderById(id, user);
        if (!po)
            throw new NotFoundException('Purchase order with ID ${ id } not found.')

        const doc = await this.purchaseOrderService.generatePdf(po, user);

        const fileName = `PO-${ po.poId }.pdf`;

        res.setHeader('Content-Disposition', 'attachment;filename=' + fileName);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
        doc.end();

        this.logger.verbose('Pdf file generated.');
    }

}
