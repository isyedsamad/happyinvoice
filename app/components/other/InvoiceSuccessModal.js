'use client';
import { AuthContext } from '@/context/AuthContext';
import { BadgeCheck, FileText } from 'lucide-react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip'
export default function InvoiceSuccessModal({ invoiceCode }) {
    const { setLoading, userData, currentUser } = useContext(AuthContext)
    const [invoiceURL, setInvoiceURL] = useState('')
    useEffect(() => {
        setInvoiceURL(`www.happyinvoice.com/${userData.username}/${invoiceCode}`)
    }, [])
    const copyURL = async () => {
        try {
            setLoading(true);
            await navigator.clipboard.writeText(invoiceURL);
            setLoading(false);
            toast.success('Invoice Url copied to clipboard!', {
                position: 'top-center',
                theme: 'colored'
            });
        } catch (error) {
            setLoading(false);
            toast.error('Failed to copy: ' + error);
        }
    }
    return (
        <>
            <ToastContainer />
            <Tooltip id="my-tooltip" />
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-[var(--bgPanel)] rounded-xl px-5 md:px-6 py-6 w-[90%] max-w-sm shadow-lg text-center">
                    <div className="flex flex-col items-center gap-1">
                        <BadgeCheck className="w-12 h-12 text-[var(--primaryPanel)]" />
                        <h2 className="text-lg font-semibold mt-3 text-[var(--textPrimary)]">
                            Invoice Generated Successfully!
                        </h2>
                        <p className="text-sm text-[var(--textSecondary)]">
                            Your invoice has been created. You can now view, edit, send the invoice.
                        </p>
                        <div className='flex flex-col justify-start items-start max-w-full'>
                            {/* Live URL Tag */}
                            <div className="inline-block mt-3 bg-[var(--primaryPanel)] text-[var(--textTrans)] text-xs font-semibold px-2 py-[4px] rounded w-max">
                                LIVE URL
                            </div>
                            {/* Invoice URL */}
                            <a
                                href={`https://${invoiceURL}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Open invoice in new tab"
                                data-tooltip-place="top"
                                className="font-medium break-all text-left mt-1 text-md md:text-sm text-[var(--primaryPanel)] underline cursor-pointer bg-[var(--cardPanel)] px-4 py-2 rounded-md"
                            >
                                {invoiceURL}
                            </a>
                            <div className="flex gap-3 flex-wrap mt-2">
                                <button
                                    onClick={copyURL}
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Copy invoice URL to share"
                                    data-tooltip-place="top"
                                    className="text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-3 py-1 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-[var(--primaryPanel)] hover:text-[var(--primaryPanel)] transition"
                                >
                                    <i className="fa-solid fa-copy text-[11px] mr-1.5"></i> Copy
                                </button>
                                <a
                                    href={`https://${invoiceURL}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Open invoice in new tab"
                                    data-tooltip-place="top"
                                >
                                    <button className="text-xs bg-[var(--cardPanel)] cursor-pointer font-medium px-3 py-1 border border-gray-500/30 rounded-md text-[var(--textSecondary)] hover:border-blue-500 hover:text-blue-500 transition">
                                        <i className="fa-solid fa-up-right-from-square text-[11px] mr-1.5"></i> Open
                                    </button>
                                </a>
                            </div>
                        </div>
                        <div className="mt-4 flex-1 w-full flex flex-row gap-3">
                            <Link href={`/portal/invoice/${invoiceCode}`} className='flex-1'>
                                <button
                                    onClick={() => { setLoading(true) }}
                                    className="btnGreen w-full flex justify-center items-center gap-3"
                                >
                                    <FileText size={16} />
                                    View Invoice
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
