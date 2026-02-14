import React from 'react'

const ActivityBar = (props) => {
    return (
        <>
            <div className='flex'>
                <div className='rounded-full w-1' style={{ background: 'color-mix(in srgb, var(--primaryPanel) 30%, transparent)' }}></div>
                <div className='ml-3'>
                    <h2 className='text-[var(--textPrimary)] text-sm font-semibold'>{props.heading}</h2>
                    <div className='text-gray-500 text-[10px] font-semibold md:font-medium'>
                        <p>{props.date} at {props.time}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActivityBar