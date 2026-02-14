import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext'
import { db } from '@/fauth/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react'

const ClientTags = () => {
    const { isReady, currentUser, setLoading } = useContext(AuthContext);
    const { isNewClientTag, setIsNewClientTag, newClientTags, clientData, setClientData, setNewClientTags, newClientTagID, setNewClientTagID } = useContext(FnContext);
    const submitHandler = async (e) => {
        e.preventDefault();
        if (tagSelected.value != "Select a Tag") {
            setLoading(true);
            // firebasefn
            const newArray = newClientTags;
            const index = newArray.indexOf(tagSelected.value.toUpperCase());
            if (index == -1) {
                newArray.unshift(tagSelected.value.toUpperCase());
                const docRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', newClientTagID);
                const snap = await updateDoc(docRef, { tags: newArray });
                clientData.forEach(child => {
                    if (child.id == newClientTagID) {
                        child.tags = newArray;
                    }
                })
                setClientData(clientData);
                setIsNewClientTag(false);
                setLoading(false);
            } else {
                setIsNewClientTag(false);
                setLoading(false);
            }
        } else {
            setIsNewClientTag(false);
        }
    }
    return (
        <>
            <div className="w-[100vw] h-[100vh] z-40 bg-black/50 backdrop-blur-sm fixed flex justify-center items-center p-6">
                <div className="rounded-xl bg-[var(--bgPanel)] w-full max-w-[350px]">
                    <div className='flex justify-between items-center rounded-tl-lg rounded-tr-lg py-4 px-6' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                            <i className="fa-solid fa-tag text-[var(--primaryPanel)] text-sm"></i>
                            <span>Add Tag</span>
                        </h3>
                        <i className='fa-solid fa-close text-[var(--textPrimary)] text-xl cursor-pointer px-2 py-1' onClick={() => { setIsNewClientTag(false) }}></i>
                    </div>
                    <div className='px-6 md:px-8 py-6'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Tag List</p>
                            <select name='tagSelected' id='tagSelected' className='happyinput'>
                                <option>Select a Tag</option>
                                <option>Premium</option>
                                <option>Frequent</option>
                                <option>Inactive</option>
                                <option>Flagged</option>
                                <option>Due Payment</option>
                                <option>International</option>
                            </select>
                            <button className='btnGreen mt-5 w-full'>Add Tag to Client <i className='fa-solid fa-angle-right ml-2'></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientTags