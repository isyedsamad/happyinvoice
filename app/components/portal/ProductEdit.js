'use client'
import React, { useContext, useEffect, useState } from 'react'
import Loading from '../other/Loading';
import { FnContext } from '@/context/FunctionContext';
import { AuthContext } from '@/context/AuthContext';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/fauth/firebase';
import FailedMsg from '../other/FailedMsg';

const ProductEdit = (props) => {
    const { setIsNewProduct, setIsProductEdit, isFailedMsg, setIsFailedMsg, setIsUpdateProduct, setProductDataReady, productData, setProductData } = useContext(FnContext);
    const { userData, setUserData, currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState('0.00');
    const [type, setType] = useState('Product');
    const [currency, setCurrency] = useState('INR');
    const [unit, setUnit] = useState("")
    const [description, setDescription] = useState("");
    const [tax, setTax] = useState("")
    const [loading, setLoading] = useState(false);
    const [errorHeading, setErrorHeading] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // firebasefn
        if (props.name == name && props.type == type.toUpperCase() && props.price == price && props.description == description && props.currency == currency && props.unit == unit && props.tax == tax) {
            setName('');
            setPrice('0.00');
            setType('Product');
            setCurrency('INR ₹');
            setTax('');
            setDescription('');
            setUnit('');
            setIsProductEdit(false);
            setLoading(false);
        } else {
            const savingValue = {
                name: name,
                type: type.toUpperCase(),
                price: price,
                description: description,
                currency: currency,
                unit: unit,
                tax: tax,
            }
            const docRef = doc(db, 'happyuser', currentUser.uid, 'happyproduct', props.uid);
            const snap = await updateDoc(docRef, savingValue);
            const docClient = doc(db, 'happyuser', currentUser.uid);
            const index = userData.products.indexOf(props.name);
            const newProductArray = userData.products;
            const newProductPriceArray = userData.productprice;
            newProductArray[index] = name;
            newProductPriceArray[index] = price;
            const recentActivity = userData.activity;
            if (recentActivity.length == 3 || recentActivity[0] == '') recentActivity.pop();
            recentActivity.unshift("Product " + name + " edited.")
            await updateDoc(docClient, { activity: recentActivity, products: newProductArray, productprice: newProductPriceArray })
            const updatedUserData = {
                ...userData,
                activity: recentActivity,
                products: newProductArray,
                productprice: newProductPriceArray
            };
            setUserData(updatedUserData);
            // setIsUpdateClient(true);
            productData.forEach(child => {
                if (child.id == props.uid) {
                    child.name = name;
                    child.type = type.toUpperCase(),
                        child.price = price,
                        child.description = description,
                        child.currency = currency,
                        child.unit = unit,
                        child.tax = tax
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
            setUnit('');
            setIsProductEdit(false);
            setLoading(false);
        }
    }
    useEffect(() => {
        setName(props.name);
        if (props.type == 'PRODUCT') setType('Product');
        else if (props.type == 'SERVICE') setType('Service');
        else if (props.type == 'DIGITAL') setType('Digital');
        setCurrency(props.currency);
        setPrice(props.price);
        setUnit(props.unit);
        setTax(props.tax);
        setDescription(props.description);
    }, [])

    return (
        <>
            <div className="w-[100vw] h-[100vh] overflow-y-auto bg-[var(--themeBlackTrans)] fixed flex justify-center items-start p-6">
                <div className="rounded-xl bg-[var(--themeWhite)] w-full max-w-[450px]">
                    <div className='flex justify-center items-center rounded-tl-lg rounded-tr-lg bg-[var(--greenLightestPanel)] py-3 px-6'>
                        <h3 className='font-semibold text-black flex-1'>Edit Product</h3>
                        <i className='fa-solid fa-close text-xl cursor-pointer px-2 py-1' onClick={() => { setIsProductEdit(false) }}></i>
                    </div>
                    <div className='px-6 md:px-8 py-6'>
                        <form onSubmit={(e) => { submitHandler(e) }}>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <div className='flex-1'>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Product Name <span className='text-red-500'>*</span></p>
                                    <input required type='text' name='name' value={name} onChange={(e) => { setName(e.target.value) }} className='happyinput' placeholder='i.e. Web Hosting Service' />
                                </div>
                                <div className='sm:max-w-fit'>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Type  <span className='text-red-500'>*</span></p>
                                    {/* <input type='email' name='mail' value={mail} onChange={(e) => { setMail(e.target.value) }} className='happyinput' placeholder='i.e. john@gmail.com' /> */}
                                    <select required value={type} onChange={(e) => { setType(e.target.value) }} id='type' name='type' className='sm:max-w-fit w-full py-3 px-2 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] text-[var(--themeBlack)] placeholder:text-gray-500 rounded-md focus:border-[var(--greenPanel)]'>
                                        <option>Product</option>
                                        <option>Service</option>
                                        <option>Digital</option>
                                    </select>
                                </div>
                            </div>
                            <p className='text-md font-medium mt-4 text-[var(--themeBlack)]'>Unit Price  <span className='text-red-500'>*</span></p>
                            <div className='flex gap-2'>
                                <select value={currency} onChange={(e) => { setCurrency(e.target.value) }} id='currency' name='currency' className='max-w-fit w-full py-3 px-2 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] text-[var(--themeBlack)] placeholder:text-gray-500 rounded-md focus:border-[var(--greenPanel)]'>
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
                            <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                                <div>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Unit <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <input type='text' name='unit' value={unit} onChange={(e) => { setUnit(e.target.value) }} className='happyinput text-right' placeholder='0' />
                                </div>
                                <div>
                                    <p className='text-md font-medium text-[var(--themeBlack)]'>Tax / GST <span className='text-sm text-gray-500'>(optional)</span></p>
                                    <div className="relative">
                                        <input type="number" value={tax} onChange={(e) => { setTax(e.target.value) }}
                                            onBlur={(e) => {
                                                if (e.target.value <= 0) setTax('');
                                                else setTax(e.target.value);
                                            }}
                                            className="pr-10 text-right w-full py-3 pl-2 md:py-2 box-border outline-0 border-2 border-[var(--grey66)] text-[var(--themeBlack)] placeholder:text-gray-500 rounded-md focus:border-[var(--greenPanel)]" placeholder="0" />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                    </div>
                                </div>
                            </div>
                            <p className='text-md font-medium mt-4 text-[var(--themeBlack)]'>Description <span className='text-sm text-gray-500'>(optional)</span></p>
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