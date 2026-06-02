'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategories } from '@/lib/services/categories';
import type { Category } from '@/lib/api-types';

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCategories(0, 100);
        if (!active) return;
        setCategories(data.content.filter((category: Category) => (category.isActive ?? category.active) !== false));
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8; // Scroll 80% of container width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!loading && !error && categories.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 py-12 sm:py-20 max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex items-end justify-between mb-6 sm:mb-10">
        <div>
          <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            Nossas Categorias
          </span>
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Navegue por <span className="text-gradient">Categoria</span>
          </h2>
        </div>
        
        {/* Navigation Arrows */}
        <div className="hidden sm:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`category-skeleton-${index}`}
              className="glass-card rounded-2xl animate-pulse min-w-[280px] h-[350px] sm:h-[400px] shrink-0"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass-card rounded-2xl p-6 text-white/60 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.name}`}
              className="relative overflow-hidden rounded-2xl group cursor-pointer shrink-0 snap-start w-[260px] sm:w-[280px] md:w-[320px] h-[350px] sm:h-[400px]"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="block text-white font-black text-xl md:text-2xl leading-tight mb-2">
                  {cat.name}
                </span>
                <span className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  Explorar <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Estilo para esconder a barra de rolagem em Webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
