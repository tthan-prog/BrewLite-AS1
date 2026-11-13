# Bảng tiến độ Assignment 1 (cập nhật 23/10/2026; mục 2 bổ sung 31/10/2026, mục 4 bổ sung 01/11/2026)

Hạn nộp: 15/11/2026 (giảng viên dời từ 02/11/2026). Điểm: 10 task, mỗi task 1 điểm, tổng 10 điểm.

## 1. Tiến độ 10 task

| # | Task | Sprint | Người làm chính | Điểm ước lượng | Code | Test | Nghiệm thu chéo | Bằng chứng |
|---|---|---|---|---|---|---|---|---|
| 1 | Khởi tạo dự án | 1 | A | 2 | Xong | Có | Đạt (nhóm xác nhận 23/10) | Commit "Initial commit" 13/10; `/health` |
| 2 | API sản phẩm | 1 | A (B: schema, seed) | 3 | Xong | e2e đạt | Đạt | `GET /products`, `/toppings`; seed 12 sản phẩm |
| 3 | Trang Menu | 1 | D | 3 | Xong | Chạy thử trình duyệt | Đạt | Trang `/menu` gọi API |
| 4 | Chi tiết, size, topping | 1 | D | 3 | Xong | e2e đạt (giá server) | Đạt | Size +0/+5.000/+10.000đ |
| 5 | Giỏ hàng | 2 | D | 3 | Xong | Chạy thử trình duyệt | Đạt | Thêm, sửa, xóa, tổng tiền, badge |
| 6 | API tạo đơn | 2 | B | 5 | Xong | e2e đạt | Đạt | `POST /orders` (JWT, validate, PENDING) |
| 7 | Đăng ký, đăng nhập | 2 | A (backend); C (giao diện) | 5 | Xong | e2e đạt | Đạt | bcrypt, JWT, guard, `/login`, `/register` |
| 8 | Thanh toán | 3 | A | 5 | Xong | e2e đạt | Đạt | `POST /payments`, PAID/PAYMENT_FAILED, thử lại |
| 9 | Xác nhận, lịch sử, bàn giao | 3 | C (A: API, Docker, README) | 3 | Xong | Chạy thử trình duyệt | Đạt | `/orders/me`, trang xác nhận, Docker |
| 10 | Nghiệp vụ nâng cao | 3 | A, B | 8 | Xong | 3 test bắt buộc đạt | Đạt | State machine, idempotency, tồn kho, khuyến mãi, điểm |

Tổng: 10/10 task xong code; nghiệm thu chéo ghi nhận Đạt theo xác nhận của nhóm.

## 2. Chất lượng

| Hạng mục | Kết quả |
|---|---|
| Unit test (Vitest) | 22 đạt (tại 23/10) |
| Tích hợp e2e (Supertest, PostgreSQL thật) | 32 đạt (tại 23/10) |
| Test bắt buộc Task 10 | (a) chặn chuyển trạng thái sai, (b) cùng Idempotency-Key chỉ 1 đơn, (c) 20 yêu cầu song song khi kho còn 5 thì đúng 5 thành công: **đạt cả ba** |
| Lint, build backend | Sạch |
| Lint, build frontend | Đạt |
| Chạy lại ngày 13/11/2026 trên tag `assign1-final` | 22/22 unit, 32/32 tích hợp đạt (ảnh `docs/report/figures/ev11-unit-test-22.png`, `ev12-e2e-test-32.png`) |
| Docker Compose | Chạy được 3 dịch vụ |

## 3. Scrum

| Sprint | Thời gian | Điểm đầu | Điểm còn lại cuối Sprint | Ghi chú |
|---|---|---|---|---|
| 1 | 14–18/10 | 11 | 9 | Trễ: chỉ xong Task 1 |
| 2 | 19–22/10 | 22 (13 mới + 9 tồn) | 8 | Còn Task 7 backend và API products |
| 3 | 23–25/10 | 24 (16 mới + 8 tồn) | 0 | Code xong 23/10 |

Tài liệu: Product Backlog, 3 Sprint Backlog, Burndown, 6 biên bản, quy trình DoD, README 2.0, báo cáo LaTeX (`docs/report`).

## 4. Việc còn lại trước khi nộp

| Việc | Người | Hạn | Trạng thái |
|---|---|---|---|
| Ghi tên người nghiệm thu thật vào `dod-nghiem-thu.md` và báo cáo mục 3.1 | Nguyễn Lê Nhựt Thắng | 24/10 | Hoàn thành (01/11) |
| Điền MSSV, lớp, nhóm vào báo cáo LaTeX (ảnh đã được chèn) | A, D | 12/11 | Đã điền MSSV trên trang bìa (10/11); lớp và số nhóm chỉ cần trong tin nhắn nộp bài |
| Hoàn chỉnh 6 biên bản họp cho đúng thực tế | Nguyễn Lê Nhựt Thắng | 25/10 | Hoàn thành (01/11) |
| Họp Sprint 3 Review và Retrospective, cập nhật biên bản 06 | Cả nhóm | 25/10 | Đã họp 25/10; biên bản 06 đã hoàn chỉnh (01/11) |
| Rà soát và hoàn thiện báo cáo 26/10 – 14/11 | Cả nhóm | 26/10 – 14/11 | Đang thực hiện |
| Hạn kết thúc 15/11: chốt nội dung 12/11, build PDF cuối và duyệt chung 13/11, nộp 15/11 | Cả nhóm | 15/11 | Đang thực hiện |

## 5. Rủi ro

| Rủi ro | Mức | Xử lý |
|---|---|---|
| Nghiệm thu chéo thực hiện bằng cách chạy Docker, chưa có Approve trên Pull Request | Thấp | Ghi rõ trong `dod-nghiem-thu.md` (chú thích D2) |
| Burndown Sprint 1 trễ | Thấp | Đã ghi trung thực trong Retrospective |
| Làm song song Assignment 2 cùng hạn | Cao | Assignment 2 làm ở repository riêng, không dùng chung mã nguồn hay tài liệu với repository này |
