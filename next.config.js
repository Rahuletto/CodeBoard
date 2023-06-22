/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
        MONGO: process.env['MONGO']
    },
  webpack: {
    
    experiments: {
      topLevelAwait: true
    }
    
  },
}

module.exports = nextConfig
