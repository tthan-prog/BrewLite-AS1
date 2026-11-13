# Kịch bản kiểm thử backend – BrewLite (Assignment 1)

Kiểm thử API backend **không cần giao diện**, bằng Postman hoặc newman. Bộ kiểm thử: `docs/postman/brewlite-as1.postman_collection.json` (51 request, 85 kiểm tra tự động), môi trường `docs/postman/brewlite-as1-local.postman_environment.json`.

Bộ này bổ sung cho kiểm thử tự động trong mã nguồn (`backend`: 22 unit test, 33 test tích hợp). Kiểm thử tích hợp chạy trong quá trình phát triển; bộ Postman dùng để thử API trên hệ thống đang chạy và trình diễn từng chức năng.

## 1. Chuẩn bị

```powershell
docker compose up -d --build
docker compose exec backend npx prisma db seed --config prisma7.config.ts
```

Kiểm tra http://localhost:3001/health trả `{"status":"ok",...}`. Tài khoản mẫu: `customer@brewlite.com`, `staff@brewlite.com`, mật khẩu `password123`.

## 2. Cách chạy

**Postman (giao diện):**

1. Mở Postman, bấm **Import**, chọn 2 file trong `docs/postman/`.
2. Góc trên bên phải chọn môi trường **BrewLite AS1 – Local**.
3. Chạy toàn bộ: chuột phải vào collection **BrewLite AS1 – Kiểm thử backend**, chọn **Run collection**, bấm **Run**.
4. Thử từng chức năng: mở request rồi bấm **Send**. Các request dùng token, mã đơn lưu từ bước trước, nên chạy theo thứ tự từ trên xuống ít nhất một lần.

**newman (một lệnh, ở thư mục gốc repository):**

```powershell
npx newman run docs/postman/brewlite-as1.postman_collection.json -e docs/postman/brewlite-as1-local.postman_environment.json
```

Kết quả đạt: bảng cuối có `requests 51 / failed 0` và `assertions 85 / failed 0`. Bộ kiểm thử chạy lại nhiều lần được mà không cần seed lại (mỗi lần đăng ký một email mới).

## 3. Danh sách kịch bản

### Task 1 – Khởi tạo dự án

Backend chạy, có endpoint kiểm tra sức khỏe.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-01 | GET / trả lời chào | `GET /` (không token) | 200 OK; Nội dung Hello BrewLite! |
| BT-02 | GET /health | `GET /health` (không token) | 200 OK; status = ok |

### Task 2 – API sản phẩm

GET /products, /products/:id, /toppings.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-03 | GET /products – danh sách menu | `GET /products` (không token) | 200 OK; Có ít nhất 1 sản phẩm; Mỗi sản phẩm có id, name, price, imageUrl, stock |
| BT-04 | GET /products/:id – có | `GET /products/{{productId}}` (không token) | 200 OK; Đúng sản phẩm |
| BT-05 | GET /products/999999 – không có → 404 | `GET /products/999999` (không token) | 404 Not Found |
| BT-06 | GET /products/abc – id sai → 400 | `GET /products/abc` (không token) | 400 Bad Request |
| BT-07 | GET /toppings | `GET /toppings` (không token) | 200 OK; Có topping kèm giá |

### Task 7 – Đăng ký, đăng nhập (JWT)

bcrypt, JWT, guard; đăng ký luôn tạo CUSTOMER.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-08 | POST /auth/register – tài khoản mới → 201 | `POST /auth/register` (không token) | 201 Created; Trả accessToken và user CUSTOMER; Không trả mật khẩu |
| BT-09 | POST /auth/register – email trùng → 409 | `POST /auth/register` (không token) | 409 Conflict |
| BT-10 | POST /auth/register – email sai định dạng → 400 | `POST /auth/register` (không token) | 400 Bad Request |
| BT-11 | POST /auth/register – tự gửi role STAFF → 400 | `POST /auth/register` (không token) | 400: không cho tự cấp quyền |
| BT-12 | POST /auth/login – sai mật khẩu → 401 | `POST /auth/login` (không token) | 401 Unauthorized |
| BT-13 | POST /auth/login – khách hàng → 200 + JWT | `POST /auth/login` (không token) | 200 OK; Có accessToken |
| BT-14 | POST /auth/login – nhân viên (STAFF) | `POST /auth/login` (không token) | 200 OK; Vai trò STAFF |
| BT-15 | GET /auth/me – có token | `GET /auth/me` (khách hàng) | 200 OK; Đúng email |
| BT-16 | GET /auth/me – thiếu token → 401 | `GET /auth/me` (không token) | 401 Unauthorized |

