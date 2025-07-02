import { AuthContext } from '@/context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'

const UpgradeBar = () => {
    const { isReady, userData } = useContext(AuthContext);
    const [isFree, setIsFree] = useState(false);
    useEffect(() => {
        if (isReady && userData) {
            if (userData.plan == 'Free') {
                setIsFree(true);
            }
        }
    }, [isReady, userData])

    return (
        <>
            {isFree ? (
                <div className='w-full cursor-pointer text-sm bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] px-4 py-2 flex justify-center items-center'>
                    <p className='font-medium text-center'>Upgrade to <span className='font-semibold'>🚀 Plus Plan </span>and generate unlimited invoices.</p>
                </div>
            ) : (
                <div className='w-full cursor-pointer text-sm bg-[var(--greenLightestPanel)] hover:bg-[var(--greenLightPanel)] px-4 py-2 flex justify-center items-center'>
                    <p className='font-medium text-center'>We are now a family of <span className='font-semibold'>🚀 Plus Plan </span>and generate unlimited invoices.</p>
                </div>
            )}
        </>
    )
}

export default UpgradeBar