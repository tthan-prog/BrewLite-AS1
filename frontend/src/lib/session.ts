// Phiên đăng nhập và trang cần quay lại sau khi đăng nhập.

const RETURN_KEY = "brewlite_return_to";

type AuthResult = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: { id?: number | string; name?: string | null; email?: string };
};

export function saveSession(result: AuthResult) {
  const token = result.accessToken ?? result.access_token ?? result.token;
  if (token) sessionStorage.setItem("brewlite_token", token);
  if (result.user) sessionStorage.setItem("brewlite_user", JSON.stringify(result.user));
  window.dispatchEvent(new Event("brewlite-auth"));
}

/** Ghi nhớ trang đang đứng (ví dụ bước thanh toán) trước khi chuyển sang đăng nhập. */
export function rememberReturnTo(path: string) {
  sessionStorage.setItem(RETURN_KEY, path);
}

/** Lấy trang cần quay lại rồi xóa; chỉ nhận đường dẫn nội bộ. */
export function takeReturnTo(fallback = "/menu") {
  const path = sessionStorage.getItem(RETURN_KEY);
  sessionStorage.removeItem(RETURN_KEY);
  return path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  PAYMENT_FAILED: "Thanh toán thất bại",
  PREPARING: "Đang pha chế",
  READY: "Sẵn sàng nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

export function statusLabel(status?: string) {
  if (!status) return "Đang cập nhật";
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}
