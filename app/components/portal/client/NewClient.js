'use client'
import React, { useContext, useState } from 'react'
import Loading from '../../other/Loading';
import { FnContext } from '@/context/FunctionContext';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import FailedMsg from '../../other/FailedMsg';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ToastContainer, toast } from 'react-toastify';
import { CloudUpload } from 'lucide-react';

const NewClient = () => {
    const { setIsNewClient, isFailedMsg, setIsFailedMsg, setIsUpdateClient, setClientDataReady, clientData, setClientData } = useContext(FnContext);
    const { userData, setUserData, currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loadingSave, setLoadingSave] = useState(false);
    const [errorHeading, setErrorHeading] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingSave(true);
        // firebasefn
        try {
            const data = {
                name: name,
                mail: mail,
                phone: phone,
                address: address
            }
            const functions = getFunctions();
            const callClientFn = httpsCallable(functions, 'clientAdd');
            const response = await callClientFn(data);
            if (response.data.success) {
                const docRef = doc(db, 'happyuser', currentUser.uid);
                const snapUser = await getDoc(docRef);
                const clientRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', response.data.uid);
                const snapClient = await getDoc(clientRef);
                setUserData(snapUser.data());
                const newArray = clientData ? clientData : [];
                newArray.unshift({ id: snapClient.id, ...snapClient.data() });
                setClientData(newArray);
                console.log(newArray);
                setClientDataReady(true);
                setName("");
                setMail("");
                setPhone("");
                setAddress("");
                toast.success('Client saved successfully!', {
                    position: 'top-center',
                    theme: 'colored'
                })
                setIsNewClient(false);
                setLoadingSave(false);
            } else {
                toast.error('Error : ' + response.data.message);
                setLoadingSave(false);
            }
        } catch (error) {
            toast.error('Error : ' + error);
            setLoadingSave(false);
        }
    }
    return (
        <>
            <ToastContainer />
            <div className="w-[100vw] h-[100dvh] z-40 bg-black/50 backdrop-blur-sm fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--bgPanel)] w-full max-w-[400px]">
                    <div className='flex justify-between items-center rounded-tl-lg rounded-tr-lg pt-4 pb-3.5 px-8' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                            <i className="fa-solid fa-user text-[var(--primaryPanel)] text-sm"></i>
                            <span>Add Client</span>
                        </h3>
                        <i className='fa-solid fa-close text-[var(--textPrimary)] text-lg cursor-pointer px-2 py-1' onClick={() => { setIsNewClient(false) }}></i>
                    </div>
                    <div className='px-7 md:px-8 py-5'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Client Name <span className='text-red-500'>*</span></p>
                            <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. John' />
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Email <span className='text-xs text-gray-500'>(optional)</span></p>
                            <input type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. john@gmail.com' />
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Phone <span className='text-xs text-gray-500'>(optional)</span></p>
                            <input type='text' name='phone' value={phone} onChange={(e) => { setPhone(e.target.value) }} className='happyinput' placeholder='i.e. 9900990099' />
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Address <span className='text-xs text-gray-500'>(optional)</span></p>
                            {/* <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Address' /> */}
                            <textarea name='address' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='i.e. JR Street'></textarea>
                            {/* <div className='flex gap-2 mt-2'>
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='City' />
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Pincode' />
                            </div> */}
                            <button className='btnGreen mt-4 w-full'>Save Client <i className='fa-solid fa-angle-right ml-2'></i></button>
                        </form>
                    </div>
                </div>
            </div>
            {isFailedMsg && (
                <FailedMsg heading={errorHeading} message={errorMsg} />
            )}
            {loadingSave && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-[var(--bgPanel)] rounded-xl px-8 py-6 w-[90%] max-w-sm shadow-lg text-center">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="animate-bounce">
                                <CloudUpload className="w-10 h-10 mt-5 text-[var(--primaryPanel)]" />
                            </div>
                            <h2 className="text-lg font-semibold mt-2 text-[var(--textPrimary)]">
                                Saving Client...
                            </h2>
                            <p className="text-sm text-[var(--textSecondary)]">
                                We’re setting up your client profile, this will only take a moment.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewClient