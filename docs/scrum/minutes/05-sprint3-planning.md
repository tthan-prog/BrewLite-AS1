# Biên bản họp – Sprint Planning 3 và nghiệm thu chéo

- **Thời gian:** 23/10/2026, 20:00 – 21:00
- **Hình thức:** Họp trực tuyến, trao đổi bằng tin nhắn trong nhóm chat Zalo
- **Chủ trì:** Nguyễn Lê Nhựt Thắng (Scrum Master)
- **Người ghi biên bản:** Nguyễn Lê Nhựt Thắng
- **Có mặt:** Nguyễn Lê Nhựt Thắng, Hồ Thiên Ngân, Hà Thiên Long, Giản Thiên Lực
- **Vắng:** Không

## 1. Nội dung và quyết định

| # | Nội dung | Quyết định |
|---|---|---|
| 1 | Phạm vi Sprint 3 | Task 8, 9, 10 (16 điểm) + Task 2, 7 tồn (8 điểm) = 24 điểm. Phần code các task đã được đẩy lên Git rạng sáng 23/10; Sprint 3 tập trung nghiệm thu chéo, chạy end-to-end bằng Docker và hoàn thiện tài liệu |
| 2 | Điểm ước lượng | T8 = 5, T9 = 3, T10 = 8 |
| 3 | Phân công | Hà Thiên Long: xác nhận, lịch sử, test; Nguyễn Lê Nhựt Thắng: payment, state machine, Docker, README, tích hợp; Hồ Thiên Ngân: idempotency, tồn kho; Giản Thiên Lực: giao diện, slide |
| 4 | Mốc | 26/10 – 14/11 rà DoD, hoàn thiện báo cáo và tập demo; 15/11 nộp |
| 5 | Nghiệm thu chéo | Không tự nghiệm thu; nghiệm thu bằng cách chạy Docker (`docker compose up --build`). Task của Hồ Thiên Ngân, Hà Thiên Long, Giản Thiên Lực do Nguyễn Lê Nhựt Thắng nghiệm thu. Task của Nguyễn Lê Nhựt Thắng: Task 1 và 7 do Hồ Thiên Ngân; Task 2 do Giản Thiên Lực; Task 8 và phần 10a, 10d của Task 10 do Hà Thiên Long |
| 6 | Kết quả nghiệm thu | Cả 10 task đạt Definition of Done; kết quả ghi trong `docs/scrum/dod-nghiem-thu.md` |

## 2. Việc cần làm sau họp

| Việc | Người làm | Hạn | Trạng thái |
|---|---|---|---|
| Chụp ảnh minh họa cho báo cáo | Giản Thiên Lực, Hà Thiên Long | 25/10 | Mới giao |
| Chạy docker-compose trên máy khác | Nguyễn Lê Nhựt Thắng | 24/10 | Mới giao |

## 3. Vướng mắc cần hỗ trợ

- Chưa.

## 4. Mức tiến độ chung

Đúng tiến độ: phần code đã hoàn tất, còn lại tài liệu.
