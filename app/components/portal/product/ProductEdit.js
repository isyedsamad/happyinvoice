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

const ProductEdit = (props) => {
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const { setIsNewProduct, setIsProductEdit, isFailedMsg, setIsFailedMsg, setIsUpdateProduct, setProductDataReady, productData, setProductData } = useContext(FnContext);
    const { userData, setUserData, currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState('0.00');
    const [type, setType] = useState('Product');
    const [currency, setCurrency] = useState('INR');
    // const [unit, setUnit] = useState("")
    const [description, setDescription] = useState("");
    const [tax, setTax] = useState("")
    const [loading, setLoading] = useState(false);
    const [errorHeading, setErrorHeading] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // firebasefn
        if (props.name == name && props.type == type.toUpperCase() && props.price == price && props.description == description && props.currency == currency && props.tax == tax) {
            setName('');
            setPrice('0.00');
            setType('Product');
            setCurrency('INR ₹');
            setTax('');
            setDescription('');
            setIsProductEdit(false);
            setLoading(false);
        } else {
            try {
                const dataFn = {
                    id: props.uid,
                    name: name,
                    type: type.toUpperCase(),
                    price: price,
                    description: description,
                    currency: currency,
                    tax: tax,
                }
                const functions = getFunctions();
                const callProductUpdate = httpsCallable(functions, 'productUpdate');
                const response = await callProductUpdate(dataFn);
                if (response.data.success) {
                    const docRef = doc(db, 'happyuser', currentUser.uid);
                    const snap = await getDoc(docRef);
                    setUserData(snap.data());
                    productData.forEach(child => {
                        if (child.id == props.uid) {
                            child.name = name;
                            child.type = type.toUpperCase();
                            child.price = price;
                            child.description = description;
                            child.currency = currency;
                            child.tax = tax;
                        }
                    })
                    setProductData(productData);
                    setProductDataReady(true);
                    setName('');
                    setPrice('0.00');
                    setType('Product');
                    setCurrency('INR ₹');
                    setTax('');
                    setDescription('');
                    setIsProductEdit(false);
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
        if (props.type == 'PRODUCT') setType('Product');
        else if (props.type == 'SERVICE') setType('Service');
        else if (props.type == 'DIGITAL') setType('Digital');
        setCurrency(props.currency);
        setPrice(props.price);
        // setUnit(props.unit);
        setTax(props.tax);
        setDescription(props.description);
    }, [])
    return (
        <>
            <ToastContainer />
            <div className="w-[100vw] h-[100vh] z-40 overflow-y-auto bg-black/50 backdrop-blur-sm fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--bgPanel)] w-full max-w-[400px]">
                    <div className='flex justify-between items-center rounded-tl-lg rounded-tr-lg pt-4 pb-3.5 px-8' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 20%, transparent)' }}>
                        <h3 className="text-sm font-semibold text-[var(--textPrimary)] flex items-center gap-4">
                            <i className="fa-solid fa-box text-[var(--primaryPanel)] text-sm"></i>
                            <span>Edit Product</span>
                        </h3>
                        <i className='fa-solid fa-close text-[var(--textPrimary)] text-lg cursor-pointer px-2 py-1' onClick={() => { setIsProductEdit(false) }}></i>
                    </div>
                    <div className='px-6 md:px-8 py-6'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <div className='flex flex-col sm:flex-row gap-3'>
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
                            <div className='flex flex-col sm:flex-row gap-3 mt-5'>
                                {/* <div>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Unit <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <input type='text' name='unit' value={unit} onChange={(e) => { setUnit(e.target.value) }} className='happyinput text-right' placeholder='0' />
                                </div> */}
                                <div className='sm:max-w-fit'>
                                    <p className='text-sm font-medium text-[var(--textPrimary)] mb-1'>Type  <span className='text-red-500'>*</span></p>
                                    {/* <input type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. john@gmail.com' /> */}
                                    <select required value={type} onChange={(e) => { setType(e.target.value) }} id='type' name='type' className='max-w-fit text-[var(--textPrimary)] w-full py-2.5 px-2 text-sm box-border outline-0 border-[2px] border-gray-500 placeholder:text-gray-500 rounded-md focus:border-[var(--primaryPanel)]'>
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
                            <button className='btnGreen mt-3 w-full'>Update Product <i className='fa-solid fa-angle-right ml-2'></i></button>
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

export default ProductEdit