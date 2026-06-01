import { Suspense } from 'react';
import ShopClient from '@/components/shop/ShopClient';

export const metadata = {
  title: 'Loja — Vitally',
  description: 'Explore a coleção completa de equipamentos de academia e essenciais de treino.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="text-white/40 text-sm animate-pulse">Carregando equipamentos...</div>
      </div>
    }>
      <ShopClient />
    </Suspense>
  );
}
