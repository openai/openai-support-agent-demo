import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'automationghana.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'automationghana.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'store.automationghana.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'store.automationghana.com',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['https://jwpai.uk', 'http://jwpai.uk', 'https://jwpai.uk:443', 'http://jwpai.uk:80'],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(process.cwd()),
    };

    return config;
  },
};

export default nextConfig;
