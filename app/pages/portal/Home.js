'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ActivityBar from '@/app/components/portal/ActivityBar'
import NavBar from '@/app/components/portal/navbar/NavBar'
import NumberCard from '@/app/components/portal/NumberCard'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore'
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
    const [isInvoiceDataEmpty, setIsInvoiceDataEmpty] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu } = useContext(FnContext);
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const signOut = () => {
        signOut(auth);
        router.replace('./')
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (!userData.business.isAboard) {
                setLoading(true)
                router.replace('/portal/getting-started')
            }
            setUserLimit(userData.planAnalysis.plan + " Plan • " + userData.count.totalinvoice + " invoices.");
            setUserName(userData.name.includes(" ") ? userData.name.split(" ")[0] : userData.name);
            setTotalInvoice(userData.count.totalinvoice);
            setTotalClient(userData.count.totalclient);
            setTotalProduct(userData.count.totalproduct);
            if (userData.activity.length > 0 && userData.activity[0] != '') {
                setRecentActivity(userData.activity);
                setIsRecentActivity(true);
            }
            if (isMenu) setIsMenu(false);
            loadLastInvoiceData();
        }
        if (isReady && !currentUser && !userData) {
            setLoading(true)
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    const loadLastInvoiceData = async () => {
        const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyinvoice'), orderBy('createdAt', 'desc'), limit(3))
        const snap = await getDocs(docRef);
        if (!snap.empty) {
            const invoiceList = [];
            snap.forEach(item => {
                invoiceList.push(item.data());
            })
            setInvoiceData(invoiceList);
            setIsInvoiceDataEmpty(false)
            setLoading(false);
        } else {
            setInvoiceData(null)
            setIsInvoiceDataEmpty(true)
            setLoading(false);
        }
    }
    return (
        <>
            {loading && (
                <Loading />
            )}
            {isMenu && (
                <Sidebar page="dashboard" />
            )}
            <div className='flex h-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="dashboard" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 shadow px-6 border-[var(--greenLightPanel)] bg-[var(--bgPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1 text-[var(--textPrimary)]'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3 text-[var(--textPrimary)]' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>Hello, {userName}</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)] capitalize'>{userLimit}</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <Link href='portal/generate-invoice/'>
                                    <button className='btnGreenLightest'><i className='fa-solid fa-plus mr-2'></i>Create New Invoice</button>
                                </Link>
                            </div>
                        </div>
                        <div className='flex md:flex-row flex-col pt-5 gap-5'>
                            <div className="flex-1 rounded-lg px-6 py-4 md:py-3 bg-[var(--primaryPanel)] hover:opacity-80 transition-all shadow flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--textTrans) 25%, transparent)' }}>
                                        <i className="fa-solid fa-crown text-[var(--textTrans)] text-sm"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--textTrans)]">Upgrade to Plus Plan</h3>
                                        <p className="text-xs text-[var(--textTrans)] font-medium mt-1">Unlock unlimited invoices</p>
                                    </div>
                                </div>
                                <i className="fa-solid fa-angle-right text-[var(--textTrans)] group-hover:translate-x-1 transition" />
                            </div>
                            <NumberCard link='/portal/invoice' icon="fa-receipt" heading="Total Invoice" number={totalInvoice >= 10 || totalInvoice == 0 || totalInvoice == '-' ? totalInvoice : '0' + totalInvoice} />
                            <NumberCard link='/portal/client' icon="fa-user" heading="Total Clients" number={totalClient >= 10 || totalClient == 0 || totalClient == '-' ? totalClient : '0' + totalClient} />
                            <NumberCard link='/portal/product' icon="fa-box-open" heading="Total Products" number={totalProduct >= 10 || totalProduct == 0 || totalProduct == '-' ? totalProduct : '0' + totalProduct} />
                        </div>
                        <div className='flex flex-col md:flex-row gap-5 mt-5'>
                            <div className='flex-1 md:flex-3/4 shadow-sm py-3 px-4 md:px-5 rounded-lg hover:shadow-md bg-[var(--cardPanel)]'>
                                <h3 className='text-sm text-[var(--primaryPanel)] font-semibold'>Invoice History</h3>
                                <p className='font-medium text-[var(--textSecondary)] text-xs'>Your last 3 invoice history</p>
                                {/* <div className="overflow-x-auto rounded-md mt-3">
                                    {!isInvoiceDataEmpty ? (
                                        <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-800 uppercase bg-[var(--primaryPanel)] filter brightness-100">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        INVOICE
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        CLIENT
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right">
                                                        AMOUNT
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right">
                                                        ACTION
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoiceData && (
                                                    invoiceData.map(item => (
                                                        <tr key={item.invoiceNo} className="odd:bg-[var(--bgPanel)] text-[var(--textSecondary)] even:bg-[var(--cardPanel)] border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                                            <th scope="row" className="px-6 py-3 font-semibold text-[var(--textPrimary)] whitespace-nowrap flex gap-2 justify-start items-center">
                                                                #{item.invoiceNo}
                                                                {item.status == 'Draft' && (
                                                                    <div className='inline-block px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is saved as a draft. Not yet sent to the client." data-tooltip-place="top">
                                                                        DRAFT
                                                                    </div>
                                                                )}
                                                                {item.status == 'Sent' && (
                                                                    <div className='inline-block px-3 py-1 rounded-sm bg-blue-100 hover:bg-blue-200 border border-blue-200 cursor-pointer text-blue-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice has been sent to the client but not yet viewed." data-tooltip-place="top">
                                                                        SENT
                                                                    </div>
                                                                )}
                                                                {item.status == 'Viewed' && (
                                                                    <div className='inline-block px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 border border-purple-200 cursor-pointer text-purple-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Client has viewed the invoice. Awaiting payment." data-tooltip-place="top">
                                                                        VIEWED
                                                                    </div>
                                                                )}
                                                                {item.status == 'Payment Due' && (
                                                                    <div className='inline-block px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is unpaid and past its due date. Payment reminder may be needed" data-tooltip-place="top">
                                                                        PAYMENT DUE
                                                                    </div>
                                                                )}
                                                                {item.status == 'Paid' && (
                                                                    <div className='inline-block px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 border border-green-200 cursor-pointer text-green-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is fully paid. No further action needed." data-tooltip-place="top">
                                                                        PAID
                                                                    </div>
                                                                )}
                                                            </th>
                                                            <td className="px-6 py-3 font-medium">
                                                                {item.client ? item.client.name : '-'}
                                                            </td>
                                                            <td className="px-6 py-3 font-semibold text-right whitespace-nowrap">
                                                                {item.product && item.product?.length > 0 ? currencyShow[item.product[0].currency] + ' ' + item.summary.balance : '-'}
                                                            </td>
                                                            <td className="px-6 py-3 font-semibold flex justify-end whitespace-nowrap">
                                                                <Link href={'/portal/' + item.invoiceID}><div onClick={() => { setLoading(true) }} data-tooltip-id="my-tooltip" data-tooltip-content="view invoice" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] border border-[var(--greenLightPanel)] cursor-pointer text-[var(--primaryPanel)] text-xs font-medium'>
                                                                    VIEW
                                                                </div></Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className='w-full py-6 md:py-10 px-2 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                            <i className='fa-solid fa-triangle-exclamation text-5xl text-[var(--greenLightPanel)]'></i>
                                            <h2 className='text-md text-center mt-4'>No Invoice Found!</h2>
                                            <p className='text-gray-500 text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any invoices yet. Click the button above to create your first invoice.</p>
                                        </div>
                                    )}
                                </div> */}
                                <div className="table-wrapper overflow-x-auto rounded-md mt-3">
                                    {!isInvoiceDataEmpty ? (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left">
                                                        INVOICE
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left">
                                                        CLIENT
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right">
                                                        AMOUNT
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-right">
                                                        ACTION
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoiceData && (
                                                    invoiceData.map(item => (
                                                        <tr key={item.invoiceNo}>
                                                            <th scope="row" className="text-left text-[var(--textPrimary)] flex justify-start items-center gap-3">
                                                                #{item.invoiceNo}
                                                                {[
                                                                    { label: item.status, color: item.status == 'Draft' ? '#F59E0B' : item.status == 'Sent' ? '#3B82F6' : item.status == 'Viewed' ? '#8B5CF6' : item.status == 'Payment Due' ? '#EF4444' : item.status == 'Paid' ? '#10B981' : '#10B981', tooltip: item.status == 'Draft' ? 'Invoice is saved as a draft. Not yet sent to the client.' : item.status == 'Sent' ? 'Invoice has been sent to the client but not yet viewed.' : item.status == 'Viewed' ? 'Client has viewed the invoice. Awaiting payment.' : item.status == 'Payment Due' ? 'Invoice is unpaid and past its due date. Payment reminder may be needed' : item.status == 'Paid' ? 'Invoice is fully paid. No further action needed.' : 'Invoice is fully paid. No further action needed.' },
                                                                ].map((item) => (
                                                                    <div
                                                                        key={item.label}
                                                                        className="filter-tab"
                                                                        style={{
                                                                            '--tab-color': item.color,
                                                                        }}
                                                                        data-tooltip-id="my-tooltip"
                                                                        data-tooltip-content={item.tooltip}
                                                                        data-tooltip-place="top"
                                                                    >
                                                                        {item.label}
                                                                    </div>
                                                                ))}
                                                            </th>
                                                            <td className="font-medium">
                                                                {item.client ? item.client.name : '-'}
                                                            </td>
                                                            <td className="font-semibold text-right whitespace-nowrap">
                                                                {item.product && item.product?.length > 0 ? currencyShow[item.product[0].currency] + ' ' + item.summary.balance : '-'}
                                                            </td>
                                                            <td className="font-semibold flex justify-end whitespace-nowrap">
                                                                <Link href={'/portal/invoice/' + item.invoiceID}>
                                                                    <div
                                                                        className="filter-tab"
                                                                        style={{
                                                                            '--tab-color': '#10B981',
                                                                        }}
                                                                        data-tooltip-id="my-tooltip"
                                                                        data-tooltip-content='view invoice'
                                                                        data-tooltip-place="top"
                                                                    >
                                                                        VIEW
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className='w-full py-6 md:py-10 px-2 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                            <i className='fa-solid fa-triangle-exclamation text-5xl text-[var(--primaryPanel)]'></i>
                                            <h2 className='text-md text-center mt-4 text-[var(--textPrimary)]'>No Invoice Found!</h2>
                                            <p className='text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any invoices yet. Click the button above to create your first invoice.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='flex-1 md:flex-1/4 max-h-fit shadow-sm hover:shadow-md py-3 px-4 md:px-5 rounded-lg bg-[var(--cardPanel)]'>
                                <h3 className='text-sm text-[var(--primaryPanel)] font-semibold'>Recent Activity</h3>
                                <p className='font-medium text-[var(--textSecondary)] text-xs'>Your latest interaction on happyinvoice.</p>
                                <div className='mt-4 flex flex-col gap-3'>
                                    {isRecentActivity ? (
                                        <div className='flex flex-col gap-3'>
                                            {recentActivity.map((child, index) => (
                                                <ActivityBar heading={child} key={index} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='font-semibold text-gray-500 text-xs'>No Activity Found!</p>
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