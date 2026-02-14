'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db } from '@/fauth/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import ClientEdit from './ClientEdit';
import { ToastContainer, toast } from 'react-toastify';
import { getFunctions, httpsCallable } from 'firebase/functions';

const ClientList = () => {
    const { isReady, currentUser, userData, setUserData, setLoading } = useContext(AuthContext);
    const { clientData, setClientData, setIsNewClient, isClientEdit, clientDataReady, setIsClientEdit, userEditArray, setUserEditArray, isNewClientTag, setIsNewClientTag, newClientTagID, setNewClientTagID, newClientTags, setNewClientTags } = useContext(FnContext);
    const [search, setSearch] = useState("");
    const [table, setTable] = useState(null);
    const [mainTable, setMainTable] = useState(null);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const searchFn = (e) => {
        setSearch(e.target.value)
        if (e.target.value != "") {
            const newTable = mainTable?.filter(value => {
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
            const newTable = mainTable?.filter(value => {
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
        // firebasefn
        setLoading(true);
        const index = clientData.indexOf(userDelete);
        if (index != -1) {
            try {
                const functions = getFunctions();
                const callClientDelete = httpsCallable(functions, 'clientDelete');
                const response = await callClientDelete(userDelete);
                if (response.data.success) {
                    const docRef = doc(db, 'happyuser', currentUser.uid);
                    const snap = await getDoc(docRef);
                    setUserData(snap.data());
                    clientData.splice(index, 1);
                    setClientData(clientData);
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
    const editHandler = (userEdit, userID) => {
        setUserEditArray(userEdit);
        setIsClientEdit(true);
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            if (clientData && clientData != '') {
                setTable(clientData);
                setMainTable(clientData);
            } else {
                setClientData(null);
                setTable(null);
                setMainTable(null);
            }
        }
    }, [isReady, currentUser, userData, clientData])
    return (
        <>
            <Tooltip id="my-tooltip" />
            <ToastContainer />
            <div>
                {/* <p className='text-md font-medium text-[var(--themeBlack)]'>Search</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { searchFn(e) }} className='happyinput max-w-[300px]' placeholder='search by name, email here...' />
            </div>
            <div className='mt-3 mb-5 flex flex-wrap md:flex-nowrap justify-start items-center gap-2'>
                {/* <div onClick={() => { searchTags("") }} className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    ALL
                </div>
                <div onClick={() => { searchTags("Premium") }} data-tooltip-id="my-tooltip" data-tooltip-content="show only premium clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                    PREMIUM
                </div>
                <div onClick={() => { searchTags("Frequent") }} data-tooltip-id="my-tooltip" data-tooltip-content="show clients with frequent activity" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 border border-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                    FREQUENT
                </div>
                <div onClick={() => { searchTags("Inactive") }} data-tooltip-id="my-tooltip" data-tooltip-content="show inactive clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    INACTIVE
                </div>
                <div onClick={() => { searchTags("Flagged") }} data-tooltip-id="my-tooltip" data-tooltip-content="show flagged clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 border border-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                    FLAGGED
                </div>
                <div onClick={() => { searchTags("Due Payment") }} data-tooltip-id="my-tooltip" data-tooltip-content="show clients with due invoices" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-amber-100 hover:bg-amber-200 border border-amber-200 cursor-pointer text-amber-900 text-xs font-medium'>
                    DUE PAYMENT
                </div>
                <div onClick={() => { searchTags("International") }} data-tooltip-id="my-tooltip" data-tooltip-content="show international clients" data-tooltip-place="top" className='px-3 py-1 rounded-sm bg-cyan-100 hover:bg-cyan-200 border border-cyan-200 cursor-pointer text-cyan-900 text-xs font-medium'>
                    INTERNATIONAL
                </div> */}
                {[
                    { label: "All", color: "#9CA3AF", tooltip: "view all clients." },
                    { label: "Premium", color: "#F59E0B", tooltip: "show only premium clients" },
                    { label: "Frequent", color: "#10B981", tooltip: "show clients with frequent activity" },
                    { label: "Inactive", color: "#9CA3AF", tooltip: "show inactive clients" },
                    { label: "Flagged", color: "#EF4444", tooltip: "show flagged clients" },
                    { label: "Due Payment", color: "#ef9f44", tooltip: "show clients with due invoices" },
                    { label: "International", color: "#3B82F6", tooltip: "show international clients" },
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
            {clientDataReady ? (
                <>
                    {clientData && table ? (
                        <div className='max-w-full overflow-x-auto'>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs rounded-md uppercase bg-gray-200 text-gray-400">
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
                                        <th scope="col" className="pl-3 pr-4 py-3 text-right">
                                            ACTION
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.map((childData) => (
                                        <tr key={childData.id} className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                            <th scope="row" className="pl-4 pr-1 py-4 font-medium text-gray-700 flex justify-start items-center gap-2">
                                                {childData.name}
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {childData.tags.includes("PREMIUM") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "PREMIUM") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#F59E0B',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='client is marked as your premium customer. click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            PREMIUM
                                                        </div>
                                                    )}
                                                    {childData.tags.includes("FREQUENT") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "FREQUENT") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#10B981',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='this client interacts or purchases frequently. click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            FREQUENT
                                                        </div>
                                                    )}
                                                    {childData.tags.includes("INACTIVE") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "INACTIVE") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#9CA3AF',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='this client hasn’t interacted in a while. click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            INACTIVE
                                                        </div>
                                                    )}
                                                    {childData.tags.includes("FLAGGED") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "FLAGGED") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#EF4444',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='this client has an issue or needs attention. click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            FLAGGED
                                                        </div>
                                                    )}
                                                    {childData.tags.includes("DUE PAYMENT") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "DUE PAYMENT") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#ef9f44',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='this client has pending payment or overdue invoice(s). click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            DUE PAYMENT
                                                        </div>
                                                    )}
                                                    {childData.tags.includes("INTERNATIONAL") && (
                                                        <div
                                                            onClick={() => { removeTagUser(childData.id, childData.tags, "INTERNATIONAL") }}
                                                            className="filter-tab-small"
                                                            style={{
                                                                '--tab-color': '#3B82F6',
                                                            }}
                                                            data-tooltip-id="my-tooltip"
                                                            data-tooltip-content='this client is based outside your local region/country. click to remove!'
                                                            data-tooltip-place="top"
                                                        >
                                                            INTERNATIONAL
                                                        </div>
                                                    )}
                                                </div>
                                                <div onClick={() => { addTagToUser(childData.id, childData.tags) }} data-tooltip-id="my-tooltip" data-tooltip-content="add tags for this client." data-tooltip-place="top" className='w-[20px] h-[20px] min-w-[20px] hover:bg-opacity-80 text-[12px] text-[var(--bgPanel)] font-bold rounded-full flex justify-center items-center' style={{ background: 'color-mix(in srgb, var(--textPrimary) 20%, transparent)' }}><i className='fa-solid fa-plus'></i></div>
                                            </th>
                                            <td className="pl-4 pr-1 py-4 whitespace-nowrap"><i className='fa-solid text-[var(--textSecondary)] fa-envelope mr-2'></i>
                                                {childData.mail != "" ? childData.mail : "-"}
                                            </td>
                                            <td className="pl-4 pr-1 py-4 whitespace-nowrap"><i className='fa-solid text-[var(--textSecondary)] fa-phone mr-2'></i>
                                                {childData.phone != "" ? childData.phone : "-"}
                                            </td>
                                            <td className="pl-4 pr-1 py-4 text-[var(--primaryPanel)] font-semibold text-right whitespace-nowrap">
                                                {childData.billed > 0 ? (
                                                    <span>₹ {childData.billed}</span>
                                                ) : (
                                                    <span className='text-gray-500'>₹ {childData.billed}</span>
                                                )}
                                            </td>
                                            <td className="pl-3 pr-4 py-4 text-[var(--yellow)] font-semibold flex justify-end">
                                                <div className='flex gap-2'>
                                                    <div
                                                        className="filter-tab-small"
                                                        style={{
                                                            '--tab-color': '#3B82F6',
                                                        }}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content='view invoice'
                                                        data-tooltip-place="top"
                                                    >
                                                        INVOICE
                                                    </div>
                                                    <div
                                                        onClick={() => editHandler(childData, childData.id)}
                                                        className="filter-tab-small"
                                                        style={{
                                                            '--tab-color': '#F59E0B',
                                                        }}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content='edit client details'
                                                        data-tooltip-place="top"
                                                    >
                                                        EDIT
                                                    </div>
                                                    <div
                                                        onClick={() => deleteHandler(childData, childData.id)}
                                                        className="filter-tab-small"
                                                        style={{
                                                            '--tab-color': '#EF4444',
                                                        }}
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content='remove client'
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
                        <div className='w-full py-12 md:py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                            <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--primaryPanel)]'></i>
                            <h2 className='text-lg text-center mt-5 text-[var(--textPrimary)]'>No Client Found!</h2>
                            <p className='text-[var(--textSecondary)] text-xs text-center max-w-sm mt-1 font-medium'>You haven’t added any clients yet. Click the button below to add your first client.</p>
                            <button className='btnGreenLightest mt-4' onClick={() => { setIsNewClient(true) }}>Add your First Client <i className='fa-solid fa-angle-right ml-2'></i></button>
                        </div>
                    )}
                </>
            ) : (
                <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                    <i className='fa-solid fa-magnifying-glass text-6xl text-[var(--primaryPanel)]'></i>
                    <h2 className='mt-5 text-lg text-center text-[var(--textPrimary)]'>Searching clients!</h2>
                    <p className='text-[var(--textSecondary)] text-xs text-center'>searching clients, please wait.</p>
                </div>
            )}
        </>
    )
}

export default ClientList