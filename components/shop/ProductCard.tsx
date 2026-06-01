'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { ApiProduct } from '@/lib/api-types';
import { useCart } from '@/components/cart/CartContext';

interface ProductCardProps {
  product: ApiProduct;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function ProductCard({ product }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const name = product.productName ?? product.name ?? 'Product';
  const description = product.productDescription ?? product.description ?? '';
  const imageUrl = product.imageUrl || product.image || '';
  const categoryName = typeof product.category === 'string'
    ? product.category
    : product.category?.name ?? '';

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group relative flex flex-col glass-card rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 hover:border-white/14"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-white/3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 via-black/60 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2">
        {categoryName && (
          <span className="text-amber-500/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">
            {categoryName}
          </span>
        )}
        <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight line-clamp-2">{name}</h3>
        {description && (
          <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed line-clamp-2 hidden sm:block">{description}</p>
        )}

        <div className="flex items-center justify-between mt-1 pt-2 sm:pt-3 border-t border-white/5">
          <span className="text-white font-bold text-sm sm:text-base">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              addedToCart
                ? 'bg-green-500 text-white'
                : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500 hover:text-black'
            }`}
          >
            <ShoppingBag size={13} className="sm:w-[15px] sm:h-[15px]" />
          </button>
        </div>
      </div>
    </Link>
  );
}
