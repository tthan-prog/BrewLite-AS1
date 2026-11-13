# Nhiệm vụ và phân công Assignment 1 (giữa kì)

- **Hạn nộp:** 15/11/2026
- **Nhóm:** 4 thành viên: A Nguyễn Lê Nhựt Thắng, B Hồ Thiên Ngân, C Hà Thiên Long, D Giản Thiên Lực.
- **Nguồn dữ liệu:** `docs/scrum/product-backlog.md`, `sprint-1/2/3-backlog.md`, `dod-nghiem-thu.md`, `docs/tien-do.md`.
- **Cách đọc:** ngày bắt đầu và hạn lấy từ Sprint Backlog (Sprint 1: 14–18/10; Sprint 2: 19–22/10; Sprint 3: 23–25/10/2026). Phần trăm hoàn thành là 100% khi task đã đạt DoD theo biên bản nhóm; phần dở ghi `[ước lượng]`.
- **Điều kiện chấm:** mỗi task đạt Definition of Done được 1 điểm (10 task, tổng 10 điểm). Nghiệm thu chéo thực hiện bằng cách chạy Docker, kết quả ghi trong `dod-nghiem-thu.md`.

## A. Nguyễn Lê Nhựt Thắng (Scrum Master, nền tảng, backend)

| Nhiệm vụ | Sản phẩm đầu ra | Ngày bắt đầu | Hạn hoàn thành | Trạng thái | % | Ghi chú |
|---|---|---|---|---|---|---|
| Task 1: Khởi tạo dự án và cấu trúc | Monorepo, README, `.env.example`, `/health`, Docker Compose | 13/10/2026 | 18/10/2026 | Hoàn thành (13/10) | 100 | Commit "Initial commit" 13/10 |
| Task 2 (phần API): danh sách sản phẩm | `GET /products`, `/products/:id`, `/toppings` | 19/10/2026 | 22/10/2026 | Hoàn thành (23/10) | 100 | Chuyển từ Sprint 2 sang Sprint 3 |
| Task 7 (phần backend): Đăng ký, đăng nhập (JWT) | `POST /auth/register`, `/auth/login`, bcrypt, `JwtAuthGuard` | 19/10/2026 | 22/10/2026 | Hoàn thành (23/10) | 100 | Giao diện đăng nhập do Hà Thiên Long làm |
| Task 8: Thanh toán không tiền mặt | `POST /payments`, PAID hoặc PAYMENT_FAILED, thử lại | 23/10/2026 | 25/10/2026 | Hoàn thành (23/10) | 100 | Giao diện thanh toán do Giản Thiên Lực làm |
| Task 9 (API, Docker, README) | `GET /orders/me`, docker-compose chạy 3 dịch vụ, README, demo | 23/10/2026 | 25/10/2026 | Hoàn thành (23/10) | 100 | Docker chạy thử trên máy khác, kết quả đạt |
| Task 10 (10a, 10d): máy trạng thái, khuyến mãi, điểm thưởng | Test (a) chặn chuyển trạng thái sai; `WELCOME10`; 1 điểm / 10.000 đồng | 23/10/2026 | 25/10/2026 | Hoàn thành (23/10) | 100 | Cùng Hồ Thiên Ngân làm Task 10 |
| Scrum Master: biên bản Sprint, Burndown | `docs/scrum/minutes/01–06`, `burndown-*.csv` | 14/10/2026 | 25/10/2026 | Hoàn thành | 100 | Biên bản 01–06 đã hoàn chỉnh (01/11) |
| Nghiệm thu chéo Task 3, 4, 5, 6, 9 và Task 10 (10b, 10c) | Dòng nghiệm thu trong `dod-nghiem-thu.md` | 23/10/2026 | 24/10/2026 | Đạt (23/10) | 100 | Chạy Docker |
| Báo cáo LaTeX Assignment 1 (2–3 trang, theo mẫu SGU) | `docs/report/main.tex` | 29/10/2026 | 13/11/2026 | Nội dung đã hoàn chỉnh (3 trang nội dung + phụ lục); đã điền MSSV; chờ build PDF cuối | 95 `[ước lượng]` | Nộp 15/11/2026 |
| Rà soát và hoàn thiện trước khi nộp | Nhánh `fix/as1-review`: giỏ hàng lưu state, thanh toán hai bước, lỗi tiếng Việt, lưu mức đường/đá, trang `/cart`, `/checkout`, thanh tab điện thoại; 33 test tích hợp | 13/11/2026 | 13/11/2026 | Hoàn thành | 100 | Thử tay 6 bước luồng đặt hàng đạt |

## B. Hồ Thiên Ngân (Backend: dữ liệu, đơn hàng)

