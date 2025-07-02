'use client'
import Loading from '@/app/components/other/Loading'
import UpgradeBar from '@/app/components/other/UpgradeBar'
import ActivityBar from '@/app/components/portal/ActivityBar'
import ClientEdit from '@/app/components/portal/ClientEdit'
import ClientList from '@/app/components/portal/ClientList'
import ClientTags from '@/app/components/portal/ClientTags'
import InvoiceList from '@/app/components/portal/InvoiceList'
import NavBar from '@/app/components/portal/NavBar'
import NewClient from '@/app/components/portal/NewClient'
import NumberCard from '@/app/components/portal/NumberCard'
import ProductEdit from '@/app/components/portal/ProductEdit'
import ProductList from '@/app/components/portal/ProductList'
import ProductNew from '@/app/components/portal/ProductNew'
import Sidebar from '@/app/components/portal/Sidebar'
import { AuthContext } from '@/context/AuthContext'
import { FnContext } from '@/context/FunctionContext'
import { auth, db } from '@/fauth/firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const Product = () => {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const { currentUser, userData, loading, isReady, setLoading } = useContext(AuthContext);
    const { isMenu, setIsMenu, isNewProduct, setIsNewProduct, productData, productDataReady, setIsUpdateProduct, isProductEdit, productEditArray, isNewProductTag, setIsNewProductTag, newProductTagID, setNewProductTagID } = useContext(FnContext);
    const signOut = () => {
        signOut(auth);
        router.replace('./')
    }
    useEffect(() => {
        if (isReady && currentUser && userData) {
            setUserName(userData.name.includes(" ") ? userData.name.split(" ")[0] : userData.name);
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
                <ProductNew />
            )}
            {isNewProductTag && (
                <ClientTags />
            )}
            {isProductEdit && (
                <ProductEdit uid={productEditArray.id} name={productEditArray.name} type={productEditArray.type} currency={productEditArray.currency} price={productEditArray.price} unit={productEditArray.unit} tax={productEditArray.tax} description={productEditArray.description} />
            )}
            {loading && (
                <Loading />
            )}
            <div className='flex h-screen max-w-screen'>
                <div className='min-h-full hidden lg:block'>
                    <NavBar page="product" />
                </div>
                <div className='flex-1 flex flex-col max-w-screen overflow-y-auto'>
                    <UpgradeBar />
                    <div className='border-b-2 px-6 border-[var(--greenLightPanel)] py-4 flex lg:hidden justify-center items-center'>
                        <h1 className='text-lg font-bold text-left flex-1'><span className='text-[var(--greenPanel)]'>Happy</span>Invoice</h1>
                        <div className='flex lg:hidden justify-start items-center'>
                            <i className='fa-solid fa-bars text-xl pr-3' onClick={() => { setIsMenu(true) }}></i>
                        </div>
                    </div>
                    <div className='py-6 px-6 md:px-8'>
                        <div className='block sm:flex'>
                            <div className='flex-1'>
                                <div className='flex justify-start items-center'>
                                    <div>
                                        <h1 className='text-xl font-semibold'>Your Products</h1>
                                    </div>
                                </div>
                                <h3 className='text-sm font-medium text-gray-500'>List all your products here!</h3>
                            </div>
                            <div className='mt-3 sm:mt-0'>
                                <button className='btnGreenLightest' onClick={() => { setIsNewProduct(true) }}><i className='fa-solid fa-plus mr-2'></i>Add Product</button>
                            </div>
                        </div>
                        <div className='mt-5 max-w-full'>
                            {productDataReady ? (
                                <>
                                    {productData ? (
                                        <ProductList data={productData} />
                                    ) : (
                                        <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                            <i className='fa-solid fa-triangle-exclamation text-6xl text-[var(--greenPanel)]'></i>
                                            <h2 className='mt-5 text-lg text-center'>No Product Found!</h2>
                                            <p className='text-gray-500 text-xs text-center'>add your first product to show here.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className='w-full py-15 px-5 flex flex-col justify-center items-center font-semibold text-[var(--themeBlack)]'>
                                    <i className='fa-solid fa-magnifying-glass text-6xl text-[var(--greenPanel)]'></i>
                                    <h2 className='mt-5 text-lg text-center'>Searching products!</h2>
                                    <p className='text-gray-500 text-xs text-center'>searching products, please wait.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product