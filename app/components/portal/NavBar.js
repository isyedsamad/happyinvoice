import Link from 'next/link'
import React from 'react'

const NavBar = (props) => {
    return (
        <>
            <div className='min-h-full border-r-1 border-[var(--greenLightestPanel)] bg-[var(--themeBackground)]'>
                <div className='flex py-5 px-10 justify-center items-center'>
                    <h1 className='text-lg font-bold text-[var(--themeBlack)]'><span className='text-[var(--greenPanel)]'>Happy</span>Invoice</h1>
                </div>
                <div className='flex justify-center items-center'>
                    <div className='w-8 h-0.5 bg-gray-300'></div>
                </div>
                <div className='pt-5'>
                    {props.page == "dashboard" ? (
                        <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-house'></i>
                                </div>
                                Dashboard
                            </div>
                        </div>
                    ) : (
                        <Link href='./'>
                            <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
                                <div className='text-sm flex flex-1'>
                                    <div className='w-7 mr-3 flex justify-center items-center'>
                                        <i className='fa-solid fa-house'></i>
                                    </div>
                                    Dashboard
                                </div>
                            </div>
                        </Link>
                    )}
                    {props.page == "invoice" ? (
                        <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-receipt'></i>
                                </div>
                                Invoice
                            </div>
                        </div>
                    ) : (
                        <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-receipt'></i>
                                </div>
                                Invoice
                            </div>
                        </div>
                    )}
                    {props.page == "client" ? (
                        <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-user'></i>
                                </div>
                                Client
                            </div>
                        </div>
                    ) : (
                        <Link href='portal/client'>
                            <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
                                <div className='text-sm flex flex-1'>
                                    <div className='w-7 mr-3 flex justify-center items-center'>
                                        <i className='fa-solid fa-user'></i>
                                    </div>
                                    Client
                                </div>
                            </div>
                        </Link>
                    )}
                    {props.page == "product" ? (
                        <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-box-open'></i>
                                </div>
                                Product
                            </div>
                        </div>
                    ) : (
                        <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-box-open'></i>
                                </div>
                                Product
                            </div>
                        </div>
                    )}
                    <div className='bg-gray-300 h-[0.6px] w-full my-1'></div>
                    {props.page == "settings" ? (
                        <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-gear'></i>
                                </div>
                                Settings
                            </div>
                        </div>
                    ) : (
                        <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
                            <div className='text-sm flex flex-1'>
                                <div className='w-7 mr-3 flex justify-center items-center'>
                                    <i className='fa-solid fa-gear'></i>
                                </div>
                                Settings
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default NavBar