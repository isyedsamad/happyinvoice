'use client'
import React, { useContext, useEffect, useState } from 'react'
import Loading from '../../other/Loading';
import { FnContext } from '@/context/FunctionContext';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, doc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import FailedMsg from '../../other/FailedMsg';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ToastContainer, toast } from 'react-toastify';

const ClientEdit = (props) => {
    const { setIsClientEdit, isFailedMsg, setIsFailedMsg, setIsUpdateClient, setClientDataReady, clientData, setClientData } = useContext(FnContext);
    const { userData, setUserData, currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorHeading, setErrorHeading] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // firebasefn
        if (props.name == name && props.mail == mail && props.phone == phone && props.address == address) {
            setName("");
            setMail("");
            setPhone("");
            setAddress("");
            setIsClientEdit(false);
            setLoading(false);
        } else {
            try {
                const dataFn = {
                    id: props.uid,
                    name: name,
                    mail: mail,
                    phone: phone,
                    address: address,
                }
                const functions = getFunctions();
                const callClientUpdate = httpsCallable(functions, 'clientUpdate');
                const response = await callClientUpdate(dataFn);
                if (response.data.success) {
                    const docRef = doc(db, 'happyuser', currentUser.uid);
                    const snap = await getDoc(docRef);
                    setUserData(snap.data());
                    clientData.forEach(child => {
                        if (child.id == props.uid) {
                            child.name = name;
                            child.mail = mail;
                            child.phone = phone;
                            child.address = address;
                        }
                    })
                    setClientData(clientData);
                    setClientDataReady(true);
                    setName("");
                    setMail("");
                    setPhone("");
                    setAddress("");
                    setIsClientEdit(false);
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
    useEffect(() => {
        setName(props.name);
        setMail(props.mail);
        setPhone(props.phone);
        setAddress(props.address);
    }, [props.name, props.mail, props.phone, props.address]);
    return (
        <>
            <ToastContainer />
            <div className="w-[100vw] h-[100vh] z-40 bg-black/50 backdrop-blur-sm fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--bgPanel)] w-full max-w-[400px]">
                    <div className='flex justify-between items-center rounded-tl-lg rounded-tr-lg pt-4 pb-3.5 px-8' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                            <i className="fa-solid fa-user text-[var(--primaryPanel)] text-sm"></i>
                            <span>Edit Client</span>
                        </h3>
                        <i className='fa-solid fa-close text-[var(--textPrimary)] text-lg cursor-pointer px-2 py-1' onClick={() => { setIsClientEdit(false) }}></i>
                    </div>
                    <div className='px-6 md:px-8 py-6'>
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
                            <button className='btnGreen mt-4 w-full'>Update Client <i className='fa-solid fa-angle-right ml-2'></i></button>
                        </form>
                    </div>
                </div>
            </div>
            {isFailedMsg && (
                <FailedMsg heading={errorHeading} message={errorMsg} />
            )}
            {loading && (
                <Loading />
            )}
        </>
    )
}

export default ClientEdit