'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ActivityBar from '@/app/components/portal/ActivityBar'
import InvoiceList from '@/app/components/portal/InvoiceList'
import NavBar from '@/app/components/portal/NavBar'
import NumberCard from '@/app/components/portal/NumberCard'
import Sidebar from '@/app/components/portal/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Home = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [userLimit, setUserLimit] = useState("-");
    const [totalInvoice, setTotalInvoice] = useState('-');
    const [totalClient, setTotalClient] = useState('-');
    const [totalProduct, setTotalProduct] = useState('-');
    const [isRecentActivity, setIsRecentActivity] = useState(false);
    const [recentActivity, setRecentActivity] = useState([]);
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu } = useContext(FnContext);
    const signOut = () => {
        signOut(auth);
        router.replace('./')
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserLimit(userData.plan + " Plan • " + userData.limitleft + " invoices left");
            setUserName(userData.name.includes(" ") ? userData.name.split(" ")[0] : userData.name);
            setTotalInvoice(userData.totalinvoice);
            setTotalClient(userData.totalclient);
            setTotalProduct(userData.totalproduct);
            if (userData.activity != [] && userData.activity[0] != '') {
                setRecentActivity(userData.activity);
                setIsRecentActivity(true);
            }
            if (isMenu) setIsMenu(false);
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
                <Sidebar page="dashboard" />
            )}
            <div className='flex h-screen bg-[var(--themeBackground)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="dashboard" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] bg-[var(--themeWhite)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1 text-[var(--themeBlack)]'><span className='text-[var(--greenPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3 text-[var(--themeBlack)]' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold text-[var(--themeBlack)]'>Hello, {userName}</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-gray-500'>{userLimit}</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <Link href='portal/generate-invoice/'>
                                    <button className='btnGreen text-[var(--textWhite)]'><i className='fa-solid fa-plus mr-2'></i>Create New Invoice</button>
                                </Link>
                            </div>
                        </div>
                        <div className='flex sm:flex-row flex-col pt-5 gap-5'>
                            <div className='flex-1 shadow flex flex-col pt-6 pb-4 md:pt-2 md:pb-1 justify-center items-center rounded-md bg-[var(--themeGreyBlue)] hover:bg-[var(--themeGreyBlueDark)] cursor-pointer'>
                                <i className='fa-solid fa-crown text-[var(--greenPanel)] text-4xl md:text-2xl'></i>
                                <h3 className='text-sm font-semibold text-[var(--themeBlack)] mt-4 md:mt-2'>Upgrade to Plus Plan</h3>
                                <p className='text-xs font-semibold text-[var(--themeGrey33)] text-center'>generate unlimited invoices</p>
                            </div>
                            <NumberCard link='/portal/invoice' heading="Total Invoice" number={totalInvoice >= 10 || totalInvoice == 0 || totalInvoice == '-' ? totalInvoice : '0' + totalInvoice} />
                            <NumberCard link='/portal/client' heading="Total Clients" number={totalClient >= 10 || totalClient == 0 || totalClient == '-' ? totalClient : '0' + totalClient} />
                            <NumberCard link='/portal/product' heading="Total Products" number={totalProduct >= 10 || totalProduct == 0 || totalProduct == '-' ? totalProduct : '0' + totalProduct} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-5 mt-5'>
                            <div className='flex-1 md:flex-3/4 shadow py-3 px-4 rounded-md'>
                                <h3 className='text-md text-[var(--greenPanel)] font-semibold'>Invoice History</h3>
                                <p className='font-semibold text-[var(--themeGrey66)] text-xs'>Your last 3 invoice history</p>
                                <div className="overflow-x-auto rounded-md mt-3">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-800 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    INVOICE
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    CLIENT
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    AMOUNT
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    STATUS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                                    #INV1028
                                                </th>
                                                <td className="px-6 py-4">
                                                    John S.
                                                </td>
                                                <td className="px-6 py-4">
                                                    ₹ 1800
                                                </td>
                                                <td className="px-6 py-4 text-[var(--greenPanel)] font-semibold">
                                                    Paid
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                                    #INV1027
                                                </th>
                                                <td className="px-6 py-4">
                                                    Abhishek Kr
                                                </td>
                                                <td className="px-6 py-4">
                                                    ₹ 100
                                                </td>
                                                <td className="px-6 py-4 text-[var(--yellow)] font-semibold">
                                                    Pending
                                                </td>
                                            </tr>
                                            <tr className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                                    #INV1026
                                                </th>
                                                <td className="px-6 py-4">
                                                    Abhishek Kr
                                                </td>
                                                <td className="px-6 py-4">
                                                    ₹ 600
                                                </td>
                                                <td className="px-6 py-4 text-[var(--greenPanel)] font-semibold">
                                                    Paid
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            <div className='flex-1 md:flex-1/4 max-h-fit shadow py-3 px-4 rounded-md'>
                                <h3 className='text-md text-[var(--greenPanel)] font-semibold'>Recent Activity</h3>
                                <p className='font-semibold text-[var(--themeGrey66)] text-xs'>Your recent activity on happyinvoice</p>
                                <div className='mt-3 flex flex-col gap-3'>
                                    {isRecentActivity ? (
                                        <div className='flex flex-col gap-3'>
                                            {recentActivity.map((child, index) => (
                                                <ActivityBar heading={child} key={index} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='font-semibold text-[var(--themeGrey66)] text-xs'>No Activity Found!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home