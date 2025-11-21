/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://oavvpnylvlibcnywswii.supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig