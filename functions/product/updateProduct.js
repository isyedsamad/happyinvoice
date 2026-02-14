const functions = require('firebase-functions');
const admin = require('firebase-admin');
const productUpdate = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.');
    }
    const uid = context.auth?.uid;
    const { id, name, type, price, description, currency, tax } = data;
    try {
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const newProductList = snap.data().products;
        const currencyShow = {
            INR: '₹',
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥'
        }
        newProductList.forEach(item => {
            if (item.pid == id) {
                item.product = name
                item.price = currencyShow[currency] + ' ' + price
            }
        })
        const recentActivity = snap.data().activity ? snap.data().activity : [];
        if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
        recentActivity.unshift("Product " + name + " edited.");
        await admin.firestore().collection('happyuser').doc(uid).collection('happyproduct').doc(id).update({
            name: name,
            type: type.toUpperCase(),
            price: price,
            description: description,
            currency: currency,
            tax: tax,
        });
        await admin.firestore().collection('happyuser').doc(uid).update({ activity: recentActivity, products: newProductList })
        return {
            success: true,
            message: 'Product edited successfully!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { productUpdate }