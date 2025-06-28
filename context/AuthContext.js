"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../fauth/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout() {
        setUserData(null);
        setCurrentUser(null);
        return signOut(auth);
    }
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async user => {
            try {
                setLoading(true);
                setCurrentUser(user);
                if (!user) {
                    setIsReady(true);
                    return
                }
                const docRef = doc(db, 'happyuser', user.uid);
                const snap = await getDoc(docRef);
                let firebaseData = {};
                if (snap.exists()) {
                    firebaseData = snap.data();
                }
                setUserData(firebaseData);
                setIsReady(true);
                setLoading(false);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        })
        return unsub;
    }, [])

    const value = {
        currentUser,
        userData,
        setUserData,
        signup,
        login,
        logout,
        loading,
        setLoading,
        isReady
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider