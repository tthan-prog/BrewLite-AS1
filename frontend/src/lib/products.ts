"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { CartProduct, CartTopping } from "@/lib/cart";

type ApiProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  stock: number;
};

type ApiTopping = { id: number; name: string; price: number };

export function toProduct(p: ApiProduct): CartProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    category: p.category ?? "Cà phê",
    price: p.price,
    emoji: p.imageUrl || "☕",
    stock: p.stock,
  };
}

export type CatalogState = {
  products: CartProduct[];
  toppings: CartTopping[];
  status: "loading" | "error" | "ready";
  error: string;
  reload: () => void;
};

/** Tải thực đơn và topping từ backend (GET /products, GET /toppings). */
export function useCatalog(): CatalogState {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [toppings, setToppings] = useState<CartTopping[]>([]);
  const [status, setStatus] = useState<CatalogState["status"]>("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all([apiRequest<ApiProduct[]>("/products"), apiRequest<ApiTopping[]>("/toppings")])
      .then(([apiProducts, apiToppings]) => {
        if (!alive) return;
        setProducts(apiProducts.map(toProduct));
        setToppings(apiToppings.map((t) => ({ id: String(t.id), name: t.name, price: t.price })));
        setError("");
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Không tải được thực đơn.");
        setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  return {
    products,
    toppings,
    status,
    error,
    reload: () => {
      setStatus("loading");
      setReloadKey((n) => n + 1);
    },
  };
}
