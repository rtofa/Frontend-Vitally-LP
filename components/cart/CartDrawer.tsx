'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from './CartContext';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    openLeadModal,
  } = useCart();

  const handleQuote = () => {
    if (items.length === 0) return;
    openLeadModal('QUOTE');
    setCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-[92vw] sm:max-w-md bg-black/95 text-white border-white/10 p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingBag size={18} />
            Carrinho
          </SheetTitle>
          <p className="text-white/40 text-xs">{totalItems} item(ns)</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {items.length === 0 && (
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">
                <ShoppingBag size={18} />
              </div>
              <div className="text-white/60 text-sm">Seu carrinho esta vazio.</div>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#39FF14] text-black text-xs font-bold uppercase tracking-wider"
              >
                Ver produtos
              </Link>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-xl border border-white/10 bg-black/50"
            >
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-white/20 text-[10px]">Sem imagem</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold line-clamp-2">{item.name}</div>
                <div className="text-white/50 text-xs mt-1">{formatPrice(item.price)}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-[#39FF14]/60 transition-colors flex items-center justify-center"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-white text-xs font-semibold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-[#39FF14]/60 transition-colors flex items-center justify-center"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="text-white/80 text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-rose-400 text-xs hover:text-rose-300 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Total</span>
            <span className="text-white text-lg font-semibold">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <button
            onClick={handleQuote}
            disabled={items.length === 0}
            className="w-full h-11 rounded-full bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Solicitar Orcamento
          </button>
          <p className="text-white/40 text-[11px] text-center">
            Sem pagamento online. Enviamos um orcamento personalizado.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
