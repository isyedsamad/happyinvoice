'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db } from '@/fauth/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientEdit from '../client/ClientEdit';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ToastContainer, toast } from 'react-toastify';

const ProductList = () => {
    const { isReady, currentUser, userData, setUserData, setLoading } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [table, setTable] = useState(null);
    const [mainTable, setMainTable] = useState(null);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const { productData, setProductData, productDataReady, isProductEdit, setIsNewProduct, setIsProductEdit, productEditArray, setProductEditArray } = useContext(FnContext);
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const searchFn = (e) => {
        setSearch(e.target.value)
        if (e.target.value != "") {
            const newTable = mainTable.filter(value => {
                if (value.name.toLowerCase().includes(e.target.value.toLowerCase()) || value.description.toLowerCase().includes(e.target.value.toLowerCase())) return true
                const index = value.type.indexOf(e.target.value.toUpperCase())
                if (index != -1) return true;
            })
            setTable(newTable);
        } else {
            setTable(mainTable);
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
    const addTagToUser = (userID, userTags) => {
        setNewClientTags(userTags);
        setNewClientTagID(userID);
        setIsNewClientTag(true);
    }
    const removeTagUser = async (userID, userTags, removingTag) => {
        setLoading(true);
        const index = userTags.indexOf(removingTag);
        if (index != -1) {
            userTags.splice(index, 1);
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', userID);
            await updateDoc(docRef, { tags: userTags });
            clientData.forEach(child => {
                if (child.id == userID) {
                    child.tags = userTags;
                }
            })
            setClientData(clientData);
            setLoading(false);
        }
    }
    const deleteHandler = async (productDelete, productID) => {
        const confirmDel = confirm("Do you really want to delete this product!");
        if (confirmDel) {
            setLoading(true);
            const index = productData.indexOf(productDelete);
            if (index != -1) {
                try {
                    const functions = getFunctions();
                    const callProductDelete = httpsCallable(functions, 'productDelete');
                    const response = await callProductDelete(productDelete);
                    if (response.data.success) {
                        const docRef = doc(db, 'happyuser', currentUser.uid);
                        const snap = await getDoc(docRef);
                        setUserData(snap.data());
                        productData.splice(index, 1);
                        setProductData(productData);
                        setLoading(false);
                    } else {
                        toast.error('Error: ' + response.data.message);
                        setLoading(false);
                    }
                } catch (error) {
                    toast.error('Error: ' + error.message);
                    setLoading(false);
                }
            }
        }
    }
    const editHandler = (productEdit, productID) => {
        setProductEditArray(productEdit);
        setIsProductEdit(true);
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (productData && productData != '') {
                setTable(productData);
                setMainTable(productData);
            } else {
                setProductData(null);
                setTable(null);
                setMainTable(null);
            }
        }
    }, [isReady, currentUser, userData, productData])
    return (
        <>
            <Tooltip id="my-tooltip" />
            <ToastContainer />
            <div>
                {/* <p className='text-md font-medium text-[var(--themeBlack)]'>Search</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { searchFn(e) }} className='happyinput max-w-[270px]' placeholder='search product here...' />
            </div>
            <div className='mt-3 mb-5 flex flex-wrap md:flex-nowrap justify-start items-center gap-2'>
                {/* <div onClick={() => { searchTags("") }} className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    ALL
                </div>
                <div onClick={() => { searchTags("Product") }} className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                    PRODUCT
                </div>
                <div onClick={() => { searchTags("Service") }} className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 border border-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                    SERVICE
                </div>
                <div onClick={() => { searchTags("Digital") }} className='px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 border border-purple-200 cursor-pointer text-purple-900 text-xs font-medium'>
                    DIGITAL
                </div> */}
                {[
                    { label: "All", color: "#9CA3AF", tooltip: "view all products." },
                    { label: "Product", color: "#EF4444", tooltip: "show only products." },
                    { label: "Service", color: "#10B981", tooltip: "show service products" },
                    { label: "Digital", color: "#3B82F6", tooltip: "show digital products" },
                ].map((item) => (
                    <div
                        key={item.label}
                        onClick={() => { item.label == 'All' ? searchTags('') : searchTags(item.label) }}
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
            {productDataReady ? (
                <>
                    {productData && table ? (
                        <div className='max-w-full overflow-x-auto'>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs rounded-md uppercase bg-gray-200 text-gray-400">
                                    <tr>
                                        <th scope="col" className="pl-4 pr-1 py-3">
                                            PRODUCT NAME
                                        </th>
                                        <th scope="col" className="pl-4 pr-1 py-3">
                                            DESCRIPTION
                                        </th>
                                        <th scope="col" className="pl-4 pr-1 py-3 text-right">
                                            PRICE AND TAX
                                        </th>
                                        <th scope="col" className="pl-4 pr-1 py-3 text-right">
                                            UNIT USED
                                        </th>
                                        <th scope="col" className="pl-4 pr-4 py-3 text-right">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.map((childData) => (
                                        <tr key={childData.id}>
                                            <td scope="row" className="font-medium flex justify-start items-center gap-2">
                                                {childData.name}
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {childData.type.includes("PRODUCT") && (
                                                        <div
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#EF4444',
                                                            }}
                                                        >
                                                            PRODUCT
                                                        </div>
                                                    )}
                                                    {childData.type.includes("SERVICE") && (
                                                        <div
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#10B981',
                                                            }}
                                                        >
                                                            SERVICE
                                                        </div>
                                                    )}
                                                    {childData.type.includes("DIGITAL") && (
                                                        <div
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#3B82F6',
                                                            }}
                                                        >
                                                            DIGITAL
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="max-w-[300px]">
                                                {childData.description != "" ? childData.description : "-"}
                                            </td>
                                            <td className="font-semibold text-right whitespace-nowrap">
                                                {currencyShow[childData.currency]} {childData.price != "" ? childData.price : "-"} <span className="text-gray-500">{childData.tax != '' && '+ ' + childData.tax + ' %'}</span>
                                            </td>
                                            <td className="text-right whitespace-nowrap">
                                                {childData.used > 0 ? (
                                                    <span>{childData.used}</span>
                                                ) : (
                                                    <span className='text-gray-500'>{childData.used}</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <div className='flex gap-2 justify-end'>
                                                    <div
                                                        onClick={() => { editHandler(childData, childData.id) }}
                                                        className="filter-tab-small"
                                                        style={{
                                                            '--tab-color': '#F59E0B',
                                                        }}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content='edit product details'
                                                        data-tooltip-place="top"
                                                    >
                                                        EDIT
                                                    </div>
                                                    <div
                                                        onClick={() => { deleteHandler(childData, childData.id) }}
                                                        className="filter-tab-small"
                                                        style={{
                                                            '--tab-color': '#EF4444',
                                                        }}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content='remove product!'
                                                        data-tooltip-place="top"
                                                    >
                                                        DELETE
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className='w-full py-12 md:py-14 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                            <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--primaryPanel)]'></i>
                            <h2 className='text-lg text-center mt-5 text-[var(--textPrimary)]'>No Product Found!</h2>
                            <p className='text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any products yet. Click the button below to add your first product.</p>
                            <button className='btnGreenLightest mt-4' onClick={() => { setIsNewProduct(true) }}>Add your First Product <i className='fa-solid fa-angle-right ml-2'></i></button>
                        </div>
                    )}
                </>
            ) : (
                <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                    <i className='fa-solid fa-magnifying-glass text-6xl text-[var(--primaryPanel)]'></i>
                    <h2 className='mt-5 text-lg text-center text-[var(--textPrimary)]'>Searching products!</h2>
                    <p className='text-[var(--textSecondary)] text-xs text-center'>searching products, please wait.</p>
                </div>
            )}
        </>
    )
}

export default ProductList