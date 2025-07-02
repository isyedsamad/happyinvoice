'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db } from '@/fauth/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientEdit from './ClientEdit';

const ClientList = ({ data }) => {
    const { isReady, currentUser, userData, setUserData, setLoading } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [table, setTable] = useState(data);
    const [mainTable, setMainTable] = useState(data);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const { clientData, setClientData, isClientEdit, setIsClientEdit, userEditArray, setUserEditArray, isNewClientTag, setIsNewClientTag, newClientTagID, setNewClientTagID, newClientTags, setNewClientTags } = useContext(FnContext);
    const searchFn = (e) => {
        setSearch(e.target.value)
        if (e.target.value != "") {
            const newTable = mainTable.filter(value => {
                if (value.name.toLowerCase().includes(e.target.value.toLowerCase()) || value.mail.toLowerCase().includes(e.target.value.toLowerCase())) return true
                const index = value.tags.indexOf(e.target.value.toUpperCase())
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
                const index = value.tags.indexOf(tag.toUpperCase())
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
    const deleteHandler = async (userDelete, userID) => {
        setLoading(true);
        const index = clientData.indexOf(userDelete);
        if (index != -1) {
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', userID);
            await deleteDoc(docRef);
            const docRefUpdate = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docRefUpdate, { clientleft: userData.clientleft + 1 })
            const updatedUserData = {
                ...userData,
                clientleft: userData.clientleft + 1
            };
            setUserData(updatedUserData);
            clientData.splice(index, 1);
            setClientData(clientData);
            setLoading(false);
        }
    }
    const editHandler = (userEdit, userID) => {
        setUserEditArray(userEdit);
        setIsClientEdit(true);
    }
    return (
        <>
            <Tooltip id="my-tooltip" />
            <div>
                {/* <p className='text-md font-medium text-[var(--themeBlack)]'>Search</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { searchFn(e) }} className='happyinput max-w-[300px]' placeholder='search by name, email here...' />
            </div>
            <div className='mt-3 mb-5 overflow-x-auto flex justify-start items-center gap-2'>
                <div onClick={() => { searchTags("") }} className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    ALL
                </div>
                <div onClick={() => { searchTags("Premium") }} data-tooltip-id="my-tooltip" data-tooltip-content="show only premium clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                    PREMIUM
                </div>
                <div onClick={() => { searchTags("Frequent") }} data-tooltip-id="my-tooltip" data-tooltip-content="show clients with frequent activity" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                    FREQUENT
                </div>
                <div onClick={() => { searchTags("Inactive") }} data-tooltip-id="my-tooltip" data-tooltip-content="show inactive clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    INACTIVE
                </div>
                <div onClick={() => { searchTags("Flagged") }} data-tooltip-id="my-tooltip" data-tooltip-content="show flagged clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                    FLAGGED
                </div>
                <div onClick={() => { searchTags("Due Payment") }} data-tooltip-id="my-tooltip" data-tooltip-content="show clients with due invoices" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-amber-100 hover:bg-amber-200 cursor-pointer text-amber-900 text-xs font-medium'>
                    DUE PAYMENT
                </div>
                <div onClick={() => { searchTags("International") }} data-tooltip-id="my-tooltip" data-tooltip-content="show international clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-cyan-100 hover:bg-cyan-200 cursor-pointer text-cyan-900 text-xs font-medium'>
                    INTERNATIONAL
                </div>
            </div>
            <div className='max-w-full overflow-x-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 rounded-md uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="pl-4 pr-1 py-3">
                                CLIENT NAME
                            </th>
                            <th scope="col" className="pl-4 pr-1 py-3">
                                MAIL
                            </th>
                            <th scope="col" className="pl-4 pr-1 py-3">
                                PHONE
                            </th>
                            <th scope="col" className="pl-4 pr-1 py-3 text-right">
                                Total Billed
                            </th>
                            <th scope="col" className="pl-4 pr-1 py-3">
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
                                        {childData.tags.includes("PREMIUM") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "PREMIUM") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client is marked as a premium (high-value) customer. click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                                                PREMIUM
                                            </div>
                                        )}
                                        {childData.tags.includes("FREQUENT") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "FREQUENT") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client interacts or purchases frequently. click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                                                FREQUENT
                                            </div>
                                        )}
                                        {childData.tags.includes("INACTIVE") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "INACTIVE") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client hasn’t interacted in a while. click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                                                INACTIVE
                                            </div>
                                        )}
                                        {childData.tags.includes("FLAGGED") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "FLAGGED") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client has an issue or needs attention. click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                                                FLAGGED
                                            </div>
                                        )}
                                        {childData.tags.includes("DUE PAYMENT") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "DUE PAYMENT") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client has pending payment or overdue invoice(s). click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-amber-100 hover:bg-amber-200 cursor-pointer text-amber-900 text-xs font-medium'>
                                                DUE PAYMENT
                                            </div>
                                        )}
                                        {childData.tags.includes("INTERNATIONAL") && (
                                            <div onClick={() => { removeTagUser(childData.id, childData.tags, "INTERNATIONAL") }} data-tooltip-id="my-tooltip" data-tooltip-content="this client is based outside your local region/country. click to remove!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-cyan-100 hover:bg-cyan-200 cursor-pointer text-cyan-900 text-xs font-medium'>
                                                INTERNATIONAL
                                            </div>
                                        )}
                                    </div>
                                    <div onClick={() => { addTagToUser(childData.id, childData.tags) }} data-tooltip-id="my-tooltip" data-tooltip-content="add tags for this client." data-tooltip-place="top" className='w-[20px] h-[20px] bg-gray-200 hover:bg-gray-300 text-[11px] text-gray-500 font-bold rounded-full flex justify-center items-center'><i className='fa-solid fa-plus'></i></div>
                                </th>
                                <td className="pl-4 pr-1 py-4"><i className='fa-solid fa-envelope mr-2'></i>
                                    {childData.mail != "" ? childData.mail : "-"}
                                </td>
                                <td className="pl-4 pr-1 py-4"><i className='fa-solid fa-phone mr-2'></i>
                                    {childData.phone != "" ? childData.phone : "-"}
                                </td>
                                <td className="pl-4 pr-1 py-4 text-[var(--greenPanel)] font-semibold text-right">
                                    {childData.billed > 0 ? (
                                        <span>₹ {childData.billed}</span>
                                    ) : (
                                        <span className='text-gray-500'>₹ {childData.billed}</span>
                                    )}
                                </td>
                                <td className="pl-4 pr-1 py-4 text-[var(--yellow)] font-semibold">
                                    <div className='flex gap-2'>
                                        <div data-tooltip-id="my-tooltip" data-tooltip-content="view all the invoices!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-blue-100 hover:bg-blue-200 cursor-pointer text-blue-900 text-xs font-medium'>
                                            INVOICE
                                        </div>
                                        <div onClick={() => { editHandler(childData, childData.id) }} data-tooltip-id="my-tooltip" data-tooltip-content="edit details of client!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                                            EDIT
                                        </div>
                                        <div onClick={() => { deleteHandler(childData, childData.id) }} data-tooltip-id="my-tooltip" data-tooltip-content="click to remove the client!" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
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

export default ClientList