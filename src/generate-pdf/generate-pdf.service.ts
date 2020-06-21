import {Logger} from "@nestjs/common";

import {docDesign, fonts} from './design';

import * as fs from 'fs';
import {PurchaseOrder} from "../purchaseorder/purchaseorder.entity";
import {Readable} from "stream";

export class GeneratePdfService {
    private logger = new Logger('GeneratePdfService');

    constructor(
    ) {}

    public async generatePdf(
        purchaseOrder: PurchaseOrder
    ): Promise<any> {

        const fileName = `PO-${ purchaseOrder.poId }.pdf`;

        const PdfPrinter = require('pdfmake');
        const printer = new PdfPrinter(fonts);

        const docDefinition = docDesign(purchaseOrder);

        const options = {

        }

        const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
        try{
            pdfDoc.pipe(fs.createWriteStream(fileName));
        }catch(error){
            throw error;
        }

        pdfDoc.end();
    }

    async generatePdfBuffer(purchaseOrder: PurchaseOrder): Promise<any> {
        const fileName = `PO-${ purchaseOrder.poId }.pdf`;

        const PdfPrinter = require('pdfmake');
        const printer = new PdfPrinter(fonts);

        const docDefinition = docDesign(purchaseOrder);

        const pdfDoc = await printer.createPdfKitDocument(docDefinition, {});

        return pdfDoc;
    }

}
