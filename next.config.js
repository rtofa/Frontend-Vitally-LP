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
        // Garanta que o source corresponde ao prefixo que o seu frontend usa
        source: '/api/v1/:path*', 
        // O DESTINO deve ser o endereço HTTP interno dentro do Docker
        destination: 'http://vitally-backend:8080/api/v1/:path*', 
      },
    ];
  },
};

  module.exports = nextConfig;