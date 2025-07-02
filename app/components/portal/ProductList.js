'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db } from '@/fauth/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientEdit from './ClientEdit';

const ProductList = ({ data }) => {
    const { isReady, currentUser, userData, setUserData, setLoading } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [table, setTable] = useState(data);
    const [mainTable, setMainTable] = useState(data);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const { productData, setProductData, isProductEdit, setIsProductEdit, productEditArray, setProductEditArray } = useContext(FnContext);
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
        setLoading(true);
        const index = productData.indexOf(productDelete);
        if (index != -1) {
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyproduct', productID);
            await deleteDoc(docRef);
            const docRefUpdate = doc(db, 'happyuser', currentUser.uid);
            const indexProduct = userData.products.indexOf(productDelete.name);
            const newProductArray = userData.products;
            const newProductPriceArray = userData.productprice;
            newProductArray.splice(indexProduct, 1);
            newProductPriceArray.splice(indexProduct, 1);
            const recentActivity = userData.activity;
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift("Product " + productDelete.name + " deleted.")
            await updateDoc(docRefUpdate, { totalproduct: userData.totalproduct - 1, activity: recentActivity, products: newProductArray, productprice: newProductPriceArray })
            const updatedUserData = {
                ...userData,
                totalproduct: userData.totalproduct - 1,
                activity: recentActivity,
                products: newProductArray, productprice: newProductPriceArray
            };
            setUserData(updatedUserData);
            productData.splice(index, 1);
            setProductData(productData);
            setLoading(false);
        }
    }
    const editHandler = (productEdit, productID) => {
        setProductEditArray(productEdit);
        setIsProductEdit(true);
    }
    return (
        <>
            <Tooltip id="my-tooltip" />
            <div>
                {/* <p className='text-md font-medium text-[var(--themeBlack)]'>Search</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { searchFn(e) }} className='happyinput max-w-[270px]' placeholder='search product here...' />
            </div>
            <div className='mt-3 mb-5 overflow-x-auto flex justify-start items-center gap-2'>
                <div onClick={() => { searchTags("") }} className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    ALL
                </div>
                <div onClick={() => { searchTags("Product") }} className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                    PRODUCT
                </div>
                <div onClick={() => { searchTags("Service") }} className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                    SERVICE
                </div>
                <div onClick={() => { searchTags("Digital") }} className='px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 cursor-pointer text-purple-900 text-xs font-medium'>
                    DIGITAL
                </div>
            </div>
            <div className='max-w-full overflow-x-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 rounded-md uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
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
                                USED / UNIT
                            </th>
                            <th scope="col" className="pl-4 pr-4 py-3 text-right">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((childData) => (
                            <tr key={childData.id} className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                <th scope="row" className="pl-4 pr-1 py-4 font-medium text-gray-700 whitespace-nowrap flex justify-start items-center gap-2">
                                    {childData.name}
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {childData.type.includes("PRODUCT") && (
                                            <div className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                                                PRODUCT
                                            </div>
                                        )}
                                        {childData.type.includes("SERVICE") && (
                                            <div className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                                                SERVICE
                                            </div>
                                        )}
                                        {childData.type.includes("DIGITAL") && (
                                            <div className='px-3 py-1 rounded-sm bg-purple-100 hover:bg-purple-200 cursor-pointer text-purple-900 text-xs font-medium'>
                                                DIGITAL
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <td className="pl-4 pr-1 py-4 max-w-[300px]">
                                    {childData.description != "" ? childData.description : "-"}
                                </td>
                                <td className="pl-4 pr-1 py-4 text-right font-semibold text-gray-900">
                                    {currencyShow[childData.currency]} {childData.price != "" ? childData.price : "-"} <span className="text-gray-500">{childData.tax != '' && '+ ' + childData.tax + ' %'}</span>
                                </td>
                                <td className="pl-4 pr-1 py-4 text-[var(--greenPanel)] font-semibold text-right">
                                    {childData.used > 0 ? (
                                        <span>{childData.used} / {childData.unit == '' ? '0' : childData.unit}</span>
                                    ) : (
                                        <span className='text-gray-500'>{childData.used} / {childData.unit == '' ? '0' : childData.unit}</span>
                                    )}
                                </td>
                                <td className="pl-4 pr-4 py-4 text-[var(--yellow)] font-semibold text-right">
                                    <div className='flex gap-2 justify-end'>
                                        <div onClick={() => { editHandler(childData, childData.id) }} data-tooltip-id="my-tooltip" data-tooltip-content="edit details of product!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                                            EDIT
                                        </div>
                                        <div onClick={() => { deleteHandler(childData, childData.id) }} data-tooltip-id="my-tooltip" data-tooltip-content="click to remove the product!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                                            DELETE
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ProductList