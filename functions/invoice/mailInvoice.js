const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');
const planConfig = require('../plan.json');
const { generateInvoiceHTML } = require('./mailTemplate');
const RESEND_API_KEY = functions.config().resend.key;
const resend = new Resend(RESEND_API_KEY);
const mailInvoice = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature!')
    }
    const uid = context.auth?.uid;
    const { invoiceId } = data;
    try {
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        if (!planConfig[snap.data().planAnalysis.plan].features.emailInvoice) {
            return {
                success: false,
                type: 'UpgradePlan',
                message: "Free Plan doesn't support email feature!"
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
        if (!snapInvoice.data().summary) {
            return {
                success: false,
                type: 'NoProduct',
                message: "Failed: No Product list found!"
            }
        }
        const { businessname } = snap.data();
        const { client, invoiceNo, invoiceDate, summary, tax, discount, partialPayment } = snapInvoice.data();
        const link = `www.happyinvoice.com/${snap.data().username}/${invoiceId}`;
        const html = generateInvoiceHTML({
            invoiceId,
            businessname,
            client,
            invoiceNo,
            invoiceDate,
            summary,
            tax,
            discount,
            partialPayment,
            link
        });
        const result = await resend.emails.send({
            from: `${businessname} <invoices@appitor.in>`,
            to: client.mail,
            subject: `Invoice ${invoiceNo} from ${businessname}`,
            html
        });
        return {
            success: true,
            result
        };
    } catch (error) {
        console.log(error.message);
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { mailInvoice };