'use client';
import { BadgeCheck, ChevronsRight } from 'lucide-react';
export default function AccountCreatedModal({ close }) {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
                <div className="bg-[var(--bgPanel)] rounded-xl px-5 md:px-6 py-6 w-[90%] max-w-sm shadow-lg text-center">
                    <div className="flex flex-col items-center gap-1">
                        <BadgeCheck className="w-12 h-12 text-[var(--primaryPanel)]" />
                        <h2 className="text-lg font-semibold mt-3 text-[var(--textPrimary)]">
                            Welcome aboard!
                        </h2>
                        <p className="text-sm text-[var(--textSecondary)]">
                            Your account has been created successfully. Let's get you set up and ready to send your first invoice in minutes.
                        </p>
                        <div className="mt-4 flex-1 w-full flex flex-row gap-3">
                            <button
                                onClick={() => { close() }}
                                className="btnGreen w-full flex justify-center items-center gap-3"
                            >
                                Start Onboarding
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
