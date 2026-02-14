import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className="bg-[var(--textPanel)] text-white py-10 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Column 1: Logo and Brand Message */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2"><span className="text-[var(--primaryPanel)]">Happy</span>Invoice</h3>
                        <p className="text-sm text-gray-300">Making invoicing delightful for businesses worldwide.</p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div>
                        <h4 className="font-semibold mb-2">Navigation</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li><a href="/" className="hover:underline">Home</a></li>
                            <li><a href="/features" className="hover:underline">Features</a></li>
                            <li><a href="/pricing" className="hover:underline">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="font-semibold mb-2">Legal</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact / Social */}
                    <div>
                        <h4 className="font-semibold mb-2">Get in Touch</h4>
                        <p className="text-sm text-gray-300 mb-2">support@happyinvoice.in</p>
                        <div className="flex space-x-4 mt-2">
                            <a href="#" className="hover:text-greenPanel"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="hover:text-greenPanel"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="hover:text-greenPanel"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Note */}
                <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} HappyInvoice. All rights reserved.
                </div>
            </footer>

        </>
    )
}

export default Footer