'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ParallaxScroll } from './ui/parallax-scroll'
import { motion } from 'framer-motion'

interface ShoeImage {
  id: string
  image: string
  title: string
}

export default function ShoeGallery() {
  const [images, setImages] = useState<ShoeImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  async function fetchGalleryImages() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
    
      if (error) throw error

      setImages(data?.map(img => ({
        ...img,
        image: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${img.image}`
      })) || [])
    } catch (error) {
      console.error('Error fetching gallery images:', error)
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

  return (
    <section className="relative py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4 font-serif">
            Our Shoe Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our latest and most iconic footwear designs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <ParallaxScroll 
            images={images.map(img => img.image)} 
          />
        </motion.div>
      </div>
    </section>
  )
}