'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { AllertCheck } from '@/components/AllertCheck';

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

export default function EditBanner({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBannerData();
    }
  }, [params]);

  async function fetchBannerData() {
    const { data, error } = await supabase
      .from('banner')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching banner data:', error);
      Swal.fire('Error', 'Failed to fetch banner data', 'error');
    } else {
      setBannerData(data);
    }
  }

  async function updateBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedItem = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image_url: bannerData?.image_url || '',
    };

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banner/${fileName}`;

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'File size exceeds 2MB', 'error');
        setLoading(false);
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        Swal.fire('Error', 'Invalid file type. Please upload an image.', 'error');
        setLoading(false);
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        Swal.fire('Error', 'Failed to upload file', 'error');
        setLoading(false);
        return;
      }

      updatedItem.image_url = filePath;
    }

    const { error } = await supabase
      .from('banner')
      .update(updatedItem)
      .eq('id', params.id);

    if (error) {
      console.error('Error updating banner:', error);
      Swal.fire('Error', 'Failed to update banner', 'error');
    } else {
      Swal.fire({
        title: 'Success!',
        text: 'Banner has been updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Banner</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Banner</CardTitle>
        </CardHeader>
        <CardContent>
          {bannerData ? (
            <form ref={formRef} onSubmit={updateBanner} className="space-y-4">
              <Input
                name="title"
                placeholder="Title"
                defaultValue={bannerData.title}
                required
              />
              <Input
                name="subtitle"
                placeholder="Subtitle"
                defaultValue={bannerData.subtitle}
                required
              />
              <Input
                name="image"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {bannerData.image_url && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${bannerData.image_url}`}
                  alt="Current Banner"
                  width={400}
                  height={200}
                  className="w-40 h-40 object-cover"
                />
              )}
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </form>
          ) : (
            <div className="w-96 h-64 md:h-96 animate-pulse flex items-center justify-center">
              <AllertCheck />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}