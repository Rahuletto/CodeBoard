/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    MONGO: process.env['MONGO'],
    NEXT_PUBLIC_KEY: process.env['NEXT_PUBLIC_KEY'],
    NEXT_PUBLIC_ENCRPT: process.env['NEXT_PUBLIC_ENCRPT']
  },
  runtime: 'edge',
  webpack: {
    experiments: {
      topLevelAwait: true
    }
  },
}

module.exports = nextConfig
