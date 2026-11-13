# Sprint Review và Retrospective – Sprint 3 – 25/10/2026

- **Thời gian:** 25/10/2026, 20:00 – 21:15
- **Hình thức:** Họp trực tuyến, trao đổi bằng tin nhắn trong nhóm chat Zalo
- **Chủ trì:** Nguyễn Lê Nhựt Thắng (Scrum Master)
- **Người ghi biên bản:** Nguyễn Lê Nhựt Thắng
- **Có mặt:** Nguyễn Lê Nhựt Thắng, Hồ Thiên Ngân, Hà Thiên Long, Giản Thiên Lực
- **Vắng:** Không

## Phần 1. Sprint Review

| Task | Demo được? | Đạt DoD? | Người nghiệm thu | Ghi chú |
|---|---|---|---|---|
| 2 (API sản phẩm) | Có | Đạt | Giản Thiên Lực | `/products`, `/toppings` |
| 7 (Đăng ký, đăng nhập) | Có | Đạt | Hồ Thiên Ngân | JWT, bcrypt, phân quyền |
| 8 (Thanh toán) | Có | Đạt | Hà Thiên Long | Ví/Thẻ, PAID/PAYMENT_FAILED, thử lại |
| 9 (Xác nhận, lịch sử) | Có | Đạt | Nguyễn Lê Nhựt Thắng | Docker chạy 3 dịch vụ; đã chạy tốt trên máy khác |
| 10 (Nghiệp vụ nâng cao) | Có | Đạt | Nguyễn Lê Nhựt Thắng (10b, 10c); Hà Thiên Long (10a, 10d) | 22 unit, 32 tích hợp đạt |

- **Sprint Goal đã đạt chưa:** Đạt. Đường găng Task 7 → 8 → 9 → 10 hoàn thành.
- **Increment demo được:** Nguyễn Lê Nhựt Thắng demo toàn bộ chức năng đã làm trên localhost (Docker): menu, giỏ hàng, đăng nhập, thanh toán, xác nhận đơn, lịch sử; STAFF đổi trạng thái đơn qua API. Tất cả chạy được.
- **Điều chỉnh Product Backlog sau Review:** đưa vào backlog sau: giao diện barista, cổng thanh toán thật, lưu đường/đá vào đơn.

## Phần 2. Sprint Retrospective

| Điều làm tốt, nên giữ | Điều chưa tốt, cần cải thiện |
|---|---|
| Làm theo đường găng, có test chứng minh nghiệp vụ Task 10 | Bắt đầu muộn, Sprint 1 trễ 9 điểm |
| README và Docker giúp chạy lại dễ dàng | Chốt mô hình dữ liệu muộn |
| Nghiệm thu chéo bằng cách chạy Docker trước khi nộp | Phân bố commit chưa đều giữa các thành viên |

### Hành động cụ thể cho Sprint sau

| Hành động | Người làm | Kiểm tra vào |
|---|---|---|
| Chốt ERD ngay Sprint Planning đầu tiên | Hồ Thiên Ngân | Đầu Sprint tiếp theo |
| Mỗi thành viên có commit hoặc PR trong từng Sprint | Cả nhóm | Mỗi Daily |
| Review PR trong 24 giờ | Cả nhóm | Mỗi Sprint Review |

## Phần 3. Burndown

- Điểm còn lại cuối Sprint: 0 trên 24 điểm.
- Nhận xét: Sprint 3 bắt đầu bằng 8 điểm tồn từ Sprint 2; toàn bộ hoàn thành ngay từ 23/10 nên đường thực tế nằm dưới đường lý tưởng.
