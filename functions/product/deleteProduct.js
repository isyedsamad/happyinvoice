const functions = require('firebase-functions');
const admin = require('firebase-admin');
const productDelete = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.');
    }
    const uid = context.auth?.uid;
    const userData = data;
    try {
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const newProductList = snap.data().products.filter(item => {
            if (item.pid == userData.id) return false
            return true
        })
        const recentActivity = snap.data().activity ? snap.data().activity : [];
        if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
        recentActivity.unshift("Product " + userData.name + " deleted.");
        await admin.firestore().collection('happyuser').doc(uid).collection('happyproduct').doc(userData.id).delete();
        await admin.firestore().collection('happyuser').doc(uid).update({
            'count.totalproduct': snap.data().count.totalproduct - 1,
            activity: recentActivity,
            products: newProductList
        })
        return {
            success: true,
            message: 'Product deleted successfully!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { productDelete }