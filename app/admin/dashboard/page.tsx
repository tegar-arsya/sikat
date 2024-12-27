'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [priceListCount, setPriceListCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    // Fetch price list count
    const { count: priceListCount, error: priceListError } = await supabase
      .from('price_list')
      .select('*', { count: 'exact', head: true })

    if (priceListError) {
      console.error('Error fetching price list count:', priceListError)
    } else {
      setPriceListCount(priceListCount || 0)
    }

    // Fetch review count and average rating
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('rating')

    if (reviewError) {
      console.error('Error fetching reviews:', reviewError)
    } else {
      setReviewCount(reviewData.length)
      const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0)
      setAverageRating(reviewData.length > 0 ? totalRating / reviewData.length : 0)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{priceListCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reviewCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

