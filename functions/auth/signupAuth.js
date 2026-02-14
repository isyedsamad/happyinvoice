const functions = require("firebase-functions");
const admin = require("firebase-admin");
function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
const signupAuth = functions.https.onCall(async (data, context) => {
    const { name, email, password } = data;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name
        });
        await admin.firestore().collection('happyuser').doc(userRecord.uid).set({
            name: name,
            username: email.split('@')[0].toLowerCase(),
            mail: email,
            uid: userRecord.uid,
            currency: 'INR',
            planAnalysis: {
                plan: 'free',
                month: getCurrentMonth(),
                invoice: 0,
                client: 0,
                product: 0,
                startDate: new Date(),
                endDate: null,
                status: 'trial',
                paymentGateway: null,
                paymentID: null,
                autoRenew: false,
                amountPaid: 0,
                totalAmountPaid: 0
            },
            count: {
                totalinvoice: 0,
                totalclient: 0,
                totalproduct: 0,
            },
            activity: [],
            theme: {
                color: '#2BB673',
                mode: 'light'
            },
            business: {
                signature: '',
                businesslogo: '',
                businessname: '',
                businessmail: '',
                businessphone: '',
                businessaddress: '',
                iFooter: '',
                qFooter: '',
                invoicePrefix: 'INV',
                invoiceNumber: 1001,
                quotePrefix: 'QTE',
                quoteNumber: 1001,
                isAboard: false,
                isOnboarding: false
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        })
        return {
            success: true,
            uid: userRecord.uid,
            message: 'User created successfully!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

module.exports = { signupAuth }