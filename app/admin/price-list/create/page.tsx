'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from 'sweetalert2'


export default function AdminPriceList() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
  }, [])

  async function addPriceItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const newItem = {
      service: formData.get('service') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      imageurl: '' // Initialize as empty, will be set after upload
    }

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `price/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        Swal.fire('Error', 'Failed to upload file', 'error')
        setLoading(false)
        return
      }

      newItem.imageurl = filePath // Set the imageurl after successful upload
    }

    const { error } = await supabase
      .from('price_list')
      .insert(newItem)

    if (error) {
        Swal.fire('Error', 'Failed to add price item', 'error')
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Price item added successfully',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: 'ok'
        })
        if (formRef.current) {
            formRef.current.reset()
        }
        setFile(null) // Reset the file state
    }

    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

//   async function deletePriceItem(id: string) {
//     const { error } = await supabase
//       .from('price_list')
//       .delete()
//       .eq('id', id)

//     if (error) {
//       console.error('Error deleting price item:', error)
//     } else {
//       fetchPriceList() // Refresh the price list after deletion
//     }
//   }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Price List Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add Price Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPriceItem} className="space-y-4">
            <Input name="service" placeholder="Service Name" required />
            <Input name="price" placeholder="Price" required />
            <Textarea name="description" placeholder="Description" required />
            <Input name="image" type="file" onChange={handleFileChange} accept="image/*" required />
            <Button type="submit">{loading ? 'Loading...' : 'Add Price Item'}</Button>
          </form>
        </CardContent>
      </Card>
</div>
  )
}
        