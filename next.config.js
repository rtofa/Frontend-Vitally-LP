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
        source: '/api/:path*',
        // DESTINO FIXO (Endereço interno do Docker)
        destination: 'http://vitally-backend:8080/api/:path*', 
      },
    ];
  },
};

module.exports = nextConfig;