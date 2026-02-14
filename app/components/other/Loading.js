import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="w-[100vw] h-[100vh] bg-black/50 backdrop-blur-sm fixed flex justify-center items-center z-55">
                <div className="pt-7 pb-5 px-7 rounded-xl bg-[var(--bgPanel)]">
                    <div id="loading"></div>
                </div>
            </div>
        </>
    )
}

export default Loading