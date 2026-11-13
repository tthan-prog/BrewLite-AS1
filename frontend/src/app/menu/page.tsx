"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";
import {
  SIZE_PRICES,
  itemUnitPrice,
  useCart,
  type CartItem,
  type CartProduct,
  type CartTopping,
  type Size,
} from "@/lib/cart";
import { formatMoney as money, rememberReturnTo, statusLabel } from "@/lib/session";
import "./menu.css";

type Category = "Tất cả" | "Cà phê" | "Trà" | "Trà sữa" | "Đá xay";
type View = "menu" | "cart" | "checkout";
type Notice = { text: string; tone: "info" | "error" } | null;

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

type ApiOrder = {
  id: number;
  status: string;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  total: number;
  createdAt: string;
};

type PaymentMethod = "WALLET" | "CARD";

const categories: Category[] = ["Tất cả", "Cà phê", "Trà", "Trà sữa", "Đá xay"];
const LEVELS = [0, 30, 50, 70, 100];
const LOW_STOCK = 10;

function toProduct(p: ApiProduct): CartProduct {
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

function viewFromHash(): View {
  const hash = window.location.hash.replace("#", "");
  return hash === "cart" || hash === "checkout" ? hash : "menu";
}

export default function MenuPage() {
  const router = useRouter();
  const cart = useCart();

  const [view, setView] = useState<View>("menu");
  const [category, setCategory] = useState<Category>("Tất cả");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<CartProduct | null>(null);
  const [size, setSize] = useState<Size>("M");
  const [sugar, setSugar] = useState(100);
  const [ice, setIce] = useState(100);
  const [chosenToppings, setChosenToppings] = useState<CartTopping[]>([]);
  const [quantity, setQuantity] = useState(1);

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [toppings, setToppings] = useState<CartTopping[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);
  const [promo, setPromo] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("WALLET");
  const [simulateFail, setSimulateFail] = useState(false);
  // Đơn đã tạo (PENDING/PAYMENT_FAILED) cho đúng nội dung giỏ hiện tại: khách xem
  // tạm tính, giảm giá, tổng tiền do máy chủ tính rồi mới bấm thanh toán.
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [orderSignature, setOrderSignature] = useState<string | null>(null);
  // Khóa idempotency gắn với nội dung giỏ: bấm đặt lại không tạo thêm đơn.
  const orderKeyRef = useRef<{ signature: string; key: string } | null>(null);

  // Điều hướng giữa thực đơn / giỏ hàng / thanh toán bằng #hash (giỏ hàng trên thanh điều hướng trỏ tới /menu#cart).
  useEffect(() => {
    const sync = () => {
      setView(viewFromHash());
      setSelected(null);
    };
    queueMicrotask(sync);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Tải thực đơn và topping từ backend (Task 3).
  useEffect(() => {
    let alive = true;
    Promise.all([apiRequest<ApiProduct[]>("/products"), apiRequest<ApiTopping[]>("/toppings")])
      .then(([apiProducts, apiToppings]) => {
        if (!alive) return;
        setProducts(apiProducts.map(toProduct));
        setToppings(apiToppings.map((t) => ({ id: String(t.id), name: t.name, price: t.price })));
        setLoadError("");
        setLoadState("ready");
      })
      .catch((error: unknown) => {
        if (!alive) return;
        setLoadError(error instanceof Error ? error.message : "Không tải được thực đơn.");
        setLoadState("error");
      });
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const orderItems = useMemo(
    () =>
      cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size,
        sugar: item.sugar,
        ice: item.ice,
        toppings: item.toppings.map((t) => ({ toppingId: Number(t.id), quantity: 1 })),
      })),
    [cart.items],
  );
  const signature = JSON.stringify({ items: orderItems, promoCode: promo.trim().toUpperCase() || null });

  // Giỏ hoặc mã khuyến mãi đổi thì đơn đã tạo không còn khớp: phải xác nhận lại.
  const orderMatchesCart = order !== null && orderSignature === signature;

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchCategory = category === "Tất cả" || product.category === category;
        const matchSearch = `${product.name} ${product.description}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        return matchCategory && matchSearch;
      }),
    [products, category, search],
  );

  /** Số ly còn có thể thêm vào giỏ (tồn kho trừ số đã có trong giỏ). */
  const remainingOf = useCallback(
    (product: CartProduct) => {
      const latest = products.find((p) => p.id === product.id) ?? product;
      return Math.max(0, latest.stock - cart.quantityOf(product.id));
    },
    [products, cart],
  );

  const selectedPrice = selected
    ? selected.price + SIZE_PRICES[size] + chosenToppings.reduce((sum, t) => sum + t.price, 0)
    : 0;

  function goTo(nextView: View) {
    window.location.hash = nextView === "menu" ? "" : nextView;
    setView(nextView);
    setSelected(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  function increase(item: CartItem) {
    if (remainingOf(item.product) <= 0) {
      setNotice({ tone: "error", text: `${item.product.name} không còn đủ số lượng để thêm.` });
      return;
    }
    cart.changeQuantity(item.key, 1);
  }

  /** Bước 1: tạo đơn PENDING để máy chủ kiểm tra tồn kho, mã khuyến mãi và tính tổng tiền. */
  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.items.length || submitting) return;

    const token = sessionStorage.getItem("brewlite_token");
    if (!token) {
      // Giỏ hàng được lưu lại; đăng nhập xong quay về đúng bước thanh toán.
      rememberReturnTo("/menu#checkout");
      router.push("/login");
      return;
    }

    if (orderKeyRef.current?.signature !== signature) {
      orderKeyRef.current = { signature, key: crypto.randomUUID() };
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const created = await apiRequest<ApiOrder>("/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Idempotency-Key": orderKeyRef.current.key },
        body: JSON.stringify({ items: orderItems, promoCode: promo.trim() || undefined }),
      });
      setOrder(created);
      setOrderSignature(signature);
    } catch (error) {
      orderKeyRef.current = null;
      setOrder(null);
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Không thể đặt hàng lúc này." });
    } finally {
      setSubmitting(false);
    }
  }

  /** Bước 2: thanh toán đơn đã tạo (mô phỏng Ví/Thẻ). Lỗi thì giữ giỏ và cho thử lại cùng đơn. */
  async function payOrder() {
    if (!order || submitting) return;
    const token = sessionStorage.getItem("brewlite_token");
    if (!token) {
      rememberReturnTo("/menu#checkout");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const result = await apiRequest<{ order: ApiOrder; payment: { status: string } }>("/payments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({
          orderId: order.id,
          method: payment,
          simulate: simulateFail ? "FAIL" : "SUCCESS",
        }),
      });

      if (result.payment.status !== "SUCCESS") {
        setOrder(result.order);
        setNotice({
          tone: "error",
          text: `Thanh toán thất bại (đơn #${result.order.id}: ${result.order.status}). Giỏ hàng được giữ nguyên, bạn có thể thử lại.`,
        });
        return;
      }

      sessionStorage.setItem("brewlite_last_order", String(result.order.id));
      orderKeyRef.current = null;
      setOrder(null);
      cart.clear();
      router.push(`/orders/confirmation?id=${result.order.id}`);
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Không thể thanh toán lúc này." });
    } finally {
      setSubmitting(false);
    }
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

      {view === "menu" && !selected && (
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

            {loadState === "loading" ? (
              <div className="brew-empty" role="status">
                <h3>Đang tải thực đơn...</h3>
              </div>
            ) : loadState === "error" ? (
              <div className="brew-empty" role="alert">
                <h3>Không tải được thực đơn</h3>
                <p>{loadError}</p>
                <button
                  className="brew-primary"
                  onClick={() => {
                    setLoadState("loading");
                    setReloadKey((n) => n + 1);
                  }}
                >
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

      {view === "menu" && selected && (
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

      {view === "cart" && (
        <section className="brew-section">
          <button className="brew-back" onClick={() => goTo("menu")}>
            ← Tiếp tục chọn đồ uống
          </button>
          <h1 className="brew-page-title">Giỏ hàng ({cart.count})</h1>

          {cart.items.length === 0 ? (
            <div className="brew-empty">
              <div>🛒</div>
              <h3>Giỏ hàng đang trống</h3>
              <button className="brew-primary" onClick={() => goTo("menu")}>
                Xem thực đơn
              </button>
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
                <button className="brew-primary brew-full" onClick={() => goTo("checkout")}>
                  Tiến hành thanh toán →
                </button>
              </aside>
            </div>
          )}
        </section>
      )}

      {view === "checkout" && (
        <section className="brew-section">
          <button className="brew-back" onClick={() => goTo("cart")}>
            ← Quay lại giỏ hàng
          </button>
          <h1 className="brew-page-title">Thanh toán</h1>

          {cart.items.length === 0 ? (
            <div className="brew-empty">
              <h3>Giỏ hàng đang trống</h3>
              <button className="brew-primary" onClick={() => goTo("menu")}>
                Xem thực đơn
              </button>
            </div>
          ) : (
            <div className="brew-checkout">
              <form className="brew-form" onSubmit={placeOrder}>
                <h2>1. Mã khuyến mãi và đặt hàng</h2>
                <label>
                  Mã khuyến mãi (nếu có)
                  <input
                    value={promo}
                    onChange={(event) => setPromo(event.target.value)}
                    placeholder="Ví dụ: WELCOME10"
                    maxLength={32}
                    disabled={submitting}
                  />
                </label>
                <p className="brew-demo-alert">
                  Bấm &quot;Đặt hàng&quot; để giữ món và xem tổng tiền cuối cùng (đã trừ khuyến mãi) trước khi thanh
                  toán. Bạn cần đăng nhập để đặt hàng.
                </p>
                <button type="submit" className="brew-primary brew-full" disabled={submitting || orderMatchesCart}>
                  {orderMatchesCart ? `Đã đặt đơn #${order?.id}` : submitting && !order ? "Đang đặt hàng..." : "Đặt hàng"}
                </button>

                {orderMatchesCart && order && (
                  <div className="brew-pay">
                    <h2>2. Thanh toán đơn #{order.id}</h2>
                    <p className="brew-order-status">Trạng thái: {statusLabel(order.status)} ({order.status})</p>
                    <label>
                      Phương thức thanh toán
                      <select value={payment} onChange={(event) => setPayment(event.target.value as PaymentMethod)}>
                        <option value="WALLET">Ví điện tử (mô phỏng)</option>
                        <option value="CARD">Thẻ ngân hàng (mô phỏng)</option>
                      </select>
                    </label>
                    <label className="brew-check">
                      <input type="checkbox" checked={simulateFail} onChange={(event) => setSimulateFail(event.target.checked)} />
                      Giả lập thanh toán thất bại (chỉ để demo)
                    </label>
                    <p className="brew-demo-alert">Thanh toán là mô phỏng: không có giao dịch thật và không trừ tiền.</p>
                    <button type="button" className="brew-primary brew-full" disabled={submitting} onClick={payOrder}>
                      {submitting ? "Đang thanh toán..." : `Thanh toán ${money(order.total)}`}
                    </button>
                  </div>
                )}
              </form>

              <aside className="brew-summary">
                <h2>Đơn hàng của bạn</h2>
                {cart.items.map((item) => (
                  <div key={item.key}>
                    <span>
                      {item.product.name} ({item.size}) × {item.quantity}
                    </span>
                    <strong>{money(itemUnitPrice(item) * item.quantity)}</strong>
                  </div>
                ))}
                <div>
                  <span>Tạm tính</span>
                  <strong>{money(orderMatchesCart && order ? order.subtotal : cart.subtotal)}</strong>
                </div>
                {orderMatchesCart && order && order.discount > 0 && (
                  <div className="brew-discount">
                    <span>Giảm giá ({order.promoCode})</span>
                    <strong>−{money(order.discount)}</strong>
                  </div>
                )}
                <div className="brew-total">
                  <span>{orderMatchesCart ? "Tổng thanh toán" : "Tạm tính"}</span>
                  <strong>{money(orderMatchesCart && order ? order.total : cart.subtotal)}</strong>
                </div>
                {!orderMatchesCart && <p className="brew-summary-note">Khuyến mãi được áp dụng sau khi bấm &quot;Đặt hàng&quot;.</p>}
                <p className="brew-summary-note">
                  Xem lại đơn đã đặt ở <Link href="/orders/history">Đơn hàng của tôi</Link>.
                </p>
              </aside>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
