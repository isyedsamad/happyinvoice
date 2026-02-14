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
function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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
        if (getCurrentMonth() == snap.data().planAnalysis.month && snap.data().planAnalysis.invoice >= planConfig[snap.data().planAnalysis.plan].invoicesPerMonth) {
            return {
                success: false,
                type: 'limitExhausted',
                message: 'Your Limit has been exhausted!'
            }
        }
        const invoiceId = generateRandomID(8);
        const checkSnap = await admin.firestore().collection('happyuser').doc(uid).collection('happyinvoice').doc(invoiceId).get();
        if (!checkSnap.exists) {
            const value = {
                invoiceID: invoiceId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'Draft',
                recentActivity: {
                    date: getDMY(),
                    time: getTime(),
                    message: `Invoice #${snap.data().invoiceprefix + snap.data().invoicenumber} created.`
                },
                signature: snap.data().signature ? snap.data().signature : '',
                invoiceNo: snap.data().invoiceprefix + snap.data().invoicenumber,
                invoiceDate: new Date().toISOString().split('T')[0],
                dueDate: ""
            }
            await admin.firestore().collection('happyuser').doc(uid).collection('happyinvoice').doc(invoiceId).set(value);
            var planMonth = getCurrentMonth(), planInvoice = 1;
            const recentActivity = snap.data().activity ? snap.data().activity : [];
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift(`New Invoice #${snap.data().invoiceprefix + snap.data().invoicenumber} created.`);
            if (getCurrentMonth() == snap.data().planAnalysis.month) planInvoice = snap.data().planAnalysis.invoice + 1
            await admin.firestore().collection('happyuser').doc(uid).update({
                invoicenumber: snap.data().invoicenumber + 1,
                totalinvoice: snap.data().totalinvoice + 1,
                planAnalysis: {
                    plan: snap.data().planAnalysis.plan,
                    month: planMonth,
                    invoice: planInvoice
                },
                activity: recentActivity
            })
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