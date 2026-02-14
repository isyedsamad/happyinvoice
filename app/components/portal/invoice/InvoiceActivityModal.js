'use client'
import React from 'react'
import ActivityBar from '../ActivityBar'
import InvoiceActivityBarModal from './InvoiceActivityBarModal'
export default function InvoiceActivityModal({ show, onClose, recentActivity }) {
    if (!show) return null
    return (
        <div className="fixed inset-0 z-40 px-7 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden">

                {/* Modal Header */}
                <div className="bg-[var(--greenLightestPanel)] rounded-t-xl px-7 py-4 flex items-center justify-between">
                    <h3 className="text-md font-semibold text-[var(--themeBlack)] flex items-center gap-3">
                        <i className="fa-solid fa-clock-rotate-left text-[var(--primaryPanel)] text-sm"></i>
                        Recent Activity
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-900 hover:text-black text-2xl cursor-pointer"
                        title="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="space-y-3 p-5 overflow-y-auto">
                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((value, index) => (
                            <InvoiceActivityBarModal heading={value.message} date={value.date} time={value.time} key={index} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 font-medium">
                            Loading Recent Activities...
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
