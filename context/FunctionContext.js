'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import { useRouter } from 'next/navigation';

export const FnContext = createContext();

export const FunctionContext = ({ children }) => {
    const router = useRouter();
    const { isReady, currentUser, userData, setLoading } = useContext(AuthContext);
    const [isMenu, setIsMenu] = useState(false);

    const [isNewClient, setIsNewClient] = useState(false);
    const [isNewClientTag, setIsNewClientTag] = useState(false);
    const [newClientTags, setNewClientTags] = useState([]);
    const [newClientTagID, setNewClientTagID] = useState("");
    const [isUpdateClient, setIsUpdateClient] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false)
    const [userEditArray, setUserEditArray] = useState('');
    const [clientData, setClientData] = useState(null);
    const [clientDataReady, setClientDataReady] = useState(false);

    const [isNewProduct, setIsNewProduct] = useState(false);
    const [isUpdateProduct, setIsUpdateProduct] = useState(false);
    const [isProductEdit, setIsProductEdit] = useState(false)
    const [productData, setProductData] = useState(null);
    const [productEditArray, setProductEditArray] = useState('');
    const [productDataReady, setProductDataReady] = useState(false);

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
        } else {
            setClientDataReady(true);
        }
        setLoading(false);
        setIsUpdateClient(false);
    }
    const loadProduct = async () => {
        setLoading(true);
        const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyproduct'), orderBy("createdAt", "desc"));
        const snap = await getDocs(docRef);
        const productArray = []
        if (!snap.empty) {
            snap.forEach(childSnap => {
                productArray.push({ id: childSnap.id, ...childSnap.data() });
            })
            setProductData(productArray);
            setProductDataReady(true);
        } else {
            setProductDataReady(true);
        }
        setLoading(false);
        setIsUpdateProduct(false);
    }
    useEffect(() => {
        if (isUpdateClient && isReady && currentUser) {
            loadClient();
        }
    }, [isReady, currentUser, isUpdateClient])
    useEffect(() => {
        if (isUpdateProduct && isReady && currentUser) {
            loadProduct();
        }
    }, [isReady, currentUser, isUpdateProduct])
    useEffect(() => {
        if (isReady && currentUser && userData) {
            const color = userData.theme ? userData.theme : 'green';
            if (color == 'green') {
                document.documentElement.style.setProperty('--greenPanel', 'var(--greenPanelSet)');
                document.documentElement.style.setProperty('--greenLightPanel', 'var(--greenLightPanelSet)');
                document.documentElement.style.setProperty('--greenLightestPanel', 'var(--greenLightestPanelSet)');
                document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--greenLightest2PanelSet)');
                document.documentElement.style.setProperty('--greenDarkPanel', 'var(--greenDarkPanelSet)');
                document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--greenDarkestPanelSet)');
            }
            if (color == 'blue') {
                document.documentElement.style.setProperty('--greenPanel', 'var(--bluePanel)');
                document.documentElement.style.setProperty('--greenLightPanel', 'var(--blueLightPanel)');
                document.documentElement.style.setProperty('--greenLightestPanel', 'var(--blueLightestPanel)');
                document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--blueLightest2Panel)');
                document.documentElement.style.setProperty('--greenDarkPanel', 'var(--blueDarkPanel)');
                document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--blueDarkestPanel)');
            }
            if (color == 'red') {
                document.documentElement.style.setProperty('--greenPanel', 'var(--redPanel)');
                document.documentElement.style.setProperty('--greenLightPanel', 'var(--redLightPanel)');
                document.documentElement.style.setProperty('--greenLightestPanel', 'var(--redLightestPanel)');
                document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--redLightest2Panel)');
                document.documentElement.style.setProperty('--greenDarkPanel', 'var(--redDarkPanel)');
                document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--redDarkestPanel)');
            }
            if (color == 'purple') {
                document.documentElement.style.setProperty('--greenPanel', 'var(--purplePanel)');
                document.documentElement.style.setProperty('--greenLightPanel', 'var(--purpleLightPanel)');
                document.documentElement.style.setProperty('--greenLightestPanel', 'var(--purpleLightestPanel)');
                document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--purpleLightest2Panel)');
                document.documentElement.style.setProperty('--greenDarkPanel', 'var(--purpleDarkPanel)');
                document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--purpleDarkestPanel)');
            }
            if (color == 'orange') {
                document.documentElement.style.setProperty('--greenPanel', 'var(--orangePanel)');
                document.documentElement.style.setProperty('--greenLightPanel', 'var(--orangeLightPanel)');
                document.documentElement.style.setProperty('--greenLightestPanel', 'var(--orangeLightestPanel)');
                document.documentElement.style.setProperty('--greenLightest2Panel', 'var(--orangeLightest2Panel)');
                document.documentElement.style.setProperty('--greenDarkPanel', 'var(--orangeDarkPanel)');
                document.documentElement.style.setProperty('--greenDarkestPanel', 'var(--orangeDarkestPanel)');
            }
        }
    }, [isReady, currentUser, userData])
    const value = {
        isMenu,
        setIsMenu,
        isNewClient,
        setIsNewClient,
        isNewClientTag, setIsNewClientTag,
        newClientTagID, setNewClientTagID,
        newClientTags, setNewClientTags,
        isClientEdit, setIsClientEdit,
        userEditArray, setUserEditArray,
        isUpdateClient,
        setIsUpdateClient,
        clientData, setClientData,
        clientDataReady, setClientDataReady,
        isNewProduct, setIsNewProduct,
        isUpdateProduct, setIsUpdateProduct,
        isProductEdit, setIsProductEdit,
        productData, setProductData,
        productDataReady, setProductDataReady,
        productEditArray, setProductEditArray,
        isFailedMsg,
        setIsFailedMsg
    }
    useEffect(() => {
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])

    return (
        <FnContext.Provider value={value}>
            {children}
        </FnContext.Provider>
    )
}

export default FunctionContext