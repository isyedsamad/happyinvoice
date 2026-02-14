'use client'
import PlanLimit from '@/app/components/modal/PlanLimit'
const planConfig = require('@/app/plan.json');
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import InvoiceCreationFlow from '@/app/components/portal/invoice/InvoiceCreationFlow';
import InvoiceList from '@/app/components/portal/invoice/InvoiceList'
import NavBar from '@/app/components/portal/navbar/NavBar'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, setDoc, serverTimestamp } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Invoice = () => {
    const router = useRouter();
    const [showFlow, setShowFlow] = useState(false)
    const [clientList, setClientList] = useState(null)
    const [productList, setProductList] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');
    const [userLimit, setUserLimit] = useState('-');
    function getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    const { currentUser, userData, setUserData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isUpdateInvoice, setIsUpdateInvoice } = useContext(FnContext);
    const generateNewInvoice = async () => {
        // firebasefn
        if (getCurrentMonth() == userData.planAnalysis.month && userData.planAnalysis.invoice >= planConfig[userData.planAnalysis.plan].invoicesPerMonth) {
            setModalText(`You’ve reached your ${planConfig[userData?.planAnalysis.plan].invoicesPerMonth} invoice limit on the ${planConfig[userData?.planAnalysis.plan].name} Plan. Upgrade to continue.`)
            setModalOpen(true);
            return;
        }
        setShowFlow(true)
        // setLoading(true);
        // try {
        //     const functions = getFunctions();
        //     const callGenerateInvoice = httpsCallable(functions, 'generateInvoice');
        //     const response = await callGenerateInvoice();
        //     if (response.data.success) {
        //         const docRef = doc(db, 'happyuser', currentUser.uid);
        //         const snap = await getDoc(docRef);
        //         setUserData(snap.data());
        //         router.push(`/portal/${response.data.invoiceId}`);
        //     } else {
        //         if (response.data.type == 'limitExhausted') {
        //             // upgradeBanner
        //             setModalText(`You’ve reached your ${planConfig[userData?.planAnalysis.plan].invoicesPerMonth} invoice limit on the ${planConfig[userData?.planAnalysis.plan].name} Plan. Upgrade to continue.`)
        //             setModalOpen(true);
        //             // toast.error('Error: ' + response.data.message);
        //             setLoading(false);
        //         } else {
        //             toast.error('Error: ' + response.data.message);
        //             setLoading(false);
        //         }
        //     }
        // } catch (error) {
        //     toast.error('Error: ' + error.message);
        //     setLoading(false);
        // }
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserLimit(userData.planAnalysis.plan + " Plan • " + userData.count.totalinvoice + " invoices.");
            const userClientArray = userData.clients ? userData.clients : [];
            const newClientList = [];
            userClientArray.forEach(child => {
                newClientList.push({ label: child.name, value: child.uid });
            })
            const userProductArray = userData.products ? userData.products : [];
            const newProductList = [];
            userProductArray.forEach(child => {
                newProductList.push({ label: child.product + ' - ' + child.price, value: child.pid });
            })
            setClientList(newClientList)
            setProductList(newProductList)
            if (isMenu) setIsMenu(false);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    return (
        <>
            {isMenu && (
                <Sidebar page="invoice" />
            )}
            {loading && (
                <Loading />
            )}
            <InvoiceCreationFlow
                isOpen={showFlow}
                clientList={clientList}
                productList={productList}
                onClose={() => setShowFlow(false)}
            />
            <PlanLimit
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Invoice Limit Reached"
                message={modalText}
            />
            <ToastContainer />
            <div className='flex h-screen max-w-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="invoice" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>Your Invoices</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)] capitalize'>{userLimit}</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <button onClick={() => { generateNewInvoice() }} className='btnGreenLightest'><i className='fa-solid fa-plus mr-2'></i>Create Invoice</button>
                            </div>
                        </div>
                        <div className='mt-5 max-w-full'>
                            <InvoiceList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Invoice