'use client';
import { Rocket } from 'lucide-react';
export default function SignUpLoading() {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white rounded-xl px-8 py-6 w-[90%] max-w-sm shadow-lg text-center">
                <div className="flex flex-col items-center space-y-2">
                    <div className="animate-bounce">
                        <Rocket className="w-10 h-10 mt-5 text-[var(--primaryPanel)]" />
                    </div>
                    <h2 className="text-lg font-semibold mt-2 text-[var(--themeBlack)]">
                        Creating your account...
                    </h2>
                    <p className="text-sm text-gray-600">
                        In our free account - you'll get 5 free invoice trail.
                    </p>
                </div>
            </div>
        </div>
    );
}
