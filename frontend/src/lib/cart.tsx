"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Giỏ hàng dùng chung cho toàn ứng dụng (Task 5): lưu trong React Context và
// localStorage, nên không mất khi chuyển trang, đăng nhập hoặc tải lại trang.

export type Size = "S" | "M" | "L";

export type CartTopping = { id: string; name: string; price: number };

export type CartProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  emoji: string;
  stock: number;
};

export type CartItem = {
  key: string;
  product: CartProduct;
  size: Size;
  sugar: number;
  ice: number;
  toppings: CartTopping[];
  quantity: number;
};

export const SIZE_PRICES: Record<Size, number> = { S: 0, M: 5000, L: 10000 };

/** Giá một ly theo size và topping (máy chủ vẫn tính lại khi tạo đơn). */
export function itemUnitPrice(item: Pick<CartItem, "product" | "size" | "toppings">) {
  return (
    item.product.price +
    SIZE_PRICES[item.size] +
    item.toppings.reduce((sum, topping) => sum + topping.price, 0)
  );
}

type CartContextValue = {
  /** false cho tới khi đọc xong giỏ đã lưu trong localStorage. */
  ready: boolean;
  items: CartItem[];
  count: number;
  subtotal: number;
  /** Số ly của một sản phẩm đang có trong giỏ (mọi tùy chọn cộng lại). */
  quantityOf: (productId: number) => number;
  add: (item: CartItem) => void;
  changeQuantity: (key: string, change: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "brewlite_cart";
const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Đọc giỏ đã lưu sau khi trang hiển thị trên trình duyệt (server không có localStorage).
  useEffect(() => {
    queueMicrotask(() => {
      setItems(readStorage());
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* trình duyệt chặn lưu trữ: giỏ chỉ còn trong phiên hiện tại */
    }
  }, [items, loaded]);

  const add = useCallback((item: CartItem) => {
    setItems((previous) => {
      const existing = previous.find((entry) => entry.key === item.key);
      if (!existing) return [...previous, item];
      return previous.map((entry) =>
        entry.key === item.key
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry,
      );
    });
  }, []);

  const changeQuantity = useCallback((key: string, change: number) => {
    setItems((previous) =>
      previous
        .map((entry) =>
          entry.key === key ? { ...entry, quantity: entry.quantity + change } : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((previous) => previous.filter((entry) => entry.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ready: loaded,
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + itemUnitPrice(item) * item.quantity, 0),
      quantityOf: (productId) =>
        items
          .filter((item) => item.product.id === productId)
          .reduce((sum, item) => sum + item.quantity, 0),
      add,
      changeQuantity,
      remove,
      clear,
    }),
    [loaded, items, add, changeQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải dùng bên trong CartProvider");
  return context;
}
