'use client'
import Loading from '@/app/components/other/Loading'
import ActivityBar from '@/app/components/portal/ActivityBar'
import ClientList from '@/app/components/portal/ClientList'
import InvoiceList from '@/app/components/portal/InvoiceList'
import NavBar from '@/app/components/portal/NavBar'
import NewClient from '@/app/components/portal/NewClient'
import NumberCard from '@/app/components/portal/NumberCard'
import Sidebar from '@/app/components/portal/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Client = () => {
    const [userName, setUserName] = useState("");
    const [userLimit, setUserLimit] = useState("-");
    const [isFree, setIsFree] = useState(false);
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewClient, setIsNewClient, clientData, clientDataReady, setIsUpdateClient } = useContext(FnContext);
    const signOut = () => {
        signOut(auth);
        router.replace('./')
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserLimit(userData.plan + " Plan • " + userData.clientleft + " clients left");
            setUserName(userData.name.includes(" ") ? userData.name.split(" ")[0] : userData.name);
            if (userData.plan == 'Free') {
                setIsFree(true);
            }
            if (isMenu) setIsMenu(false);
            if (!clientData) setIsUpdateClient(true);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('signin/');
        }
    }, [isReady, currentUser, userData])
    return (
        <>
            {loading && (
                <Loading />
            )}
            {isMenu && (
                <Sidebar page="client" />
            )}
            {isNewClient && (
                <NewClient />
            )}
            <div className='flex h-screen max-w-screen'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="client" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen'>
                    {isFree ? (
                        <div className='w-full cursor-pointer text-sm bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] px-4 py-2 flex justify-center items-center'>
                            <p className='font-medium text-center'>Upgrade to <span className='font-semibold'>🚀 Plus Plan </span>and generate unlimited invoices.</p>
                        </div>
                    ) : (
                        <div className='w-full cursor-pointer text-sm bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] px-4 py-2 flex justify-center items-center'>
                            <p className='font-medium text-center'>We are now a family of <span className='font-semibold'>🚀 Plus Plan </span>and generate unlimited invoices.</p>
                        </div>
                    )}
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--greenPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold'>Your Clients</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-gray-500'>{userLimit}</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <button className='btnGreen' onClick={() => { setIsNewClient(true) }}><i className='fa-solid fa-plus mr-2'></i>New Client</button>
                            </div>
                        </div>
                        <div className='mt-5 max-w-full'>
                            {clientDataReady ? (
                                <>
                                    {clientData ? (
                                        <ClientList data={clientData} />
                                    ) : (
                                        <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                            <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--greenPanel)]'></i>
                                            <h2 className='mt-5 text-lg text-center'>No Client Found!</h2>
                                            <p className='text-gray-500 text-xs text-center'>add clients by clicking on the button to show here.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                    <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--greenPanel)]'></i>
                                    <h2 className='mt-5 text-lg text-center'>Searching clients!</h2>
                                    <p className='text-gray-500 text-xs text-center'>searching clients, please wait.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Client