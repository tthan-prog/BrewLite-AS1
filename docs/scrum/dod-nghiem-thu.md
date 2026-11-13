# Quy trình nghiệm thu chéo theo Definition of Done (DoD)

Mục đích: mỗi task trong 10 task của Assignment 1 có **bằng chứng** đạt DoD để được tính 1 điểm. Hạn hoàn thành: **tối 24/10/2026**. Điều phối: Nguyễn Lê Nhựt Thắng.

## 1. Quy tắc

- Người nghiệm thu **không** phải người viết task đó.
- Task của Hồ Thiên Ngân, Hà Thiên Long, Giản Thiên Lực do Nguyễn Lê Nhựt Thắng nghiệm thu; task của Nguyễn Lê Nhựt Thắng chia đều cho ba thành viên còn lại theo bảng phân công ở mục 2.
- Cách nghiệm thu: chạy Docker (mục 3) rồi thử theo bảng mục 5; kết quả ghi vào bảng mục 6. Chụp ảnh màn hình làm bằng chứng nếu được.
- Task không đạt: ghi rõ lý do, báo Nguyễn Lê Nhựt Thắng để người viết sửa, sau đó nghiệm thu lại.

## 2. Phân công người nghiệm thu

| Task | Nội dung | Người viết chính | Người nghiệm thu |
|---|---|---|---|
| 1 | Khởi tạo dự án | Nguyễn Lê Nhựt Thắng | Hồ Thiên Ngân |
| 2 | API sản phẩm | Nguyễn Lê Nhựt Thắng (Hồ Thiên Ngân: schema, seed) | Giản Thiên Lực |
| 3 | Trang Menu | Giản Thiên Lực | Nguyễn Lê Nhựt Thắng |
| 4 | Chi tiết, size, topping | Giản Thiên Lực | Nguyễn Lê Nhựt Thắng |
| 5 | Giỏ hàng | Giản Thiên Lực | Nguyễn Lê Nhựt Thắng |
| 6 | API tạo đơn | Hồ Thiên Ngân | Nguyễn Lê Nhựt Thắng |
| 7 | Đăng ký, đăng nhập | Nguyễn Lê Nhựt Thắng (backend); Hà Thiên Long (giao diện) | Hồ Thiên Ngân |
| 8 | Thanh toán | Nguyễn Lê Nhựt Thắng (backend); Giản Thiên Lực (giao diện) | Hà Thiên Long |
| 9 | Xác nhận, lịch sử đơn | Hà Thiên Long (giao diện); Nguyễn Lê Nhựt Thắng (API, Docker, README) | Nguyễn Lê Nhựt Thắng |
| 10 | Nghiệp vụ nâng cao | Hồ Thiên Ngân (10b, 10c); Nguyễn Lê Nhựt Thắng (10a, 10d) | Nguyễn Lê Nhựt Thắng (10b, 10c); Hà Thiên Long (10a, 10d) |

## 3. Chuẩn bị (mỗi người nghiệm thu làm một lần)

```powershell
git checkout main
git pull
cp .env.example .env            # PowerShell: Copy-Item .env.example .env
docker compose up --build
# terminal thứ hai, chỉ chạy lần đầu:
docker compose exec backend npx prisma db seed --config prisma7.config.ts
```

Mở http://localhost:3000/menu. Tài khoản mẫu: `customer@brewlite.com` và `staff@brewlite.com`, mật khẩu `password123`. Mã khuyến mãi: `WELCOME10`, `SAVE20K`.

## 4. Bốn mục DoD áp dụng cho mọi task

| Mục | Cách kiểm tra |
|---|---|
| D1. Chạy được, không lỗi build | Docker chạy đủ 3 dịch vụ; hoặc `cd backend; npm run build` và `cd frontend; npm run build` không lỗi |
| D2. Commit rõ ràng, được review | Có commit của task trong `git log`; Pull Request có ít nhất 1 Approve của người khác (không phải người viết) |
| D3. Validate và loading/lỗi | API trả 400 khi gửi dữ liệu sai; giao diện hiển thị loading và thông báo lỗi |
| D4. README có hướng dẫn chạy | Làm theo README mục 6 chạy được task đó |

## 5. Bảng kiểm tra riêng từng task

Cách thử nhanh API (PowerShell, dùng `curl.exe`; hoặc dùng Postman):

```powershell
curl.exe http://localhost:3001/products
curl.exe -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"email\":\"customer@brewlite.com\",\"password\":\"password123\"}"
```

