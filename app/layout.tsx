import './globals.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { formatJsonLd } from "@/lib/jsonHelper";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sikat Shoe Cleaning',
  description: 'Layanan pembersihan sepatu profesional untuk menghidupkan kembali sepatu Anda.',
  openGraph: {
    title: 'Sikat Shoe Cleaning',
    description: 'Layanan pembersihan sepatu profesional untuk menghidupkan kembali sepatu Anda.',
    url: 'https://Sikat.vercel.app',
    siteName: 'Sikat Shoe Cleaning',
    images: [
      {
        url: 'https://jtvrfxldycmyztieusdd.supabase.co/storage/v1/object/public/images/banner/kat.png',
        width: 800,
        height: 600,
        alt: 'Sikat Shoe Cleaning',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sikat Shoe Cleaning',
    description: 'Layanan pembersihan sepatu profesional untuk menghidupkan kembali sepatu Anda.',
    images: [
      {
        url: 'https://jtvrfxldycmyztieusdd.supabase.co/storage/v1/object/public/images/banner/kat.png', 
        width: 800,
        height: 600,
        alt: 'Sikat Shoe Cleaning',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sikat Shoe Cleaning",
    "description": "Layanan pembersihan sepatu profesional untuk menghidupkan kembali sepatu Anda.",
    "url": "https://Sikat.vercel.app",
    "sameAs": [
      "https://www.linkedin.com/in/tegar-arsyadani",
      "https://www.instagram.com/tegar_arsya",
      "https://wa.me/6281353677822"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Address Here",
      "addressLocality": "Your City",
      "addressRegion": "Your Province",
      "postalCode": "Your Postal Code",
      "addressCountry": "ID"
    },
    "telephone": "+62 813-5367-7822",
    "image": "https://jtvrfxldycmyztieusdd.supabase.co/storage/v1/object/public/images/banner/kat.png",
    "openingHours": "Mo-Su 09:00-20:00"
  };
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      <link rel="canonical" href="https://katsikat.vercel.app" />
      <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: formatJsonLd(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
