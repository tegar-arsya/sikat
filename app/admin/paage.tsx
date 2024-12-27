'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BannerData {
  id: string
  title: string
  subtitle: string
  image_url: string
}

interface PriceItem {
  id: string
  service: string
  price: string
  description: string
  imageUrl: string
}

export default function AdminPage() {
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [priceList, setPriceList] = useState<PriceItem[]>([])

  useEffect(() => {
    fetchBannerData()
    fetchPriceList()
  }, [])

  async function fetchBannerData() {
    const { data, error } = await supabase
      .from('banner')
      .select('*')
      .single()
    
    if (error) {
      console.error('Error fetching banner data:', error)
    } else {
      setBannerData(data)
    }
  }

  async function fetchPriceList() {
    const { data, error } = await supabase
      .from('price_list')
      .select('*')
    
    if (error) {
      console.error('Error fetching price list:', error)
    } else {
      setPriceList(data)
    }
  }

  async function updateBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedBanner = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image_url: formData.get('image_url') as string,
    }

    const { error } = await supabase
      .from('banner')
      .update(updatedBanner)
      .eq('id', bannerData?.id)

    if (error) {
      console.error('Error updating banner:', error)
    } else {
      fetchBannerData()
    }
  }

  async function addPriceItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem = {
      service: formData.get('service') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
    }

    const { error } = await supabase
      .from('price_list')
      .insert(newItem)

    if (error) {
      console.error('Error adding price item:', error)
    } else {
      fetchPriceList()
      e.currentTarget.reset()
    }
  }

  async function deletePriceItem(id: string) {
    const { error } = await supabase
      .from('price_list')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting price item:', error)
    } else {
      fetchPriceList()
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateBanner} className="space-y-4">
            <Input name="title" placeholder="Title" defaultValue={bannerData?.title} />
            <Input name="subtitle" placeholder="Subtitle" defaultValue={bannerData?.subtitle} />
            <Input name="image_url" placeholder="Image URL" defaultValue={bannerData?.image_url} />
            <Button type="submit">Update Banner</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Price Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPriceItem} className="space-y-4">
            <Input name="service" placeholder="Service Name" required />
            <Input name="price" placeholder="Price" required />
            <Textarea name="description" placeholder="Description" required />
            <Input name="imageUrl" placeholder="Image URL" required />
            <Button type="submit">Add Price Item</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {priceList.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.service} - {item.price}</span>
                <Button onClick={() => deletePriceItem(item.id)} variant="destructive">Delete</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

