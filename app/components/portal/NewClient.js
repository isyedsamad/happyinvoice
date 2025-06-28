'use client'
import React, { useContext, useState } from 'react'
import Loading from '../other/Loading';
import { FnContext } from '@/context/FunctionContext';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import FailedMsg from '../other/FailedMsg';

const NewClient = () => {
    const { setIsNewClient, isFailedMsg, setIsFailedMsg, setIsUpdateClient, setClientDataReady, clientData, setClientData } = useContext(FnContext);
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
        if (userData.plan == "Free" && userData.clientleft > 0) {
            setLoading(true);
            // firebasefn
            const savingValue = {
                name: name,
                mail: mail,
                phone: phone,
                address: address,
                invoice: 0,
                tags: [],
                createdAt: serverTimestamp()
            }
            const docCollection = collection(db, 'happyuser', currentUser.uid, 'happyclient');
            const snap = await addDoc(docCollection, savingValue);
            const docClient = doc(db, 'happyuser', currentUser.uid);
            await updateDoc(docClient, { clientleft: userData.clientleft - 1 })
            const updatedUserData = {
                ...userData,
                clientleft: userData.clientleft - 1
            };
            setUserData(updatedUserData);
            // setIsUpdateClient(true);
            const newArray = clientData ? clientData : [];
            newArray.unshift({ id: snap.id, ...savingValue });
            setClientData(newArray);
            setClientDataReady(true);
            setName("");
            setMail("");
            setPhone("");
            setAddress("");
            setIsNewClient(false);
            setLoading(false);
        } else {
            setErrorHeading("User Limit Exeeded");
            setErrorMsg("your user limit exceeded, upgrade to our plus plan to add unlimited clients.");
            setIsFailedMsg(true);
        }
    }
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[var(--themeBlackTrans)] fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--themeWhite)] w-full max-w-[400px]">
                    <div className='flex justify-center items-center rounded-tl-lg rounded-tr-lg bg-[var(--greenLightestPanel)] py-3 px-6'>
                        <h3 className='font-semibold text-black flex-1'>Add New Client</h3>
                        <i className='fa-solid fa-close text-xl cursor-pointer px-2 py-1' onClick={() => { setIsNewClient(false) }}></i>
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
                            <button className='btnGreen mt-5 w-full'>Save Client <i className='fa-solid fa-angle-right ml-2'></i></button>
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

export default NewClient