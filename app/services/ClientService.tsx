"use client";

import { Navbar } from '@/components/Navbar'
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from 'next/navigation'

export default function ClientService({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      <Toaster />
    </div>
  )
}
