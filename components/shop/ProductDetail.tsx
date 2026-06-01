'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';
import { getProduct, getProducts } from '@/lib/services/products';
import type { ApiProduct } from '@/lib/api-types';
import { useCart } from '@/components/cart/CartContext';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatInstallment = (value: number, installments: number = 12) => {
  const installmentValue = value / installments;
  return `${installments}x de ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(installmentValue)} sem juros`;
};

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [productData, allProducts] = await Promise.all([
          getProduct(productId),
          getProducts(),
        ]);
        if (!active) return;
        setProduct(productData);

        // Find related products from same category
        const categoryName = typeof productData.category === 'string'
          ? productData.category
          : productData.category?.name ?? '';

        const related = allProducts
          .filter((p) => {
            if (String(p.id) === String(productData.id)) return false;
            const pCat = typeof p.category === 'string' ? p.category : p.category?.name ?? '';
            return pCat === categoryName;
          })
          .slice(0, 4);

        setRelatedProducts(related.length > 0 ? related : allProducts.filter(p => String(p.id) !== String(productData.id)).slice(0, 4));
      } catch (err) {
        if (active) setError('Não foi possível carregar os detalhes do produto.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);

    return () => { active = false; };
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="aspect-square bg-white/5 rounded-xl sm:rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-72 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-24 w-full bg-white/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="glass-card rounded-2xl p-10 sm:p-16 max-w-lg mx-auto">
          <p className="text-white/60 text-sm sm:text-base mb-4">{error || 'Produto não encontrado.'}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const name = product.productName ?? product.name ?? 'Produto';
  const description = product.productDescription ?? product.description ?? '';
  const imageUrl = product.imageUrl || product.image || '';
  const categoryName = typeof product.category === 'string'
    ? product.category
    : product.category?.name ?? '';

  return (
    <div className="relative z-10">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 sm:pt-6">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-white/40 overflow-x-auto">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
          <ChevronRight size={11} className="shrink-0 text-white/20" />
          <Link href="/shop" className="hover:text-white transition-colors whitespace-nowrap">Loja</Link>
          {categoryName && (
            <>
              <ChevronRight size={11} className="shrink-0 text-white/20" />
              <Link
                href={`/shop?category=${encodeURIComponent(categoryName)}`}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight size={11} className="shrink-0 text-white/20" />
          <span className="text-white/60 truncate">{name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/3 aspect-square">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 via-black/60 to-black flex items-center justify-center">
                  <span className="text-white/20 text-sm">Sem imagem</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Category */}
            {categoryName && (
              <Link
                href={`/shop?category=${encodeURIComponent(categoryName)}`}
                className="text-amber-500/90 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 sm:mb-3 hover:text-amber-400 transition-colors w-fit"
              >
                {categoryName}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight mb-3 sm:mb-4">
              {name}
            </h1>

            {/* Price */}
            <div className="mb-4 sm:mb-6">
              <div className="text-white text-2xl sm:text-3xl font-black">
                {formatPrice(product.price)}
              </div>
              <p className="text-white/40 text-xs sm:text-sm mt-1">
                ou {formatInstallment(product.price)}
              </p>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-5 sm:mb-6">
                <h3 className="text-white text-sm font-semibold mb-2">Descrição</h3>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5 sm:mb-6">
              <label className="text-white text-sm font-semibold mb-2 block">Quantidade</label>
              <div className="inline-flex items-center glass border border-white/10 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 sm:w-12 text-center text-white text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-12 sm:h-13 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-black'
                }`}
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 sm:h-13 rounded-full border transition-all duration-200 flex items-center justify-center shrink-0 ${
                  wishlisted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'glass border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="w-12 h-12 sm:h-13 rounded-full glass border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all flex items-center justify-center shrink-0">
                <Share2 size={18} />
              </button>
            </div>

            {/* Perks */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Truck, title: 'Entrega grátis', desc: 'Pedidos acima de R$1999' },
                { icon: Shield, title: 'Garantia 2 anos', desc: 'Cobertura inclusa' },
                { icon: RotateCcw, title: 'Troca fácil', desc: '30 dias para trocar' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 sm:py-16">
          <div className="border-t border-white/8 pt-10 sm:pt-14">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <div>
                <span className="text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 block">
                  Talvez você goste
                </span>
                <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
                  Produtos <span className="text-gradient">relacionados</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-white/50 hover:text-amber-400 text-xs sm:text-sm font-medium transition-colors hidden sm:block"
              >
                Ver todos →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((related) => {
                const rName = related.productName ?? related.name ?? 'Produto';
                const rImage = related.imageUrl || related.image || '';
                const rCategory = typeof related.category === 'string'
                  ? related.category
                  : related.category?.name ?? '';
                return (
                  <Link
                    key={related.id}
                    href={`/shop/${related.id}`}
                    className="group flex flex-col glass-card rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 hover:border-white/14"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-white/3">
                      {rImage ? (
                        <img
                          src={rImage}
                          alt={rName}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-white/5 via-black/60 to-black" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
                      {rCategory && (
                        <span className="text-amber-500/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
                          {rCategory}
                        </span>
                      )}
                      <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-2">{rName}</h3>
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-white font-bold text-sm sm:text-base">{formatPrice(related.price)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/shop"
              className="mt-6 text-white/50 hover:text-amber-400 text-xs font-medium transition-colors block text-center sm:hidden"
            >
              Ver todos os produtos →
            </Link>
          </div>
        </div>
      )}

      {/* Back button (mobile sticky) */}
      <Link
        href="/shop"
        className="fixed bottom-4 left-4 z-40 lg:hidden w-10 h-10 bg-black/80 backdrop-blur-lg border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white shadow-xl shadow-black/50 transition-all"
      >
        <ArrowLeft size={18} />
      </Link>
    </div>
  );
}
