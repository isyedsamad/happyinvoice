const functions = require("firebase-functions");
const admin = require("firebase-admin");
const onBoardingProcess = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this feature!')
    }
    try {
        const uid = context.auth?.uid;
        const { name, mail, phone, address, invoiceFooter, quoteFooter, invoicePrefix, quotePrefix } = data;
        if (name == '') {
            return {
                success: false,
                message: 'Please enter the business name to continue.'
            }
        }
        await admin?.firestore().collection('happyuser').doc(uid).update({
            'business.businessname': name,
            'business.businessmail': mail,
            'business.businessphone': phone,
            'business.businessaddress': address,
            'business.iFooter': invoiceFooter,
            'business.qFooter': quoteFooter,
            'business.invoicePrefix': invoicePrefix != '' ? invoicePrefix : 'INV',
            'business.quotePrefix': quotePrefix != '' ? quotePrefix : 'QTE',
            'business.invoiceNumber': 1001,
            'business.quoteNumber': 1001,
            'business.isAboard': true,
        })
        return {
            success: true,
            message: 'Onboarding Completed!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { onBoardingProcess }