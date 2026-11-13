# Sprint 2 Backlog

- **Thời gian:** 19/10 – 22/10/2026
- **Sprint Goal:** Người dùng xem menu, quản lý giỏ hàng và tạo đơn; có đăng nhập (Task 5, 6, 7) và hoàn tất phần tồn từ Sprint 1 (Task 2, 3, 4).
- **Daily Scrum:** hằng ngày 20:00 qua nhóm chat.
- **Sprint Review và Retrospective:** 22/10/2026, 20:00 (xem `minutes/04-sprint2-review-retro.md`).
- **Tổng điểm:** 22 điểm = 13 điểm mới (T5 = 3, T6 = 5, T7 = 5) + 9 điểm tồn từ Sprint 1 (T2, T3, T4).

## Việc trong Sprint

| # | Việc | Task | Người làm | Điểm | Trạng thái cuối Sprint | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Prisma schema, migration, seed | 2 | B | 3 | Hoàn thành (21/10) | Commit "setup Prisma database and seed" |
| 2 | Trang Menu, trang chi tiết (size, topping) | 3, 4 | D | 6 | Hoàn thành giao diện (22/10) | Commit "add BrewLite menu cart checkout and order history" |
| 3 | Giỏ hàng: thêm, sửa, xóa, tổng tiền, badge | 5 | D | 3 | Hoàn thành giao diện (22/10) | Cùng commit trên |
| 4 | `POST /orders`: validate, trạng thái PENDING | 6 | B (A) | 5 | Hoàn thành (22/10) | Có idempotency và kiểm soát tồn kho đồng thời |
| 5 | Đăng ký, đăng nhập, JWT, guard | 7 | A (C) | 5 | Một phần | Giao diện đăng nhập xong 22/10; backend auth chuyển sang Sprint 3 |
| 6 | `GET /products` nối menu với dữ liệu thật | 2 | A | (đã tính ở T2) | Chưa xong | Chuyển sang Sprint 3 |

## Rủi ro và vướng mắc

| Ngày | Rủi ro / vướng mắc | Người xử lý | Kết quả |
|---|---|---|---|
| 19/10 | Đang trễ 9 điểm từ Sprint 1 | A | Theo mốc cắt phạm vi 21/10 trong kế hoạch: ưu tiên Task 6, 7 trước, hoãn Task 10 |
| 21/10 | Xung đột nhánh khi gộp Prisma với nhánh team | A, B | Gộp và đồng bộ nhánh team (commit merge 21/10) |
| 22/10 | Backend auth và `GET /products` chưa lên main | A | Đưa vào Sprint 3 làm đầu tiên |

## Kết quả Sprint

- Hoàn thành: Task 2 (schema, seed), Task 3, 4, 5 (giao diện), Task 6 → 14/22 điểm.
- Chưa hoàn thành: Task 7 (backend), `GET /products` → 8 điểm chuyển sang Sprint 3.
- Increment demo được: giao diện menu, giỏ hàng, lịch sử đơn; API tạo đơn có idempotency.
