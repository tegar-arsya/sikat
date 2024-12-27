'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
import { Button } from "@/components/ui/button"
import Link from 'next/link';

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function AdminBanner() {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);

  useEffect(() => {
    fetchBannerData();
  }, []);

  async function fetchBannerData() {
    const { data, error } = await supabase.from('banner').select('*');
    if (error) {
      console.error('Error fetching banner data:', error);
    } else {
      setBannerData(data || []); // Set default to empty array
    }
  }
  async function DeleteBanner(id: string) {
    const { error } = await supabase
      .from('banner')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting price item:', error)
    } else {
      fetchBannerData() // Refresh the price list after deletion
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Banner Management</h1>
      <Link href="/admin/banner/create">
      <Button className="mt-4 items-end bg-sky-400">Create</Button>
    </Link>
      <Table>
        <TableCaption>List of banners</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Subtitle</TableHead>
            <TableHead>Images</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(bannerData) &&
            bannerData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.subtitle}</TableCell>
                <TableCell>
                  <Image
                    src={`${SUPABASE_URL}/storage/v1/object/public/images/${item.image_url}`}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                </TableCell>
                <TableCell className="text-right">
                <Link href={`/admin/banner/edit/${item.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                <Button onClick={() => DeleteBanner(item.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
