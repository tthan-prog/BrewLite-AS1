# BrewLite Frontend

Next.js (App Router), React, TypeScript; giao diện mobile-first. Cách chạy toàn bộ hệ thống: xem [README gốc](../README.md).

## Chạy riêng frontend

Yêu cầu Node.js theo `.nvmrc` ở thư mục gốc và backend đang chạy ở cổng 3001.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Mở http://localhost:3000. Biến môi trường trong `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Các trang

| Trang | Nội dung | API dùng |
|---|---|---|
| `/` | Trang chủ | – |
| `/menu` | Thực đơn, tìm kiếm, lọc; chi tiết món (size, đường, đá, topping, số lượng) | `GET /products`, `GET /toppings` |
| `/cart` | Giỏ hàng | `GET /products` (kiểm tra tồn kho) |
| `/checkout` | Đặt đơn (mã khuyến mãi, tạm tính, giảm giá, tổng) rồi thanh toán Ví/Thẻ | `POST /orders`, `POST /payments` |
| `/login`, `/register` | Đăng nhập, đăng ký | `POST /auth/login`, `POST /auth/register` |
| `/orders/confirmation?id=` | Chi tiết đơn | `GET /orders/:id` |
| `/orders/history` | Lịch sử đơn | `GET /orders/me` |

## Mã nguồn chính

| Thư mục, file | Vai trò |
|---|---|
| `src/lib/api.ts` | Gọi API, đổi thông báo lỗi của máy chủ sang tiếng Việt |
| `src/lib/cart.tsx` | Giỏ hàng dùng chung (React Context), lưu localStorage |
| `src/lib/session.ts` | Phiên đăng nhập, trang quay lại sau khi đăng nhập, nhãn trạng thái đơn |
| `src/lib/products.ts`, `src/lib/orders.ts` | Tải thực đơn; kiểu dữ liệu đơn hàng |
| `src/components/site-header.tsx` | Thanh điều hướng; thanh tab ở đáy màn hình trên điện thoại |

Không đưa `.env.local`, token hoặc thông tin bí mật vào Git.
