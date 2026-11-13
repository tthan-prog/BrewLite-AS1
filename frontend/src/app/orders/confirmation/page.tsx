"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { lineTotal, statusTone, type ApiOrderDetail } from "@/lib/orders";
import { formatMoney, statusLabel } from "@/lib/session";

type LoadState =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "error"; message: string; needLogin: boolean }
  | { kind: "ready"; order: ApiOrderDetail };

export default function OrderConfirmationPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  // Lấy mã đơn từ ?id= (hoặc đơn vừa thanh toán trong phiên) rồi đọc chi tiết từ GET /orders/:id.
  useEffect(() => {
    let alive = true;
    const id = new URLSearchParams(window.location.search).get("id") ?? sessionStorage.getItem("brewlite_last_order");
    const token = sessionStorage.getItem("brewlite_token");
    const request: Promise<LoadState> = !id
      ? Promise.resolve({ kind: "none" })
      : !token
        ? Promise.resolve({ kind: "error", message: "Bạn cần đăng nhập để xem đơn hàng.", needLogin: true })
        : apiRequest<ApiOrderDetail>(`/orders/${encodeURIComponent(id)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(
            (order): LoadState => ({ kind: "ready", order }),
            (error: unknown): LoadState => ({
              kind: "error",
              message: error instanceof Error ? error.message : "Không tải được đơn hàng.",
              needLogin: false,
            }),
          );
    request.then((next) => {
      if (alive) setState(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  const order = state.kind === "ready" ? state.order : null;
  const paid = order?.status === "PAID";

  return (
    <main className="page-shell">
      <div className="container" style={{ maxWidth: 850 }}>
        <div className="content-card" style={{ textAlign: "center", padding: "42px 28px" }}>
          <span className="eyebrow">Thông tin đơn hàng</span>
          <h1 className="page-title" style={{ marginTop: 16 }}>
            {paid ? "Đặt hàng thành công" : "Chi tiết đơn hàng"}
          </h1>
          <p className="page-intro" style={{ maxWidth: 560, margin: "0 auto" }}>
            {paid
              ? "Cảm ơn bạn! Đơn đã được thanh toán, mời bạn tới quầy nhận đồ uống khi đơn sẵn sàng. Thanh toán là mô phỏng nên không có giao dịch thật."
              : "Thông tin đơn hàng của bạn tại BrewLite."}
          </p>

          {state.kind === "loading" && (
            <div className="notice" style={{ maxWidth: 560, margin: "26px auto 0" }}>
              Đang tải đơn hàng...
            </div>
          )}
          {state.kind === "none" && (
            <div className="notice" style={{ maxWidth: 560, margin: "26px auto 0", textAlign: "left" }}>
              Chưa có đơn hàng nào vừa được đặt. Hãy chọn đồ uống ở trang Thực đơn.
            </div>
          )}
          {state.kind === "error" && (
            <div className="form-error" style={{ maxWidth: 560, margin: "26px auto 0", textAlign: "left" }}>
              {state.message} {state.needLogin && <Link className="text-link" href="/login">Đăng nhập</Link>}
            </div>
          )}

          {order && (
            <div style={{ maxWidth: 560, margin: "28px auto 0", textAlign: "left" }} className="content-card">
              <span className={`status-pill ${statusTone(order.status)}`}>
                {statusLabel(order.status)} · {order.status}
              </span>
              <div className="detail-label" style={{ marginTop: 18 }}>
                Mã đơn hàng
              </div>
              <div className="order-number">#{order.id}</div>
              <div className="detail-label">Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}</div>

              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>
                        {item.product.name} × {item.quantity}
                      </strong>
                      <small>
                        Size {item.size} · Đường {item.sugar}% · Đá {item.ice}%
                        {item.toppings.length > 0 && ` · ${item.toppings.map((t) => t.topping.name).join(", ")}`}
                      </small>
                    </div>
                    <span>{formatMoney(lineTotal(item))}</span>
                  </li>
                ))}
              </ul>

              <div className="order-sum">
                <div>
                  <span>Tạm tính</span>
                  <span>{formatMoney(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div>
                    <span>Giảm giá ({order.promoCode})</span>
                    <span>−{formatMoney(order.discount)}</span>
                  </div>
                )}
                <div className="grand">
                  <span>Tổng thanh toán</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="btn btn-primary" href="/orders/history">
              Xem lịch sử đơn hàng
            </Link>
            <Link className="btn btn-outline" href="/menu">
              Tiếp tục đặt món
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
