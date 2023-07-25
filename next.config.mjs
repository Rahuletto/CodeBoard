/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/fetch',
        destination: '/api/fetch',
      },
      {
        source: '/save',
        destination: '/api/save',
      },
      {
        source: '/ping',
        destination: '/api/ping',
      },
      {
        source: '/teapot',
        destination: '/api/teapot',
      },
    ];
  },
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
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
      {
        source: '/email',
        destination: 'mailto:support@codeboard.tech',
        permanent: true,
      },
      {
        source: '/support',
        destination: 'https://discord.gg/3JzDV9T5Fn',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
