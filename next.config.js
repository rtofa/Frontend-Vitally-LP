/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://vitally-backend:8080/api/v1/:path*', // Destino Docker fixo
      },
    ];
  },
};

module.exports = nextConfig;