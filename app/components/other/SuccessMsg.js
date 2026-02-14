import React from 'react'

const SuccessMsg = (props) => {
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[var(--blackTrans)] fixed flex justify-center items-center">
                <div className="p-6 rounded-md bg-[var(--white)] w-full max-w-[300px]">
                    <div className='flex flex-col justify-start items-start'>
                        <p className='text-lg font-bold text-[var(--primaryPanel)]'>{props.heading}</p>
                        <p className='text-md font-medium mt-2'>{props.message}</p>
                        <button className='w-full py-2 cursor-pointer hover:bg-gray-900 bg-black text-white font-semibold mt-4 rounded-md'>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuccessMsg