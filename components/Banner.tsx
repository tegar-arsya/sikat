'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase'

interface Banner {
  id: string
  title: string
  subtitle: string
  image_url: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export default function Banner() {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBanner()
  }, [])

  async function fetchBanner() {
    try {
      const { data, error } = await supabase
        .from('banner')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching banner:', error)
      } else {
        setBanner(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600" />
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400">No banner available</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <div key={banner.id} className="relative h-full">
        <Image
          src={`${SUPABASE_URL}/storage/v1/object/public/images/${banner.image_url}`}
          alt={banner.title}
          priority
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

        {/* Content container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white 
                         tracking-tight drop-shadow-lg transform transition-all duration-300
                         hover:scale-105">
              {banner.title}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl md:max-w-2xl mx-auto 
                        leading-relaxed drop-shadow-md">
              {banner.subtitle}
            </p>
            
            <div className="pt-2 sm:pt-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-primary hover:text-white
                         transform transition-all duration-300 hover:scale-105
                         text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3
                         shadow-lg hover:shadow-xl"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}