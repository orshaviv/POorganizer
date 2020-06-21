import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    Logger,
    NotFoundException,
    ParseIntPipe,
    Res,
    UseGuards
} from "@nestjs/common";
import {GeneratePdfService} from "./generate-pdf.service";
import {PurchaseOrderService} from "../purchaseorder/purchaseorder.service";
import {User} from "../auth/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseOrder} from "../purchaseorder/purchaseorder.entity";
import {GetUser} from "../auth/get-user.decorator";
import * as fs from "fs";

@Controller('generatepdf')
@UseGuards(AuthGuard())
export class GeneratePdfController {
    private logger = new Logger('GeneratePdfController');
    constructor(
        private readonly generatePdfService: GeneratePdfService,
        private readonly purchaseOrderService: PurchaseOrderService,
    ) {}

    @Get()
    public async generatePdf(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<any> {
        const po = await this.purchaseOrderService.getPurchaseOrderById(id, user);
        if (!po)
            throw new NotFoundException('Purchase order with ID ${ id } not found.');

        await this.generatePdfService.generatePdf(po);

        this.logger.log('Pdf file generated.');

        return 'pdf file genereated';
    }

    @Get('download')
    @HttpCode(201)
    @Header('Content-Type', 'image/pdf')
    @Header('Content-Disposition', 'attachment; filename=test.pdf')
    async download(
        @Body('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Res() res
    ) {
        const po = await this.purchaseOrderService.getPurchaseOrderById(id, user);
        if (!po)
            throw new NotFoundException('Purchase order with ID ${ id } not found.')

        const doc = await this.generatePdfService.generatePdfBuffer(po);

        const fileName = `PO-${ po.poId }.pdf`;
        res.setHeader('Content-Disposition', 'attachment;filename=' + fileName);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
        doc.end();
    }
}
