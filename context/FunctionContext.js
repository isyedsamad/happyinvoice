'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/fauth/firebase';

export const FnContext = createContext();

export const FunctionContext = ({ children }) => {
    const { isReady, currentUser, setLoading } = useContext(AuthContext);
    const [isMenu, setIsMenu] = useState(false);
    const [isNewClient, setIsNewClient] = useState(false);
    const [isUpdateClient, setIsUpdateClient] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [clientDataReady, setClientDataReady] = useState(false);
    const [isFailedMsg, setIsFailedMsg] = useState(false);
    const loadClient = async () => {
        setLoading(true);
        const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyclient'), orderBy("createdAt", "desc"));
        const snap = await getDocs(docRef);
        const clientArray = []
        if (!snap.empty) {
            snap.forEach(childSnap => {
                clientArray.push({ id: childSnap.id, ...childSnap.data() });
            })
            setClientData(clientArray);
            setClientDataReady(true);
        }
        setLoading(false);
        setIsUpdateClient(false);
    }
    useEffect(() => {
        if (isUpdateClient && isReady && currentUser) {
            loadClient();
        }
    }, [isReady, currentUser, isUpdateClient])
    const value = {
        isMenu,
        setIsMenu,
        isNewClient,
        setIsNewClient,
        isUpdateClient,
        setIsUpdateClient,
        clientData, setClientData,
        clientDataReady, setClientDataReady,
        isFailedMsg,
        setIsFailedMsg
    }
    return (
        <FnContext.Provider value={value}>
            {children}
        </FnContext.Provider>
    )
}

export default FunctionContext