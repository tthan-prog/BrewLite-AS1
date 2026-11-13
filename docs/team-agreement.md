# Thỏa thuận nhóm – BrewLite

## 1. Mục tiêu

- Hoàn thành BrewLite đạt Definition of Done cho càng nhiều task càng tốt, theo thứ tự ưu tiên: Task 1–9 trước, Task 10 sau.
- Nộp đúng hạn: báo cáo, mã nguồn, demo. (Hạn nộp Assignment 1: 15/11/2026.)
- Mọi thành viên đều viết code và đều có commit trên Git.

## 2. Vai trò

| Ký hiệu | Họ tên | Vai trò |
|---|---|---|
| A | Nguyễn Lê Nhựt Thắng | Scrum Master + Dev nền tảng, backend (API sản phẩm, xác thực, thanh toán, state machine) |
| B | Hồ Thiên Ngân | Dev backend (ERD, schema, seed, đơn hàng, idempotency, tồn kho) |
| C | Hà Thiên Long | Dev frontend, kiểm thử, PO tạm |
| D | Giản Thiên Lực | Dev frontend (menu, chi tiết, giỏ hàng, giao diện thanh toán) |

Vai trò là "người chịu trách nhiệm chính", không phải "chỉ một mình làm".

## 3. Họp và liên lạc

- Daily Scrum: mỗi ngày lúc 20:00, tối đa 15 phút, trao đổi qua nhóm chat Zalo.
- Họp cuối Sprint (Review và Retrospective): 18/10, 22/10, 25/10.
- Kênh liên lạc chính: Zalo (nhóm chat). Quyết định quan trọng phải được ghi lại bằng văn bản trong nhóm chat hoặc biên bản.
- Phản hồi tin nhắn liên quan đến công việc trong vòng 12 giờ ban ngày.
- Vắng họp hoặc không kịp việc: báo trước cho A càng sớm càng tốt.

## 4. Quy tắc làm việc

- Mỗi việc có **một người chịu trách nhiệm chính** và một hạn cụ thể.
- Không push trực tiếp lên `main`; mỗi thành viên làm trên nhánh riêng của mình, gộp vào `main` qua pull request và có ít nhất một người khác xem.
- Hoàn thành nghĩa là đã đẩy lên GitHub, được review và báo cho nhóm.
- Task chỉ tính xong khi đạt Definition of Done và được **người khác** nghiệm thu (nghiệm thu chéo bằng cách chạy Docker, xem `docs/scrum/dod-nghiem-thu.md`).
- Thay đổi phạm vi chỉ được chốt khi cả nhóm đồng thuận. Khi không đồng thuận thì bỏ phiếu; nếu hòa, Scrum Master có phiếu quyết định.
- Không đưa mật khẩu, khóa bí mật, file `.env` lên Git.

## 5. Khi có thành viên chậm trễ

1. Hỏi nguyên nhân sớm (trong cùng ngày trễ), nhắn riêng, với tinh thần hỗ trợ.
2. Hỗ trợ: ghép cặp, chia nhỏ việc hoặc giảm độ khó.
3. Điều chỉnh: chia lại việc nếu quá tải; thỏa thuận hạn mới bằng văn bản trong nhóm chat.
4. Ghi nhận: nếu tái diễn 2 lần, trao đổi trực tiếp và ghi lại số việc chưa hoàn thành.
5. Báo giảng viên nếu đã làm các bước trên mà không cải thiện, kèm bằng chứng (lịch sử commit, tin nhắn); làm sớm, không chờ sát hạn.

## 6. Ghi nhận đóng góp

- Đóng góp của từng người được đối chiếu với lịch sử commit và pull request trên GitHub, cộng với phần báo cáo mỗi người viết.
- Bảng phân công và đóng góp trong báo cáo do A tổng hợp và cả nhóm xác nhận.

## 7. Xác nhận

Mỗi thành viên ghi họ tên và ngày để xác nhận đã đọc và đồng ý.

| Ký hiệu | Họ tên | Ngày xác nhận |
|---|---|---|
| A | Nguyễn Lê Nhựt Thắng | 20/10 |
| B | Hồ Thiên Ngân | 20/10 |
| C | Hà Thiên Long | 20/10 |
| D | Giản Thiên Lực | 20/10 |