| Task | Việc cần thử (đạt khi...) |
|---|---|
| 1 | `http://localhost:3001/` trả "Hello BrewLite!"; `/health` trả `{"status":"ok",...}`; frontend mở được |
| 2 | `GET /products` trả 12 sản phẩm có id, name, price, imageUrl; `GET /products/:id` trả đúng sản phẩm; id không tồn tại trả 404 |
| 3 | Trang `/menu` hiển thị lưới sản phẩm từ API; có trạng thái loading; tắt backend thì hiện thông báo lỗi |
| 4 | Mở chi tiết, chọn size S/M/L và topping thì giá thay đổi (M +5.000, L +10.000, cộng topping) |
| 5 | Thêm, sửa số lượng, xóa sản phẩm trong giỏ; tổng tiền và số lượng trên biểu tượng giỏ cập nhật đúng |
| 6 | Đăng nhập, đặt hàng thì tạo đơn PENDING và trả mã đơn; thiếu `Idempotency-Key` hoặc dữ liệu sai trả 400; chưa đăng nhập trả 401 |
| 7 | Đăng ký tài khoản mới rồi đăng nhập được; sai mật khẩu bị từ chối; email trùng bị từ chối; token dùng được cho `GET /auth/me` |
| 8 | Thanh toán bằng Ví hoặc Thẻ thì đơn thành PAID; chọn mô phỏng lỗi thì thành PAYMENT_FAILED và thử lại được; giỏ được giữ khi lỗi |
| 9 | Sau khi thanh toán hiện trang xác nhận có mã đơn và trạng thái; `/orders/history` liệt kê đơn của tôi; `docker compose up --build` chạy ổn |
| 10 | Chạy `npm test` và `npm run test:e2e` trong `backend` thì đạt. Xem 3 nhóm test: 10a chặn chuyển trạng thái sai, 10b cùng `Idempotency-Key` chỉ tạo 1 đơn, 10c đặt đồng thời không vượt tồn kho. Thử thủ công: STAFF chuyển PAID, PREPARING, READY, COMPLETED đúng thứ tự, chuyển sai bị từ chối |

## 6. Ghi kết quả

Người nghiệm thu điền bảng này (hoặc gửi cho Nguyễn Lê Nhựt Thắng điền). Cập nhật tiếp vào README mục 8.2 và báo cáo mục 3.1.

| Task | Người nghiệm thu | Ngày | D1 | D2 | D3 | D4 | Kết luận | Ghi chú / link PR |
|---|---|---|---|---|---|---|---|---|
| 1 | Hồ Thiên Ngân | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 2 | Giản Thiên Lực | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 3 | Nguyễn Lê Nhựt Thắng | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 4 | Nguyễn Lê Nhựt Thắng | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 5 | Nguyễn Lê Nhựt Thắng | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 6 | Nguyễn Lê Nhựt Thắng | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 7 | Hồ Thiên Ngân | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 8 | Hà Thiên Long | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 9 | Nguyễn Lê Nhựt Thắng | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |
| 10 | Nguyễn Lê Nhựt Thắng (10b, 10c); Hà Thiên Long (10a, 10d) | 23/10 | Đạt | Xác nhận nhóm\* | Đạt | Đạt | Đạt | Chạy Docker, đạt |

Điền "Đạt" hoặc "Chưa đạt" cho từng cột D1 đến D4. Kết luận "Đạt" khi cả 4 cột đều đạt (riêng D2 xem chú thích bên dưới).

\* D2 (commit rõ ràng, được review): ghi theo hiện trạng GitHub ngày 31/10/2026, các Pull Request của Assignment 1 chưa có Approve hoặc comment review; kết luận "Đạt" dựa trên nghiệm thu chéo bằng cách chạy Docker ngày 23/10/2026.

## 7. Tiến trình

| Mốc | Việc | Người làm |
|---|---|---|
| Sáng 23/10 | Nguyễn Lê Nhựt Thắng gửi bảng phân công nghiệm thu vào nhóm chat Zalo | Nguyễn Lê Nhựt Thắng |
| Tối 23/10 (họp Sprint Planning 3) | Nghiệm thu chéo bằng cách chạy Docker, ghi kết quả vào mục 6 | Cả nhóm |
| 24/10 | Nguyễn Lê Nhựt Thắng tổng hợp, cập nhật README mục 8.2 và báo cáo mục 3.1 | Nguyễn Lê Nhựt Thắng |
| Tối 24/10 | Mốc cắt phạm vi: task chưa đạt thì sửa hoặc đưa vào backlog | Cả nhóm |
| 25/10 | Sprint 3 Review và Retrospective | Cả nhóm |

**Ghi chú:** kết quả trên do Nguyễn Lê Nhựt Thắng tổng hợp sau buổi nghiệm thu chéo ngày 23/10/2026.
