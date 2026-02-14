import React from 'react'

const WhyChooseUs = () => {
    return (
        <>
            <section className="py-10 px-6 bg-white text-center">
                <h2 className="text-xl md:text-2xl font-bold">Why <span className='text-[var(--primaryPanel)]'>Happy</span>Invoice?</h2>
                <div className='flex justify-center items-center'>
                    <div className='w-[80px] h-[2px] bg-black rounded-full mt-4 mb-4'></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className='bg-[var(--greenLightest2Panel)] rounded-lg px-3 pb-4 pt-8'>
                        <i className="fa-solid fa-bolt text-4xl text-[var(--primaryPanel)]"></i>
                        <h3 className="text-xl font-semibold mb-2 mt-3">Easy to Use</h3>
                        <p className="text-gray-600">Create invoices in just a few clicks with our intuitive interface.</p>
                    </div>
                    <div className='bg-[var(--greenLightest2Panel)] rounded-lg px-3 pb-4 pt-8'>
                        <i className="fa-solid fa-shield-halved text-4xl text-[var(--primaryPanel)]"></i>
                        <h3 className="text-xl font-semibold mb-2 mt-3">Secure & Reliable</h3>
                        <p className="text-gray-600">Your data is encrypted and backed up, always safe with us.</p>
                    </div>
                    <div className='bg-[var(--greenLightest2Panel)] rounded-lg px-3 pb-4 pt-8'>
                        <i className="fa-solid fa-rocket text-4xl text-[var(--primaryPanel)]"></i>
                        <h3 className="text-xl font-semibold mb-2 mt-3">Fast & Professional</h3>
                        <p className="text-gray-600">Send professional invoices in seconds, anytime, anywhere.</p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default WhyChooseUs