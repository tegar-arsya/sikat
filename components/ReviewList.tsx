'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const supabase = createClientComponentClient()

interface Review {
  id: number
  name: string
  rating: number
  comment: string
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching reviews:', error)
      } else {
        setReviews(data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-background">
        <CardHeader>
          <Skeleton className="h-8 w-64 mx-auto" />
        </CardHeader>
        <CardContent className="px-8 py-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-background">
        <CardContent className="p-6 text-center text-muted-foreground">
          No reviews available yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-background">
      <CardHeader className="space-y-4">
        <CardTitle className="text-4xl font-bold text-center text-primary">
          Customer Reviews
        </CardTitle>
        <p className="text-center text-muted-foreground">
          What our customers say about us
        </p>
      </CardHeader>
      
      <CardContent className="px-8 py-6">
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="rounded-full hover:bg-primary/10"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </div>
          
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="rounded-full hover:bg-primary/10"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Review Content */}
          <div className="overflow-hidden px-4">
            <div 
              className="transition-all duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              <div className="flex">
                {reviews.map((review) => (
                  <div 
                    key={review.id}
                    className="w-full flex-shrink-0 px-8"
                    style={{ width: '100%' }}
                  >
                    <div className="space-y-6">
                      {/* Quote Icon */}
                      <div className="flex justify-center">
                        <Quote className="h-12 w-12 text-primary/20" />
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-lg text-center text-muted-foreground italic min-h-[100px]">
                        {review.comment}
                      </p>
                      
                      {/* Reviewer Info */}
                      <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary text-xl">
                            {getInitials(review.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="text-center">
                          <p className="font-semibold text-lg">{review.name}</p>
                          <div className="flex gap-1 justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className={`w-2 h-2 rounded-full p-0 ${
                  currentIndex === i 
                    ? 'bg-primary' 
                    : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}