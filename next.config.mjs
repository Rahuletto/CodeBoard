import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    MONGO: process.env['MONGO'],
    NEXT_PUBLIC_KEY: process.env['NEXT_PUBLIC_KEY'],
    NEXT_PUBLIC_ENCRPT: process.env['NEXT_PUBLIC_ENCRPT'],
  },
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
    return config;
  },

  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Rahuletto/CodeBoard',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/3JzDV9T5Fn',
        permanent: true,
      },
    ]
  },

};

export default million.next(nextConfig);
