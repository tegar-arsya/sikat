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
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2'
import { PaginationControls } from '@/components/Pagination'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
interface Gallery {
  id: string
  image: string
}


const ITEMS_PER_PAGE =  5

export default function GalleryList() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchGallery()
  }, [currentPage])

  async function fetchGallery() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)

    if (error) {
      Swal.fire('Error', 'Failed to fetch price list', 'error')
    } else {
        setGallery(data || [])
      setTotalPages(Math.ceil((data?.length || 0) / ITEMS_PER_PAGE))
    }
  }


  async function deleteGalleryItem(id: string) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting price item:', error)
    } else {
        fetchGallery() // Refresh the price list after deletion
    }
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery Management</h1>
      <Link href="/admin/gallery/create">
      <Button className="mt-4 items-end bg-sky-400">Create</Button>
    </Link>
      <Table>
        <TableCaption>List of banners</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>=
            <TableHead>Images</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(gallery) &&
            gallery.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>=
                <TableCell>
                  <Image
                    src={`${SUPABASE_URL}/storage/v1/object/public/images/${item.image}`}
                    alt={item.image}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </TableCell>
                <TableCell className="text-right">
                <Link href={`/admin/gallery/edit/${item.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                <Button onClick={() => deleteGalleryItem(item.id)} variant="destructive">Delete</Button>
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
  );
}
        