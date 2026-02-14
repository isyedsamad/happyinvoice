import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';

Font.register({
    family: 'Poppins',
    src: '/fonts/Poppins-Regular.ttf',
    fontWeight: 'normal',
});

Font.register({
    family: 'Poppins',
    src: '/fonts/Poppins-Medium.ttf',
    fontWeight: 500,
});

Font.register({
    family: 'Poppins',
    src: '/fonts/Poppins-SemiBold.ttf',
    fontWeight: 600,
});

Font.register({
    family: 'Poppins',
    src: '/fonts/Poppins-Bold.ttf',
    fontWeight: 700,
});
export default function PDFTemplate01(props) {
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const design = {
        colors: {
            greenPanel: props.pdfData.theme.main,
            greenLightPanel: props.pdfData.theme.light,
            gray: '#4B5563',
            black: '#000000',
            white: '#ffffff',
        },
        text: {
            text8: 8,
            text9: 9,
            xs: 9,
            text10: 10,
            text11: 11,
            text12: 12,
            normal: 13,
            medium: 14,
            text15: 15,
            large: 16,
            xlarge: 18,
        },
        spacing: {
            xs: 4,
            sm: 6,
            md: 8,
            lg: 12,
            xl: 16,
            xxl: 24,
            xxxl: 32,
        },
        border: {
            light: 1,
        },
        fontWeight: {
            normal: 'normal',
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    };
    return (
        <Document>
            <Page size="A4" style={{ backgroundColor: design.colors.white, color: design.colors.black }}>
                <View style={{ height: design.spacing.md, backgroundColor: design.colors.greenPanel }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: design.spacing.xxxl, paddingTop: 10 }}>
                    {props.logoBase64 != '' && (
                        <Image
                            src={props.logoBase64}
                            style={{ height: 35, borderRadius: 8 }}
                        />
                    )}
                    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.large, fontWeight: design.fontWeight.semibold, color: design.colors.greenPanel }}>{props.pdfData.business.name}</Text>
                        {props.pdfData.business.mail != '' && (
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 1.5, color: design.colors.gray }}>{props.pdfData.business.mail}</Text>
                        )}
                        {props.pdfData.business.phone != '' && (
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 2, color: design.colors.gray }}>{props.pdfData.business.phone}</Text>
                        )}
                        {props.pdfData.business.address != '' && (
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 1, color: design.colors.gray }}>{props.pdfData.business.address}</Text>
                        )}
                    </View>
                </View>
                <View style={{ height: 1, backgroundColor: design.colors.greenLightPanel, marginTop: 8, marginBottom: 7 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: design.spacing.xxxl }}>
                    {[
                        { label: 'INVOICE NO.', value: props.pdfData.invoice.invoiceNo },
                        { label: 'INVOICE DATE', value: props.pdfData.invoice.invoiceDate },
                        { label: 'DUE DATE', value: props.pdfData.invoice.dueDate != '' ? props.pdfData.invoice.dueDate : '-' },
                        { label: 'BALANCE DUE', value: `${currencyShow[props.pdfData.currency]} ${props.pdfData.summary.balance}` },
                    ].map((item, i) => (
                        <View key={i}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.xs, color: design.colors.gray, fontWeight: design.fontWeight.medium }}>{item.label}</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, marginTop: 1, color: design.colors.greenPanel, fontWeight: design.fontWeight.semibold }}>{item.value}</Text>
                        </View>
                    ))}
                </View>
                <View style={{ height: 1, backgroundColor: design.colors.greenLightPanel, marginTop: 7, marginBottom: 10 }} />
                <View style={{ paddingHorizontal: design.spacing.xxxl, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text10, fontWeight: design.fontWeight.semibold, color: design.colors.black }}>BILL TO</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.large, fontWeight: design.fontWeight.semibold, color: design.colors.greenPanel, marginTop: 2 }}>{props.pdfData.client.name}</Text>
                    {props.pdfData.client.mail != '' && (
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 1.5, color: design.colors.gray }}>{props.pdfData.client.mail}</Text>
                    )}
                    {props.pdfData.client.phone != '' && (
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 2, color: design.colors.gray }}>{props.pdfData.client.phone}</Text>
                    )}
                    {props.pdfData.client.address != '' && (
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text9, fontWeight: design.fontWeight.medium, marginTop: 1, color: design.colors.gray }}>{props.pdfData.client.address}</Text>
                    )}
                </View>
                <View style={{ height: 1, backgroundColor: design.colors.greenLightPanel, marginTop: 10 }} />
                {/* Table */}
                <View style={{ paddingHorizontal: 0 }}>
                    {/* <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: design.colors.greenLightPanel, paddingHorizontal: design.spacing.xxxl, paddingVertical: 8 }}>
                        {["DESCRIPTION", "PRICE", "TAX", "QTY", "AMOUNT"].map((header, i) => (
                            <Text key={i} style={{ fontFamily: 'Poppins', fontSize: design.text.text11, flex: 1, color: design.colors.gray, textAlign: i === 0 ? 'left' : 'right', maxWidth: i === 0 ? 100 : 25, fontWeight: design.fontWeight.semibold }}>{header}</Text>
                        ))}
                    </View> */}
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: design.colors.greenLightPanel, paddingHorizontal: design.spacing.xxxl, paddingVertical: 8 }}>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, flex: 1, color: design.colors.gray, textAlign: 'left', fontWeight: design.fontWeight.semibold }}>DESCRIPTION</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, width: 80, color: design.colors.gray, textAlign: 'right', fontWeight: design.fontWeight.semibold }}>PRICE</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, width: 60, color: design.colors.gray, textAlign: 'right', fontWeight: design.fontWeight.semibold }}>TAX</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, width: 50, color: design.colors.gray, textAlign: 'right', fontWeight: design.fontWeight.semibold }}>QTY</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, width: 90, color: design.colors.gray, textAlign: 'right', fontWeight: design.fontWeight.semibold }}>AMOUNT</Text>
                    </View>
                    {props.pdfData.product.map(child => (
                        <View key={child.id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingHorizontal: design.spacing.xxxl, paddingVertical: 4 }}>
                            <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold }}>{child.name}</Text>
                                <Text style={{ fontFamily: 'Poppins', color: design.colors.gray, fontSize: design.text.text8, fontWeight: design.fontWeight.medium }}>{child.description}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, textAlign: 'right', width: 80 }}>{currencyShow[props.pdfData.currency]} {child.price}</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, textAlign: 'right', width: 60 }}>{props.pdfData.tax.taxType == 'Per Item' ? child.tax != "" ? child.tax + ' %' : "-" : "-"}</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, textAlign: 'right', width: 50 }}>{child.qty >= 10 ? child.qty : '0' + child.qty}</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, textAlign: 'right', width: 90 }}>
                                {currencyShow[props.pdfData.currency]} {props.pdfData.tax.taxType == 'Per Item' ? child.tax != '' ?
                                    ((child.qty * child.price) + (((child.qty * child.price) * child.tax) / 100)).toFixed(2)
                                    :
                                    (child.qty * child.price).toFixed(2)
                                    :
                                    (child.qty * child.price).toFixed(2)
                                }</Text>
                        </View>
                    ))}
                </View>

                {/* Totals Section */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 }}>
                    <View style={{ flex: 1, paddingLeft: design.spacing.xxxl }}>
                        {props.pdfData.isBank == 'Yes' && (
                            <>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.normal, fontWeight: design.fontWeight.semibold, color: design.colors.greenPanel }}>Payment Details</Text>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text12, color: design.colors.gray, marginTop: 5, fontWeight: design.fontWeight.medium }}>A/C : 999999999999</Text>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text12, color: design.colors.gray, marginTop: 2, fontWeight: design.fontWeight.medium }}>IFSC : SBIN0001238</Text>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text12, color: design.colors.gray, marginTop: 2, fontWeight: design.fontWeight.medium }}>Name : Sanjay Singh</Text>
                            </>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* {["Subtotal", "Tax", "Total", "Discount", "Balance Due"].map((label, i) => (
                            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.normal, color: design.colors.gray }}>{label} :</Text>
                                <Text style={{ fontFamily: 'Poppins', fontSize: i === 4 ? design.text.large : design.text.normal, fontWeight: i === 4 ? design.fontWeight.bold : design.fontWeight.semibold }}>
                                    ₹ 1299.00
                                </Text>
                            </View>
                        ))} */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray, fontWeight: design.fontWeight.medium, paddingLeft: 4 }}>Subtotal :</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                {currencyShow[props.pdfData.currency]} {Number(props.pdfData.summary.subtotal).toFixed(2)}
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4, marginBottom: 4 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray, fontWeight: design.fontWeight.medium, paddingLeft: 4 }}>
                                {props.pdfData.tax.taxType == 'On Total' || props.pdfData.tax.taxType == 'Deducted' ? (
                                    props.pdfData.tax.taxLabel + ' (' + props.pdfData.tax.taxValue + '%)'
                                ) : (
                                    'Tax'
                                )} :
                            </Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                {currencyShow[props.pdfData.currency]} {Number(props.pdfData.summary.tax).toFixed(2)}
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4, marginBottom: 4 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray, fontWeight: design.fontWeight.medium, paddingLeft: 4 }}>Total :</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                {currencyShow[props.pdfData.currency]} {Number(props.pdfData.summary.total).toFixed(2)}
                            </Text>
                        </View>
                        {props.pdfData.discount.discountType != 'None' && (
                            <>
                                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4, marginBottom: 4 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray, fontWeight: design.fontWeight.medium, paddingLeft: 4 }}>Discount {props.pdfData.discount.discountType == 'Percent' && '(' + props.pdfData.discount.discountValue + '%)'} :</Text>
                                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                        {currencyShow[props.pdfData.currency]} {props.pdfData.discount.discountType == 'Percent' ? Number(props.pdfData.summary.discount).toFixed(2) : Number(props.pdfData.discount.discountValue).toFixed(2)}
                                    </Text>
                                </View>
                            </>
                        )}
                        {props.pdfData.partialPayment.isPartial == 'Yes' && (
                            <>
                                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4, marginBottom: 4 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray, fontWeight: design.fontWeight.medium, paddingLeft: 4 }}>Previous Payment :</Text>
                                    <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                        {currencyShow[props.pdfData.currency]} {Number(props.pdfData.partialPayment.amount).toFixed(2)}
                                    </Text>
                                </View>
                            </>
                        )}
                        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4, marginBottom: 6 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.medium, color: design.colors.black, fontWeight: design.fontWeight.semibold, paddingLeft: 4 }}>Balance Due :</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: design.text.large, fontWeight: design.fontWeight.semibold, paddingRight: design.spacing.xxxl }}>
                                {currencyShow[props.pdfData.currency]} {Number(props.pdfData.summary.balance).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer Signature */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: design.spacing.xxxl, marginTop: 30 }}>
                    <View>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text12, fontWeight: design.fontWeight.semibold, color: design.colors.greenPanel }}>NOTE</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray }}>{props.pdfData.footerNote}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        {props.signBase64 != '' && (
                            <>
                                <Image
                                    src={props.signBase64}
                                    style={{ height: 55 }}
                                />
                                <Text style={{ fontFamily: 'Poppins', fontSize: design.text.text11, color: design.colors.gray }}>Authorised Signature</Text>
                            </>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
