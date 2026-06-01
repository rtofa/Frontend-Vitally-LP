"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/services/categories';
import type { Category } from '@/lib/api-types';

export default function CategoryBanner() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories();
        if (!active) return;
        setCategories(data.filter((category) => category.active !== false));
      } catch (err) {
        if (active) setError('Não foi possível carregar as categorias.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const visibleCategories = categories.slice(0, 5);

  return (
    <section className="relative z-10 py-8 sm:py-10 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="mb-6 sm:mb-10">
        <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
          Equipamentos
        </span>
        <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
          Compre por <span className="text-gradient">categoria</span>
        </h2>
      </div>

      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className={`glass-card rounded-xl sm:rounded-2xl animate-pulse h-[140px] sm:h-[200px] lg:h-[260px] ${index === 0 ? 'col-span-2 row-span-2 !h-[290px] sm:!h-[410px] lg:!h-[530px]' : ''}`}
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass-card rounded-2xl p-6 text-white/60 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && visibleCategories.length === 0 && (
        <div className="glass-card rounded-2xl p-6 text-white/60 text-sm">
          Nenhuma categoria disponível ainda.
        </div>
      )}

      {!loading && !error && visibleCategories.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-[auto] lg:grid-rows-2 gap-3 sm:gap-4">
          {visibleCategories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.name}`}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl group cursor-pointer ${
                i === 0 
                  ? 'col-span-2 row-span-1 lg:row-span-2 h-[200px] sm:h-[300px] lg:h-full' 
                  : 'h-[140px] sm:h-[200px] lg:h-auto'
              }`}
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 via-black/40 to-black/80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <span className="block text-white font-black text-base sm:text-lg md:text-xl leading-none mb-1 sm:mb-1.5">
                  {cat.name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Ver {cat.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
