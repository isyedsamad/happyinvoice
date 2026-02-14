import { FnContext } from '@/context/FunctionContext'
import React, { useContext } from 'react'

const FailedMsg = (props) => {
    const { setIsFailedMsg } = useContext(FnContext);
    return (
        <>
            <div className="w-[100vw] h-[100vh] z-45 bg-[var(--blackTrans)] fixed flex justify-center items-center">
                <div className="p-6 rounded-xl bg-[var(--white)] w-[90%] max-w-[320px]">
                    <div className='flex flex-col justify-start items-start'>
                        <p className='text-lg font-bold text-[var(--red)]'>{props.heading}</p>
                        <p className='text-sm font-medium mt-1'>{props.message}</p>
                        <button onClick={() => { setIsFailedMsg(false) }} className='w-full py-2 cursor-pointer hover:bg-gray-900 bg-black text-white font-semibold mt-4 rounded-md'>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FailedMsg