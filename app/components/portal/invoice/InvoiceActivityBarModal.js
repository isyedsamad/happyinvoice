import React from 'react'

const InvoiceActivityBar = (props) => {
    return (
        <>
            <div className='flex flex-col bg-gray-50 border border-gray-200 rounded-md py-2 px-4'>
                <div>
                    <h2 className='text-[var(--themeBlack)] text-sm font-semibold'>{props.heading}</h2>
                </div>
                <div className='h-[1px] my-1 bg-gray-300'></div>
                <div className='text-gray-400 text-xs font-semibold md:font-medium'>
                    <p>{props.date} at {props.time}</p>
                </div>
            </div>
        </>
    )
}

export default InvoiceActivityBar