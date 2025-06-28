import React from 'react'

const Testimonial = () => {
    return (
        <>
            <section className="bg-white py-9 md:py-11 px-6 text-center">
                <h2 className="text-xl md:text-2xl font-bold">What Our <span className='text-[var(--greenPanel)]'>Happy</span> Users Say</h2>
                <div className='flex justify-center items-center'>
                    <div className='w-[80px] h-[2px] bg-black rounded-full mt-4 mb-4'></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="bg-[var(--backPanel)] p-6 rounded-md shadow">
                        <p className="text-gray-700">“It’s the best invoicing tool I’ve used – clean UI and saves a lot of time.”</p>
                        <p className="mt-4 font-semibold">– Rajeev S.</p>
                    </div>
                    <div className="bg-[var(--backPanel)] p-6 rounded-lg shadow">
                        <p className="text-gray-700">“Great for freelancers like me! No more Excel struggles.”</p>
                        <p className="mt-4 font-semibold">– Priya N.</p>
                    </div>
                    <div className="bg-[var(--backPanel)] p-6 rounded shadow">
                        <p className="text-gray-700">“HappyInvoice feels premium and works flawlessly. Highly recommend.”</p>
                        <p className="mt-4 font-semibold">– Aman K.</p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Testimonial