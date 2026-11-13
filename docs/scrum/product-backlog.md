# Product Backlog – BrewLite

Nguồn: file đề BrewLite (10 task). Tiêu chí chấp nhận dưới đây tóm tắt từ đề; các quyết định thiết kế của nhóm được ghi riêng ở cột "Ghi chú". **C (PO tạm)** ước lượng điểm và chỉnh lại thứ tự ưu tiên; mỗi task đạt DoD được 1 điểm chấm (khác với story points ước lượng công sức).

Ký hiệu thành viên: A = Nguyễn Lê Nhựt Thắng, B = Hồ Thiên Ngân, C = Hà Thiên Long, D = Giản Thiên Lực (xem README gốc, Mục 14). Trạng thái: Chưa làm / Một phần / Hoàn thành.

> Cập nhật 23/10/2026: Task 1 đến 10 đã hoàn thiện đầu-cuối, có test, và **nhóm đã nghiệm thu chéo, xác nhận đạt DoD** (xem `dod-nghiem-thu.md`).

| # | User story | Tiêu chí chấp nhận (tóm tắt từ đề) | Story points | Sprint | Người làm | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | Là nhóm phát triển, chúng tôi muốn có khung dự án frontend và backend chạy được, để cả nhóm phát triển trên một nền chung | Hai thư mục frontend (Next.js) và backend (NestJS); chạy được "Hello"; có README, Git, `.env.example` | 2 | 1 | A | Hoàn thành | Đã build, test, chạy thử; đạt DoD (nhóm nghiệm thu 23/10) |
| 2 | Là khách hàng, tôi muốn xem danh sách đồ uống, để chọn món | `GET /products` trả JSON menu (id, tên, giá, ảnh) từ dữ liệu mẫu hoặc CSDL | 3 | 1 | A (B: schema, seed) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 3 | Là khách hàng, tôi muốn thấy menu dạng lưới trên web, để dễ chọn | Next.js gọi `/products`, hiển thị lưới sản phẩm; có trạng thái loading và rỗng | 3 | 1 | D | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 4 | Là khách hàng, tôi muốn xem chi tiết và chọn size, topping, để đặt đúng ý | Màn hình chi tiết; chọn size S/M/L và topping; giá tính theo tùy chọn | 3 | 1 | D (A, C) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 5 | Là khách hàng, tôi muốn quản lý giỏ hàng, để xem tổng tiền trước khi thanh toán | Thêm, sửa số lượng, xóa; lưu state (Zustand hoặc Context); tự tính tổng; badge số lượng | 3 | 2 | D | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 6 | Là khách hàng, tôi muốn tạo đơn từ giỏ hàng, để đặt đồ uống | `POST /orders` nhận giỏ hàng, validate (class-validator), lưu đơn PENDING, trả mã đơn | 5 | 2 | B (A) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 7 | Là khách hàng, tôi muốn đăng ký và đăng nhập, để đặt đơn và xem lịch sử | `POST /auth/register`, `/auth/login`; băm mật khẩu (bcrypt); phát JWT; guard bảo vệ route đặt đơn | 5 | 2 | A (backend); C (giao diện) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 8 | Là khách hàng, tôi muốn thanh toán đơn bằng ví hoặc thẻ, để không cần tiền mặt | Mock payment: chọn Ví/Thẻ, `POST /payments`; đơn chuyển PAID khi thành công, PAYMENT_FAILED khi lỗi | 5 | 3 | A (backend); D (giao diện) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 9 | Là khách hàng, tôi muốn xem xác nhận và lịch sử đơn, để theo dõi đơn đã đặt | Màn hình xác nhận (mã đơn, trạng thái); `GET /orders/me`; docker-compose chạy cả 3 dịch vụ; README; demo end-to-end | 3 | 3 | C (giao diện); A (API, docker, README) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|
| 10 | Là cửa hàng, tôi muốn xử lý đơn và thanh toán đúng nghiệp vụ, để tránh sai sót khi đặt đồng thời | State machine đơn hàng; thanh toán idempotent (`Idempotency-Key`); kiểm soát tồn kho đồng thời; khuyến mãi và điểm thưởng; **có test chứng minh (a) chặn chuyển trạng thái sai, (b) gửi 2 lần cùng key chỉ tạo 1 đơn, (c) đặt đồng thời không vượt tồn kho** | 8 | 3 | B (10b, 10c); A (10a, 10d) | Hoàn thành | Đã chạy đầu-cuối, có test; đạt DoD (nhóm nghiệm thu 23/10)|

## Quyết định thiết kế đã chọn (áp dụng cho backlog)

1. Task 6 tạo đơn ở PENDING; Task 8 chuyển PAID hoặc PAYMENT_FAILED.
2. Làm Task 7 trước Task 6.
3. Endpoint `PATCH /orders/:id/status` cho role STAFF để chuyển PREPARING, READY, COMPLETED; không làm giao diện barista.
4. Bổ sung dữ liệu: bảng Topping, bảng Promotion, trường role trong User, các trường subtotal/discount/promoCode/total trong Order; tồn kho ban đầu theo `Product.stock`; sau đó mở rộng sang kho nguyên liệu, trừ khi thanh toán (ADR-005).
5. Điểm thưởng: 1 điểm cho mỗi 10.000đ, cộng khi đơn PAID.

## Việc ngoài 10 task (nhóm tự thêm)

| Việc | Người làm | Ghi chú |
|---|---|---|
| Báo cáo LaTeX Assignment 1 (1 file) | Xem README gốc và kế hoạch | Viết song song theo Sprint |
| Thư mục `docs/scrum` và biên bản họp | A | Cập nhật mỗi ngày |
