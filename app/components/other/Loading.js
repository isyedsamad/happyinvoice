import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-[var(--blackTrans)] fixed flex justify-center items-center">
                <div className="pt-7 pb-5 px-7 rounded-xl bg-[var(--white)]">
                    <div id="loading"></div>
                </div>
            </div>
        </>
    )
}

export default Loading