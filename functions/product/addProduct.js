const functions = require('firebase-functions');
const admin = require('firebase-admin');
const planConfig = require('../plan.json');
const productAdd = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.')
    }
    try {
        const uid = context.auth?.uid;
        const { name, type, price, description, currency, tax } = data;
        const currencyShow = {
            INR: '₹',
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥'
        }
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const savingValue = {
            name: name,
            type: type,
            price: price,
            description: description,
            currency: currency,
            tax: tax,
            used: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            showAtFree: snap.data().planAnalysis.plan == 'free' ? 1 : 0
        }
        if (snap.data().planAnalysis.product < planConfig[snap.data().planAnalysis.plan].products) {
            const addProduct = await admin.firestore().collection('happyuser').doc(uid).collection('happyproduct').add(savingValue);
            const recentActivity = snap.data().activity ? snap.data().activity : [];
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift("New Product " + name + " added.");
            const newProductList = snap.data().products ? snap.data().products : [];
            newProductList.push({
                product: name,
                price: currencyShow[currency] + ' ' + price,
                pid: addProduct.id,
                showAtFree: snap.data().planAnalysis.plan == 'free' ? 1 : 0
            });
            await admin.firestore().collection('happyuser').doc(uid).update({
                'count.totalproduct': snap.data().count.totalproduct + 1,
                'planAnalysis.product': snap.data().planAnalysis.product + 1,
                activity: recentActivity,
                products: newProductList
            })
            return {
                success: true,
                pid: addProduct.id,
                message: 'Product added successfully!'
            }
        } else {
            return {
                success: false,
                message: 'Upgrade'
            }
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { productAdd };