### Task 4, 6 – Tạo đơn (giá theo size, topping; validate)

POST /orders: cần JWT và Idempotency-Key; máy chủ tính giá.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-17 | POST /orders – chưa đăng nhập → 401 | `POST /orders` (không token) | 401 Unauthorized |
| BT-18 | POST /orders – thiếu Idempotency-Key → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-19 | POST /orders – size sai → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-20 | POST /orders – số lượng 0 → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-21 | POST /orders – mức đường sai (45%) → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-22 | POST /orders – vượt 50 ly một món → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-23 | POST /orders – tạo đơn size L + topping + đường/đá → 201 PENDING | `POST /orders` (khách hàng) | 201 Created; Trạng thái PENDING; Tạm tính = (giá gốc + 10.000 size L + topping) × 2; Không giảm giá, tổng = tạm tính; Lưu mức đường 30%, đá 0% |

### Task 10b – Idempotency-Key khi tạo đơn

Gửi lại cùng khóa không tạo đơn thứ hai.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-24 | Gửi lại đúng request BT-23 (cùng khóa) → cùng đơn | `POST /orders` (khách hàng) | 2xx; Trả lại đúng đơn cũ, không tạo đơn mới |
| BT-25 | Cùng khóa nhưng nội dung khác → 409 | `POST /orders` (khách hàng) | 409 Conflict |

### Task 10d – Khuyến mãi; Task 10c – tồn kho

WELCOME10 giảm 10% (đơn từ 50.000đ); SAVE20K cần đơn từ 100.000đ; không bán quá tồn kho.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-26 | Mã WELCOME10 → giảm 10% | `POST /orders` (khách hàng) | 201 Created; Giảm đúng 10%; Tổng = tạm tính − giảm giá; Lưu mã WELCOME10 |
| BT-27 | Mã không tồn tại → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-28 | SAVE20K cho đơn dưới 100.000đ → 400 | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-29 | Đặt quá tồn kho → 400, kho không bị trừ | `POST /orders` (khách hàng) | 400 Bad Request |
| BT-30 | Kiểm tra tồn kho sản phẩm vẫn ≥ 0 | `GET /products/{{lastProductId}}` (khách hàng) | 200 OK; Tồn kho không âm |

### Task 8 – Thanh toán (Ví/Thẻ mô phỏng, idempotent)

POST /payments; simulate: FAIL để giả lập lỗi.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-31 | Thanh toán lỗi → PAYMENT_FAILED | `POST /payments` (khách hàng) | 200 OK; Thanh toán FAILED; Đơn PAYMENT_FAILED |
| BT-32 | Thử lại thành công → PAID | `POST /payments` (khách hàng) | 200 OK; Thanh toán SUCCESS; Đơn PAID; Số tiền = tổng đơn |
| BT-33 | Gửi lại cùng khóa thanh toán → không trả tiền lần hai | `POST /payments` (khách hàng) | 200 OK; replayed = true (trả kết quả cũ) |
| BT-34 | Thanh toán lại đơn đã PAID bằng khóa mới → 400 | `POST /payments` (khách hàng) | 400 Bad Request |
| BT-35 | Thanh toán đơn của người khác → 404 | `POST /payments` (khách khác) | 404 Not Found |

### Task 9 – Lịch sử, chi tiết đơn

