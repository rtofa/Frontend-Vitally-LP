'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (!active) return;
        setCategories(data.filter((category) => category.active !== false));
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
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
          <div className="flex items-center justify-between h-12 sm:h-16 gap-3 sm:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <img
                src="/Logo/Vitally%20-%20Logotipo%20Branca.svg"
                alt="Vitally"
                className="h-6 sm:h-8 w-auto"
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.name}`}
                  className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all duration-150 whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-white/5 rounded-md transition-all duration-150 font-medium"
              >
                Ofertas
              </Link>
            </div>

            {/* Search + icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Desktop search bar */}
              <div className="hidden md:flex items-center bg-white/8 border border-white/10 rounded-full px-4 h-9 gap-2 focus-within:border-amber-500/60 focus-within:bg-white/10 transition-all w-48 xl:w-64">
                <Search size={14} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar equipamentos..."
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                />
              </div>

              {/* Mobile search toggle */}
              <button
                className="md:hidden p-2 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={18} />
              </button>

              <Link
                href="/contato"
                className="hidden md:inline-flex items-center h-9 px-4 rounded-full border border-[#39FF14]/40 text-[#39FF14] text-xs font-semibold uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-colors"
              >
                Contato
              </Link>

              <Link
                href="/carrinho"
                className="relative p-2 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#39FF14] text-black text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/8 rounded-full transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="flex items-center bg-white/8 border border-white/10 rounded-full px-4 h-10 gap-2 focus-within:border-amber-500/60 transition-all">
                <Search size={14} className="text-white/40 shrink-0" />
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
                    className="px-4 py-3.5 text-base text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className="px-4 py-3.5 text-base text-amber-400 font-medium hover:bg-white/5 rounded-xl transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Ofertas
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
                    Contato
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
