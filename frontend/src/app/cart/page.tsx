"use client";

import Link from "next/link";
import { useState } from "react";
import { itemUnitPrice, useCart, type CartItem } from "@/lib/cart";
import { useCatalog } from "@/lib/products";
import { formatMoney as money } from "@/lib/session";
import "../menu/menu.css";

type Notice = { text: string; tone: "info" | "error" } | null;

export default function CartPage() {
  const cart = useCart();
  const { products } = useCatalog();
  const [notice, setNotice] = useState<Notice>(null);

  /** Tăng số lượng nhưng không vượt tồn kho hiện tại (lấy từ GET /products). */
  function increase(item: CartItem) {
    const stock = products.find((p) => p.id === item.product.id)?.stock ?? item.product.stock;
    if (cart.quantityOf(item.product.id) >= stock) {
      setNotice({ tone: "error", text: `${item.product.name} không còn đủ số lượng để thêm.` });
      return;
    }
    cart.changeQuantity(item.key, 1);
  }

  return (
    <main className="brew-menu">
      {notice && (
        <div className={`brew-notice ${notice.tone === "error" ? "is-error" : ""}`} role={notice.tone === "error" ? "alert" : "status"}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Đóng thông báo">
            ×
          </button>
        </div>
      )}

      
        <section className="brew-section">
          <Link className="brew-back" href="/menu">
            ← Tiếp tục chọn đồ uống
          </Link>
          <h1 className="brew-page-title">Giỏ hàng ({cart.count})</h1>

          {!cart.ready ? (
            <div className="brew-empty" role="status">
              <h3>Đang tải giỏ hàng...</h3>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="brew-empty">
              <div>🛒</div>
              <h3>Giỏ hàng đang trống</h3>
              <Link className="brew-primary" href="/menu">
                Xem thực đơn
              </Link>
            </div>
          ) : (
            <div className="brew-cart-layout">
              <div className="brew-cart-list">
                {cart.items.map((item) => (
                  <article className="brew-cart-item" key={item.key}>
                    <div className="brew-cart-emoji">{item.product.emoji}</div>
                    <div className="brew-cart-info">
                      <h3>{item.product.name}</h3>
                      <p>
                        Size {item.size} · Đường {item.sugar}% · Đá {item.ice}%
                      </p>
                      <p>{item.toppings.length > 0 ? item.toppings.map((t) => t.name).join(", ") : "Không thêm topping"}</p>
                      <strong>{money(itemUnitPrice(item))}</strong>
                      <button className="brew-remove" onClick={() => cart.remove(item.key)}>
                        Xóa
                      </button>
                    </div>
                    <div className="brew-quantity">
                      <button onClick={() => cart.changeQuantity(item.key, -1)} aria-label="Giảm số lượng">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increase(item)} aria-label="Tăng số lượng">
                        +
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="brew-summary">
                <h2>Tóm tắt đơn hàng</h2>
                <div>
                  <span>Số ly</span>
                  <strong>{cart.count}</strong>
                </div>
                <p className="brew-summary-note">Mã khuyến mãi nhập ở bước thanh toán.</p>
                <div className="brew-total">
                  <span>Tổng tạm tính</span>
                  <strong>{money(cart.subtotal)}</strong>
                </div>
                <Link className="brew-primary brew-full" href="/checkout">
                  Tiến hành thanh toán →
                </Link>
              </aside>
            </div>
          )}
        </section>
    </main>
  );
}
