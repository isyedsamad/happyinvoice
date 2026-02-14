'use client'
import InvoicePage from '@/app/pages/portal/InvoicePage';
import React, { use } from 'react'

const page = (props) => {
    const { invoiceid } = use(props.params);
    return (
        <>
            <InvoicePage invoiceid={invoiceid} />
        </>
    )
}

export default page