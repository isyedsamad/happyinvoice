"use client"
import Loading from '@/app/components/other/Loading'
import { auth, db } from '@/fauth/firebase'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { ToastContainer, toast } from 'react-toastify'
import SignUpLoading from '../components/modal/SignUpLoading'

const SignUp = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSignup, setLoadingSignup] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");
    const signupUserFn = async () => {
        try {
            const functions = getFunctions();
            const callSignUpFn = httpsCallable(functions, 'signupAuth');
            const response = await callSignUpFn({
                name: name,
                email: mail,
                password: password
            });
            if (response.data.success) {
                return { success: true, uid: response.data.uid }
            } else {
                return { success: false, error: 'Unknown Error' }
            }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingSignup(true);
        const result = await signupUserFn();
        if (result.success) {
            try {
                await signInWithEmailAndPassword(auth, mail, password);
            } catch (error) {
                toast.error('Error: ' + result.error, {
                    position: 'top-center',
                    theme: 'colored'
                });
                setLoadingSignup(false);
            }
        } else {
            toast.error('Error: ' + result.error, {
                position: 'top-center',
                theme: 'colored'
            });
            setLoadingSignup(false);
        }
    }
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/portal/getting-started');
            }
        })
        return unsub
    }, [])
    return (
        <>
            {loadingSignup && (
                <SignUpLoading />
            )}
            {loading && (
                <Loading />
            )}
            {error && (
                <div>
                    <div className="w-[100vw] h-[100vh] bg-[var(--blackTrans)] fixed flex justify-center items-center">
                        <div className="p-6 rounded-md bg-[var(--white)] w-full max-w-[300px]">
                            <div className='flex flex-col justify-start items-start'>
                                <p className='text-lg font-semibold text-[var(--red)]'>Server Error</p>
                                <p className='text-md font-medium mt-2'>{msg}</p>
                                <button onClick={() => { setError(false) }} className='w-full py-2 cursor-pointer hover:bg-gray-900 bg-black text-white font-semibold mt-4 rounded-md'>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
            <div className='w-[100vw] min-h-screen flex'>
                <div className='flex flex-1 justify-center items-start py-6 bg-[var(--greenLightPanel)]'>
                    <div className='bg-white py-6 px-6 rounded-lg shadow w-[90%] max-w-[400px]'>
                        <div>
                            <Link href='/'><h1 className='text-xl font-bold text-black'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1></Link>
                            <h3 className='text-sm font-medium text-[var(--grey66)] mt-1'>Create your free HappyInvoice account — it only takes a minute.</h3>
                        </div>
                        <div className='mt-5 w-full'>
                            <form onSubmit={(e) => { submitHandler(e) }}>
                                <p className='text-md font-medium'>Full Name</p>
                                <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='w-full py-3 px-4 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]' placeholder='enter your full name' />
                                <p className='text-md font-medium mt-4'>Email</p>
                                <input required type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='w-full py-3 px-4 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]' placeholder='enter your email' />
                                <p className='text-md font-medium mt-4'>Password</p>
                                <input required minLength={6} type='password' name='password' value={password} onChange={(e) => { setPassword(e.target.value) }} className='w-full py-3 px-4 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]' placeholder='enter your password' />
                                <p className='text-[12px] text-gray-600 italic font-semibold mt-1'>🔒 Your data is encrypted and never shared.</p>
                                <button className='btnGreen mt-4'>Create Account <i className='fa-solid fa-angle-right ml-2'></i></button>
                            </form>
                            <Link href='signin/'>
                                <p className='font-semibold text-sm mt-3 text-[var(--grey66)]'>Already Registered? <span className='text-[var(--primaryPanel)] font-semibold'>Login Now</span></p>
                            </Link>
                            <div className='mt-6 py-4 flex justify-center items-center rounded-lg cursor-pointer bg-black text-white hover:bg-gray-800'>
                                <FcGoogle className='text-xl mr-3' />
                                <p className='text-sm font-medium'>Continue with Google</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp