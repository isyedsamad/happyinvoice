'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ClientEdit from '@/app/components/portal/client/ClientEdit'
import ClientList from '@/app/components/portal/client/ClientList'
import ClientTags from '@/app/components/portal/client/ClientTags'
import NavBar from '@/app/components/portal/navbar/NavBar'
import NewClient from '@/app/components/portal/client/NewClient'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

const Client = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userLimit, setUserLimit] = useState("-");
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewClient, setIsNewClient, clientData, clientDataReady, setIsUpdateClient, isClientEdit, userEditArray, isNewClientTag, setIsNewClientTag, newClientTagID, setNewClientTagID } = useContext(FnContext);
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserLimit(userData.planAnalysis.plan + " Plan • " + userData.count.totalclient + " clients");
            setUserName(userData.name.includes(" ") ? userData.name.split(" ")[0] : userData.name);
            if (isMenu) setIsMenu(false);
            if (!clientData) setIsUpdateClient(true);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    return (
        <>
            {isMenu && (
                <Sidebar page="client" />
            )}
            {isNewClient && (
                <NewClient />
            )}
            {isNewClientTag && (
                <ClientTags />
            )}
            {isClientEdit && (
                <ClientEdit uid={userEditArray.id} name={userEditArray.name} mail={userEditArray.mail} phone={userEditArray.phone} address={userEditArray.address} />
            )}
            {loading && (
                <Loading />
            )}
            <ToastContainer />
            <div className='flex h-screen max-w-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="client" />
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
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>Your Clients</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)] capitalize'>{userLimit}</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <button className='btnGreenLightest' onClick={() => { setIsNewClient(true) }}><i className='fa-solid fa-plus mr-2'></i>Add Client</button>
                            </div>
                        </div>
                        <div className='mt-5 max-w-full'>
                            <ClientList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Client