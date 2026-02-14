import React from 'react';
import { Page, Text, View, Document, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Poppins',
    fonts: [
        { src: '/fonts/Poppins-Regular.ttf' },
        { src: '/fonts/Poppins-Medium.ttf', fontWeight: 500 },
        { src: '/fonts/Poppins-SemiBold.ttf', fontWeight: 600 },
        { src: '/fonts/Poppins-Bold.ttf', fontWeight: 700 },
    ]
});

export default function PDFTemplate01(props) {
    const { pdfData, logoBase64, signBase64 } = props;
    const { theme, business, client, invoice, summary, currency, tax, discount, partialPayment, footerNote, isBank } = pdfData;

    const currencySymbol = {
        INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥'
    }[currency] || currency;

    const styles = {
        page: {
            fontFamily: 'Poppins',
            fontSize: 9,
            padding: 30, // Reduced padding for compact feel
            color: '#333',
            lineHeight: 1.4,
        },
        // Header Section
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 25,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        brandSection: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '60%',
        },
        logo: {
            height: 50,
            width: 50,
            objectFit: 'contain',
            borderRadius: 4,
            marginRight: 15,
        },
        brandDetails: {
            justifyContent: 'center',
        },
        businessName: {
            fontSize: 18,
            fontWeight: 700,
            color: theme.main,
            textTransform: 'uppercase',
            marginBottom: 3,
            lineHeight: 1.2,
        },
        businessMeta: {
            fontSize: 9,
            color: '#666',
        },
        invoiceMetaSection: {
            width: '35%',
            alignItems: 'flex-end',
        },
        invoiceTitle: {
            fontSize: 22,
            fontWeight: 800,
            color: '#222', // Dark grey for improved readability
            letterSpacing: 1,
            marginBottom: 8,
            textTransform: 'uppercase',
        },
        metaRow: {
            flexDirection: 'row',
            marginBottom: 4,
            alignItems: 'center',
        },
        metaLabel: {
            fontSize: 9,
            color: '#888',
            fontWeight: 500,
            marginRight: 8,
            textTransform: 'uppercase',
        },
        metaValue: {
            fontSize: 10,
            fontWeight: 700,
            color: '#222',
        },

        // Address Section - Clean & Modern
        addressSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
        },
        addressBlock: {
            width: '45%',
        },
        addressLabel: {
            fontSize: 8,
            fontWeight: 700,
            color: '#999',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            alignSelf: 'flex-start',
        },
        clientName: {
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 4,
            color: theme.main, // Use theme color only for name
        },
        addressText: {
            fontSize: 9,
            color: '#555',
            lineHeight: 1.4,
            marginBottom: 1,
        },

        // Table - Minimalist
        table: {
            width: '100%',
            marginBottom: 20,
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#fff', // White background
            borderBottomWidth: 2, // Stronger bottom border
            borderBottomColor: theme.main, // Colored accent
            paddingVertical: 8,
            paddingHorizontal: 5,
            alignItems: 'center',
            marginBottom: 5,
        },
        th: {
            fontSize: 9,
            fontWeight: 700,
            color: theme.main, // Colored header text for contrast on white
            textTransform: 'uppercase',
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#f5f5f5',
            paddingVertical: 10, // More vertical breathing room
            paddingHorizontal: 5,
            alignItems: 'center',
        },
        td: {
            fontSize: 9,
            color: '#444',
        },
        // Columns
        colDesc: { flex: 1, paddingLeft: 5 },
        colPrice: { width: '15%', textAlign: 'right' },
        colQty: { width: '10%', textAlign: 'center' },
        colTax: { width: '12%', textAlign: 'right' },
        colTotal: { width: '18%', textAlign: 'right', paddingRight: 5 },

        // Footer Section (Totals + Notes)
        footerSection: {
            flexDirection: 'row',
            marginTop: 15,
        },
        leftFooter: {
            flex: 1,
            paddingRight: 30,
        },
        rightFooter: {
            width: '40%',
            paddingLeft: 10,
        },

        // Totals - tiered structure
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
        },
        totalLabel: {
            fontSize: 9,
            color: '#666',
            fontWeight: 500,
        },
        totalValue: {
            fontSize: 10,
            fontWeight: 600,
            color: '#333',
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            marginTop: 10,
            borderTopWidth: 2, // Strong top border
            borderTopColor: '#eee',
            // Removed background color to avoid contrast issues
        },
        grandTotalLabel: {
            fontSize: 11,
            fontWeight: 800,
            color: '#222',
            textTransform: 'uppercase',
        },
        grandTotalValue: {
            fontSize: 16,
            fontWeight: 800,
            color: theme.main, // Theme color for just the value
        },

        // Notes & Bank
        sectionTitle: {
            fontSize: 9,
            fontWeight: 700,
            color: '#555',
            marginBottom: 4,
            marginTop: 10,
            textTransform: 'uppercase',
        },
        noteText: {
            fontSize: 8,
            color: '#666',
            lineHeight: 1.5,
        },
        bankRow: {
            flexDirection: 'row',
            marginBottom: 3,
        },
        bankLabel: {
            fontSize: 8,
            color: '#888',
            width: 50,
            fontWeight: 600,
        },
        bankValue: {
            fontSize: 9,
            color: '#333',
            fontWeight: 500,
        },

        // Signature
        signatureBox: {
            marginTop: 30,
            alignItems: 'flex-start',
        },
        signatureImage: {
            height: 40,
            marginBottom: 5,
        },
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandSection}>
                        {logoBase64 && <Image src={logoBase64} style={styles.logo} />}
                        <View style={styles.brandDetails}>
                            <Text style={styles.businessName}>{business.name}</Text>
                            {business.address && <Text style={styles.businessMeta}>{business.address}</Text>}
                            {(business.mail || business.phone) && (
                                <Text style={styles.businessMeta}>
                                    {[business.mail, business.phone].filter(Boolean).join(' • ')}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.invoiceMetaSection}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Invoice #</Text>
                            <Text style={styles.metaValue}>{invoice.invoiceNo}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Date</Text>
                            <Text style={styles.metaValue}>{invoice.invoiceDate}</Text>
                        </View>
                        {invoice.dueDate && (
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Due</Text>
                                <Text style={styles.metaValue}>{invoice.dueDate}</Text>
                            </View>
                        )}
                        <View style={[styles.metaRow, { marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}>
                            <Text style={[styles.metaLabel, { color: theme.main }]}>Amount Due</Text>
                            <Text style={[styles.metaValue, { color: theme.main }]}>{currencySymbol}{Number(summary.balance).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Addresses */}
                <View style={styles.addressSection}>
                    <View style={styles.addressBlock}>
                        <Text style={styles.addressLabel}>Bill To</Text>
                        <Text style={styles.clientName}>{client.name}</Text>
                        {client.address && <Text style={styles.addressText}>{client.address}</Text>}
                        {client.phone && <Text style={styles.addressText}>{client.phone}</Text>}
                        {client.mail && <Text style={styles.addressText}>{client.mail}</Text>}
                    </View>
                    {/* Can put 'Ship To' or 'Payment Info' here if needed, or leave blank/balance it */}
                    {isBank === 'Yes' && (
                        <View style={styles.addressBlock}>
                            <Text style={styles.addressLabel}>Bank Details</Text>
                            <View style={styles.bankRow}><Text style={styles.bankLabel}>Bank:</Text><Text style={styles.bankValue}>State Bank of India</Text></View>
                            <View style={styles.bankRow}><Text style={styles.bankLabel}>A/C:</Text><Text style={styles.bankValue}>999999999999</Text></View>
                            <View style={styles.bankRow}><Text style={styles.bankLabel}>IFSC:</Text><Text style={styles.bankValue}>SBIN0001238</Text></View>
                            <View style={styles.bankRow}><Text style={styles.bankLabel}>Name:</Text><Text style={styles.bankValue}>Sanjay Singh</Text></View>
                        </View>
                    )}
                </View>

                {/* Compact Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.th, styles.colDesc]}>Item Description</Text>
                        <Text style={[styles.th, styles.colPrice]}>Price</Text>
                        <Text style={[styles.th, styles.colQty]}>Qty</Text>
                        <Text style={[styles.th, styles.colTax]}>Tax</Text>
                        <Text style={[styles.th, styles.colTotal]}>Total</Text>
                    </View>

                    {pdfData.product.map((item, index) => {
                        const itemTotal = tax.taxType == 'Per Item' && item.tax
                            ? (item.qty * item.price) + (((item.qty * item.price) * item.tax) / 100)
                            : (item.qty * item.price);

                        return (
                            <View key={item.id} style={styles.tableRow}>
                                <View style={styles.colDesc}>
                                    <Text style={[styles.td, { fontWeight: 600, fontSize: 10, marginBottom: 2 }]}>{item.name}</Text>
                                    {item.description && <Text style={{ fontSize: 8, color: '#777' }}>{item.description}</Text>}
                                </View>
                                <Text style={[styles.td, styles.colPrice]}>{currencySymbol}{Number(item.price).toFixed(2)}</Text>
                                <Text style={[styles.td, styles.colQty]}>{item.qty}</Text>
                                <Text style={[styles.td, styles.colTax]}>
                                    {tax.taxType === 'Per Item' && item.tax ? `${item.tax}%` : '-'}
                                </Text>
                                <Text style={[styles.td, styles.colTotal, { fontWeight: 600 }]}>
                                    {currencySymbol}{Number(itemTotal).toFixed(2)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Footer Section */}
                <View style={styles.footerSection}>
                    {/* Left Side: Notes & Signature */}
                    <View style={styles.leftFooter}>
                        {footerNote && (
                            <>
                                <Text style={styles.sectionTitle}>Terms & Notes</Text>
                                <Text style={styles.noteText}>{footerNote}</Text>
                            </>
                        )}
                        <View style={styles.signatureBox}>
                            {signBase64 ? <Image src={signBase64} style={styles.signatureImage} /> : null}
                            <Text style={{ fontSize: 9, color: theme.main, fontWeight: 700 }}>Authorized Signature</Text>
                        </View>
                    </View>

                    {/* Right Side: Totals */}
                    <View style={styles.rightFooter}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{currencySymbol}{Number(summary.subtotal).toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                {(['On Total', 'Deducted'].includes(tax.taxType)) ? `${tax.taxLabel} (${tax.taxValue}%)` : 'Tax'}
                            </Text>
                            <Text style={styles.totalValue}>{currencySymbol}{Number(summary.tax).toFixed(2)}</Text>
                        </View>
                        {discount.discountType !== 'None' && (
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Discount</Text>
                                <Text style={[styles.totalValue, { color: '#e53e3e' }]}>
                                    -{currencySymbol}{discount.discountType === 'Percent' ? Number(summary.discount).toFixed(2) : Number(discount.discountValue).toFixed(2)}
                                </Text>
                            </View>
                        )}

                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total Amount</Text>
                            <Text style={styles.grandTotalValue}>{currencySymbol}{Number(summary.total).toFixed(2)}</Text>
                        </View>

                        {partialPayment.isPartial === 'Yes' && (
                            <>
                                <View style={[styles.totalRow, { marginTop: 5, borderBottomWidth: 0 }]}>
                                    <Text style={styles.totalLabel}>Paid</Text>
                                    <Text style={styles.totalValue}>{currencySymbol}{Number(partialPayment.amount).toFixed(2)}</Text>
                                </View>
                                <View style={[styles.totalRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 5, borderBottomWidth: 0 }]}>
                                    <Text style={[styles.totalLabel, { color: theme.main, fontWeight: 700 }]}>Balance Due</Text>
                                    <Text style={[styles.totalValue, { color: theme.main, fontWeight: 700 }]}>{currencySymbol}{Number(summary.balance).toFixed(2)}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Thin bottom branding */}
                <View style={{ position: 'absolute', bottom: 20, left: 30, right: 30, borderTopWidth: 1, borderTopColor: '#f5f5f5', paddingTop: 5 }}>
                    <Text style={{ fontSize: 7, color: '#ccc', textAlign: 'center' }}>Generated via HappyInvoice</Text>
                </View>

            </Page>
        </Document>
    );
}
