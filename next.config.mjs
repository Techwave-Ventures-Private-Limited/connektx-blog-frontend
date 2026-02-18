/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Keep this to avoid the ESLint 9 conflict
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'connektx-blogs-backend.onrender.com',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`, 
      },
      {
        source: '/sitemap.xml',
        destination: `${backendUrl}/api/sitemap.xml`,
      }
    ]
  }
}

export default nextConfig;