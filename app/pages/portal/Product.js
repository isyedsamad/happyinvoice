'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ActivityBar from '@/app/components/portal/ActivityBar'
import ClientEdit from '@/app/components/portal/client/ClientEdit'
import ClientList from '@/app/components/portal/client/ClientList'
import ClientTags from '@/app/components/portal/client/ClientTags'
import InvoiceList from '@/app/components/portal/invoice/InvoiceList'
import NavBar from '@/app/components/portal/navbar/NavBar'
import NewClient from '@/app/components/portal/client/NewClient'
import NumberCard from '@/app/components/portal/NumberCard'
import ProductEdit from '@/app/components/portal/product/ProductEdit'
import ProductList from '@/app/components/portal/product/ProductList'
import ProductNew from '@/app/components/portal/product/ProductNew'
import Sidebar from '@/app/components/portal/navbar/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

const Product = () => {
    const router = useRouter();
    const [userCurrency, setUserCurrency] = useState("INR");
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewProduct, setIsNewProduct, productData, productDataReady, setIsUpdateProduct, isProductEdit, productEditArray, isNewProductTag, setIsNewProductTag, newProductTagID, setNewProductTagID } = useContext(FnContext);
    const signOut = () => {
        signOut(auth);
        router.replace('./')
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserCurrency(userData.currency ? userData.currency : 'INR');
            if (isMenu) setIsMenu(false);
            if (!productData) setIsUpdateProduct(true);
        }
        if (isReady && !currentUser && !userData) {
            router.replace('/signin/');
        }
    }, [isReady, currentUser, userData])
    return (
        <>
            {isMenu && (
                <Sidebar page="product" />
            )}
            {isNewProduct && (
                <ProductNew currency={userCurrency} />
            )}
            {isProductEdit && (
                <ProductEdit uid={productEditArray.id} name={productEditArray.name} type={productEditArray.type} currency={productEditArray.currency} price={productEditArray.price} unit={productEditArray.unit} tax={productEditArray.tax} description={productEditArray.description} />
            )}
            {loading && (
                <Loading />
            )}
            <ToastContainer />
            <div className='flex h-screen max-w-screen bg-[var(--bgPanel)]'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="product" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold text-[var(--textPrimary)]'>Your Products</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-[var(--textSecondary)]'>List all your products here!</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <button className='btnGreenLightest' onClick={() => { setIsNewProduct(true) }}><i className='fa-solid fa-plus mr-2'></i>Add Product</button>
                            </div>
                        </div>
                        <div className='mt-5 max-w-full'>
                            <ProductList />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product