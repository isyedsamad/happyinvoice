'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HappyLogo from '../../logo/HappyLogo'

const navItems = [
    { label: 'Home', href: '/portal', icon: 'fa-house' },
    { label: 'Invoice', href: '/portal/invoice', icon: 'fa-receipt' },
    { label: 'Analytics', href: '/portal/analytics', icon: 'fa-chart-line' },
    { label: 'Client', href: '/portal/client', icon: 'fa-user' },
    { label: 'Product', href: '/portal/product', icon: 'fa-box-open' },
    { label: 'Settings', href: '/portal/settings', icon: 'fa-gear' }
]

const NavBar = () => {
    const pathname = usePathname()

    return (
        <aside className="h-screen bg-[var(--bgPanel)] border-r-2 z-5 border-[var(--cardPanel)] flex flex-col justify-between">

            {/* Top Section */}
            <div className=''>
                {/* Logo */}
                {/* <div className="flex items-center justify-center h-16">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                        🧾
                    </div>
                </div> */}
                <Link href='/portal/'>
                    <div className="flex items-center justify-center mt-4">
                        <HappyLogo color='var(--primaryPanel)' size={40} animate />
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="mt-4 flex flex-col items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                href={item.href}
                                key={item.label}
                                className={`flex items-center justify-center`}
                            >
                                <div className={`relative min-w-15 mx-2 group cursor-pointer flex flex-col justify-start pt-3 pb-2 px-2 items-center rounded-md transition-all
                                ${isActive
                                        ? 'bg-[var(--primaryPanel)] text-[var(--textTrans)]'
                                        : 'text-[var(--textSecondary)] hover:text-[var(--textPrimary)] hover:bg-[var(--cardPanel)]'}`}>
                                    <i className={`fa-solid ${item.icon} text-[15px]`} />
                                    <p className={`text-[9px] font-semibold mt-2`}>{item.label}</p>
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}

export default NavBar




// import Link from 'next/link'
// import React from 'react'

// const NavBar = (props) => {
//     return (
//         <>
//             <div className='min-h-full border-r-1 border-[var(--greenLightestPanel)] bg-[var(--themeBackground)]'>
//                 <div className='flex py-5 px-10 justify-center items-center'>
//                     <h1 className='text-lg font-bold text-[var(--themeBlack)]'><span className='text-[var(--primaryPanel)]'>Happy</span>Invoice</h1>
//                 </div>
//                 <div className='flex justify-center items-center'>
//                     <div className='w-8 h-0.5 bg-gray-300'></div>
//                 </div>
//                 <div className='pt-5'>
//                     {props.page == "dashboard" ? (
//                         <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
//                             <div className='text-sm flex flex-1'>
//                                 <div className='w-7 mr-3 flex justify-center items-center'>
//                                     <i className='fa-solid fa-house'></i>
//                                 </div>
//                                 Dashboard
//                             </div>
//                         </div>
//                     ) : (
//                         <Link href='/portal'>
//                             <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
//                                 <div className='text-sm flex flex-1'>
//                                     <div className='w-7 mr-3 flex justify-center items-center'>
//                                         <i className='fa-solid fa-house'></i>
//                                     </div>
//                                     Dashboard
//                                 </div>
//                             </div>
//                         </Link>
//                     )}
//                     {props.page == "invoice" ? (
//                         <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
//                             <div className='text-sm flex flex-1'>
//                                 <div className='w-7 mr-3 flex justify-center items-center'>
//                                     <i className='fa-solid fa-receipt'></i>
//                                 </div>
//                                 Invoice
//                             </div>
//                         </div>
//                     ) : (
//                         <Link href='/portal/invoice'>
//                             <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
//                                 <div className='text-sm flex flex-1'>
//                                     <div className='w-7 mr-3 flex justify-center items-center'>
//                                         <i className='fa-solid fa-receipt'></i>
//                                     </div>
//                                     Invoice
//                                 </div>
//                             </div>
//                         </Link>
//                     )}
//                     {props.page == "client" ? (
//                         <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
//                             <div className='text-sm flex flex-1'>
//                                 <div className='w-7 mr-3 flex justify-center items-center'>
//                                     <i className='fa-solid fa-user'></i>
//                                 </div>
//                                 Client
//                             </div>
//                         </div>
//                     ) : (
//                         <Link href='/portal/client'>
//                             <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
//                                 <div className='text-sm flex flex-1'>
//                                     <div className='w-7 mr-3 flex justify-center items-center'>
//                                         <i className='fa-solid fa-user'></i>
//                                     </div>
//                                     Client
//                                 </div>
//                             </div>
//                         </Link>
//                     )}
//                     {props.page == "product" ? (
//                         <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
//                             <div className='text-sm flex flex-1'>
//                                 <div className='w-7 mr-3 flex justify-center items-center'>
//                                     <i className='fa-solid fa-box-open'></i>
//                                 </div>
//                                 Product
//                             </div>
//                         </div>
//                     ) : (
//                         <Link href='/portal/product'>
//                             <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
//                                 <div className='text-sm flex flex-1'>
//                                     <div className='w-7 mr-3 flex justify-center items-center'>
//                                         <i className='fa-solid fa-box-open'></i>
//                                     </div>
//                                     Product
//                                 </div>
//                             </div>
//                         </Link>
//                     )}
//                     <div className='bg-gray-300 h-[0.6px] w-full my-1'></div>
//                     {props.page == "settings" ? (
//                         <div className='flex justify-start items-center font-semibold text-[var(--themeBlack)] px-5 py-4 cursor-pointer'>
//                             <div className='text-sm flex flex-1'>
//                                 <div className='w-7 mr-3 flex justify-center items-center'>
//                                     <i className='fa-solid fa-gear'></i>
//                                 </div>
//                                 Settings
//                             </div>
//                         </div>
//                     ) : (
//                         <Link href='/portal/settings'>
//                             <div className='flex justify-start items-center hover:text-[var(--themeBlack)] font-semibold text-[var(--grey88)] px-5 py-4 cursor-pointer'>
//                                 <div className='text-sm flex flex-1'>
//                                     <div className='w-7 mr-3 flex justify-center items-center'>
//                                         <i className='fa-solid fa-gear'></i>
//                                     </div>
//                                     Settings
//                                 </div>
//                             </div>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default NavBar