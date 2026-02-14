const functions = require('firebase-functions');
const admin = require('firebase-admin');
const clientDelete = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.');
    }
    const uid = context.auth?.uid;
    const userData = data;
    try {
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const newClientList = snap.data().clients.filter(item => {
            if (item.uid == userData.id) return false
            return true
        })
        const recentActivity = snap.data().activity ? snap.data().activity : [];
        if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
        recentActivity.unshift("Client " + userData.name + " deleted.");
        await admin.firestore().collection('happyuser').doc(uid).collection('happyclient').doc(userData.id).delete();
        await admin.firestore().collection('happyuser').doc(uid).update({
            'count.totalclient': snap.data().count.totalclient - 1,
            activity: recentActivity,
            clients: newClientList
        })
        return {
            success: true,
            message: 'Client deleted successfully!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { clientDelete }