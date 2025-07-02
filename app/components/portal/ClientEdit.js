'use client'
import React, { useContext, useEffect, useState } from 'react'
import Loading from '../other/Loading';
import { FnContext } from '@/context/FunctionContext';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import FailedMsg from '../other/FailedMsg';

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
            const updatingValue = {
                name: name,
                mail: mail,
                phone: phone,
                address: address,
            }
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyclient', props.uid);
            await updateDoc(docRef, updatingValue);
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
            <div className="w-[100vw] h-[100vh] bg-[var(--themeBlackTrans)] fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--themeWhite)] w-full max-w-[400px]">
                    <div className='flex justify-center items-center rounded-tl-lg rounded-tr-lg bg-[var(--greenLightestPanel)] py-3 px-6'>
                        <h3 className='font-semibold text-black flex-1'>Update Client</h3>
                        <i className='fa-solid fa-close text-xl cursor-pointer px-2 py-1' onClick={() => { setIsClientEdit(false) }}></i>
                    </div>
                    <div className='px-6 md:px-8 py-6'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <p className='text-md font-medium text-[var(--themeBlack)]'>Client Name <span className='text-red-500'>*</span></p>
                            <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. John' />
                            <p className='text-md font-medium mt-4 text-[var(--themeBlack)]'>Email <span className='text-sm text-gray-500'>(optional)</span></p>
                            <input type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. john@gmail.com' />
                            <p className='text-md font-medium mt-4 text-[var(--themeBlack)]'>Phone <span className='text-sm text-gray-500'>(optional)</span></p>
                            <input type='text' name='phone' value={phone} onChange={(e) => { setPhone(e.target.value) }} className='happyinput' placeholder='i.e. 9900990099' />
                            <p className='text-md font-medium mt-4 text-[var(--themeBlack)]'>Address <span className='text-sm text-gray-500'>(optional)</span></p>
                            {/* <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Address' /> */}
                            <textarea name='address' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='i.e. JR Street'></textarea>
                            {/* <div className='flex gap-2 mt-2'>
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='City' />
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Pincode' />
                            </div> */}
                            <button className='btnGreen mt-5 w-full'>Update Client <i className='fa-solid fa-angle-right ml-2'></i></button>
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