| Nhiệm vụ | Sản phẩm đầu ra | Ngày bắt đầu | Hạn hoàn thành | Trạng thái | % | Ghi chú |
|---|---|---|---|---|---|---|
| Task 2 (phần dữ liệu): ERD, Prisma schema, migration, seed | `schema.prisma`, `prisma/migrations`, seed 12 sản phẩm | 20/10/2026 | 22/10/2026 | Hoàn thành (21/10) | 100 | ERD chốt 20/10; schema và seed hoàn thành 21/10 |
| Task 6: API tạo đơn | `POST /orders`: JWT, validate, PENDING | 19/10/2026 | 22/10/2026 | Hoàn thành (22/10) | 100 | Có idempotency và kiểm soát tồn kho |
| Task 10 (10b, 10c): thanh toán idempotent, tồn kho đồng thời | Test (b) cùng khóa chỉ một đơn; test (c) 20 yêu cầu song song, kho 5 | 21/10/2026 | 25/10/2026 | Hoàn thành (23/10) | 100 | Cùng Nguyễn Lê Nhựt Thắng làm Task 10; idempotency và tồn kho đồng thời commit từ 21–22/10 (trong API đơn hàng), test và chốt Task 10 ngày 23/10 |
| Nghiệm thu chéo Task 1, 7 | Dòng nghiệm thu trong `dod-nghiem-thu.md` | 23/10/2026 | 24/10/2026 | Đạt (23/10) | 100 | Chạy Docker |

## C. Hà Thiên Long (Frontend, kiểm thử, Product Owner tạm)

| Nhiệm vụ | Sản phẩm đầu ra | Ngày bắt đầu | Hạn hoàn thành | Trạng thái | % | Ghi chú |
|---|---|---|---|---|---|---|
| Task 7 (phần giao diện): đăng ký, đăng nhập | Trang `/login`, `/register` | 19/10/2026 | 22/10/2026 | Hoàn thành giao diện (22/10) | 100 | Cùng Nguyễn Lê Nhựt Thắng (backend) làm Task 7 |
| Task 9 (phần giao diện): xác nhận, lịch sử đơn | Trang xác nhận, trang lịch sử đơn | 23/10/2026 | 25/10/2026 | Hoàn thành (23/10) | 100 | Cùng Nguyễn Lê Nhựt Thắng (API, Docker, README) làm Task 9 |
| Product Vision, FR/NFR, user story (báo cáo chương 1 và 3) | Nội dung yêu cầu trong báo cáo | 14/10/2026 | 13/11/2026 | Đã đưa vào báo cáo LaTeX | 100 | |
| Kiểm thử: chạy test, kiểm tra yêu cầu | Kết quả unit và tích hợp (22, 32 test) | 14/10/2026 | 25/10/2026 | Hoàn thành | 100 | Chạy lại ngày 13/11 trên tag `assign1-final`: 22/22, 32/32 đạt |
| Product Owner tạm: ước lượng điểm, ưu tiên Product Backlog | `product-backlog.md` | 14/10/2026 | 18/10/2026 | Hoàn thành | 100 | |
| Nghiệm thu chéo Task 8 và Task 10 (10a, 10d) | Dòng nghiệm thu trong `dod-nghiem-thu.md` | 23/10/2026 | 24/10/2026 | Đạt (23/10) | 100 | Chạy Docker |

## D. Giản Thiên Lực (Frontend)

| Nhiệm vụ | Sản phẩm đầu ra | Ngày bắt đầu | Hạn hoàn thành | Trạng thái | % | Ghi chú |
|---|---|---|---|---|---|---|
| Task 3: Trang Menu | Lưới sản phẩm, loading, rỗng, lỗi | 14/10/2026 | 18/10/2026 | Hoàn thành giao diện (22/10) | 100 | Thực tế gộp vào Sprint 2 |
| Task 4: Chi tiết, size, topping | Chọn size S/M/L và topping, tính giá | 14/10/2026 | 18/10/2026 | Hoàn thành giao diện (22/10) | 100 | Thực tế gộp vào Sprint 2 |
| Task 5: Giỏ hàng | Thêm, sửa, xóa, tổng tiền, badge | 19/10/2026 | 22/10/2026 | Hoàn thành giao diện (22/10) | 100 | |
| Ảnh minh họa cho báo cáo | Ảnh chụp màn hình luồng chính | 23/10/2026 | 25/10/2026 | Thay ảnh ngày 13/11 | 100 | Bộ ảnh ban đầu (cùng Hà Thiên Long) chụp từ bản chạy của Assignment 2 nên không dùng; ngày 13/11 Nguyễn Lê Nhựt Thắng chụp lại từ bản Assignment 1 chạy bằng Docker (`docs/report/figures`) |
| Nghiệm thu chéo Task 2 | Dòng nghiệm thu trong `dod-nghiem-thu.md` | 23/10/2026 | 24/10/2026 | Đạt (23/10) | 100 | Chạy Docker |
