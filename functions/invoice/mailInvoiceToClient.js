const functions = require('firebase-functions');
const admin = require('firebase-admin');
const planConfig = require('../plan.json');
const { Resend } = require('resend');
const RESEND_API_KEY = functions.config().resend.key;
const resendMail = new Resend(RESEND_API_KEY);
const { generateInvoiceHTML } = require('./mailTemplate');
const mailInvoiceToClient = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature!');
    }
    try {
        const uid = context.auth?.uid;
        const { invoiceId } = data;
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        if (!planConfig[snap.data().planAnalysis.plan].features.emailInvoice) {
            return {
                success: false,
                type: 'UpgradePlan',
                message: 'This feature is not available for your plan!'
            }
        }
        const snapInvoice = await admin.firestore().collection('happyuser').doc(uid).collection('happyinvoice').doc(invoiceId).get();
        if (!snapInvoice.data().client) {
            return {
                success: false,
                type: 'NoClient',
                message: "Failed: No Client found to send invoice!"
            }
        }
        if (snapInvoice.data().client.mail == '') {
            return {
                success: false,
                type: 'NoClientMail',
                message: "Failed: Client's Mail not found!"
            }
        }
        if (!snapInvoice.data().summary || !snapInvoice.data().product || snapInvoice.data().product.length == 0) {
            return {
                success: false,
                type: 'NoProduct',
                message: "Failed: No Product list found!"
            }
        }
        const { businessname } = snap.data();
        const { client, invoiceNo, invoiceDate, dueDate, summary, tax, discount, partialPayment, product } = snapInvoice.data();
        const link = `www.happyinvoice.com/${snap.data().username}/${invoiceId}`;
        const currency = product[0].currency;
        const html = generateInvoiceHTML({
            invoiceId,
            businessname,
            client,
            invoiceNo,
            invoiceDate,
            dueDate,
            summary,
            tax,
            discount,
            partialPayment,
            link,
            currency
        });
        const result = await resendMail.emails.send({
            from: `${businessname} <invoices@appitor.in>`,
            to: client.mail,
            subject: `Invoice #${invoiceNo} from ${businessname}`,
            html
        });
        return {
            success: true,
            message: result
        }
    } catch (error) {
        return {
            success: false,
            type: 'internalError',
            message: error.message
        }
    }
})
module.exports = { mailInvoiceToClient }