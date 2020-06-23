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

export function docDesign (purchaseOrder: PurchaseOrder, headerLogo, footerLogo): any {
    const pageSize = 'A4';
    const leftMargin = 9;
    const tableFillColor = '#2D9395';

    const currency = 'NIS';

    const whiteSquareBase64Url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
    if (headerLogo.length < 1)
        headerLogo = whiteSquareBase64Url;
    if (footerLogo.length < 1)
        footerLogo = whiteSquareBase64Url;

    const date = new Date();
    const dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

    const { deliveryMethod, paymentMethod, completionDate, poId,
        supplierName, contactName,
        quantity, catalogNumber, details, itemCost,
        totalCostBeforeTax, taxPercentage,
        companyName, companyCode, companyAddress, companyEmail, companyWebsite } = purchaseOrder;


    let itemsTablerows = new Array();

    itemsTablerows.push([
        {
            border: [false, false, false, true],
            text: '',
            fillColor: tableFillColor,
            colSpan: 6,
            alignment: 'center'
        }, {}, {}, {}, {}, {}
    ]);

    itemsTablerows.push([
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
        itemsTablerows.push([
            {text: `${ index+1 }`, alingment: 'center', margin: 5},
            {text: `${ quantity[index] }`, alingment: 'center', margin: 5},
            {text: catalogNumber[index], alingment: 'center', margin: 5},
            {text: details[index], alingment: 'center', margin: 5},
            {text: `${ itemCost[index] } ${ currency }`, alingment: 'center', margin: 5},
            {text: `${ itemTotalCost[index] } ${ currency }`, alingment: 'center', margin: 5}
        ]);
    }

    itemsTablerows.push([
        {
            border: [false, false, true, false],
            text: '',
            colSpan: 3
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

    itemsTablerows.push([
        {
            border: [false, false, true, false],
            text: '',
            colSpan: 3
        }, {}, {},
        {
            text: `Tax ${ taxPercentage }%:`,
            style: 'tableStyle',
            colSpan: 2,
            alignment: 'right',
            margin: 5
        }, {},
        {
            text: `${ itemTotalCost.reduce( (a,b) => a+b, 0) * taxPercentage/100 } ${ currency }`,
            style: 'tableStyle',
            alignment: 'center',
            margin: 5
        }
    ]);

    itemsTablerows.push([
        {
            border: [false, false, true, false],
            text: '',
            colSpan: 3
        }, {}, {},
        {
            text: 'Total cost:',
            style: 'tableStyle',
            colSpan: 2,
            alignment: 'right',
            margin: 5
        }, {},
        {
            text: `${ itemTotalCost.reduce( (a,b) => a+b, 0) * (1 + taxPercentage/100) } ${ currency }`,
            style: 'tableStyle',
            fillColor: tableFillColor,
            alignment: 'center',
            margin: 5,
        }
    ]);

    const docDesign = {
        pageSize: pageSize,
        header: {
            columns: [
                {
                    text: dateString,
                    color: 'grey',
                    alignment: 'center',
                    margin: [5, 10, 5, 10],
                },
                {
                    image: headerLogo,
                    width: 120,
                    alignment: 'center'
                },
                {
                    text: ''
                }
            ]
        },
        footer: {
            columns: [
                {
                    text: companyEmail,
                    bold: true,
                    color: '#3e5365',
                    alignment: 'center',
                },
                {
                    image: footerLogo,
                    width: 120,
                    alignment: 'center'
                },
                {
                    text: companyAddress,
                    bold: true,
                    color: '#3e5365',
                    alignment: 'center',
                }
            ]
            },
        content: [
            {
                text: companyName,
                style: 'header' },
            {
                text: `${ companyCode }`,
                style: 'subheader'
            },
            {
                text: companyWebsite,
                link: companyWebsite,
                color: '#0000EE',
                decoration: 'underline',
                margin: [9, 0, 0, 0]
            },
            {
                columns: [
                    {
                        text: `Purchase Order no. ${ poId }`,
                        style: 'subheader',
                        color: tableFillColor
                    },
                    {
                        width: 60,
                        text: 'Source',
                        margin: [ 0, 15, 10, 0 ],
                        alignment: 'right'
                    }
                ]
            },
            {
                table: {
                    body: [
                            [
                                '',
                                {
                                    border: [false, false, false, false],
                                    text: '',
                                    colSpan: 0,
                                    fillColor: tableFillColor,
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
                    widths: [ 15, 50, 50, '*', 'auto', 'auto'],
                    dontBreakRows: true,
                    keepWithHeaderRows: 1,
                    body: itemsTablerows,
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

    return docDesign;
}
