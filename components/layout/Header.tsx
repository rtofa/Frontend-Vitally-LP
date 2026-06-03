'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from '@/lib/services/categories';
import type { Category } from '@/lib/api-types';
import { useCart } from '@/components/cart/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();

  // SSR Safe Default - Renderiza 6 no servidor para evitar Hydration Mismatch
  const [visibleCount, setVisibleCount] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const itemWidths = useRef<number[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories(0, 100);
        if (!active) return;
        setCategories(data.content.filter((category: Category) => (category.isActive ?? category.active) !== false));
      } catch (error) {
        if (active) setCategories([]);
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Medição do Menu Fantasma (Executa quando as categorias carregam)
  useEffect(() => {
    if (categories.length > 0 && ghostRef.current) {
      const children = Array.from(ghostRef.current.children) as HTMLElement[];
      itemWidths.current = children.map(child => child.offsetWidth);
    }
  }, [categories]);

  // Priority+ Navigation Cálculo (Resize Observer com Debounce / RAF)
  useEffect(() => {
    if (typeof window === 'undefined' || itemWidths.current.length === 0) return;

    let rafId: number;

    const calculateVisibleItems = (containerWidth: number) => {
      // Largura estimada: Botão "+ Categorias" (~120px) + "TODOS NOSSOS PRODUTOS" (~180px) + flex gaps = ~320px
      const bufferSpace = 320; 
      let availableSpace = containerWidth - bufferSpace;
      let count = 0;

      for (let i = 0; i < itemWidths.current.length; i++) {
        const itemWidth = itemWidths.current[i];
        // Considera o gap-6 (24px) do flexbox para cada item extra
        const spaceNeeded = i === 0 ? itemWidth : itemWidth + 24; 
        
        if (availableSpace >= spaceNeeded) {
          availableSpace -= spaceNeeded;
          count++;
        } else {
          break;
        }
      }

      // Se der pra caber todos com o espaço do botão de dropdown sobrando, exibe todos
      if (count >= categories.length) {
        setVisibleCount(categories.length);
      } else {
        setVisibleCount(Math.max(1, count)); // Sempre garante no mínimo 1
      }
    };

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          calculateVisibleItems(entry.contentRect.width);
        });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      // Força cálculo imediato na montagem
      calculateVisibleItems(containerRef.current.offsetWidth);
    }

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [categories]);

  const visibleCategories = categories.slice(0, visibleCount);
  const hiddenCategories = categories.slice(visibleCount);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Menu Fantasma para Medição de Largura */}
      <div 
        ref={ghostRef} 
        className="absolute top-0 left-0 opacity-0 pointer-events-none invisible flex gap-6"
        aria-hidden="true"
      >
        {categories.map(cat => (
          <div key={`ghost-${cat.id}`} className="text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap">
            {cat.name}
          </div>
        ))}
      </div>

      {/* Announcement bar */}
      <div className="bg-amber-500 text-black text-[10px] sm:text-xs font-semibold text-center py-1.5 sm:py-2 px-4 tracking-widest uppercase leading-tight">
        Entrega grátis acima de R$1999 &nbsp;|&nbsp; Código&nbsp;
        <span className="underline cursor-pointer">LUMINA20</span>
        &nbsp;para 20% off
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/60'
            : 'bg-black/70 backdrop-blur-lg'
        } border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Tier 1: Top Bar */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <img
                src="/Logo/Vitally%20-%20Logotipo%20Branca.svg"
                alt="Vitally"
                className="h-6 sm:h-8 w-auto"
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
              <div className="flex items-center bg-white/8 border border-white/10 rounded-full px-5 h-11 w-full gap-3 focus-within:border-amber-500/60 focus-within:bg-white/10 transition-all">
                <Search size={16} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar equipamentos..."
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <button
                className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={18} />
              </button>

              <Link
                href="/contato"
                className="hidden md:inline-flex items-center h-10 px-5 rounded-full border border-[#39FF14]/40 text-[#39FF14] text-xs font-bold uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-colors"
              >
                Fale Conosco
              </Link>

              <Link
                href="/carrinho"
                className="relative p-2.5 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={20} className="sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 h-4.5 min-w-[18px] px-1 rounded-full bg-[#39FF14] text-black text-[10px] font-bold flex items-center justify-center border-2 border-black">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Tier 2: Bottom Bar (Priority+ Navigation) */}
          <div 
            ref={containerRef}
            className="hidden lg:flex items-center gap-6 h-12 border-t border-white/5 relative z-40"
          >
            {visibleCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.name}`}
                className="text-[13px] font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap tracking-wide uppercase flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}

            {hiddenCategories.length > 0 && (
              <div className="relative group h-full flex items-center flex-shrink-0">
                <button className="flex items-center gap-1.5 text-[13px] font-semibold text-white/70 hover:text-white transition-colors h-full tracking-wide uppercase">
                  + Categorias <ChevronDown size={14} />
                </button>
                <div className="absolute top-full right-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right group-hover:translate-y-0 translate-y-1">
                  <div className="bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-xl p-2 shadow-2xl shadow-black overflow-hidden">
                    {hiddenCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.name}`}
                        className="block px-4 py-2.5 text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors truncate tracking-wide"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1" /> {/* Spacer dinâmico */}
            
            <Link
              href="/shop"
              className="text-[13px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest flex items-center h-full flex-shrink-0"
            >
              Todos nossos produtos
            </Link>
          </div>

          {/* Mobile search expanded */}
          {searchOpen && (
            <div className="md:hidden pb-4">
              <div className="flex items-center bg-white/8 border border-white/10 rounded-full px-4 h-11 gap-3 focus-within:border-amber-500/60 transition-all">
                <Search size={16} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar equipamentos..."
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu - fullscreen overlay */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 top-0 z-50 flex flex-col">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setMenuOpen(false)} />
            <div className="relative ml-auto w-[85%] max-w-sm h-full bg-neutral-950/98 border-l border-white/8 overflow-y-auto animate-slide-in-right">
              <div className="flex items-center justify-between p-4 border-b border-white/8">
                <span className="text-white font-bold text-lg">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/8">
                  <X size={22} />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.name}`}
                    className="px-4 py-3.5 text-base text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className="px-4 py-3.5 text-base text-amber-400 font-bold hover:bg-white/5 rounded-xl transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Todos nossos produtos
                </Link>
                <div className="border-t border-white/8 mt-4 pt-4 flex flex-col gap-1">
                  <Link
                    href="/carrinho"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all"
                  >
                    <ShoppingBag size={18} /> Sacola
                  </Link>
                  <Link
                    href="/contato"
                    onClick={() => setMenuOpen(false)}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-all"
                  >
                    Atendimento
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
