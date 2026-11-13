"use client";

import Link from "next/link";
import { useState } from "react";
import { SIZE_PRICES, useCart, type CartItem, type CartProduct, type CartTopping, type Size } from "@/lib/cart";
import { useCatalog } from "@/lib/products";
import { formatMoney as money } from "@/lib/session";
import "./menu.css";

type Category = "Tất cả" | "Cà phê" | "Trà" | "Trà sữa" | "Đá xay";
type Notice = { text: string; tone: "info" | "error" } | null;

const categories: Category[] = ["Tất cả", "Cà phê", "Trà", "Trà sữa", "Đá xay"];
const LEVELS = [0, 30, 50, 70, 100];
const LOW_STOCK = 10;

export default function MenuPage() {
  const cart = useCart();
  // Thực đơn và topping tải từ backend (Task 3).
  const catalog = useCatalog();
  const { products, toppings } = catalog;

  const [category, setCategory] = useState<Category>("Tất cả");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<CartProduct | null>(null);
  const [size, setSize] = useState<Size>("M");
  const [sugar, setSugar] = useState(100);
  const [ice, setIce] = useState(100);
  const [chosenToppings, setChosenToppings] = useState<CartTopping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<Notice>(null);

  const keyword = search.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      (category === "Tất cả" || product.category === category) &&
      `${product.name} ${product.description}`.toLowerCase().includes(keyword),
  );

  /** Số ly còn có thể thêm vào giỏ (tồn kho trừ số đã có trong giỏ). */
  function remainingOf(product: CartProduct) {
    const latest = products.find((p) => p.id === product.id) ?? product;
    return Math.max(0, latest.stock - cart.quantityOf(product.id));
  }

  const selectedPrice = selected
    ? selected.price + SIZE_PRICES[size] + chosenToppings.reduce((sum, t) => sum + t.price, 0)
    : 0;

  function openProduct(product: CartProduct) {
    setSelected(product);
    setSize("M");
    setSugar(100);
    setIce(100);
    setChosenToppings([]);
    setQuantity(1);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart() {
    if (!selected) return;
    const remaining = remainingOf(selected);
    if (quantity > remaining) {
      setNotice({
        tone: "error",
        text:
          remaining === 0
            ? `${selected.name} đã hết hoặc giỏ hàng đã có toàn bộ số ly còn lại.`
            : `${selected.name} chỉ còn có thể thêm ${remaining} ly.`,
      });
      return;
    }
    const toppingIds = chosenToppings.map((t) => t.id).sort().join(",");
    const item: CartItem = {
      key: `${selected.id}-${size}-${sugar}-${ice}-${toppingIds}`,
      product: selected,
      size,
      sugar,
      ice,
      toppings: [...chosenToppings],
      quantity,
    };
    cart.add(item);
    setSelected(null);
    setNotice({ tone: "info", text: `Đã thêm ${quantity} ${selected.name} vào giỏ hàng.` });
  }

  return (
    <main className="brew-menu">
      {notice && (
        <div className={`brew-notice ${notice.tone === "error" ? "is-error" : ""}`} role={notice.tone === "error" ? "alert" : "status"}>
          <span>
            {notice.text}{" "}
            {notice.tone === "info" && (
              <Link href="/cart" className="brew-notice-link">
                Xem giỏ hàng →
              </Link>
            )}
          </span>
          <button onClick={() => setNotice(null)} aria-label="Đóng thông báo">
            ×
          </button>
        </div>
      )}

      {!selected && (
        <>
          <section className="brew-hero">
            <div>
              <span className="brew-eyebrow">BREWLITE — COFFEE & MORE</span>
              <h1>
                Một chút cà phê,
                <br />
                <em>cho ngày thêm vui.</em>
              </h1>
              <p>Từ cà phê đậm đà đến trà thơm mát, BrewLite luôn có một thức uống dành cho bạn.</p>
              <a href="#brew-products" className="brew-primary">
                Khám phá thực đơn ↘
              </a>
            </div>
            <div className="brew-hero-art">
              <div className="brew-circle">
                <span>☕</span>
              </div>
              <div className="brew-floating">✨ Pha mới mỗi ngày</div>
            </div>
          </section>

          <section className="brew-section" id="brew-products">
            <div className="brew-section-top">
              <div>
                <span className="brew-eyebrow">THỰC ĐƠN BREWLITE</span>
                <h2>Chọn món bạn yêu thích</h2>
                <p>Cà phê, trà và nhiều thức uống hấp dẫn.</p>
              </div>
              <input
                className="brew-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="🔎 Tìm đồ uống..."
                aria-label="Tìm đồ uống"
              />
            </div>

            <div className="brew-categories">
              {categories.map((item) => (
                <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                  {item}
                </button>
              ))}
            </div>

            {catalog.status === "loading" ? (
              <div className="brew-empty" role="status">
                <h3>Đang tải thực đơn...</h3>
              </div>
            ) : catalog.status === "error" ? (
              <div className="brew-empty" role="alert">
                <h3>Không tải được thực đơn</h3>
                <p>{catalog.error}</p>
                <button className="brew-primary" onClick={catalog.reload}>
                  Thử lại
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="brew-empty">
                <h3>Hiện chưa có đồ uống nào</h3>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="brew-empty">
                <h3>Không tìm thấy đồ uống</h3>
                <button
                  className="brew-primary"
                  onClick={() => {
                    setSearch("");
                    setCategory("Tất cả");
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="brew-grid">
                {visibleProducts.map((product) => {
                  const soldOut = product.stock <= 0;
                  return (
                    <article className={`brew-card ${soldOut ? "is-sold-out" : ""}`} key={product.id}>
                      <button
                        className="brew-card-art"
                        onClick={() => openProduct(product)}
                        aria-label={`Xem ${product.name}`}
                        disabled={soldOut}
                      >
                        <span>{product.emoji}</span>
                        {soldOut ? (
                          <small>Hết hàng</small>
                        ) : (
                          product.stock <= LOW_STOCK && <small>Còn {product.stock} ly</small>
                        )}
                      </button>
                      <div className="brew-card-body">
                        <span className="brew-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="brew-card-bottom">
                          <strong>Từ {money(product.price)}</strong>
                          <button
                            onClick={() => openProduct(product)}
                            aria-label={`Chọn ${product.name}`}
                            disabled={soldOut}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {selected && (
        <section className="brew-section">
          <button className="brew-back" onClick={() => setSelected(null)}>
            ← Quay lại thực đơn
          </button>
          <div className="brew-detail">
            <div className="brew-detail-art">{selected.emoji}</div>
            <div className="brew-detail-info">
              <span className="brew-eyebrow">{selected.category}</span>
              <h1>{selected.name}</h1>
              <p>{selected.description}</p>
              <h2>{money(selected.price)}</h2>
              {selected.stock <= LOW_STOCK && <p className="brew-stock-note">Chỉ còn {selected.stock} ly hôm nay.</p>}

              <h3>Chọn kích thước</h3>
              <div className="brew-options">
                {(["S", "M", "L"] as Size[]).map((option) => (
                  <button key={option} className={size === option ? "active" : ""} onClick={() => setSize(option)}>
                    Size {option}
                    <small>{SIZE_PRICES[option] === 0 ? "Giá gốc" : "+" + money(SIZE_PRICES[option])}</small>
                  </button>
                ))}
              </div>

              <h3>Mức đường</h3>
              <div className="brew-options">
                {LEVELS.map((value) => (
                  <button key={value} className={sugar === value ? "active" : ""} onClick={() => setSugar(value)}>
                    {value}%
                  </button>
                ))}
              </div>

              <h3>Mức đá</h3>
              <div className="brew-options">
                {LEVELS.map((value) => (
                  <button key={value} className={ice === value ? "active" : ""} onClick={() => setIce(value)}>
                    {value}%
                  </button>
                ))}
              </div>

              <h3>Topping thêm</h3>
              <div className="brew-toppings">
                {toppings.map((topping) => (
                  <label key={topping.id}>
                    <span>
                      {topping.name}
                      <small>+{money(topping.price)}</small>
                    </span>
                    <input
                      type="checkbox"
                      checked={chosenToppings.some((item) => item.id === topping.id)}
                      onChange={(event) =>
                        setChosenToppings((previous) =>
                          event.target.checked
                            ? [...previous, topping]
                            : previous.filter((item) => item.id !== topping.id),
                        )
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="brew-quantity-row">
                <strong>Số lượng</strong>
                <div className="brew-quantity">
                  <button onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}>−</button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((previous) => Math.min(previous + 1, Math.max(1, remainingOf(selected))))}
                  >
                    +
                  </button>
                </div>
              </div>

              <button className="brew-primary brew-full" onClick={addToCart} disabled={remainingOf(selected) === 0}>
                {remainingOf(selected) === 0 ? "Đã hết hàng" : `Thêm vào giỏ · ${money(selectedPrice * quantity)}`}
              </button>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
