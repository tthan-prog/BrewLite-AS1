"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";
import { itemUnitPrice, useCart } from "@/lib/cart";
import { formatMoney as money, rememberReturnTo, statusLabel } from "@/lib/session";
import "../menu/menu.css";

type Notice = { text: string; tone: "info" | "error" } | null;
type PaymentMethod = "WALLET" | "CARD";

type ApiOrder = {
  id: number;
  status: string;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  total: number;
  createdAt: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
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
  // Giỏ hoặc mã khuyến mãi đổi thì đơn đã tạo không còn khớp: phải đặt lại.
  const orderMatchesCart = order !== null && orderSignature === signature;

  /** Bước 1: tạo đơn PENDING để máy chủ kiểm tra tồn kho, mã khuyến mãi và tính tổng tiền. */
  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.items.length || submitting) return;

    const token = sessionStorage.getItem("brewlite_token");
    if (!token) {
      // Giỏ hàng được lưu lại; đăng nhập xong quay về đúng bước thanh toán.
      rememberReturnTo("/checkout");
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
      rememberReturnTo("/checkout");
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

      
        <section className="brew-section">
          <Link className="brew-back" href="/cart">
            ← Quay lại giỏ hàng
          </Link>
          <h1 className="brew-page-title">Thanh toán</h1>

          {!cart.ready ? (
            <div className="brew-empty" role="status">
              <h3>Đang tải giỏ hàng...</h3>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="brew-empty">
              <h3>Giỏ hàng đang trống</h3>
              <Link className="brew-primary" href="/menu">
                Xem thực đơn
              </Link>
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
    </main>
  );
}
