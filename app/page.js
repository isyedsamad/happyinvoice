'use client'
import Topbar from '@/app/components/main/Topbar'
import HomePage from '@/app/pages/HomePage'
import { auth } from '@/fauth/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/portal')
      }
      return unsub
    })
  }, [])
  return (
    <>
      <HomePage />
    </>
  )
}

export default page