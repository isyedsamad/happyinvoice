import BlockTab from '@/app/components/main/BlockTab'
import Footer from '@/app/components/main/Footer'
import Header from '@/app/components/main/Header'
import MainDiv from '@/app/components/main/MainDiv'
import Testimonial from '@/app/components/main/Testimonial'
import WhyChooseUs from '@/app/components/main/WhyChooseUs'
import React, { useContext } from 'react'
import Pricing from '../components/main/Pricing'
import { AuthContext } from '@/context/AuthContext'
import Loading from '../components/other/Loading'

const HomePage = () => {
    const { loading } = useContext(AuthContext);
    return (
        <>
            {loading && (
                <Loading />
            )}
            <Header page="home" />
            <MainDiv />
            <WhyChooseUs />
            <BlockTab />
            <Pricing />
            <Testimonial />
            <Footer />
        </>
    )
}

export default HomePage