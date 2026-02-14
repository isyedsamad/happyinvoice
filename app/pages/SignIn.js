"use client"
import Loading from '@/app/components/other/Loading'
import { auth } from '@/fauth/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

const SignIn = () => {
    const router = useRouter();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");
    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        signInWithEmailAndPassword(auth, mail, password)
            .then((snap) => {
                router.push('/portal');
            }).catch((e) => {
                setMsg(e.message);
                setError(true);
                setLoading(false);
            })
    }
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace('/portal')
            }
            return unsub
        })
    }, [])

    return (
        <>
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
            <div className='w-[100vw] min-h-screen flex overflow-x-auto overflow-y-hidden'>
                <div className='flex flex-1 justify-center items-start py-6 bg-[var(--greenLightPanel)]'>
                    <div className='bg-white py-6 px-6 rounded-lg shadow w-[90%] max-w-[400px]'>
                        <div>
                            <Link href='/'><h1 className='text-xl font-bold text-black'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1></Link>
                            <h3 className='text-sm font-medium text-[var(--grey66)] mt-1'>Welcome back! Continue your billing journey.</h3>
                        </div>
                        <div className='mt-5 w-full'>
                            <form onSubmit={(e) => { submitHandler(e) }}>
                                <p className='text-md font-medium'>Email</p>
                                <input required type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='w-full py-3 px-5 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]' placeholder='enter your email' />
                                <p className='text-md font-medium mt-4'>Password</p>
                                <input required type='password' name='password' value={password} onChange={(e) => { setPassword(e.target.value) }} className='w-full py-3 px-5 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] rounded-md focus:border-[var(--primaryPanel)]' placeholder='enter your password' />
                                <p className='text-[12px] text-gray-600 italic font-semibold mt-1'>🔒 Your data is encrypted and never shared.</p>
                                <button className='btnGreen mt-4'>Login <i className='fa-solid fa-angle-right ml-2'></i></button>
                            </form>
                            <p className='font-semibold text-sm mt-3 text-[var(--grey66)]'>Forget Password?</p>
                            <Link href='signup/'>
                                <p className='font-semibold text-sm mt-1 text-[var(--grey66)]'>New User? <span className='text-[var(--primaryPanel)] font-semibold'>SignUp Now</span></p>
                            </Link>
                            <div className='mt-6 py-4 flex justify-center items-center cursor-pointer rounded-lg bg-black text-white hover:bg-gray-800'>
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

export default SignIn