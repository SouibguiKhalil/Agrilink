import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { resolveUploadUrl } from '../utils/images';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image?: string;
  producerId?: string;
  producerName?: string;
};

export type CartAddress = {
  _id?: string;
  label?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

type CartContextValue = {
  items: CartItem[];
  selectedAddress?: CartAddress | null;
  deliveryMethod?: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedAddress: (address: CartAddress | null) => void;
  setDeliveryMethod: (method: string | null) => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'agrilink_cart';

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Cart storage parse error', err);
    return null;
  }
};

const writeStorage = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CartAddress | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setItems(stored.items || []);
      setSelectedAddress(stored.selectedAddress || null);
      setDeliveryMethod(stored.deliveryMethod || null);
    }
  }, []);

  useEffect(() => {
    writeStorage({ items, selectedAddress, deliveryMethod });
  }, [items, selectedAddress, deliveryMethod]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [
        ...prev,
        {
          ...item,
          image: resolveUploadUrl(item.image),
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedAddress(null);
    setDeliveryMethod(null);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    selectedAddress,
    deliveryMethod,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedAddress,
    setDeliveryMethod,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
