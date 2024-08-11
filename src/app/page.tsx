'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Banner from '@/components/Banner'
import Dashboard from '@/components/DashBoard'

export default function Home() {
  const [bannerVisible, setBannerVisible] = useState(false)
  const [bannerContent, setBannerContent] = useState({
    description: '',
    timer: 0,
    link: ''
  })

  // useEffect(() => {
  //   fetchBannerContent()
  // }, [])

  // const fetchBannerContent = async () => {
  //   try {
  //     const response = await axios.get('/api/banner')
  //     setBannerContent(response.data)
  //   } catch (error) {
  //     console.error('Error fetching banner content:', error)
  //   }
  // }

  return (
    <main className="min-h-screen p-24">
      {bannerVisible && <Banner content={bannerContent} />}
      <Dashboard 
      />
     
    </main>
  )
}