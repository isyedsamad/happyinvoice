'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle } from 'lucide-react'

const GeneratePDF = () => {
    const currencyShow = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥'
    }
    const [style, setStyle] = useState({
        width: '794px',
        height: '1123px',
        scale: 1,
    })
    const [scale, setScale] = useState(1);
    const containerRef = useRef();
    const [A4_WIDTH, setA4_WIDTH] = useState(794);
    const [A4_HEIGHT, setA4_HEIGHT] = useState(1123);
    // const A4_WIDTH = 794; // px
    // const A4_HEIGHT = 1123; // px
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const scaleW = screenWidth / A4_WIDTH;
            const scaleH = screenHeight / A4_HEIGHT;
            const scaleToUse = screenWidth < 768 ? scaleW : scaleH;
            setScale(scaleToUse > 1 ? 1 : scaleToUse); // Don’t scale above 1
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <>
            {/* <div className='min-h-screen flex flex-col md:flex-row p-4 md:p-0 bg-[var(--greenLightPanel)]' ref={containerRef}> */}
            {/* <div className='flex-1 bg-[var(--greenLightPanel)] flex justify-center items-center px-10'>
                    <div className="flex flex-col justify-center items-center h-full px-6 py-10 text-center">
                        <div className="text-[var(--greenDarkPanel)] mb-4">
                            <CheckCircle size={64} className="mx-auto" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-[var(--greenDarkPanel)] mt-4">PDF Generated Successfully!</h1>
                        <p className="text-gray-600 font-medium mb-6">Your invoice has been processed and is ready for download or sharing.</p>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button className="bg-gray-900 cursor-pointer text-white py-3 px-4 rounded-lg hover:bg-gray-800 flex justify-center items-center"><i className='fa-solid fa-envelope mr-3'></i>Download PDF</button>
                        </div>
                        <button className="mt-6 text-sm text-gray-600 hover:underline cursor-pointer">← Back to Invoices</button>
                    </div>
                </div> */}
            {/* h-auto md:h-screen w-full md:w-auto aspect-[210/297] */}
            {/* <div className='flex-1'></div> */}
            <div className='bg-white text-black flex flex-col origin-top transition-transform duration-300 ease-in-out'
                style={{
                    width: `${A4_WIDTH}px`,
                    height: `${A4_HEIGHT}px`,
                    //  transform: `scale(${scale})`,
                }}>
                <div className='h-2 bg-[var(--primaryPanel)]'></div>
                <div className='flex flex-row justify-between items-center px-6 pt-4'>
                    <div>
                        <img className='h-18 rounded-lg' src='https://firebasestorage.googleapis.com/v0/b/happyinvoice-e72af.firebasestorage.app/o/happylogo%2F1751520951163_ISM%20Logo%20Tricolor-min.png?alt=media&token=91e584e4-2ea3-486e-9b10-ca7012e73640' />
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-lg text-right text-[var(--primaryPanel)]'>Aman Enterprises</p>
                        <p className='font-medium text-[13px] text-right text-gray-600 mt-1'>aman@gmail.com</p>
                        <p className='font-medium text-[13px] text-right text-gray-600'>+91 7004707500</p>
                        <p className='font-medium text-[13px] text-right text-gray-600'>Aman Campus, M. M. Colony</p>
                    </div>
                </div>
                <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-4 mb-2'></div>
                <div className='flex justify-between px-6'>
                    <div>
                        <p className='font-semibold text-[11px] text-gray-600'>INVOICE NO.</p>
                        <p className='font-semibold text-[13px] text-[var(--primaryPanel)]'>INV1001</p>
                    </div>
                    <div>
                        <p className='font-semibold text-[11px] text-gray-600'>INVOICE DATE</p>
                        <p className='font-semibold text-[13px] text-[var(--primaryPanel)]'>08/07/2025</p>
                    </div>
                    <div>
                        <p className='font-semibold text-[11px] text-gray-600'>DUE DATE</p>
                        <p className='font-semibold text-[13px] text-[var(--primaryPanel)]'>10/07/2025</p>
                    </div>
                    <div>
                        <p className='font-semibold text-[11px] text-gray-600'>BALANCE DUE</p>
                        <p className='font-semibold text-[13px] text-[var(--primaryPanel)]'>₹ 800</p>
                    </div>
                </div>
                <div className='h-[1px] w-full bg-[var(--greenLightPanel)] my-2'></div>
                <div className='flex flex-col px-6 mt-1'>
                    <p className='font-bold text-[13px] text-[var(--primaryPanel)]'>BILL TO</p>
                    <p className='font-semibold text-lg text-black mt-1'>Aman Enterprises</p>
                    <p className='font-medium text-[13px] text-gray-600 mt-1'>aman@gmail.com</p>
                    <p className='font-medium text-[13px] text-gray-600'>+91 7004707500</p>
                    <p className='font-medium text-[13px] text-gray-600'>Aman Campus, M. M. Colony</p>
                </div>
                {/* <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-2'></div> */}
                {/* <div className='flex py-2 px-6'>
                        <p className='font-semibold flex-1 text-[9px] text-gray-600'>DESCRIPTION</p>
                        <p className='font-semibold flex-1 text-[9px] text-gray-600 text-right'>PRICE</p>
                        <p className='font-semibold flex-1 text-[9px] text-gray-600 text-right'>TAX</p>
                        <p className='font-semibold flex-1 text-[9px] text-gray-600 text-right'>QTY</p>
                        <p className='font-semibold flex-1 text-[9px] text-gray-600 text-right'>AMOUNT</p>
                    </div> */}
                <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-2'></div>
                <div className='max-w-full'>
                    <table className="w-full text-[13px] text-left">
                        <thead className="text-[13px] uppercase text-gray-400 border-b border-[var(--greenLightPanel)]">
                            <tr>
                                <th scope="col" className="pl-6 py-2">
                                    DESCRIPTION
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    PRICE
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    TAX
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    QTY
                                </th>
                                <th scope="col" className="pr-6 py-2 text-right">
                                    AMOUNT
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 font-medium text-gray-700 text-[13px]">
                                <th scope="row" className="pl-6 py-2 font-semibold text-gray-900">
                                    Apple MacBook Pro 17"
                                </th>
                                <td className="px-0 py-2 text-right">
                                    Silver
                                </td>
                                <td className="px-0 py-2 text-right">
                                    Laptop
                                </td>
                                <td className="px-0 py-2 text-right">
                                    $2999
                                </td>
                                <td className="pr-6 py-2 text-right font-semibold">
                                    $2999
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='flex mt-2 items-end'>
                    <div className='flex-1 flex flex-col pl-6'>
                        <p className='font-semibold text-[14px] text-[var(--primaryPanel)]'>Payment Details</p>
                        <p className='font-medium text-[13px] text-gray-600 mt-1'>A/C : 999999999999</p>
                        <p className='font-medium text-[13px] text-gray-600'>IFSC : SBIN0001238</p>
                        <p className='font-medium text-[13px] text-gray-600'>Name : Sanjay Singh</p>
                    </div>
                    <div className='flex-1 flex pl-5 flex-col gap-1'>
                        <div className='flex'>
                            <p className='font-medium text-[13px] text-gray-600 flex-1 text-left pl-2'>Subtotal :</p>
                            <p className='font-semibold text-[13px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[13px] text-gray-600 flex-1 text-left pl-2'>Tax :</p>
                            <p className='font-semibold text-[13px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[13px] text-gray-600 flex-1 text-left pl-2'>Total :</p>
                            <p className='font-semibold text-[13px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[13px] text-gray-600 flex-1 text-left pl-2'>Discount :</p>
                            <p className='font-semibold text-[13px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-semibold text-[17px] text-black flex-1 text-left pl-2'>Balance Due :</p>
                            <p className='font-semibold text-[17px] text-black flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                    </div>
                </div>
                <div className='flex-1'></div>
                <div className='flex justify-start items-end pb-4 pt-2 px-6'>
                    <div className='flex-2/3'>
                        <p className='font-semibold text-[14px] text-[var(--primaryPanel)] flex-1 text-left'>NOTE</p>
                        <p className='font-semibold text-[13px] text-gray-600 flex-1 text-left'>Authorised Signature</p>
                    </div>
                    <div className='flex-1/3 flex flex-col justify-center'>
                        <div className='flex justify-center'><img className='h-17' src='https://firebasestorage.googleapis.com/v0/b/happyinvoice-e72af.firebasestorage.app/o/happysign%2Fsignature_1751639663442.png?alt=media&token=3e4653c7-2dba-4a49-b421-4137d4cb1c9a' /></div>
                        <p className='font-semibold text-[13px] text-gray-600 flex-1 text-center'>Authorised Signature</p>
                    </div>
                </div>
            </div>
            {/* <div className='bg-white  text-black flex flex-col origin-top transition-transform duration-300 ease-in-out'
                    style={{
                        width: `${A4_WIDTH}px`,
                        height: `${A4_HEIGHT}px`,
                        //  transform: `scale(${scale})`,
                    }}>
                    <div className='h-2 bg-[var(--primaryPanel)]'></div>
                    <div className='flex flex-row justify-between items-center px-6 pt-3'>
                        <div>
                            <img className='h-13 rounded-lg' src='https://firebasestorage.googleapis.com/v0/b/happyinvoice-e72af.firebasestorage.app/o/happylogo%2F1751520951163_ISM%20Logo%20Tricolor-min.png?alt=media&token=91e584e4-2ea3-486e-9b10-ca7012e73640' />
                        </div>
                        <div className='flex flex-col'>
                            <p className='font-semibold text-xs text-right text-[var(--primaryPanel)]'>Aman Enterprises</p>
                            <p className='font-medium text-[9px] text-right text-gray-600 mt-1'>aman@gmail.com</p>
                            <p className='font-medium text-[9px] text-right text-gray-600'>+91 7004707500</p>
                            <p className='font-medium text-[9px] text-right text-gray-600'>Aman Campus, M. M. Colony</p>
                        </div>
                    </div>
                    <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-3 mb-2'></div>
                    <div className='flex justify-around'>
                        <div>
                            <p className='font-semibold text-[7px] text-gray-600'>INVOICE NO.</p>
                            <p className='font-semibold text-[9px] text-[var(--primaryPanel)]'>INV1001</p>
                        </div>
                        <div>
                            <p className='font-semibold text-[7px] text-gray-600'>INVOICE DATE</p>
                            <p className='font-semibold text-[9px] text-[var(--primaryPanel)]'>08/07/2025</p>
                        </div>
                        <div>
                            <p className='font-semibold text-[7px] text-gray-600'>DUE DATE</p>
                            <p className='font-semibold text-[9px] text-[var(--primaryPanel)]'>10/07/2025</p>
                        </div>
                        <div>
                            <p className='font-semibold text-[7px] text-gray-600'>BALANCE DUE</p>
                            <p className='font-semibold text-[9px] text-[var(--primaryPanel)]'>₹ 800</p>
                        </div>
                    </div>
                    <div className='h-[1px] w-full bg-[var(--greenLightPanel)] my-2'></div>
                    <div className='flex flex-col px-6 mt-1'>
                        <p className='font-bold text-[10px] text-[var(--primaryPanel)]'>BILL TO</p>
                        <p className='font-semibold text-xs text-black mt-1'>Aman Enterprises</p>
                        <p className='font-medium text-[9px] text-gray-600 mt-1'>aman@gmail.com</p>
                        <p className='font-medium text-[9px] text-gray-600'>+91 7004707500</p>
                        <p className='font-medium text-[9px] text-gray-600'>Aman Campus, M. M. Colony</p>
                    </div>
                    {/* <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-2'></div> */}
            {/* <div className='h-[1px] w-full bg-[var(--greenLightPanel)] mt-2'></div>
                <div className='max-w-full'>
                    <table className="w-full text-[9px] text-left">
                        <thead className="text-[9px] uppercase text-gray-600 border-b border-[var(--greenLightPanel)]">
                            <tr>
                                <th scope="col" className="pl-6 py-2">
                                    DESCRIPTION
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    PRICE
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    TAX
                                </th>
                                <th scope="col" className="px-0 py-2 text-right">
                                    QTY
                                </th>
                                <th scope="col" className="pr-6 py-2 text-right">
                                    AMOUNT
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 font-medium text-gray-700">
                                <th scope="row" className="pl-6 py-2 font-semibold text-gray-900">
                                    Apple MacBook Pro 17"
                                </th>
                                <td className="px-0 py-2 text-right">
                                    Silver
                                </td>
                                <td className="px-0 py-2 text-right">
                                    Laptop
                                </td>
                                <td className="px-0 py-2 text-right">
                                    $2999
                                </td>
                                <td className="pr-6 py-2 text-right">
                                    $2999
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='flex mt-2 items-end'>
                    <div className='flex-1 flex flex-col pl-6'>
                        <p className='font-semibold text-[10px] text-gray-900'>Payment Details</p>
                        <p className='font-medium text-[9px] text-gray-600 mt-1'>A/C : 999999999999</p>
                        <p className='font-medium text-[9px] text-gray-600'>IFSC : SBIN0001238</p>
                        <p className='font-medium text-[9px] text-gray-600'>Name : Sanjay Singh</p>
                    </div>
                    <div className='flex-1 flex pl-5 flex-col gap-1'>
                        <div className='flex'>
                            <p className='font-medium text-[9px] text-gray-600 flex-1 text-left'>Subtotal :</p>
                            <p className='font-semibold text-[9px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[9px] text-gray-600 flex-1 text-left'>Tax :</p>
                            <p className='font-semibold text-[9px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[9px] text-gray-600 flex-1 text-left'>Total :</p>
                            <p className='font-semibold text-[9px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-medium text-[9px] text-gray-600 flex-1 text-left'>Discount :</p>
                            <p className='font-semibold text-[9px] text-gray-600 flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <div className='flex'>
                            <p className='font-semibold text-xs text-black flex-1 text-left'>Balance Due :</p>
                            <p className='font-semibold text-xs text-black flex-1 text-right pr-6'>₹ 1299.00</p>
                        </div>
                    </div>
                </div>
                <div className='flex-1'></div>
                <div className='flex justify-start items-end pb-4 pt-2 px-6'>
                    <div className='flex-2/3'>
                        <p className='font-semibold text-[9px] text-[var(--primaryPanel)] flex-1 text-left'>NOTE</p>
                        <p className='font-semibold text-[7px] text-gray-600 flex-1 text-left'>Authorised Signature</p>
                    </div>
                    <div className='flex-1/3 flex flex-col justify-center'>
                        <div className='flex justify-center'><img className='h-12' src='https://firebasestorage.googleapis.com/v0/b/happyinvoice-e72af.firebasestorage.app/o/happysign%2Fsignature_1751639663442.png?alt=media&token=3e4653c7-2dba-4a49-b421-4137d4cb1c9a' /></div>
                        <p className='font-semibold text-[7px] text-gray-600 flex-1 text-center'>Authorised Signature</p>
                    </div>
                </div>
            </div> */}
            {/* </div > */}
        </>
    )
}

export default GeneratePDF