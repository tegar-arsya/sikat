/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'jtvrfxldycmyztieusdd.supabase.co',
          pathname: '**',
        },
      ],
      // Menonaktifkan Image Optimization untuk mendukung static export
      unoptimized: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  