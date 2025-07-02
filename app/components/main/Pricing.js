'use client'
import React, { useState } from 'react'

const Pricing = () => {
    const [currency, setCurrency] = useState("USD");
    const prices = {
        USD: {
            monthly: "$1 / month",
            yearly: "$10 / year",
        },
        INR: {
            monthly: "₹ 79 / month",
            yearly: "₹ 799 / year",
        },
    };
    return (
        <>
            <section className="bg-gradient-to-b from-white to-gray-50 py-15 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Flexible Pricing for Everyone</h2>
                    <p className="text-gray-500 mt-3 text-lg">Simple, affordable, and designed to scale with you.</p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className="text-md font-medium text-gray-600 flex gap-2">INR<img
                            src="https://flagcdn.com/in.svg"
                            width="30"
                            alt="India" /></span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={currency === "USD"}
                                onChange={() => setCurrency(currency === "USD" ? "INR" : "USD")}
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full relative transition">
                                <div
                                    className={`h-5 w-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all ${currency === "USD" ? "left-5" : "left-0.5"
                                        }`}
                                />
                            </div>
                        </label>
                        <span className="text-md font-medium text-gray-600 flex gap-2"><img
                            src="https://flagcdn.com/us.svg"
                            width="30"
                            alt="USA" />USD</span>
                    </div>

                    {/* Plans */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="flex flex-col bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Free</h3>
                            <p className="text-gray-500 mb-4 text-sm">Perfect for personal use or testing</p>
                            <p className="text-4xl font-bold text-green-600">$ 0</p>
                            <ul className="mt-6 text-left text-sm text-gray-600 space-y-3">
                                <li>✓ 5 invoices trial</li>
                                <li>✓ Limited client entries</li>
                                <li>✓ Unlimited products entries</li>
                                <li>✓ Watermarked invoices</li>
                                <li>✓ Basic reporting</li>
                            </ul>
                            <div className='flex-1'></div>
                            <button className="mt-8 w-full py-2 cursor-pointer bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                                Start Free
                            </button>
                        </div>

                        {/* Monthly Plan */}
                        <div className="flex flex-col bg-white rounded-2xl p-8 border-2 border-green-600 shadow-lg scale-105">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Unlimited – Monthly</h3>
                            <p className="text-gray-500 mb-4 text-sm">Best for freelancers & consultants</p>
                            <p className="text-4xl font-bold text-green-600">{prices[currency].monthly}</p>
                            <ul className="mt-6 text-left text-sm text-gray-600 space-y-3">
                                <li>✓ Unlimited invoices</li>
                                <li>✓ Custom branding</li>
                                <li>✓ Unlimited client entries</li>
                                <li>✓ Unlimited products entries</li>
                                <li>✓ Export as PDF & Excel</li>
                                <li>✓ Priority email support</li>
                                <li>✓ Client analytics</li>
                            </ul>
                            <button className="mt-8 w-full py-2 cursor-pointer bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                                Subscribe Monthly
                            </button>
                        </div>

                        {/* Yearly Plan */}
                        <div className="flex flex-col bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Unlimited – Yearly</h3>
                            <p className="text-gray-500 mb-4 text-sm">Save more with our annual plan</p>
                            <p className="text-4xl font-bold text-green-600">{prices[currency].yearly}</p>
                            <ul className="mt-6 text-left text-sm text-gray-600 space-y-3">
                                <li>✓ All monthly benefits</li>
                                <li>✓ 2 months free</li>
                                <li>✓ Priority onboarding</li>
                                <li>✓ CSV data export</li>
                                <li>✓ 24/7 chat support</li>
                            </ul>
                            <div className='flex-1'></div>
                            <button className="mt-8 w-full cursor-pointer py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                                Subscribe Yearly
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Pricing