GET /orders/me, /orders/:id; GET /orders chỉ STAFF.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-36 | GET /orders/me – có đơn vừa đặt, kèm tên món | `GET /orders/me` (khách hàng) | 200 OK; Có đơn vừa thanh toán, trạng thái PAID; Món có tên sản phẩm và tên topping |
| BT-37 | GET /orders/:id – chủ đơn → 200 | `GET /orders/{{orderId}}` (khách hàng) | 200 OK |
| BT-38 | GET /orders/:id – người khác → 404 | `GET /orders/{{orderId}}` (khách khác) | 404 Not Found (không lộ đơn của người khác) |
| BT-39 | GET /orders – khách hàng → 403 | `GET /orders` (khách hàng) | 403 Forbidden |
| BT-40 | GET /orders – nhân viên → 200 | `GET /orders` (nhân viên) | 200 OK; Là danh sách đơn |

### Task 10a – Máy trạng thái đơn hàng

STAFF chuyển PREPARING → READY → COMPLETED; chuyển sai bị chặn.

| Mã | Kịch bản | Request | Kết quả mong đợi |
|---|---|---|---|
| BT-41 | Khách hàng gọi PATCH trạng thái → 403 | `PATCH /orders/{{orderId}}/status` (khách hàng) | 403 Forbidden |
| BT-42 | STAFF đặt tay PAID → 400 | `PATCH /orders/{{promoOrderId}}/status` (nhân viên) | 400 Bad Request |
| BT-43 | Chuyển sai PENDING → READY → 400 | `PATCH /orders/{{promoOrderId}}/status` (nhân viên) | 400 Bad Request |
| BT-44 | Chuyển sai PAID → COMPLETED → 400 | `PATCH /orders/{{orderId}}/status` (nhân viên) | 400 Bad Request |
| BT-45 | PAID → PREPARING | `PATCH /orders/{{orderId}}/status` (nhân viên) | 200 OK; PREPARING |
| BT-46 | PREPARING → READY | `PATCH /orders/{{orderId}}/status` (nhân viên) | 200 OK; READY |
| BT-47 | READY → COMPLETED | `PATCH /orders/{{orderId}}/status` (nhân viên) | 200 OK; COMPLETED |
| BT-48 | Đơn COMPLETED không đi tiếp được → 400 | `PATCH /orders/{{orderId}}/status` (nhân viên) | 400 Bad Request |
| BT-49 | Ghi nhận tồn kho trước khi hủy | `GET /products/{{productId}}` (khách hàng) | 200 OK |
| BT-50 | Hủy đơn PENDING → CANCELLED | `PATCH /orders/{{promoOrderId}}/status` (nhân viên) | 200 OK; CANCELLED |
| BT-51 | Hủy đơn hoàn lại tồn kho (+2 ly) | `GET /products/{{productId}}` (khách hàng) | 200 OK; Tồn kho tăng đúng 2 |

## 4. Ghi chú

- Điểm thưởng (1 điểm / 10.000đ khi đơn PAID, thu hồi khi hủy) và kiểm thử 20 yêu cầu đặt đồng thời khi kho còn 5 được kiểm tra trong test tích hợp (`backend/test/assign1.e2e-spec.ts`), vì Postman chạy tuần tự từng request.
- Mỗi lần chạy tạo vài đơn mới và trừ tồn kho của sản phẩm còn hàng đầu tiên. Muốn đưa dữ liệu về ban đầu: chạy lại lệnh seed (xóa toàn bộ dữ liệu cũ).
- Các ô 404, 400 màu đỏ bên phải (ví dụ BT-05, BT-06) không phải lỗi. Đó là các test cố ý gửi dữ liệu sai để kiểm tra backend từ chối đúng cách. Dòng PASS xanh bên dưới mỗi ô cho biết backend trả đúng mã lỗi mong đợi. Khi trình bày, bạn có thể nói: “Mã đỏ là trường hợp lỗi có chủ đích; PASS nghĩa là hệ thống chặn đúng.”