'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaginationControls } from '@/components/Pagination'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
}

const ITEMS_PER_PAGE = 10

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [currentPage])

  async function fetchReviews() {
    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
    
    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      setReviews(data || [])
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
    }
  }

  async function deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting review:', error)
    } else {
      fetchReviews()
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Review Management</h1>
      <Table>
        <TableCaption>List of Reviews</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(reviews) &&
            reviews.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.rating}</TableCell>
                <TableCell>{item.comment}</TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => deleteReview(item.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

