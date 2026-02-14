"use client";

import { Lock, UserLock } from "lucide-react";

export default function FeatureLimitModal({ feature = "This", onUpgrade, onClose }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[var(--bgPanel)] w-full max-w-sm rounded-xl shadow-xl text-center p-6 space-y-2 relative">
                {/* Sparkle Icon */}
                <div className="w-14 h-14 rounded-full bg-[var(--primaryPanel)] flex items-center justify-center mx-auto shadow-md">
                    <Lock className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-xl mt-4 font-semibold text-[var(--textPrimary)]">Feature Locked</h2>

                {/* Message */}
                <p className="text-[var(--textSecondary)] text-sm">
                    The {feature} feature is part of our premium offerings. Upgrade now to unlock it.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-4">
                    <button
                        onClick={onUpgrade}
                        className="bg-[var(--primaryPanel)] cursor-pointer hover:opacity-80 text-[var(--textTrans)] font-medium py-2 px-4 rounded-lg transition"
                    >
                        Upgrade to Use
                    </button>
                    <button
                        onClick={onClose}
                        className="text-[var(--textSecondary)] cursor-pointer hover:opacity-80 hover:underline text-sm"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
