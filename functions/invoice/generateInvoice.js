const functions = require('firebase-functions');
const admin = require('firebase-admin');
const planConfig = require('../plan.json');
const generateRandomID = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function getDMY() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
    return formattedDate;
}
function getTime() {
    const date = new Date();
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
    return formattedTime;
}
const generateInvoice = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to perform this action!')
    }
    try {
        const uid = context.auth?.uid;
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        if (snap.data().planAnalysis.invoice >= planConfig[snap.data().planAnalysis.plan].invoicesPerMonth) {
            return {
                success: false,
                type: 'limitExhausted',
                message: 'Your Limit has been exhausted!'
            }
        }
        const invoiceId = generateRandomID(8);
        const { client, product, taxData, discountData, summary } = data
        const checkSnap = await admin.firestore().collection('happyuser').doc(uid).collection('happyinvoice').doc(invoiceId).get();
        if (!checkSnap.exists) {
            const recentActivityObj = {
                date: getDMY(),
                time: getTime(),
                message: `Invoice #${snap.data().business.invoicePrefix + snap.data().business.invoiceNumber} created.`
            }
            const recentActivityArray = []
            recentActivityArray.push(recentActivityObj)
            const value = {
                invoiceID: invoiceId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                client: client,
                product: product,
                tax: taxData,
                discount: discountData,
                summary: summary,
                status: 'Draft',
                recentActivity: recentActivityArray,
                signature: snap.data().business.signature ? snap.data().business.signature : '',
                invoiceNo: snap.data().business.invoicePrefix + snap.data().business.invoiceNumber,
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: ""
            }
            await admin.firestore().collection('happyuser').doc(uid).collection('happyinvoice').doc(invoiceId).set(value);
            const recentActivity = snap.data().activity ? snap.data().activity : [];
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift(`New Invoice #${snap.data().business.invoicePrefix + snap.data().business.invoiceNumber} created.`);
            var planInvoice = snap.data().planAnalysis.invoice + 1;
            await admin.firestore().collection('happyuser').doc(uid).update({
                'business.invoiceNumber': snap.data().business.invoiceNumber + 1,
                'count.totalinvoice': snap.data().count.totalinvoice + 1,
                'planAnalysis.invoice': planInvoice,
                activity: recentActivity
            })
            const date = new Date();
            const thisYear = "year-" + date.getFullYear();
            const thisMonth = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
            const snapAnalytics = await admin.firestore().collection('happyuser').doc(uid).collection('happyanalytics').doc(thisYear).get();
            if (snapAnalytics.exists) {
                const analyticsUpdate = {
                    totalInvoice: snapAnalytics.data().totalInvoice + 1,
                    totalAmount: Number(Number(snapAnalytics.data().totalAmount) + Number(summary.balance)).toFixed(2),
                    [`monthlyInvoice.${thisMonth}`]: snapAnalytics.data().monthlyInvoice?.[thisMonth] + 1,
                    [`monthlyAmount.${thisMonth}`]: Number(Number(snapAnalytics.data().monthlyAmount?.[thisMonth]) + Number(summary.balance)).toFixed(2),
                }
                await admin.firestore().collection('happyuser').doc(uid).collection('happyanalytics').doc(thisYear).update(analyticsUpdate);
            } else {
                const analyticsUpdate = {
                    year: thisYear,
                    totalInvoice: 1,
                    totalAmount: summary.balance,
                    totalIncome: 0,
                    transactionCount: 0,
                    transactions: [],
                    monthlyInvoice: {
                        '01': thisMonth == '01' ? 1 : 0,
                        '02': thisMonth == '02' ? 1 : 0,
                        '03': thisMonth == '03' ? 1 : 0,
                        '04': thisMonth == '04' ? 1 : 0,
                        '05': thisMonth == '05' ? 1 : 0,
                        '06': thisMonth == '06' ? 1 : 0,
                        '07': thisMonth == '07' ? 1 : 0,
                        '08': thisMonth == '08' ? 1 : 0,
                        '09': thisMonth == '09' ? 1 : 0,
                        '10': thisMonth == '10' ? 1 : 0,
                        '11': thisMonth == '11' ? 1 : 0,
                        '12': thisMonth == '12' ? 1 : 0,
                    },
                    monthlyIncome: {
                        '01': 0,
                        '02': 0,
                        '03': 0,
                        '04': 0,
                        '05': 0,
                        '06': 0,
                        '07': 0,
                        '08': 0,
                        '09': 0,
                        '10': 0,
                        '11': 0,
                        '12': 0,
                    },
                    monthlyAmount: {
                        '01': thisMonth == '01' ? summary.balance : 0,
                        '02': thisMonth == '02' ? summary.balance : 0,
                        '03': thisMonth == '03' ? summary.balance : 0,
                        '04': thisMonth == '04' ? summary.balance : 0,
                        '05': thisMonth == '05' ? summary.balance : 0,
                        '06': thisMonth == '06' ? summary.balance : 0,
                        '07': thisMonth == '07' ? summary.balance : 0,
                        '08': thisMonth == '08' ? summary.balance : 0,
                        '09': thisMonth == '09' ? summary.balance : 0,
                        '10': thisMonth == '10' ? summary.balance : 0,
                        '11': thisMonth == '11' ? summary.balance : 0,
                        '12': thisMonth == '12' ? summary.balance : 0,
                    }
                }
                await admin.firestore().collection('happyuser').doc(uid).collection('happyanalytics').doc(thisYear).set(analyticsUpdate);
            }
            return {
                success: true,
                invoiceId: invoiceId,
                message: 'Invoice Generated Successfully'
            }
        } else {
            return {
                success: false,
                type: 'invoiceExists',
                message: 'Please try again!'
            }
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { generateInvoice };