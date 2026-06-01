'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Grid3x3 as Grid3X3, LayoutGrid } from 'lucide-react';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import type { ApiProduct, Category } from '@/lib/api-types';
import ProductCard from './ProductCard';

const PRODUCTS_PER_PAGE = 9;

type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price-asc', label: 'Preço: menor para maior' },
  { value: 'price-desc', label: 'Preço: maior para menor' },
];

type FilterState = {
  categories: string[];
  priceRange: [number, number];
};

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/6 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-white text-sm font-semibold">{title}</span>
        {open ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function ShopClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 0],
  });
  const [sort, setSort] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
  });

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (!active) return;
        setProducts(productsData);
        setCategories(categoriesData.filter((category) => category.active !== false));
      } catch (err) {
        if (active) setError('Não foi possível carregar o catálogo.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const priceStats = useMemo(() => {
    const prices = products.map((product) => product.price).filter((price) => typeof price === 'number');
    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  useEffect(() => {
    if (priceStats.max > 0 && filters.priceRange[1] === 0) {
      setFilters((prev) => ({ ...prev, priceRange: [priceStats.min, priceStats.max] }));
    }
  }, [priceStats, filters.priceRange]);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (value: string) => {
    setFilters((prev) => {
      const categories = prev.categories;
      return {
        ...prev,
        categories: categories.includes(value)
          ? categories.filter((item) => item !== value)
          : [...categories, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({ categories: [], priceRange: [priceStats.min, priceStats.max] });
  };

  const priceFilterActive =
    priceStats.max > 0 &&
    (filters.priceRange[0] > priceStats.min || filters.priceRange[1] < priceStats.max);

  const activeFilterCount = filters.categories.length + (priceFilterActive ? 1 : 0);

  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.categories.length > 0) {
      list = list.filter((product) => {
        const categoryName = typeof product.category === 'string'
          ? product.category
          : product.category?.name;
        return categoryName ? filters.categories.includes(categoryName) : false;
      });
    }
    if (filters.priceRange[1] > 0) {
      list = list.filter(
        (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => {
          const aId = typeof a.id === 'number' ? a.id : Number(a.id) || 0;
          const bId = typeof b.id === 'number' ? b.id : Number(b.id) || 0;
          return bId - aId;
        });
        break;
    }
    return list;
  }, [filters, sort, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const Sidebar = (
    <aside className="w-full flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-white/6">
        <span className="text-white font-bold text-sm uppercase tracking-wider">Filtros</span>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors">
            Limpar filtros ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Active filters chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filters.categories.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-500/25 transition-colors"
              onClick={() => {
                toggleCategory(f);
              }}
            >
              {f} <X size={10} />
            </span>
          ))}
          {priceFilterActive && (
            <span
              className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-500/25 transition-colors"
              onClick={() => setFilters((prev) => ({ ...prev, priceRange: [priceStats.min, priceStats.max] }))}
            >
              R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]} <X size={10} />
            </span>
          )}
        </div>
      )}

      {/* Categories */}
      <FilterSection title="Category" open={openSections.categories} onToggle={() => toggleSection('categories')}>
        <div className="flex flex-col gap-1">
          {loading && (
            <span className="text-white/40 text-xs">Carregando categorias...</span>
          )}
          {!loading && categories.length === 0 && (
            <span className="text-white/40 text-xs">Nenhuma categoria encontrada.</span>
          )}
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleCategory(cat.name)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  filters.categories.includes(cat.name)
                    ? 'bg-amber-500 border-amber-500'
                    : 'border-white/20 group-hover:border-white/40'
                }`}
              >
                {filters.categories.includes(cat.name) && (
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-black fill-current">
                    <path d="M10 3L5 8.5L2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat.name)}
                className={`text-sm transition-colors ${
                  filters.categories.includes(cat.name) ? 'text-white font-medium' : 'text-white/55 group-hover:text-white/80'
                }`}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Faixa de preço" open={openSections.price} onToggle={() => toggleSection('price')}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>R$ {filters.priceRange[0]}</span>
            <span>R$ {filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={priceStats.min}
            max={priceStats.max}
            step={10}
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))
            }
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </FilterSection>
    </aside>
  );

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-10">
      {/* Page header */}
      <div className="mb-5 sm:mb-8">
        <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 block">Todos os equipamentos</span>
        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
          Comprar <span className="text-gradient">equipamentos</span>
        </h1>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-24">
            {Sidebar}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
            {/* Mobile filter toggle */}
            <button
              className="lg:hidden flex items-center gap-1.5 sm:gap-2 glass border border-white/10 rounded-full px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm text-white/70 hover:text-white transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={13} className="sm:w-3.5 sm:h-3.5" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-black text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-white/40 text-xs sm:text-sm hidden sm:block">
              {loading ? 'Carregando...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              {/* Grid toggle */}
              <div className="hidden sm:flex glass border border-white/8 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCompact(false)}
                  className={`p-2 transition-colors ${!compact ? 'bg-amber-500/20 text-amber-400' : 'text-white/40 hover:text-white/70'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setCompact(true)}
                  className={`p-2 transition-colors ${compact ? 'bg-amber-500/20 text-amber-400' : 'text-white/40 hover:text-white/70'}`}
                >
                  <Grid3X3 size={16} />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="glass border border-white/10 rounded-full px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm text-white/80 bg-transparent outline-none cursor-pointer appearance-none pr-7 sm:pr-8 focus:border-amber-500/40 transition-all"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-neutral-900 text-white">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                <div key={`product-skeleton-${index}`} className="glass-card rounded-xl sm:rounded-2xl h-[240px] sm:h-[320px] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-6 sm:p-10 text-center text-white/60 text-xs sm:text-sm">
              {error}
            </div>
          ) : paginated.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 sm:p-16 text-center">
              <p className="text-white/40 text-base sm:text-lg font-medium mb-2">Nenhum equipamento encontrado</p>
              <p className="text-white/25 text-xs sm:text-sm">Tente ajustar os filtros</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-medium transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-4 ${compact ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 sm:px-4 h-8 sm:h-9 glass border border-white/10 rounded-full text-xs sm:text-sm text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">←</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === page;
                const isNear = Math.abs(pageNum - page) <= 1;
                if (!isNear && pageNum !== 1 && pageNum !== totalPages) return null;
                if (!isNear && (pageNum === 2 || pageNum === totalPages - 1))
                  return (
                    <span key={`ellipsis-${i}`} className="text-white/30 px-0.5 sm:px-1 text-xs">
                      ...
                    </span>
                  );
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-black font-bold'
                        : 'glass border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 sm:px-4 h-8 sm:h-9 glass border border-white/10 rounded-full text-xs sm:text-sm text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Próxima</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-neutral-950/98 border-l border-white/8 overflow-y-auto p-5 animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-bold text-lg">Filtros</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/8">
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full h-11 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-all"
            >
              Ver {filtered.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
