const functions = require('firebase-functions');
const admin = require('firebase-admin');
const clientUpdate = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.');
    }
    const uid = context.auth?.uid;
    const { id, name, mail, phone, address } = data;
    try {
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const newClientList = snap.data().clients;
        newClientList.forEach(item => {
            if (item.uid == id) item.name = name
        })
        const recentActivity = snap.data().activity ? snap.data().activity : [];
        if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
        recentActivity.unshift("Client " + name + " edited.");
        await admin.firestore().collection('happyuser').doc(uid).collection('happyclient').doc(id).update({
            name: name,
            mail: mail,
            phone: phone,
            address: address,
        });
        await admin.firestore().collection('happyuser').doc(uid).update({ activity: recentActivity, clients: newClientList })
        return {
            success: true,
            message: 'Client edited successfully!'
        }
    } catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
})
module.exports = { clientUpdate }