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
import { CloudUpload } from 'lucide-react';

const ProductNew = (props) => {
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const { setIsNewProduct, isFailedMsg, setIsFailedMsg, setIsUpdateProduct, setProductDataReady, productData, setProductData } = useContext(FnContext);
    const { userData, setUserData, currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState('0.00');
    const [type, setType] = useState('Product');
    const [currency, setCurrency] = useState('INR');
    // const [unit, setUnit] = useState("")
    const [description, setDescription] = useState("");
    const [tax, setTax] = useState("")
    const [loadingSave, setLoadingSave] = useState(false);
    const [errorHeading, setErrorHeading] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoadingSave(true);
        // firebasefn
        try {
            const savingValue = {
                name: name,
                type: type.toUpperCase(),
                price: price,
                description: description,
                currency: currency ? currency : 'INR',
                tax: tax,
            }
            const functions = getFunctions();
            const callProductFn = httpsCallable(functions, 'productAdd');
            const response = await callProductFn(savingValue);
            if (response.data.success) {
                const docRef = doc(db, 'happyuser', currentUser.uid);
                const snapUser = await getDoc(docRef);
                const productRef = doc(db, 'happyuser', currentUser.uid, 'happyproduct', response.data.pid);
                const snapProduct = await getDoc(productRef);
                setUserData(snapUser.data());
                const newArray = productData ? productData : [];
                newArray.unshift({ id: snapProduct.id, ...snapProduct.data() });
                setProductData(newArray);
                setProductDataReady(true);
                setName('');
                setPrice('0.00');
                setType('Product');
                setCurrency('INR ₹');
                setTax('');
                setDescription('');
                toast.success('Product saved successfully!', {
                    position: 'top-center',
                    theme: 'colored',
                })
                setIsNewProduct(false);
                setLoadingSave(false);
            } else {
                toast.error('Error : ' + response.data.message, {
                    position: 'top-center',
                    theme: 'colored'
                });
                setLoadingSave(false);
            }
        } catch (error) {
            toast.error('Error : ' + error, {
                position: 'top-center',
                theme: 'colored'
            });
            setLoadingSave(false);
        }
    }
    useEffect(() => {
        setCurrency(props.currency);
    }, [])
    return (
        <>
            <ToastContainer />
            <div className="w-[100vw] h-[100dvh] z-40 overflow-y-auto bg-black/50 backdrop-blur-sm fixed flex justify-center items-start pt-6 pb-10 md:pb-6 px-6">
                <div className="rounded-xl bg-[var(--bgPanel)] w-full max-w-[400px] shadow-sm">
                    <div className='flex justify-between items-center rounded-tl-lg rounded-tr-lg pt-4 pb-3.5 px-8' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                            <i className="fa-solid fa-box text-[var(--primaryPanel)] text-sm"></i>
                            <span>Add Product</span>
                        </h3>
                        <i className='fa-solid fa-close text-[var(--textPrimary)] text-lg cursor-pointer px-2 py-1' onClick={() => { setIsNewProduct(false) }}></i>
                    </div>
                    <div className='px-7 md:px-8 py-5'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <div className='flex flex-col sm:flex-row'>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Product Name <span className='text-red-500'>*</span></p>
                                    <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. Web Hosting Service' />
                                </div>
                            </div>
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Unit Price  <span className='text-red-500'>*</span></p>
                            <div className='flex gap-2'>
                                <select value={currency} onChange={(e) => { setCurrency(e.target.value) }} id='currency' name='currency' className='max-w-fit text-[var(--textPrimary)] w-full py-2.5 px-2 text-sm box-border outline-0 border-[2px] border-gray-500 placeholder:text-gray-500 rounded-md focus:border-[var(--primaryPanel)]'>
                                    <option value="INR">INR ₹</option>
                                    <option value="USD">USD $</option>
                                    <option value="EUR">EUR €</option>
                                    <option value="GBP">GBP £</option>
                                    <option value="JPY">JPY ¥</option>
                                </select>
                                <input required type='number' name='price' value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                    }}
                                    onBlur={(e) => {
                                        let value = e.target.value;
                                        if (value !== "") {
                                            if (value.length > 1 && value.startsWith("0")) {
                                                value = value.replace(/^0+/, "");
                                            }
                                            const num = parseFloat(value);
                                            if (!isNaN(num)) {
                                                setPrice(num.toFixed(2)); // formats to .00
                                            }
                                        }
                                    }}
                                    className='happyinput text-right' placeholder='i.e. 1200.00' />
                            </div>
                            <div className='flex flex-col sm:flex-row gap-4 md:gap-3 mt-4'>
                                {/* <div>
                                    <p className='text-md mb-[2px] font-medium text-[var(--themeBlack)]'>Unit <span className='text-xs text-gray-500'>(optional)</span></p>
                                    <input type='text' name='unit' value={unit} onChange={(e) => { setUnit(e.target.value) }} className='happyinput text-right' placeholder='0' />
                                </div> */}
                                <div className='sm:max-w-fit'>
                                    <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Type  <span className='text-red-500'>*</span></p>
                                    {/* <input type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. john@gmail.com' /> */}
                                    <select required value={type} onChange={(e) => { setType(e.target.value) }} id='type' name='type' className='sm:max-w-fit text-[var(--textPrimary)] w-full py-2.5 px-3 text-sm box-border outline-0 border-[2px] border-gray-500 placeholder:text-gray-500 rounded-md focus:border-[var(--primaryPanel)]'>
                                        <option>Product</option>
                                        <option>Service</option>
                                        <option>Digital</option>
                                    </select>
                                </div>
                                <div className='flex-1'>
                                    <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Tax / GST <span className='text-xs text-gray-500'>(optional)</span></p>
                                    <div className="relative">
                                        <input type="number" value={tax} onChange={(e) => { setTax(e.target.value) }}
                                            onBlur={(e) => {
                                                if (e.target.value <= 0) setTax('');
                                                else setTax(e.target.value);
                                            }}
                                            className="happyselect" placeholder="0" />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-sm font-medium text-[var(--textPrimary)] mb-1 mt-4'>Description <span className='text-xs text-gray-500'>(optional)</span></p>
                            {/* <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Address' /> */}
                            <textarea name='description' value={description} onChange={(e) => { setDescription(e.target.value) }} className='happyinput' placeholder='write a short description here...'></textarea>
                            {/* <div className='flex gap-2 mt-2'>
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='City' />
                                <input type='text' name='mail' value={address} onChange={(e) => { setAddress(e.target.value) }} className='happyinput' placeholder='Pincode' />
                            </div> */}
                            <button className='btnGreen mt-3 w-full'>Save Product <i className='fa-solid fa-angle-right ml-2'></i></button>
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
                                Saving Product...
                            </h2>
                            <p className="text-sm text-[var(--textSecondary)]">
                                Adding your product to the catalog so it’s ready for billing and tracking.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductNew