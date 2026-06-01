'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ApiProduct } from '@/lib/api-types';

export type LeadMode = 'QUOTE' | 'CONTACT';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  product: ApiProduct;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: ApiProduct, quantity?: number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isLeadModalOpen: boolean;
  leadMode: LeadMode;
  openLeadModal: (mode: LeadMode) => void;
  closeLeadModal: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'vitally-cart';

const getProductName = (product: ApiProduct) =>
  product.productName ?? product.name ?? 'Produto';

const getProductImage = (product: ApiProduct) =>
  product.imageUrl || product.image || '';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLeadModalOpen, setLeadModalOpen] = useState(false);
  const [leadMode, setLeadMode] = useState<LeadMode>('QUOTE');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (error) {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: ApiProduct, quantity: number = 1) => {
    if (!product?.id) return;

    setItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: getProductName(product),
          price: Number(product.price) || 0,
          imageUrl: getProductImage(product),
          quantity,
          product,
        },
      ];
    });
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const openLeadModal = (mode: LeadMode) => {
    setLeadMode(mode);
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => setLeadModalOpen(false);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isCartOpen,
      setCartOpen,
      openCart,
      closeCart,
      isLeadModalOpen,
      leadMode,
      openLeadModal,
      closeLeadModal,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      isLeadModalOpen,
      leadMode,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
