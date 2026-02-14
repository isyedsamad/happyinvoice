import PDFTemplate01 from '@/app/pages/portal/PDFTemplate01'
import { FnContext } from '@/context/FunctionContext'
import React, { useContext } from 'react'
import { PDFViewer } from '@react-pdf/renderer'

const PDF_01 = (props) => {
    const { isPDFPreview, setIsPDFPreview } = useContext(FnContext);
    return (
        <>
            <div className="w-[100vw] h-[100vh] z-40 bg-[var(--themeBlackTrans)] fixed flex justify-center items-start">
                <div className="rounded-xl bg-[var(--themeWhite)] w-full h-[90%] m-6">
                    <div className='flex justify-center items-center rounded-tl-lg rounded-tr-lg bg-[var(--greenLightestPanel)] py-3 px-6'>
                        <h3 className='font-semibold text-black flex-1'>PDF Preview</h3>
                        <i className='fa-solid fa-close text-xl cursor-pointer px-2 py-1' onClick={() => { setIsPDFPreview(false) }}></i>
                    </div>
                    <div className='h-[90%]'>
                        <PDFViewer width='100%' height='100%'>
                            <PDFTemplate01 logoBase64={props.logoBase64} signBase64={props.signBase64} pdfData={props.pdfData} />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PDF_01