# Sprint 3 Backlog

- **Thời gian:** 23/10 – 25/10/2026
- **Sprint Goal:** Hoàn thành đường găng Task 7 → 8 → 9 → 10, có test chứng minh nghiệp vụ, docker-compose chạy end-to-end.
- **Daily Scrum:** hằng ngày 20:00 qua nhóm chat.
- **Sprint Review và Retrospective:** 25/10/2026, 20:00, xem `minutes/06-sprint3-review-retro.md`.
- **Tổng điểm:** 24 điểm = 16 điểm mới (T8 = 5, T9 = 3, T10 = 8) + 8 điểm tồn từ Sprint 2 (T2 API, T7).

## Việc trong Sprint

| # | Việc | Task | Người làm | Điểm | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | `GET /products`, `/products/:id`, `/toppings` | 2 | A | 3 | Hoàn thành, đạt DoD (23/10) | |
| 2 | Auth: register, login, JWT, `JwtAuthGuard`, phân quyền CUSTOMER/STAFF | 7 | A (C) | 5 | Hoàn thành, đạt DoD (23/10) | |
| 3 | Thanh toán mock: Ví/Thẻ, PAID/PAYMENT_FAILED, thử lại | 8 | A (D) | 5 | Hoàn thành, đạt DoD (23/10) | |
| 4 | Xác nhận đơn, lịch sử đơn `GET /orders/me`, docker-compose chạy 3 dịch vụ | 9 | C (D, A) | 3 | Hoàn thành, đạt DoD (23/10) | Docker đã chạy thử trên máy A |
| 5 | State machine, idempotency, tồn kho đồng thời, khuyến mãi, điểm thưởng + test 10a/10b/10c | 10 | B (10b, 10c), A (10a, 10d) | 8 | Hoàn thành, đạt DoD (23/10) | 22 unit test + 32 e2e test đạt |
| 6 | Nghiệm thu chéo từng task (A–D, không tự nghiệm thu) | 1–10 | A, B, C, D | – | Hoàn thành (23/10) | Kết quả ở `dod-nghiem-thu.md` |
| 7 | Báo cáo LaTeX Assignment 1, chụp ảnh minh họa | – | D, C, A | – | Đang làm (còn điền MSSV) | |
| 8 | Từ 26/10 rà lại, tập demo | – | A | – | Theo kế hoạch | |

## Rủi ro

| Ngày | Rủi ro | Người xử lý | Hướng xử lý |
|---|---|---|---|
| 23/10 | Nghiệm thu chéo chưa có bằng chứng | A | Nghiệm thu bằng cách chạy Docker; kết quả ghi ở `dod-nghiem-thu.md` |

## Kết quả Sprint

- Hoàn thành: toàn bộ 24 điểm (Task 2, 7, 8, 9, 10), đạt DoD sau nghiệm thu chéo.
- Tồn sang backlog sau: giao diện barista, cổng thanh toán thật, lưu đường/đá vào đơn.
- Increment demo được: luồng đầu-cuối từ menu đến xác nhận đơn bằng docker-compose.
