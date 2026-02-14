'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db } from '@/fauth/firebase';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientEdit from '../client/ClientEdit';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';

const InvoiceList = ({ data }) => {
    const { isReady, currentUser, userData, setUserData, setLoading } = useContext(AuthContext);
    const [invoiceData, setInvoiceData] = useState(null);
    const [invoiceDataReady, setInvoiceDataReady] = useState(false);
    const [lastVisible, setLastVisible] = useState('');
    const [search, setSearch] = useState('');
    const [table, setTable] = useState(invoiceData);
    const [mainTable, setMainTable] = useState(invoiceData);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const [filterStatus, setFilterStatus] = useState('');
    const { isUpdateInvoice, setIsUpdateInvoice } = useContext(FnContext);
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const searchFn = async () => {
        if (search != "") {
            setLoading(true);
            const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyinvoice'), where('invoiceNo', '==', search.toUpperCase()))
            const snap = await getDocs(docRef)
            const invoiceArray = [];
            if (!snap.empty) {
                snap.forEach(childSnap => {
                    invoiceArray.push({ id: childSnap.id, ...childSnap.data() });
                })
                setTable(invoiceArray)
                setInvoiceData(invoiceArray);
                setInvoiceDataReady(true);
                setLastVisible(snap.docs[snap.docs.length - 1])
            } else {
                setInvoiceDataReady(true);
                setInvoiceData(null);
                setTable(null);
            }
            setIsUpdateInvoice(false);
            setLoading(false);
        }
    }
    const searchTags = (tag) => {
        setSearch(tag)
        if (tag != "") {
            const newTable = mainTable.filter(value => {
                const index = value.type.indexOf(tag.toUpperCase())
                if (index != -1) return true;
            })
            setTable(newTable);
        } else {
            setTable(mainTable);
        }
    }
    const loadInvoice = async (filterData) => {
        setFilterStatus(filterData);
        if (filterData == 'All') {
            setLoading(true);
            const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyinvoice'),
                orderBy("createdAt", "desc"), limit(5));
            const snap = await getDocs(docRef);
            const invoiceArray = []
            if (!snap.empty) {
                snap.forEach(childSnap => {
                    invoiceArray.push({ id: childSnap.id, ...childSnap.data() });
                })
                setTable(invoiceArray)
                setInvoiceData(invoiceArray);
                setInvoiceDataReady(true);
                setLastVisible(snap.docs[snap.docs.length - 1])
            } else {
                setInvoiceDataReady(true);
                setInvoiceData(null);
                setTable(null);
            }
            setIsUpdateInvoice(false);
            setLoading(false);
        } else {
            setLoading(true);
            const docRef = query(collection(db, 'happyuser', currentUser.uid, 'happyinvoice'),
                where('status', '==', filterData), orderBy("createdAt", "desc"), limit(5));
            const snap = await getDocs(docRef);
            const invoiceArray = []
            if (!snap.empty) {
                snap.forEach(childSnap => {
                    invoiceArray.push({ id: childSnap.id, ...childSnap.data() });
                })
                setTable(invoiceArray)
                setInvoiceData(invoiceArray);
                setInvoiceDataReady(true);
                setLastVisible(snap.docs[snap.docs.length - 1])
            } else {
                setInvoiceDataReady(true);
                setInvoiceData(null);
                setTable(null);
            }
            setIsUpdateInvoice(false);
            setLoading(false);
        }
    }
    useEffect(() => {
        if (isUpdateInvoice && isReady && currentUser) {
            loadInvoice('All');
        }
    }, [isReady, currentUser, isUpdateInvoice])
    useEffect(() => {
        if (isReady && currentUser) {
            loadInvoice('All');
        }
    }, [isReady, currentUser])
    const loadMore = async (filterData) => {
        if (!lastVisible) {
            toast.error('No Invoice Found!');
            return;
        }
        if (filterData == 'All') {
            setLoading(true)
            const q = query(
                collection(db, 'happyuser', currentUser.uid, 'happyinvoice'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(5)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                const invoiceArray = []
                snap.forEach(childSnap => {
                    invoiceArray.push({ id: childSnap.id, ...childSnap.data() });
                })
                setLastVisible(snap.docs[snap.docs.length - 1]);
                setTable(prev => [...prev, ...invoiceArray])
                setInvoiceData(prev => [...prev, ...invoiceArray]);
                setLoading(false)
            } else {
                toast.error('No Invoice Found!');
                setLoading(false)
            }
        } else {
            setLoading(true)
            const q = query(
                collection(db, 'happyuser', currentUser.uid, 'happyinvoice'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                where('status', '==', filterData),
                limit(5)
            );
            const snap = await getDocs(q);
            if (!snap.empty) {
                const invoiceArray = []
                snap.forEach(childSnap => {
                    invoiceArray.push({ id: childSnap.id, ...childSnap.data() });
                })
                setLastVisible(snap.docs[snap.docs.length - 1]);
                setTable(prev => [...prev, ...invoiceArray])
                setInvoiceData(prev => [...prev, ...invoiceArray]);
                setLoading(false)
            } else {
                toast.error('No Invoice Found!');
                setLoading(false)
            }
        }
    }
    // const deleteHandler = async (productDelete, productID) => {
    //     setLoading(true);
    //     const index = productData.indexOf(productDelete);
    //     if (index != -1) {
    //         const docRef = doc(db, 'happyuser', currentUser.uid, 'happyproduct', productID);
    //         await deleteDoc(docRef);
    //         const docRefUpdate = doc(db, 'happyuser', currentUser.uid);
    //         const indexProduct = userData.products.indexOf(productDelete.name);
    //         const newProductArray = userData.products;
    //         const newProductPriceArray = userData.productprice;
    //         newProductArray.splice(indexProduct, 1);
    //         newProductPriceArray.splice(indexProduct, 1);
    //         const recentActivity = userData.activity;
    //         if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
    //         recentActivity.unshift("Product " + productDelete.name + " deleted.")
    //         await updateDoc(docRefUpdate, { totalproduct: userData.totalproduct - 1, activity: recentActivity, products: newProductArray, productprice: newProductPriceArray })
    //         const updatedUserData = {
    //             ...userData,
    //             totalproduct: userData.totalproduct - 1,
    //             activity: recentActivity,
    //             products: newProductArray, productprice: newProductPriceArray
    //         };
    //         setUserData(updatedUserData);
    //         productData.splice(index, 1);
    //         setProductData(productData);
    //         setLoading(false);
    //     }
    // }
    return (
        <>
            <ToastContainer />
            <Tooltip id="my-tooltip" />
            <div className='flex gap-2'>
                {/* <p className='text-sm font-medium text-gray-500 uppercase'>Search Invoice No.</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { setSearch(e.target.value) }} className='happyinput max-w-[210px]' placeholder='search invoice no.' />
                <button onClick={() => { searchFn() }} className='py-1 px-4 rounded-md bg-[var(--cardPanel)] text-[var(--textPrimary)] hover:opacity-80 cursor-pointer'><i className='fa-solid fa-magnifying-glass'></i></button>
            </div>
            <div className='mt-3 mb-5 flex flex-wrap md:flex-nowrap justify-start items-center gap-2'>
                {/* <div onClick={() => { loadInvoice('All') }} className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 cursor-pointer text-gray-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="View all your invoices." data-tooltip-place="top">
                    ALL
                </div>
                <div onClick={() => { loadInvoice('Draft') }} className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="show invoices that are saved." data-tooltip-place="top">
                    DRAFT
                </div>
                <div onClick={() => { loadInvoice('Sent') }} className='px-3 py-1 rounded-sm bg-blue-100 hover:bg-blue-200 border border-blue-200 cursor-pointer text-blue-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="filter invoices that have been sent." data-tooltip-place="top">
                    SENT
                </div>
                <div onClick={() => { loadInvoice('Viewed') }} className='px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 border border-purple-200 cursor-pointer text-purple-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="show invoices that your client has opened." data-tooltip-place="top">
                    VIEWED
                </div>
                <div onClick={() => { loadInvoice('Payment Due') }} className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium whitespace-nowrap' data-tooltip-id="my-tooltip" data-tooltip-content="show overdue invoices that haven’t been paid." data-tooltip-place="top">
                    PAYMENT DUE
                </div>
                <div onClick={() => { loadInvoice('Paid') }} className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 border border-green-200 cursor-pointer text-green-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="view invoices that have been successfully paid." data-tooltip-place="top">
                    PAID
                </div> */}
                {[
                    { label: "All", color: "#9CA3AF", tooltip: "View all your invoices." },
                    { label: "Draft", color: "#F59E0B", tooltip: "Show invoices that are saved." },
                    { label: "Sent", color: "#3B82F6", tooltip: "Filter invoices that have been sent." },
                    { label: "Viewed", color: "#8B5CF6", tooltip: "Show invoices your client has opened." },
                    { label: "Payment Due", color: "#EF4444", tooltip: "Show overdue invoices." },
                    { label: "Paid", color: "#10B981", tooltip: "View invoices that have been paid." },
                ].map((item) => (
                    <div
                        key={item.label}
                        onClick={() => loadInvoice(item.label)}
                        className="filter-tab"
                        style={{
                            '--tab-color': item.color,
                        }}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={item.tooltip}
                        data-tooltip-place="top"
                    >
                        {item.label.toUpperCase()}
                    </div>
                ))}
            </div>
            {invoiceDataReady ? (
                <>
                    {invoiceData ? (
                        <>
                            <div className='max-w-full overflow-x-auto'>
                                <table>
                                    <thead className="uppercase">
                                        <tr>
                                            <th scope="col" className="pl-4 pr-1 py-3 text-left">
                                                INVOICE NO
                                            </th>
                                            <th scope="col" className="pl-4 pr-1 py-3 text-left">
                                                CLIENT
                                            </th>
                                            <th scope="col" className="pl-4 pr-1 py-3 text-left">
                                                DATE
                                            </th>
                                            <th scope="col" className="pl-4 pr-1 py-3 text-right">
                                                AMOUNT
                                            </th>
                                            <th scope="col" className="pl-4 pr-4 py-3 text-right">
                                                ACTION
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.map((childData) => (
                                            <tr key={childData.id}>
                                                <th scope="row" className="pl-4 pr-1 py-4 font-semibold whitespace-nowrap flex justify-start items-center gap-3">
                                                    #{childData.invoiceNo}
                                                    {[
                                                        { label: childData.status, color: childData.status == 'Draft' ? '#F59E0B' : childData.status == 'Sent' ? '#3B82F6' : childData.status == 'Viewed' ? '#8B5CF6' : childData.status == 'Payment Due' ? '#EF4444' : childData.status == 'Paid' ? '#10B981' : '#10B981', tooltip: childData.status == 'Draft' ? 'Invoice is saved as a draft. Not yet sent to the client.' : childData.status == 'Sent' ? 'Invoice has been sent to the client but not yet viewed.' : childData.status == 'Viewed' ? 'Client has viewed the invoice. Awaiting payment.' : childData.status == 'Payment Due' ? 'Invoice is unpaid and past its due date. Payment reminder may be needed' : childData.status == 'Paid' ? 'Invoice is fully paid. No further action needed.' : 'Invoice is fully paid. No further action needed.' },
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
                                                    {/* {childData.status == 'Draft' && (
                                                        <div className='inline-block px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is saved as a draft. Not yet sent to the client." data-tooltip-place="top">
                                                            DRAFT
                                                        </div>
                                                    )}
                                                    {childData.status == 'Sent' && (
                                                        <div className='inline-block px-3 py-1 rounded-sm bg-blue-100 hover:bg-blue-200 border border-blue-200 cursor-pointer text-blue-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice has been sent to the client but not yet viewed." data-tooltip-place="top">
                                                            SENT
                                                        </div>
                                                    )}
                                                    {childData.status == 'Viewed' && (
                                                        <div className='inline-block px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 border border-purple-200 cursor-pointer text-purple-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Client has viewed the invoice. Awaiting payment." data-tooltip-place="top">
                                                            VIEWED
                                                        </div>
                                                    )}
                                                    {childData.status == 'Payment Due' && (
                                                        <div className='inline-block px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is unpaid and past its due date. Payment reminder may be needed" data-tooltip-place="top">
                                                            PAYMENT DUE
                                                        </div>
                                                    )}
                                                    {childData.status == 'Paid' && (
                                                        <div className='inline-block px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 border border-green-200 cursor-pointer text-green-900 text-xs font-medium' data-tooltip-id="my-tooltip" data-tooltip-content="Invoice is fully paid. No further action needed." data-tooltip-place="top">
                                                            PAID
                                                        </div>
                                                    )} */}
                                                </th>
                                                <td className="pl-4 pr-1 py-4 font-semibold">
                                                    {childData.client ? childData.client.name : '-'}
                                                </td>
                                                <td className="pl-4 pr-1 py-4">
                                                    {childData.invoiceDate}
                                                </td>
                                                <td className="pl-4 pr-1 py-4 text-black font-semibold text-right whitespace-nowrap">
                                                    {childData.product && currencyShow[childData.product[0].currency]} {childData.summary ? childData.summary.balance : '-'}
                                                </td>
                                                <td className="pl-4 pr-4 py-4 text-[var(--yellow)] font-semibold text-right">
                                                    <div className='flex gap-2 justify-end'>
                                                        <Link href={'/portal/invoice/' + childData.invoiceID}>
                                                            <div
                                                                className="filter-tab"
                                                                style={{
                                                                    '--tab-color': '#ad6e00',
                                                                }}
                                                                data-tooltip-id="my-tooltip"
                                                                data-tooltip-content='view invoice'
                                                                data-tooltip-place="top"
                                                            >
                                                                VIEW
                                                            </div>
                                                            {/* <div onClick={() => { setLoading(true) }} data-tooltip-id="my-tooltip" data-tooltip-content="view invoice" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                                                                VIEW
                                                            </div> */}
                                                        </Link>
                                                        <div
                                                            className="filter-tab"
                                                            style={{
                                                                '--tab-color': '#EF4444',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='click to remove the invoice!'
                                                            data-tooltip-place="top"
                                                        >
                                                            DELETE
                                                        </div>
                                                        {/* <div data-tooltip-id="my-tooltip" data-tooltip-content="click to remove the invoice!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                                                            DELETE
                                                        </div> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='flex justify-end my-4'>
                                <button onClick={() => { loadMore(filterStatus) }} disabled={!lastVisible} className='py-2 px-4 text-[#11141d] font-semibold hover:opacity-80 rounded-md text-xs cursor-pointer' style={{ background: 'color-mix(in srgb, #999999 30%, transparent)' }}>Load More</button>
                            </div>
                        </>
                    ) : (
                        <div className='w-full py-12 md:py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                            <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--primaryPanel)]'></i>
                            <h2 className='text-lg text-center mt-5 text-[var(--textPrimary)]'>No Invoice Found!</h2>
                            <p className=' text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any invoices yet. Click the button above to create your first invoice.</p>
                            {/* <button className='btnGreenLightest mt-4' onClick={() => { generate }}>Add your First Invoice <i className='fa-solid fa-angle-right ml-2'></i></button> */}
                        </div>
                    )}
                </>
            ) : (
                <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                    <i className='fa-solid fa-magnifying-glass text-6xl text-[var(--primaryPanel)]'></i>
                    <h2 className='mt-5 text-lg text-center text-[var(--textPrimary)]'>Searching invoices!</h2>
                    <p className='text-[var(--textSecondary)] text-xs text-center'>searching invoices, please wait.</p>
                </div>
            )}
        </>
    )
}

export default InvoiceList