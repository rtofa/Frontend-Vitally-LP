'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function CarrinhoPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    openLeadModal,
  } = useCart();

  const handleQuote = () => {
    if (items.length === 0) return;
    openLeadModal('QUOTE');
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 lg:px-8 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-white text-3xl sm:text-4xl font-black">Carrinho de compras</h1>
          <p className="text-white/50 text-base">
            {totalItems === 0 ? 'Seu carrinho está vazio' : `${totalItems} item(ns)`}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 sm:p-16 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/40">
              <ShoppingBag size={28} />
            </div>
            <div className="space-y-2">
              <p className="text-white/60 text-base">Seu carrinho está vazio.</p>
              <p className="text-white/40 text-sm">
                Adicione produtos para começar a fazer um pedido.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6"
                >
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-white/20 text-xs text-center">Sem imagem</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="inline-flex items-center gap-2 glass-dark rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white text-sm font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-rose-400 text-xs hover:text-rose-300 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between">
                    <div className="text-white text-base sm:text-lg font-black">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 h-fit sticky top-24">
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Frete</span>
                    <span className="text-[#39FF14]">Grátis</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-lg font-black">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleQuote}
                  className="w-full h-12 rounded-full bg-[#39FF14] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#53FF2E] transition-colors"
                >
                  Solicitar Orçamento
                </button>

                <Link
                  href="/shop"
                  className="block w-full h-12 rounded-full border border-white/20 text-white text-sm font-bold uppercase tracking-wider hover:border-[#39FF14] hover:text-[#39FF14] transition-colors flex items-center justify-center"
                >
                  Continuar comprando
                </Link>

                <p className="text-white/40 text-xs text-center">
                  Sem pagamento online. Enviamos um orçamento personalizado.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
