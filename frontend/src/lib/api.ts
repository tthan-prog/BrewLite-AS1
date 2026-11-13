const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type ApiError = { message?: string | string[]; statusCode?: number };

// Thông báo lỗi của máy chủ (một số bằng tiếng Anh) đổi sang câu tiếng Việt cho khách hàng.
const ERROR_TRANSLATIONS: [RegExp, string][] = [
  [/^Insufficient stock for product/i, "Một món trong giỏ không còn đủ số lượng. Vui lòng giảm số lượng hoặc chọn món khác."],
  [/^Promotion code is invalid/i, "Mã khuyến mãi không tồn tại."],
  [/^Promotion has expired/i, "Mã khuyến mãi đã hết hạn."],
  [/^Order does not meet promotion minimum/i, "Đơn hàng chưa đạt giá trị tối thiểu để dùng mã khuyến mãi này."],
  [/^Idempotency-Key was already used/i, "Yêu cầu này đã được gửi với nội dung khác. Vui lòng tải lại trang và thử lại."],
  [/^Idempotency-Key header is required/i, "Thiếu mã yêu cầu. Vui lòng thử lại."],
  [/^(Product|Topping) \d+ not found/i, "Một món trong giỏ không còn bán. Vui lòng xóa món đó khỏi giỏ hàng."],
  [/^Order \d+ not found/i, "Không tìm thấy đơn hàng."],
  [/^(Invalid order item|Invalid topping|userId and at least one item are required)/i, "Thông tin món trong giỏ không hợp lệ. Vui lòng kiểm tra lại giỏ hàng."],
  [/^Order status was changed concurrently/i, "Trạng thái đơn vừa thay đổi. Vui lòng tải lại trang."],
  [/must be an email/i, "Email không đúng định dạng."],
  [/password must be longer than or equal to 6/i, "Mật khẩu phải có ít nhất 6 ký tự."],
  [/^Failed to fetch|NetworkError|Load failed/i, "Không kết nối được tới máy chủ BrewLite. Vui lòng thử lại sau."],
];

export function toVietnameseMessage(message: string): string {
  for (const [pattern, text] of ERROR_TRANSLATIONS) {
    if (pattern.test(message)) return text;
  }
  return message;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new Error(toVietnameseMessage("Failed to fetch"));
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const body = payload as ApiError;
    const messages = Array.isArray(body?.message)
      ? body.message
      : [body?.message || (typeof payload === "string" && payload) || `Yêu cầu thất bại (mã ${response.status})`];
    throw new Error([...new Set(messages.map(toVietnameseMessage))].join(" "));
  }

  return payload as T;
}

export { API_URL };
