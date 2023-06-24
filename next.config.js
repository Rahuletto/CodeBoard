/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    MONGO: process.env['MONGO'],
    KEY: process.env['NEXT_PUBLIC_KEY'],
    ENCRPT: process.env['NEXT_PUBLIC_ENCRPT']
  },
  experimental: {
    runtime: 'edge',
  },
  webpack: {
    experiments: {
      topLevelAwait: true
    }
  },
}

module.exports = nextConfig
