/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzpkoivuzfexejxn.public.blob.vercel-storage.com',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
