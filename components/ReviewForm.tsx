'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2, User, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Swal from 'sweetalert2'


export default function ReviewForm() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const supabase = createClientComponentClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (rating === 0) {
      Swal.fire({
        title: 'Rating Required',
        text: 'Please select a rating before submitting',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{ name, rating, comment }])
      
      if (error) throw error

      Swal.fire({
        title: 'Thank You!',
        text: 'Your review has been submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })

      // Reset form
      setName('')
      setRating(0)
      setComment('')
      
    } catch (error) {
      console.error('Error submitting review:', error)
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem submitting your review. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingLabels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-12 bg-background/50 backdrop-blur">
      <CardHeader className="space-y-3">
        <CardTitle className="text-4xl font-bold text-center text-primary">
          Share Your Experience
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Your feedback helps us improve our services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Your Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 text-base"
                placeholder="Enter your name"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>

          {/* Rating Input */}
          <div className="space-y-2">
            <Label className="text-base">Your Rating</Label>
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {ratingLabels[hoveredRating || rating as keyof typeof ratingLabels]}
                </p>
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base">
              Your Review
            </Label>
            <div className="relative">
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="min-h-[120px] pl-10 text-base resize-none"
                placeholder="Tell us about your experience..."
              />
              <MessageSquare className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full text-base font-medium"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}