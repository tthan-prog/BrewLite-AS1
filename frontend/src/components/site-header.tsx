"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart";

// Đọc phiên đăng nhập từ sessionStorage; trên server luôn là "chưa đăng nhập".
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("brewlite-auth", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("brewlite-auth", callback);
  };
}

function useAuthState() {
  return useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("brewlite_user") ?? "",
    () => "",
  );
}

function displayName(raw: string): string {
  try {
    const user = JSON.parse(raw) as { name?: string | null; email?: string };
    return user.name || user.email || "Tài khoản";
  } catch {
    return "Tài khoản";
  }
}

export default function SiteHeader() {
  const rawUser = useAuthState();
  const { count } = useCart();

  function logout() {
    sessionStorage.removeItem("brewlite_token");
    sessionStorage.removeItem("brewlite_user");
    sessionStorage.removeItem("brewlite_last_order");
    window.dispatchEvent(new Event("brewlite-auth"));
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" aria-label="BrewLite trang chủ">
          <span className="brand-mark">B</span><span>BrewLite</span>
        </Link>
        <nav className="nav-links" aria-label="Điều hướng chính">
          <Link href="/menu">Thực đơn</Link>
          <Link href="/#features">Giới thiệu</Link>
          <Link href="/orders/history">Đơn hàng của tôi</Link>
        </nav>
        <div className="nav-actions">
          <Link className="btn btn-outline nav-cart" href="/cart" aria-label={`Giỏ hàng, ${count} món`}>
            Giỏ hàng <span className="cart-badge">{count}</span>
          </Link>
          {rawUser ? (
            <>
              <span className="nav-user">{displayName(rawUser)}</span>
              <button className="btn btn-outline" type="button" onClick={logout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" href="/login">Đăng nhập</Link>
              <Link className="btn btn-primary" href="/register">Tạo tài khoản</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
