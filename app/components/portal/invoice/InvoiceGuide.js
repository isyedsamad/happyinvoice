import React from "react";

const guideData = [
    {
        title: "Invoice Details",
        id: "invoice-details",
        content: [
            "Invoice Number: A unique identifier for tracking.",
            "Invoice Date: The issue date of the invoice.",
            "Due Date: Optional, used for payment reminders.",
        ],
    },
    {
        title: "Bill From",
        id: "bill-from",
        content: [
            "Add your business name, email, phone number, and address. Editable in Settings.",
        ],
    },
    {
        title: "Bill To (Client)",
        id: "bill-to",
        content: [
            "Select an existing client or create a new one with contact details.",
        ],
    },
    {
        title: "Product List",
        id: "product-list",
        content: [
            "Add line items with product/service name, quantity, price, and tax.",
        ],
    },
    {
        title: "Tax and Discount",
        id: "tax-discount",
        content: [
            "Tax Type: Choose per-item or total.",
            "Tax Rate: Enter applicable percentage.",
            "Discount: Flat or percentage deduction.",
        ],
    },
    {
        title: "Partial Payment",
        id: "partial-payment",
        content: [
            "Enable if advance payment is made.",
            "Remaining balance will auto-adjust.",
        ],
    },
    {
        title: "Invoice Settings",
        id: "invoice-settings",
        content: [
            "Status: Draft, Sent, Paid, or Overdue.",
            "Theme: Choose a color scheme for PDF.",
            "Bank Details: Add UPI, account number, etc.",
        ],
    },
    {
        title: "Footer Settings",
        id: "footer-settings",
        content: [
            "Add custom invoice notes or terms.",
            "Upload a digital signature for authenticity.",
        ],
    },
    {
        title: "Export & Share",
        id: "export-share",
        content: [
            "Preview: See the invoice before sending.",
            "Download: Export as PDF.",
            "Send: Email directly to the client.",
            "Live Link: Share a read-only view.",
        ],
    },
];

const InvoiceGuide = () => {
    return (
        <section className="w-[100%] max-w-screen-lg mx-0 md:mx-auto px-4 mt-5 md:px-10 pb-10">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 md:px-8 py-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                        How to Create a Professional Invoice
                    </h1>
                    <p className="text-gray-500 text-sm md:text-md max-w-2xl">
                        Learn how to quickly and accurately create client-ready invoices with HappyInvoice's intuitive system.
                    </p>
                </div>

                {/* Seeking Help With (Filter Tags) */}
                <div className="mb-10">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
                        Seeking Help With
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {guideData.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const el = document.getElementById(item.id);
                                    if (el) {
                                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                }}
                                className="text-gray-600 border cursor-pointer border-gray-300 rounded-full px-4 py-1.5 text-sm bg-white hover:border-[var(--primaryPanel)] hover:text-[var(--primaryPanel)] transition whitespace-nowrap"
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step-by-step */}
                <div className="mb-10">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                        Step-by-Step Guide
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 leading-relaxed">
                        <li>Enter invoice number and date.</li>
                        <li>Add client details or select from saved.</li>
                        <li>Insert products or services.</li>
                        <li>Apply tax and discounts.</li>
                        <li>Set invoice theme, status, and notes.</li>
                        <li>Preview or download the final invoice.</li>
                    </ol>
                </div>

                {/* Guide Sections */}
                <div className="space-y-4">
                    {guideData.map((section, index) => (
                        <details
                            key={index}
                            id={section.id}
                            open
                            className="group border border-gray-200 rounded-xl transition-all duration-300"
                        >
                            <summary className="cursor-pointer flex items-center justify-between gap-2 px-5 py-4 rounded-xl bg-gray-50 hover:bg-green-50 transition group-open:bg-green-50 group-open:border-[var(--primaryPanel)] group-open:text-[var(--primaryPanel)]">
                                <span className="font-medium">{section.title}</span>
                                <svg
                                    className="w-5 h-5 text-gray-400 group-open:rotate-180 group-open:[var(--primaryPanel)] transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div className="px-5 pb-4 text-sm mt-3 text-gray-600 space-y-2 leading-relaxed">
                                {section.content.map((line, i) => (
                                    <p key={i}>• {line}</p>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default InvoiceGuide;
