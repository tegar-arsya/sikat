'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from 'sweetalert2'
import Image from 'next/image';
import { AllertCheck } from '@/components/AllertCheck';

interface PriceItem {
    id: string
    service: string
    price: string
    description: string
    imageurl: string
}

export default function AdminPriceList({ params }: { params: { id: string } }) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [priceList, setPriceList] = useState<PriceItem | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchPriceList()
        }
    }, [params])

    async function fetchPriceList() {
        const { data, error } = await supabase
            .from('price_list')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            Swal.fire('Error', 'Failed to fetch price list', 'error')
        } else {
            setPriceList(data || [])
        }
    }

    async function addPriceItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const UpdateData = {
            service: formData.get('service') as string,
            price: formData.get('price') as string,
            description: formData.get('description') as string,
            imageurl: priceList?.imageurl || '',
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

            UpdateData.imageurl = filePath
        }

        const { error } = await supabase
            .from('price_list')
            .update(UpdateData)
            .eq('id', params.id)

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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Price List Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Add Price Item</CardTitle>
                </CardHeader>
                <CardContent>
                    {priceList ? (
                        <form ref={formRef} onSubmit={addPriceItem} className="space-y-4">
                            <Input name="service" placeholder="Service Name" defaultValue={priceList.service} required />
                            <Input name="price" placeholder="Price" defaultValue={priceList.price} required />
                            <Textarea name="description" placeholder="Description" defaultValue={priceList.description} required />
                            <Input
                                name="image"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {priceList.imageurl && (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${priceList.imageurl}`}
                                    alt="Current Banner"
                                    width={400}
                                    height={200}
                                    className="w-40 h-40 object-cover"
                                />
                            )}
                            <Button type="submit">{loading ? 'Loading...' : 'Add Price Item'}</Button>
                        </form>
                    ) : (
                        <div className="w-96 h-64 md:h-96 animate-pulse flex items-center justify-center">
                            <AllertCheck />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
