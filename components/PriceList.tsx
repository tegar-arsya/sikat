'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Clock, Check } from "lucide-react"
import { supabase } from '@/lib/supabase'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

interface PriceItem {
  id: string
  service: string
  price: string
  description: string
  imageurl: string
}

export default function PriceList() {
  const [prices, setPrices] = useState<PriceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPrices()
  }, [])

  async function fetchPrices() {
    try {
      const { data, error } = await supabase
        .from('price_list')
        .select('*')
      
      if (error) {
        console.error('Error fetching prices:', error)
      } else {
        setPrices(data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-secondary/50">
        <CardHeader>
          <Skeleton className="h-8 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-secondary/50">
      <CardHeader className="space-y-4">
        <CardTitle className="text-4xl font-bold text-center text-primary">
          Our Services
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Choose from our range of professional services
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden group transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative">
                <Image 
                  src={`${SUPABASE_URL}/storage/v1/object/public/images/${item.imageurl}`}
                  alt={item.service} 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge 
                  className="absolute top-2 right-2 bg-primary/90 hover:bg-primary"
                >
                  Most Popular
                </Badge>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{item.service}</h3>
                  <p className="text-2xl font-bold text-primary">{item.price}</p>
                </div>
                
                <p className="text-muted-foreground">{item.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  variant="secondary"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}