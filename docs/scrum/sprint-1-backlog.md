# Sprint 1 Backlog

- **Thời gian:** 14/10 – 18/10/2026
- **Sprint Goal:** Nền tảng dự án chạy được; có dữ liệu mẫu và menu hiển thị được (Task 1, 2, 3, 4).
- **Daily Scrum:** hằng ngày 20:00, tối đa 15 phút, qua nhóm chat.
- **Sprint Review và Retrospective:** 18/10/2026, 20:00 (xem `minutes/02-sprint1-review-retro.md`).
- **Tổng điểm cam kết:** 11 điểm (T1 = 2, T2 = 3, T3 = 3, T4 = 3).

## Việc trong Sprint

| # | Việc | Task | Người làm | Điểm | Trạng thái cuối Sprint | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Khởi tạo dự án, cấu trúc, README, `.env.example` | 1 | A | 2 | Hoàn thành (13/10) | Commit "Initial commit" 13/10 |
| 2 | Prisma schema, migration, seed (sản phẩm, topping, user, mã khuyến mãi) | 2 | B (A) | 3 | Một phần | Schema và seed xong 21/10 (B); chuyển sang Sprint 2 |
| 3 | `GET /products`, `GET /products/:id` | 2 | A | 3 (gộp Task 2) | Chưa làm | Chuyển sang Sprint 2, phụ thuộc seed |
| 4 | Trang Menu: lưới, loading, trạng thái rỗng | 3 | D | 3 | Chưa làm | Chuyển sang Sprint 2 |
| 5 | Trang chi tiết: size, topping, tính giá | 4 | D (A, C) | 3 | Chưa làm | Chuyển sang Sprint 2 |
| 6 | Báo cáo: Product Vision, FR/NFR, user story | – | C | – | Đang làm | Bản nháp chương 1 và 3 |
| 7 | Cập nhật Burndown, ghi biên bản | – | A | – | Đang làm | Hằng ngày |

## Rủi ro và vướng mắc

| Ngày | Rủi ro / vướng mắc | Người xử lý | Kết quả |
|---|---|---|---|
| 14/10 | ERD bổ sung (subtotal, discount, promoCode, total) chưa chốt nên B chưa bắt đầu schema | A, B | Chốt ERD trong tuần; B bắt đầu 20/10 |
| 16/10 | Môi trường Node, Postgres khác nhau giữa các máy | A | Dùng docker-compose cho Postgres; ghi vào README mục 6 |
| 18/10 | Hết Sprint nhưng mới xong Task 1 | A | Chuyển Task 2, 3, 4 sang Sprint 2 và ghi nhận ở Retrospective |

## Kết quả Sprint

- Task hoàn thành đạt DoD: Task 1 (2 trên 11 điểm).
- Task chưa hoàn thành và lý do: Task 2, 3, 4 (9 điểm) do ERD chốt muộn, việc song song giữa các vai trò chưa bắt đầu đúng hạn.
- Increment demo được: khung frontend/backend chạy được, README hướng dẫn cài đặt.
