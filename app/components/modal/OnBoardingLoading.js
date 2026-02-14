'use client';
import { Rocket } from 'lucide-react';
export default function OnBoardingLoading() {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-[var(--bgPanel)] rounded-xl px-8 py-6 w-[90%] max-w-sm shadow-lg text-center">
                <div className="flex flex-col items-center space-y-2">
                    <div className="animate-bounce">
                        <Rocket className="w-10 h-10 mt-5 text-[var(--primaryPanel)]" />
                    </div>
                    <h2 className="text-lg font-semibold mt-2 text-[var(--textPrimary)]">
                        Setting things up...
                    </h2>
                    <p className="text-sm text-[var(--textSecondary)]">
                        We're almost there! Just wrapping things up.
                    </p>
                </div>
            </div>
        </div>
    );
}
