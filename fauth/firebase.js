// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA3YPXfrHQLN_7N57tdV8WZX7BK36T7NfQ",
    authDomain: "happyinvoice-e72af.firebaseapp.com",
    projectId: "happyinvoice-e72af",
    storageBucket: "happyinvoice-e72af.firebasestorage.app",
    messagingSenderId: "616190705273",
    appId: "1:616190705273:web:520dbc7c6a6e6d00fc1ea8",
    measurementId: "G-P07DWDCC0D"
};

// const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_APP_ID,
//     measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { storage }