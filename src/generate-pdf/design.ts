import {PurchaseOrder} from "../purchaseorder/purchaseorder.entity";
import path from "path";

export const fonts = {
    Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
};

export function docDesign (purchaseOrder: PurchaseOrder): any {
    const pageSize = 'A4';
    const leftMargin = 9;

    const currency = 'NIS';

    const fileName = 'PO-' + purchaseOrder.poId.toString() + '.pdf';

    const date = new Date();
    const dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

    const { deliveryMethod, paymentMethod, completionDate, poId,
        supplierName, contactName,
        quantity, catalogNumber, details, itemCost,
    totalCostBeforeTax, taxPercentage,
    companyName, companyCode, companyAddress, companyEmail, companyWebsite } = purchaseOrder;

    let rows = new Array();

    rows.push([
            {
                border: [false, false, false, true],
                text: '',
                fillColor: '#2D9395',
                colSpan: 6,
                alignment: 'center'
            }, {}, {}, {}, {}, {}
        ]);

    rows.push([
        {text: '#', style: 'tableHeader', alignment: 'center'},
        {text: 'Quantity', style: 'tableHeader', alignment: 'center'},
        {text: 'CAT no.', style: 'tableHeader', alignment: 'center'},
        {text: 'Details', style: 'tableHeader', alignment: 'center'},
        {text: 'Cost', style: 'tableHeader', alignment: 'center'},
        {text: 'Total', style: 'tableHeader', alignment: 'center'}
    ]);

    let itemTotalCost = [];
    for (let index = 0; index < quantity.length; index++) {
        itemTotalCost.push(parseFloat(itemCost[index])*parseInt(quantity[index],10));
        rows.push([
            {text: `${ index+1 }`, alingment: 'center', margin: 5},
            {text: `${ quantity[index] }`, alingment: 'center', margin: 5},
            {text: catalogNumber[index], alingment: 'center', margin: 5},
            {text: details[index], alingment: 'center', margin: 5},
            {text: `${ itemCost[index] } ${ currency }`, alingment: 'center', margin: 5},
            {text: `${ itemTotalCost[index] } ${ currency }`, alingment: 'center', margin: 5}
        ]);
    }

    rows.push([
        {
            text: '',
            colSpan: 3,
            border: [false, false, true, false]
        }, {}, {},
        {
            colSpan: 2,
            text: 'Total cost before tax:',
            style: 'tableStyle',
            alignment: 'right',
            margin: 5
        }, {},
        {
            text: `${ itemTotalCost.reduce( (a,b) => a+b, 0)  } ${ currency }`,
            style: 'tableStyle',
            alignment: 'center',
            margin: 5
        }
    ]);

    rows.push([
        {
            text: '',
            colSpan: 3,
            border: [false, false, true, false]
        }, {}, {},
        {
            colSpan: 2,
            text: `Tax ${ taxPercentage*100 }%:`,
            style: 'tableStyle',
            alignment: 'right',
            margin: 5
        }, {},
        {
            text: `${ itemTotalCost.reduce( (a,b) => a+b, 0) * taxPercentage } ${ currency }`,
            style: 'tableStyle',
            alignment: 'center',
            margin: 5
        }
    ]);

    rows.push([
        {
            text: '',
            colSpan: 3,
            border: [false, false, true, false]
        }, {}, {},
        {
            colSpan: 2,
            text: 'Total cost:',
            style: 'tableStyle',
            alignment: 'right',
            margin: 5
        }, {},
        {
            text: `${ itemTotalCost.reduce( (a,b) => a+b, 0) * (1 + taxPercentage) } ${ currency }`,
            style: 'tableStyle',
            alignment: 'center',
            margin: 5,
            fillColor: '#2D9395',
        }
    ]);

    const dd = {
        info: {
            title: fileName,
            author: 'john doe',
            subject: 'Purchase Order',
        },

        footer:
            {
            table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                widths: [ 200, '*', 200],
                body: [
                    [
                        {
                            border: [false, false, false, false],
                            text: companyEmail,
                            alignment: 'center',
                            bold: true,
                            color: '#3e5365'
                        },
                        {
                            border: [false, false, false, false],
                            image: __dirname + '/FooterLogo.PNG', width: 120,
                            alignment: 'center'
                        },
                        {
                            border: [false, false, false, false],
                            text: companyAddress,
                            alignment: 'center',
                            bold: true,
                            color: '#3e5365'
                        }
                    ],
                    [
                        { border: [false, false, false, false], text: '' },
                        { border: [false, false, false, false], text: '' },
                        { border: [false, false, false, false], text: '' }
                    ]]
                }
            },

        header:
            {
            table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                widths: [ 100, '*', 100],
                body: [
                    [
                        { border: [false, false, false, false], text: '' },
                        { border: [false, false, false, false], text: '' },
                        { border: [false, false, false, false], text: '' }
                    ],
                    [
                        {
                            border: [false, false, false, false],
                            text: dateString,
                            alignment: 'center',
                            margin: 5
                        },
                        {
                            border: [false, false, false, false],
                            image: __dirname + '/HeaderLogo.PNG', width: 90,
                            alignment: 'center'
                        },
                        {
                            border: [false, false, false, false],
                            text: ''
                        }
                    ]]
                }
            },

        content: [

            { text: companyName, style: 'header' },
            { text: `${ companyCode }`, style: 'subheader' },

            { text: companyWebsite, link: companyWebsite, color: '#0000EE', decoration: 'underline', margin: [9, 0, 0, 0] },

            {
                columns: [
                    {
                        text: `Purchase Order no. ${ poId }`,
                        style: 'subheader',
                        color: '#2D9395'
                    },

                    {
                        width: 70,
                        text: 'Original',
                        margin: [ 0, 15, 0, 0 ]
                    }
                ]
            },
            {
                table: {
                    body: [
                        [
                            '',
                            {
                                colSpan: 0,
                                border: [false, false, false, false],
                                fillColor: '#2D9395',
                                text: '',
                                margin: [ 245, 0 ],
                            },
                            ''
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            {
                text: `For: ${ contactName },`,
                style: 'subheader',
                margin: [ leftMargin, 20, 0, 10 ]
            },

            {
                style: 'tableStyle',
                table: {
                    heights: function (row) {
                        if (row <= 1) return 10;
                        return 25;
                    },
                    headerRows: 2,
                    widths: [ 15, 50, 50, '*', 60, 60],
                    // dontBreakRows: true,
                    // keepWithHeaderRows: 1,
                    body: rows,
                }
            },

        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify',
                margin: [ leftMargin, 10, 0, 10 ]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                alignment: 'justify',
                margin: [ leftMargin, 15, 0, 5 ]
            },
            tableHeader: {
                fontSize: 12,
                bold: true,
                alignment: 'justify',
            },
            tableStyle: {
                alignment: 'center',
                margin: [leftMargin, 0, 10, 0]
            },
        }
    };

    return dd;
}
