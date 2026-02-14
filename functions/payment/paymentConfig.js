const functions = require('firebase-functions');
const admin = require('firebase-admin');
const planConfig = require('../plan.json');
const paymentConfig = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to perform this action!');
    }
    try {
        const uid = context.auth?.uid;
        const { paymentGateway, paymentID, amountPaid, plan } = data;
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        if (snap.exists) {
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth + 1);
            await admin.firestore().collection('happyuser').doc(uid).update({
                'planAnalysis.plan': plan.toLowerCase(),
                'planAnalysis.invoice': 0,
                'planAnalysis.startDate': startDate,
                'planAnalysis.endDate': endDate,
                'planAnalysis.status': 'active',
                'planAnalysis.paymentGateway': paymentGateway,
                'planAnalysis.paymentID': paymentID,
                'planAnalysis.autoRenew': false,
                'planAnalysis.amountPaid': amountPaid,
                'planAnalysis.totalAmountPaid': snap.data().planAnalysis.totalAmountPaid + amountPaid,
            })
        } else {
            throw new functions.https.HttpsError('internal', 'No account found!');
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error);
    }
})
module.exports = { paymentConfig };