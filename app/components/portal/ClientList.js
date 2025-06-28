'use client'
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/fauth/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'

const ClientList = ({ data }) => {
    const [search, setSearch] = useState("");
    const [table, setTable] = useState(data);
    const [mainTable, setMainTable] = useState(data);
    const [addTag, setAddTag] = useState(false);
    const [addTagID, setAddTagID] = useState("");
    const searchFn = (e) => {
        setSearch(e.target.value)
        if (e.target.value != "") {
            const newTable = mainTable.filter(value => {
                if (value.name.toLowerCase().includes(e.target.value.toLowerCase()) || value.mail.toLowerCase().includes(e.target.value.toLowerCase())) return true
            })
            setTable(newTable);
        } else {
            setTable(mainTable);
        }
    }
    const addTagToUser = (userID) => {
        console.log(userID);
    }
    return (
        <>
            <div>
                {/* <p className='text-md font-medium text-[var(--themeBlack)]'>Search</p> */}
                <input type='text' name='search' value={search} onChange={(e) => { searchFn(e) }} className='happyinput max-w-[300px]' placeholder='search by name, email' />
            </div>
            <div className='mt-3 mb-5 overflow-x-auto flex justify-start items-center gap-2'>
                <div className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                    PREMIUM
                </div>
                <div className='px-3 py-1 rounded-sm bg-green-100 hover:bg-green-200 cursor-pointer text-green-900 text-xs font-medium'>
                    FREQUENT
                </div>
                <div className='px-3 py-1 rounded-sm bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-900 text-xs font-medium'>
                    INACTIVE
                </div>
                <div className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
                    FLAGGED
                </div>
                <div className='px-3 py-1 rounded-sm bg-amber-100 hover:bg-amber-200 cursor-pointer text-amber-900 text-xs font-medium'>
                    DUE PAYMENT
                </div>
                <div className='px-3 py-1 rounded-sm bg-cyan-100 hover:bg-cyan-200 cursor-pointer text-cyan-900 text-xs font-medium'>
                    INTERNATIONAL
                </div>
            </div>
            <div className='max-w-full overflow-x-auto'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-800 rounded-md uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                CLIENT NAME
                            </th>
                            <th scope="col" className="px-6 py-3">
                                MAIL
                            </th>
                            <th scope="col" className="px-6 py-3">
                                PHONE
                            </th>
                            <th scope="col" className="px-6 py-3">
                                INVOICE CREATED
                            </th>
                            <th scope="col" className="px-6 py-3">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((childData) => (
                            <tr key={childData.id} className="odd:bg-[var(--themeWhite)] text-gray-600 even:bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap flex justify-start items-center">
                                    {childData.name}<div onClick={() => { addTagToUser(childData.id) }} className='w-[20px] h-[20px] bg-gray-200 hover:bg-gray-300 text-[11px] text-gray-500 font-bold rounded-full flex justify-center items-center ml-2'><i className='fa-solid fa-plus'></i></div>
                                </th>
                                <td className="px-6 py-4">
                                    {childData.mail != "" ? childData.mail : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    {childData.phone != "" ? childData.phone : "-"}
                                </td>
                                <td className="px-6 py-4 text-[var(--greenPanel)] font-semibold">
                                    {childData.invoice}
                                </td>
                                <td className="px-6 py-4 text-[var(--yellow)] font-semibold">
                                    <div className='flex gap-2'>
                                        <div className='px-3 py-1 rounded-sm bg-yellow-100 hover:bg-yellow-200 cursor-pointer text-yellow-900 text-xs font-medium'>
                                            EDIT
                                        </div>
                                        <div className='px-3 py-1 rounded-sm bg-red-100 hover:bg-red-200 cursor-pointer text-red-900 text-xs font-medium'>
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