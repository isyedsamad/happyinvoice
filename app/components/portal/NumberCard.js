import Link from 'next/link'
import React from 'react'

const NumberCard = (props) => {
    return (
        <>
            <Link href={props.link} className='flex-1'>
                <div className='shadow pl-8 pr-6 py-4 text-[var(--themeBlack)] flex-1 rounded-lg font-semibold text-md bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] cursor-pointer'>
                    <p>{props.heading}</p>
                    <p className='text-3xl mt-1'>{props.number}</p>
                </div>
            </Link>
        </>
    )
}

export default NumberCard