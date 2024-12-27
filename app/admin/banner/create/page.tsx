'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from 'sweetalert2'

export default function CreateBanner() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement | null>(null) // Create a ref for the form

    useEffect(() => {
        // Fetching banner data can be removed if not used
    }, [])

    async function addBanner(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true) // Start loading

        const formData = new FormData(e.currentTarget)
        const newItem = {
            title: formData.get('title') as string,
            subtitle: formData.get('subtitle') as string,
            image_url: '' // Initialize as empty, will be set after upload
        }

        if (file) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `banner/${fileName}`

            // Validate file type and size (example: max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire('Error', 'File size exceeds 2MB', 'error')
                setLoading(false)
                return
            }

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) {
                console.error('Error uploading file:', uploadError)
                Swal.fire('Error', 'Failed to upload file', 'error')
                setLoading(false)
                return
            }

            newItem.image_url = filePath // Set the image URL after successful upload
        }

        const { error } = await supabase
            .from('banner')
            .insert(newItem)

        if (error) {
            console.error('Error adding banner item:', error)
            Swal.fire('Error', 'Failed to add banner item', 'error')
        } else {
            Swal.fire({
                title: 'Thank You!',
                text: 'Your Banner has been submitted successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            })
            if (formRef.current) {
                formRef.current.reset() // Reset the form fields using the ref
            }
            setFile(null) // Reset the file state
        }
        setLoading(false) // End loading
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
                    <form ref={formRef} onSubmit={addBanner} className="space-y-4">
                        <Input name="title" placeholder="Title" required />
                        <Input name="subtitle" placeholder="Subtitle" required />
                        <Input name="image" type="file" onChange={handleFileChange} accept="image/*" required />
                        <Button type="submit" disabled={loading}>
                            {loading ? ' Loading...' : 'Submit'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}