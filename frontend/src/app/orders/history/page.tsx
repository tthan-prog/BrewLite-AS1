"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { statusTone, type ApiOrderDetail } from "@/lib/orders";
import { formatMoney, rememberReturnTo, statusLabel } from "@/lib/session";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<ApiOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needLogin, setNeedLogin] = useState(false);

  useEffect(() => {
    let alive = true;
    const token = sessionStorage.getItem("brewlite_token");
    if (!token) rememberReturnTo("/orders/history");
    const request: Promise<ApiOrderDetail[]> = token
      ? apiRequest<ApiOrderDetail[]>("/orders/me", { headers: { Authorization: `Bearer ${token}` } })
      : Promise.reject(new Error("Bạn cần đăng nhập để xem lịch sử đơn hàng."));
    request
      .then((data) => {
        if (alive) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Không thể tải lịch sử đơn hàng.");
        setNeedLogin(!token);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <div className="container">
        <span className="eyebrow">Tài khoản BrewLite</span>
        <h1 className="page-title" style={{ marginTop: 16 }}>
          Lịch sử đơn hàng
        </h1>
        <p className="page-intro">Theo dõi trạng thái những đơn hàng của bạn.</p>
        <div className="orders-layout">
          <section className="content-card">
            {loading ? (
              <div className="empty-state">
                <h3>Đang tải đơn hàng...</h3>
              </div>
            ) : error ? (
              <div className="empty-state">
                <h3>Chưa thể tải lịch sử</h3>
                <p>{error}</p>
                {needLogin && (
                  <Link className="btn btn-primary" href="/login">
                    Đăng nhập
                  </Link>
                )}
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <h3>Bạn chưa có đơn hàng</h3>
                <p>Khi bạn hoàn tất đơn đầu tiên, thông tin sẽ được hiển thị ở đây.</p>
                <Link className="btn btn-primary" href="/menu">
                  Xem thực đơn
                </Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày đặt</th>
                      <th>Món</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <Link className="text-link" href={`/orders/confirmation?id=${order.id}`}>
                            #{order.id}
                          </Link>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                        <td className="order-lines">
                          {order.items.map((item) => `${item.product.name} (${item.size}) × ${item.quantity}`).join(", ")}
                        </td>
                        <td>
                          <span className={`status-pill ${statusTone(order.status)}`} title={order.status}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td>{formatMoney(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <aside className="content-card">
            <h3>Thông tin riêng tư</h3>
            <p className="subtext" style={{ marginBottom: 18 }}>
              Lịch sử chỉ hiển thị đơn của tài khoản đang đăng nhập. Bấm vào mã đơn để xem chi tiết.
            </p>
            <Link className="btn btn-primary full" href="/menu">
              Đặt đồ uống
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
