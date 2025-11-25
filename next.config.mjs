/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  allowedDevOrigins: isDev
    ? [
        process.env.REPLIT_DEV_DOMAIN || null,
        'localhost:5000',
        '127.0.0.1:5000',
      ].filter(Boolean)
    : [],
}

export default nextConfig
