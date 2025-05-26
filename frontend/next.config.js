/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Pastikan output: 'standalone' tidak digunakan karena dapat menyebabkan masalah dengan CSS
  // output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`  // Hapus /api di sini
        : "https://v0-pneu-scope-production.up.railway.app/:path*",
      {
        source: "/ml/:path*",
        destination: process.env.NEXT_PUBLIC_ML_SERVICE_URL
          ? `${process.env.NEXT_PUBLIC_ML_SERVICE_URL}/ml/:path*`
          : "http://localhost:5000/:path*",
      },
    ]
  },
}

module.exports = nextConfig
