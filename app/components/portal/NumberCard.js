import Link from 'next/link'
import React from 'react'

const NumberCard = (props) => {
    return (
        <>
            <Link href={props.link} className='flex-1'>
                <div className="flex items-center gap-4 p-4 rounded-xl shadow bg-[var(--cardPanel)] hover:shadow-md transition-shadow cursor-pointer">
                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bgPanel)] text-[var(--primaryPanel)]">
                        <i className={`fa-solid ${props.icon} text-base`}></i>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium text-[var(--textSecondary)]">{props.heading}</p>
                        <p className="text-xl font-bold text-[var(--textPrimary)]">{props.number}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default NumberCard