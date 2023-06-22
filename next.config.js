/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
        MONGO: process.env['MONGO'],
        KEY: process.env['KEY'],
        ENCRPT: process.env['ENCRPT']
    },
  webpack: {
    
    experiments: {
      topLevelAwait: true
    }
    
  },
}

module.exports = nextConfig
