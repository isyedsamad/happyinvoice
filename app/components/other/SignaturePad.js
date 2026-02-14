'use client'
import { AuthContext } from '@/context/AuthContext';
import { FnContext } from '@/context/FunctionContext';
import { db, storage } from '@/fauth/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useContext, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'react-toastify';

const SignaturePad = (props) => {
    const { setLoading, currentUser } = useContext(AuthContext);
    const { setIsSignature, isSignatureLink, setIsSignatureLink } = useContext(FnContext);
    const signCanvas = useRef();
    const clear = async () => {
        signCanvas.current.clear();
        // if (isSignatureLink) {
        //     try {
        //         setLoading(true);
        //         const dbInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.id);
        //         await updateDoc(dbInvoice, { signature: '' });
        //         setIsSignatureLink(null);
        //         setIsSignature(false);
        //         setLoading(false);
        //     } catch (error) {
        //         setLoading(false);
        //         toast.error('Server Error! Please try again');
        //     }
        // }
    }
    const saveToFirebase = async () => {
        const dataUrl = signCanvas.current.toDataURL('image/png');
        if (signCanvas.current.isEmpty()) {
            toast.error('Please draw a signature!');
            return;
        }
        try {
            setLoading(true);
            const fileRef = ref(storage, `happysign/signature_${Date.now()}.png`);
            await uploadString(fileRef, dataUrl, 'data_url');
            const downloadUrl = await getDownloadURL(fileRef);
            // const dbRef = doc(db, 'happyuser', currentUser.uid);
            // await updateDoc(dbRef, { signature: downloadUrl });
            if (props.id != 'account') {
                const dbInvoice = doc(db, 'happyuser', currentUser.uid, 'happyinvoice', props.id);
                await updateDoc(dbInvoice, { signature: downloadUrl });
            } else {
                const dbInvoice = doc(db, 'happyuser', currentUser.uid);
                await updateDoc(dbInvoice, { 'business.signature': downloadUrl });
            }
            setIsSignatureLink(downloadUrl);
            setIsSignature(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error('Server Error! Please try again');
        }
    }
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[var(--blackTrans)] fixed flex justify-center items-center z-40">
                <div className='p-4 bg-white border rounded-lg shadow-md max-w-md mx-auto'>
                    <SignatureCanvas ref={signCanvas}
                        penColor='black'
                        canvasProps={{
                            className: 'bg-white border border-gray-300 rounded-md w-full h-48',
                        }} />
                    <div className='mt-3 flex justify-between'>
                        <div className='flex gap-2'>
                            <button onClick={() => { setIsSignature(false) }} className='bg-red-800 cursor-pointer text-white px-4 py-1 rounded hover:bg-red-900'>Close</button>
                            <button onClick={() => { clear() }} className='bg-red-200 cursor-pointer text-black px-4 py-1 rounded hover:bg-red-300'>Clear</button>
                        </div>
                        <button onClick={() => { saveToFirebase() }} className='bg-gray-600 cursor-pointer text-white px-4 py-1 rounded hover:bg-gray-700'>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignaturePad