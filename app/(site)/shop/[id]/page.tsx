import { Suspense } from 'react';
import ProductDetail from '@/components/shop/ProductDetail';
import ProductJsonLd from '@/components/shop/ProductJsonLd';

export const metadata = {
  title: 'Detalhes do Produto — Vitally',
  description: 'Confira os detalhes completos do equipamento selecionado.',
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-72 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <ProductJsonLd productId={params.id} />
      <ProductDetail productId={params.id} />
    </Suspense>
  );
}
