import React from 'react'

const ActivityBar = (props) => {
    return (
        <>
            <div className='flex'>
                <div className='rounded-full bg-[var(--greenPanel)] w-1'></div>
                <div className='ml-2'>
                    <h2 className='text-[var(--themeBlack)] text-xs font-semibold'>{props.heading}</h2>
                </div>
            </div>
        </>
    )
}

export default ActivityBar