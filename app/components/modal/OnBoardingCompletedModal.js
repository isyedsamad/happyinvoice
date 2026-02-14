'use client';
import { BadgeCheck, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
export default function OnBoardingCompletedModal({ close }) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-[var(--bgPanel)] rounded-xl px-5 md:px-6 py-6 w-[90%] max-w-sm shadow-lg text-center">
                    <div className="flex flex-col items-center gap-1">
                        <BadgeCheck className="w-12 h-12 text-[var(--primaryPanel)]" />
                        <h2 className="text-lg font-semibold mt-3 text-[var(--textPrimary)]">
                            You're all set!
                        </h2>
                        <p className="text-sm text-[var(--textSecondary)]">
                            You're now ready to create your first invoice, quote or more.
                        </p>
                        <div className="mt-4 flex-1 w-full flex flex-row gap-3">
                            <Link href='/portal' className='flex-1'><button
                                className="w-full btnGreen flex justify-center items-center gap-3"
                            >
                                Go to Dashboard
                                <ChevronsRight size={16} />
                            </button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
