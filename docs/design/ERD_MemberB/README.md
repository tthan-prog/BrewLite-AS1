# ERD – BrewLite

Sơ đồ quan hệ dữ liệu của BrewLite, khớp với `backend/prisma/schema.prisma`. Thiết kế dữ liệu: Hồ Thiên Ngân (B).

- Nguồn sơ đồ: `BrewLite_ERD_MemberB.mmd` (Mermaid).
- Ảnh: `BrewLite_ERD.png`. Tạo lại ảnh: `npx @mermaid-js/mermaid-cli -i BrewLite_ERD_MemberB.mmd -o BrewLite_ERD.png -b white -s 2`.

## Bảng và quan hệ

| Bảng | Vai trò | Quan hệ chính |
|---|---|---|
| `User` | Tài khoản khách (CUSTOMER) và nhân viên (STAFF); mật khẩu băm bcrypt; điểm thưởng | 1-N `Order`, 1-N `Payment`, 1-N `IdempotencyRecord` |
| `Product` | Đồ uống: giá gốc, tồn kho, nhóm, hình | 1-N `OrderItem` |
| `Topping` | Topping và giá | N-N `OrderItem` qua `OrderItemTopping` |
| `Order` | Đơn hàng: trạng thái, tạm tính, giảm giá, mã khuyến mãi, tổng tiền | 1-N `OrderItem`, 1-N `Payment`, 1-1 `IdempotencyRecord` |
| `OrderItem` | Một món trong đơn: số lượng, giá một ly (giá gốc + phụ thu size), size, mức đường, mức đá | N-1 `Order`, N-1 `Product` |
| `OrderItemTopping` | Topping của một món, lưu giá tại thời điểm đặt | Khóa chính `(orderItemId, toppingId)` |
| `Promotion` | Mã khuyến mãi: giảm theo % hoặc số tiền, đơn tối thiểu, hạn dùng | Đơn lưu `promoCode` (không dùng khóa ngoại) |
| `IdempotencyRecord` | Chống tạo đơn trùng khi gửi lại cùng `Idempotency-Key` | Duy nhất theo `(userId, key)`; mỗi bản ghi gắn 1 đơn |
| `Payment` | Lần thanh toán mô phỏng (Ví/Thẻ), thành công hoặc thất bại | Duy nhất theo `(userId, idempotencyKey)` |

## Quyết định thiết kế

- Khóa chính là số nguyên tự tăng.
- `role`, `status`, `type`, `method` dùng enum của PostgreSQL.
- Giá lưu lại trong `OrderItem.unitPrice` và `OrderItemTopping.price`, nên đổi giá sản phẩm sau này không làm sai đơn cũ.
- Mức đường, mức đá chỉ nhận 0, 30, 50, 70, 100 (%); mặc định 100.
