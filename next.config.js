// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    swcMinify: true,
  },
  images: {
    domains: ['static1.e621.net'],
  },
}

module.exports = nextConfig
