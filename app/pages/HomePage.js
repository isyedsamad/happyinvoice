import BlockTab from '@/app/components/main/BlockTab'
import Footer from '@/app/components/main/Footer'
import Header from '@/app/components/main/Header'
import MainDiv from '@/app/components/main/MainDiv'
import Testimonial from '@/app/components/main/Testimonial'
import WhyChooseUs from '@/app/components/main/WhyChooseUs'
import React from 'react'

const HomePage = () => {
    return (
        <>
            <Header page="home" />
            <MainDiv />
            <WhyChooseUs />
            <BlockTab />
            <Testimonial />
            <Footer />
        </>
    )
}

export default HomePage