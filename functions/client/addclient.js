const functions = require('firebase-functions');
const admin = require('firebase-admin');
const planConfig = require('../plan.json');
const clientAdd = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use this function.')
    }
    try {
        const uid = context.auth?.uid;
        const { name, mail, phone, address } = data;
        const snap = await admin.firestore().collection('happyuser').doc(uid).get();
        const savingValue = {
            name: name,
            mail: mail,
            phone: phone,
            address: address,
            invoice: 0,
            billed: 0,
            tags: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            showAtFree: snap.data().planAnalysis.plan == 'free' ? 1 : 0
        }
        if (snap.data().planAnalysis.client < planConfig[snap.data().planAnalysis.plan].clients) {
            const addClient = await admin.firestore().collection('happyuser').doc(uid).collection('happyclient').add(savingValue);
            const recentActivity = snap.data().activity ? snap.data().activity : [];
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift("New Client " + name + " added.");
            const newClientList = snap.data().clients ? snap.data().clients : [];
            newClientList.push({
                name: name,
                uid: addClient.id,
                showAtFree: snap.data().planAnalysis.plan == 'free' ? 1 : 0
            });
            await admin.firestore().collection('happyuser').doc(uid).update({
                'count.totalclient': snap.data().count.totalclient + 1,
                'planAnalysis.client': snap.data().planAnalysis.client + 1,
                activity: recentActivity,
                clients: newClientList
            })
            return {
                success: true,
                uid: addClient.id,
                message: 'Client added successfully!'
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
module.exports = { clientAdd };