'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/services/products';
import type { ApiProduct } from '@/lib/api-types';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);

interface ProductGridSectionProps {
  title: React.ReactNode;
  subtitle: string;
  categoryFilterName: string;
}

export default function ProductGridSection({ title, subtitle, categoryFilterName }: ProductGridSectionProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getProducts();
        if (!active) return;
        
        // Filtro 1: Apenas produtos ativos usando o fallback seguro (isActive ?? active)
        const activeProducts = data.filter(p => (p.isActive ?? p.active) !== false);
        
        // Filtro 2: Filtragem iterativa pela categoria requisitada
        const filtered = activeProducts.filter(p => {
          const catName = typeof p.category === 'string' ? p.category : p.category?.name;
          return catName?.toLowerCase() === categoryFilterName.toLowerCase();
        });
        
        setProducts(filtered.slice(0, 8)); // Pega os primeiros 8 para fechar o grid 4x2
      } catch (err) {
        if (!active) return;
        setError('Não foi possível carregar os produtos agora.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [categoryFilterName]);

  return (
    <section className="relative z-10 py-12 sm:py-20 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div>
          <span className="text-[#39FF14] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2 block">
            {subtitle}
          </span>
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none">
            {title}
          </h2>
        </div>
        <Link
          href={`/shop?category=${categoryFilterName}`}
          className="flex items-center gap-2 text-white/50 hover:text-[#39FF14] text-xs sm:text-sm font-medium transition-colors group"
        >
          Ver todos
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="glass-card rounded-xl sm:rounded-2xl h-[240px] sm:h-[320px] animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass-card rounded-2xl p-6 text-white/70 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <p className="text-white/60 text-sm sm:text-base">
            Não foi possível carregar os produtos agora ou não há lançamentos.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {products.map((product) => {
            const name = product.productName ?? product.name ?? 'Produto';
            const description = product.productDescription ?? product.description ?? '';
            const imageUrl = product.imageUrl || product.image || '';
            const categoryName =
              typeof product.category === 'string'
                ? product.category
                : product.category?.name ?? '';
            return (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group relative flex flex-col glass-card rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 hover:border-white/14"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-white/3">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
                {categoryName && (
                  <span className="text-[#39FF14]/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                    {categoryName}
                  </span>
                )}
                <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-2">
                  {name}
                </h3>
                {description && (
                  <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed line-clamp-2 hidden sm:block">
                    {description}
                  </p>
                )}
                {(product.price != null || typeof product.inStock === 'boolean') && (
                <div className="flex items-center justify-between mt-1 sm:mt-2 pt-2 sm:pt-3 border-t border-white/5">
                  {product.price != null && (
                    <span className="text-white font-bold text-sm sm:text-base">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  {typeof product.inStock === 'boolean' && (
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                        product.inStock ? 'text-[#39FF14]' : 'text-rose-400'
                      }`}
                    >
                      {product.inStock ? 'Em estoque' : 'Sem estoque'}
                    </span>
                  )}
                </div>
                )}
              </div>
            </Link>
          );
          })}
        </div>
      )}
    </section>
  );
}
