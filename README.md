# BrewLite

Ứng dụng web đặt đồ uống không dùng tiền mặt: khách xem thực đơn, chọn size, mức đường, mức đá và topping, thêm vào giỏ, đăng nhập, đặt đơn, thanh toán (mô phỏng Ví/Thẻ) và theo dõi đơn hàng; nhân viên (STAFF) xử lý đơn qua API.

Bài tập lớn 1 (giữa kì) môn **Công nghệ Phần mềm**, Trường Đại học Sài Gòn, học kỳ I năm học 2026–2027, làm theo quy trình **Agile Scrum**. Hạn nộp: 15/11/2026.

## Trạng thái dự án

| Hạng mục | Tình trạng |
|---|---|
| 10 task | Hoàn thành, chạy đầu-cuối từ giao diện đến CSDL; cả 10 task đạt Definition of Done qua nghiệm thu chéo (`docs/scrum/dod-nghiem-thu.md`) |
| Kiểm thử | 22 unit test và 33 test tích hợp (PostgreSQL thật) đạt; bộ Postman 51 request, 85 kiểm tra đạt; lint và build backend, frontend đạt |
| Docker Compose | Chạy đủ 3 dịch vụ (db, backend, frontend); đã chạy trên Windows (Docker Desktop + WSL 2) |
| Bằng chứng Scrum | Product Backlog, 3 Sprint Backlog, Burndown, 6 biên bản (`docs/scrum/`) |
| Báo cáo | LaTeX tại `docs/report/` |

Chi tiết từng task ở [Mục 8](#8-api-giao-diện-và-tiến-độ-task).

---

## Mục lục

1. [Giới thiệu và phạm vi](#1-giới-thiệu-và-phạm-vi)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Môi trường phát triển](#3-môi-trường-phát-triển)
4. [Công cụ làm việc](#4-công-cụ-làm-việc)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Cài đặt và chạy](#6-cài-đặt-và-chạy)
7. [Biến môi trường](#7-biến-môi-trường)
8. [API, giao diện và tiến độ task](#8-api-giao-diện-và-tiến-độ-task)
9. [Nghiệp vụ đơn hàng](#9-nghiệp-vụ-đơn-hàng)
10. [Kiểm thử và chất lượng code](#10-kiểm-thử-và-chất-lượng-code)
11. [Quy ước làm việc nhóm](#11-quy-ước-làm-việc-nhóm)
12. [Tài liệu Scrum và báo cáo](#12-tài-liệu-scrum-và-báo-cáo)
13. [Xử lý sự cố thường gặp](#13-xử-lý-sự-cố-thường-gặp)
14. [Thành viên nhóm](#14-thành-viên-nhóm)

---

## 1. Giới thiệu và phạm vi

**Product Vision:** BrewLite giúp khách hàng đặt và thanh toán đồ uống không dùng tiền mặt chỉ trong vài chạm, giảm thời gian xếp hàng và hạn chế sai sót khi nhiều người đặt cùng lúc.

**Luồng chính:**

```
Xem thực đơn → Chọn món (size, đường, đá, topping) → Thêm vào giỏ → Xem giỏ hàng
   → Đăng nhập (nếu chưa) → Đặt đơn, nhập mã khuyến mãi → Xem tổng tiền → Thanh toán (Ví/Thẻ mô phỏng)
   → Xác nhận đơn → Xem lịch sử đơn
```

**Chức năng:**

| Nhóm | Chức năng |
|---|---|
| Thực đơn | Danh sách đồ uống từ API, lọc theo nhóm, tìm kiếm; báo "Hết hàng", "Còn N ly"; trạng thái đang tải, rỗng, lỗi |
| Chi tiết món | Chọn size S/M/L, mức đường, mức đá, topping, số lượng; giá cập nhật ngay |
| Giỏ hàng | Thêm, sửa số lượng, xóa; tổng tiền; số món trên nút Giỏ hàng; lưu trong React Context và localStorage nên không mất khi chuyển trang, đăng nhập hoặc tải lại |
| Tài khoản | Đăng ký, đăng nhập (JWT); đăng nhập xong quay lại đúng bước đang làm; phân quyền CUSTOMER/STAFF |
| Đặt đơn và thanh toán | Bước 1 đặt đơn: máy chủ kiểm tra tồn kho, mã khuyến mãi, tính tạm tính, giảm giá, tổng tiền. Bước 2 thanh toán Ví/Thẻ mô phỏng; lỗi thì giữ giỏ và thử lại trên cùng đơn |
| Đơn hàng | Trang xác nhận có từng món, size, đường, đá, topping, giảm giá, tổng; lịch sử đơn của tài khoản |
| Nghiệp vụ backend | Máy trạng thái đơn hàng, Idempotency-Key, kiểm soát tồn kho đồng thời, mã khuyến mãi, điểm thưởng |
| Giao diện | Mobile-first: trên điện thoại có thanh tab cố định ở đáy (Thực đơn, Giỏ hàng, Đơn hàng); thông báo lỗi bằng tiếng Việt |

**Ngoài phạm vi:** giao diện cho barista (STAFF thao tác qua API), cổng thanh toán thật, quản lý kho nguyên liệu, quên mật khẩu, hồ sơ cá nhân, khách tự hủy đơn.

---

## 2. Công nghệ sử dụng

| Lớp | Công nghệ |
|---|---|
| Frontend | Next.js 16.4, React 19.3, TypeScript, TailwindCSS 4 |
| Backend | NestJS 12, TypeScript, REST API |
| CSDL và ORM | PostgreSQL 16, Prisma 7 (adapter pg) |
| Xác thực | JWT (`@nestjs/jwt`), bcryptjs |
| Validate dữ liệu | class-validator, class-transformer (whitelist DTO) |
| Kiểm thử | Vitest, Supertest (e2e trên PostgreSQL thật) |
| Chất lượng code | oxlint và Prettier (backend), ESLint (frontend) |
| Đóng gói | Docker, Docker Compose |

---

## 3. Môi trường phát triển

### 3.1. Yêu cầu phần mềm

| Công cụ | Yêu cầu |
|---|---|
| Node.js | 24.15 trở lên (khuyến nghị, có trong `.nvmrc`), hoặc 22.22.3 trở lên |
| npm | Đi kèm Node.js; cả nhóm chỉ dùng npm |
| Git | Bản mới |
| Docker Desktop | Có lệnh `docker compose`; trên Windows nên bật WSL 2 |
| Trình duyệt | Chrome hoặc Edge bản mới |

Một số gói của NestJS CLI yêu cầu `node: ^22.22.3 || ^24.15.0 || >=26.0.0`; Node thấp hơn vẫn chạy nhưng npm cảnh báo `EBADENGINE`. Dùng `nvm use` để thống nhất.

### 3.2. Cổng mặc định

| Dịch vụ | Cổng |
|---|---|
| Frontend | 3000 |
| Backend | 3001 |
| PostgreSQL | 5432 |

---

## 4. Công cụ làm việc

| Nhóm | Công cụ | Cách dùng |
|---|---|---|
| Mã nguồn | Git, GitHub | Mỗi chức năng một nhánh, gộp qua Pull Request vào `main` |
| Liên lạc | Nhóm chat | Daily Scrum, đăng biên bản |
| Tài liệu | Thư mục `docs/` | Báo cáo LaTeX, tài liệu Scrum |
| Sơ đồ | Mermaid, draw.io | ERD (`docs/design/ERD_MemberB`), state machine |
| Chạy và đóng gói | Docker Compose | `docker compose up --build` |
| Kiểm thử | Vitest, Supertest, Postman/newman | Unit, e2e, test bắt buộc Task 10; thử API thủ công |

Phạm vi chạy: bằng Docker Compose trên máy cá nhân để demo.

---

## 5. Cấu trúc thư mục

```
brewlite/
├── backend/                       # NestJS
│   ├── src/
│   │   ├── auth/                  # đăng ký, đăng nhập, JWT, guard, phân quyền
│   │   ├── products/              # /products, /toppings
│   │   ├── orders/                # tạo đơn, state machine, lịch sử, đổi trạng thái
│   │   ├── payments/              # thanh toán mô phỏng
│   │   ├── prisma/                # PrismaService
│   │   ├── app.setup.ts, main.ts, app.module.ts
│   │   └── generated/prisma/      # Prisma client (sinh tự động, không commit)
│   ├── prisma/                    # schema.prisma, migrations/, seed.ts
│   ├── test/                      # e2e: assign1.e2e-spec.ts, app.e2e-spec.ts
│   ├── prisma7.config.ts          # cấu hình Prisma 7
│   ├── Dockerfile
│   └── package.json
├── frontend/                      # Next.js (App Router)
│   └── src/
│       ├── app/                   # các trang (xem Mục 8.2)
│       ├── components/            # thanh điều hướng, chân trang
│       └── lib/                   # gọi API, giỏ hàng (Context), phiên đăng nhập
├── docs/
│   ├── team-agreement.md          # thỏa thuận nhóm
│   ├── phan-cong.md, tien-do.md, bang-dong-gop.md
│   ├── kich-ban-test-backend.md   # kịch bản kiểm thử API
│   ├── postman/                   # bộ kiểm thử Postman
│   ├── message-to-lecturer.md     # tin nhắn nộp bài
│   ├── scrum/                     # backlog, burndown, minutes/
│   ├── design/                    # ERD
│   └── report/                    # báo cáo LaTeX (main.tex, figures/)
├── docker-compose.yml
├── .env.example
├── .nvmrc
└── README.md
```

---

## 6. Cài đặt và chạy

### 6.1. Lấy mã nguồn

```bash
git clone https://github.com/tthan-prog/BrewLite-AS1.git
cd BrewLite-AS1
nvm use            # nếu dùng nvm
```

### 6.2. Cách 1: chạy toàn bộ bằng Docker Compose

```bash
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
docker compose up --build
```

Khi backend khởi động, container tự chạy `prisma migrate deploy` (tạo bảng). Dữ liệu mẫu **không** tự nạp; mở terminal thứ hai và nạp **một lần**:

```bash
docker compose exec backend npx prisma db seed --config prisma7.config.ts
```

> Cảnh báo: `prisma/seed.ts` bắt đầu bằng `deleteMany()` trên mọi bảng. Chạy lại seed sẽ **xóa sạch** dữ liệu hiện có (kể cả đơn hàng).

**Dữ liệu mẫu:**

| Loại | Nội dung |
|---|---|
| Tài khoản | `customer@brewlite.com` (CUSTOMER) và `staff@brewlite.com` (STAFF); mật khẩu `password123` (chỉ dùng phát triển) |
| Sản phẩm, topping | 12 sản phẩm, 4 topping |
| Mã khuyến mãi | `WELCOME10` (giảm 10%, đơn từ 50.000đ), `SAVE20K` (giảm 20.000đ, đơn từ 100.000đ) |

**Sau khi chạy:**

- Frontend: http://localhost:3000 (thực đơn ở `/menu`)
- Backend: http://localhost:3001 (kiểm tra `/health`)
- PostgreSQL: `localhost:5432`

**Dừng hệ thống:**

```bash
docker compose down           # giữ dữ liệu
docker compose down -v        # xóa cả dữ liệu CSDL
```

Nếu đổi mã nguồn, chạy lại `docker compose up --build` (lệnh `exec` không tự build lại). Prisma 7 sinh client vào `backend/src/generated/prisma`; `backend/Dockerfile` tự chạy `prisma generate` khi build. Mọi lệnh Prisma cần thêm `--config prisma7.config.ts`.

### 6.3. Cách 2: chạy từng phần để phát triển

**CSDL và backend (terminal 1):**

```bash
docker compose up -d db
cd backend
cp .env.example .env          # kiểm tra DATABASE_URL trỏ localhost:5432
npm install
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts      # một lần
npm run start:dev
```

Kiểm tra: http://localhost:3001/health trả `{"status":"ok","service":"brewlite-backend"}`.

**Frontend (terminal 2):**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Mở http://localhost:3000/menu.

---

## 7. Biến môi trường

Không đưa `.env` hoặc `.env.local` lên Git; chỉ đưa các file `.env.example`.

**`.env.example` (thư mục gốc, cho docker-compose):**

```env
POSTGRES_USER=brewlite
POSTGRES_PASSWORD=change_me
POSTGRES_DB=brewlite
JWT_SECRET=change_me_to_a_long_random_string
```

**`backend/.env.example`:**

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://brewlite:change_me@localhost:5432/brewlite
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=1d
```

**`frontend/.env.example`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

| Biến | Ý nghĩa |
|---|---|
| `PORT` | Cổng backend (mặc định 3001) |
| `FRONTEND_ORIGIN` | Địa chỉ frontend được phép gọi API (CORS); nhiều địa chỉ cách nhau bằng dấu phẩy |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL. Trong Docker Compose, host là `db`, không phải `localhost` |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Khóa ký và thời hạn JWT; phải đổi khỏi giá trị mẫu |
| `NEXT_PUBLIC_API_URL` | Địa chỉ backend mà trình duyệt gọi; gắn lúc build nên đổi giá trị phải build lại |

---

## 8. API, giao diện và tiến độ task

### 8.1. API backend

Mọi route (trừ `/`, `/health`, `/products*`, `/toppings`, `/auth/register`, `/auth/login`) cần header `Authorization: Bearer <JWT>`. Test tích hợp `backend/test/assign1.e2e-spec.ts` kiểm tra từng dòng dưới đây.

| Method | Endpoint | Chức năng | Quyền | Task |
|---|---|---|---|---|
| GET | `/` | "Hello BrewLite!" | công khai | 1 |
| GET | `/health` | Kiểm tra backend sống | công khai | 1 |
| GET | `/products`, `/products/:id` | Danh sách, chi tiết sản phẩm | công khai | 2 |
| GET | `/toppings` | Danh sách topping | công khai | 2, 4 |
| POST | `/auth/register` | Đăng ký (bcrypt; luôn tạo CUSTOMER) | công khai | 7 |
| POST | `/auth/login` | Đăng nhập, trả `accessToken` | công khai | 7 |
| GET | `/auth/me` | Thông tin người dùng hiện tại | đăng nhập | 7 |
| POST | `/orders` | Tạo đơn PENDING; bắt buộc `Idempotency-Key`; mỗi món gồm size S/M/L (+0/+5.000/+10.000đ), mức đường, mức đá (0/30/50/70/100%, mặc định 100) và topping; trừ kho có điều kiện; mã khuyến mãi; `userId` lấy từ JWT | đăng nhập | 6, 10 |
| GET | `/orders/me` | Lịch sử đơn của tôi, kèm danh sách món | đăng nhập | 9 |
| GET | `/orders/:id` | Chi tiết đơn kèm tên món, topping (chủ đơn hoặc STAFF) | đăng nhập | 9 |
| GET | `/orders` | Tất cả đơn | STAFF | 6 |
| POST | `/payments` | Thanh toán mô phỏng (`WALLET` hoặc `CARD`; `simulate: "FAIL"` để ép lỗi khi demo); idempotent; PAID cộng điểm, lỗi thì PAYMENT_FAILED | đăng nhập | 8, 10 |
| PATCH | `/orders/:id/status` | STAFF chuyển PREPARING, READY, COMPLETED, CANCELLED (hủy hoàn kho) | STAFF | 10 |

`GET /health`, `GET /toppings`, `GET /auth/me`, `GET /orders/:id` và `PATCH /orders/:id/status` là bổ sung của nhóm (đề không nêu).

### 8.2. Các trang giao diện

| Trang | Nội dung |
|---|---|
| `/` | Trang chủ, giới thiệu, nút đặt món |
| `/menu` | Thực đơn, tìm kiếm, lọc theo nhóm; chi tiết món (size, đường, đá, topping, số lượng) |
| `/cart` | Giỏ hàng: sửa số lượng, xóa, tổng tạm tính |
| `/checkout` | Đặt đơn (nhập mã khuyến mãi, xem tạm tính, giảm giá, tổng) rồi thanh toán Ví/Thẻ |
| `/login`, `/register` | Đăng nhập, đăng ký; xong quay lại trang đang làm |
| `/orders/confirmation?id=` | Chi tiết đơn: từng món, giảm giá, tổng, trạng thái |
| `/orders/history` | Lịch sử đơn của tài khoản; bấm mã đơn để xem chi tiết |

### 8.3. Tiến độ 10 task

"Xong" nghĩa là chức năng chạy đầu-cuối và có test. Task được tính điểm khi đạt Definition of Done và được nghiệm thu chéo.

| # | Task | Sprint | Người làm chính | Trạng thái | Nghiệm thu chéo |
|---|---|---|---|---|---|
| 1 | Khởi tạo dự án | 1 | Nguyễn Lê Nhựt Thắng | Xong | Đạt |
| 2 | API danh sách sản phẩm | 1 | Nguyễn Lê Nhựt Thắng (API); Hồ Thiên Ngân (schema, seed) | Xong | Đạt |
| 3 | Trang Menu | 1 | Giản Thiên Lực | Xong (gọi API; loading, lỗi, rỗng) | Đạt |
| 4 | Chi tiết, size, topping | 1 | Giản Thiên Lực | Xong (giá do server tính lại) | Đạt |
| 5 | Giỏ hàng | 2 | Giản Thiên Lực | Xong (thêm, sửa, xóa, tổng tiền, số món, lưu Context + localStorage) | Đạt |
| 6 | API tạo đơn | 2 | Hồ Thiên Ngân | Xong (JWT, validate, PENDING) | Đạt |
| 7 | Đăng ký, đăng nhập | 2 | Nguyễn Lê Nhựt Thắng (backend); Hà Thiên Long (giao diện) | Xong (bcrypt, JWT, guard, trang `/login`, `/register`) | Đạt |
| 8 | Thanh toán không tiền mặt | 3 | Nguyễn Lê Nhựt Thắng | Xong (Ví/Thẻ mô phỏng, PAID/PAYMENT_FAILED, thử lại) | Đạt |
| 9 | Xác nhận, lịch sử đơn, bàn giao | 3 | Hà Thiên Long (giao diện); Nguyễn Lê Nhựt Thắng (API, Docker, README) | Xong (`/orders/me`, trang xác nhận, Docker, README) | Đạt |
| 10 | Nghiệp vụ nâng cao | 3 | Hồ Thiên Ngân (10b, 10c); Nguyễn Lê Nhựt Thắng (10a, 10d) | Xong (state machine, idempotency, tồn kho, khuyến mãi, điểm; test a, b, c) | Đạt |

**Giới hạn:** thanh toán chỉ mô phỏng; không có giao diện barista; khách chưa tự hủy được đơn chưa thanh toán (đơn PENDING vẫn giữ kho); migration của các bảng bổ sung viết tay, cần đối chiếu với Prisma khi đổi môi trường.

Kết quả nghiệm thu chi tiết: `docs/scrum/dod-nghiem-thu.md`.

---

## 9. Nghiệp vụ đơn hàng

### 9.1. Trạng thái đơn hàng

Luồng thành công: `PENDING → PAID → PREPARING → READY → COMPLETED`.

| Từ | Sang |
|---|---|
| PENDING | PAID, PAYMENT_FAILED, CANCELLED |
| PAYMENT_FAILED | PENDING (thử lại), CANCELLED |
| PAID | PREPARING, CANCELLED |
| PREPARING | READY |
| READY | COMPLETED |
| COMPLETED, CANCELLED | (kết thúc) |

Mọi chuyển tiếp khác bị chặn (lỗi 4xx). Mã nguồn: `backend/src/orders/order-state.ts`.

### 9.2. Quy tắc nghiệp vụ

| Quy tắc | Cách làm |
|---|---|
| Giá | Server tính lại từ CSDL: giá gốc + phụ thu size (S +0, M +5.000, L +10.000đ) + topping; không tin giá từ client |
| Tồn kho | Trừ khi tạo đơn bằng `updateMany` có điều kiện (stock ≥ số lượng) trong transaction; hủy đơn hoàn kho; giao diện không cho thêm quá số còn lại |
| Giới hạn đặt hàng | Tồn kho tính theo từng sản phẩm (dữ liệu mẫu: 100 ly mỗi sản phẩm); hết thì hiện "Hết hàng" và không đặt được. Mỗi đơn tối đa 50 dòng món, mỗi món tối đa 50 ly và 10 loại topping (máy chủ trả lỗi 400 nếu vượt). Chưa tính tồn kho theo nguyên liệu và công thức pha chế. |
| Idempotency | Header `Idempotency-Key` bắt buộc khi tạo đơn và thanh toán; ràng buộc unique, gửi lại cùng khóa trả về kết quả cũ |
| Khuyến mãi | `WELCOME10`, `SAVE20K` (điều kiện đơn tối thiểu ở Mục 6.2); máy chủ tính giảm giá khi tạo đơn, khách thấy tổng tiền trước khi thanh toán |
| Điểm thưởng | 1 điểm cho mỗi 10.000đ, cộng khi đơn PAID, thu hồi khi hủy đơn đã PAID |

---

## 10. Kiểm thử và chất lượng code

**Backend (trong `backend/`):**

```bash
npm test              # unit test (Vitest)
npm run test:e2e      # kiểm thử tích hợp (Vitest + Supertest)
npm run lint          # oxlint
npm run format        # Prettier
npm run build         # biên dịch
```

**Frontend (trong `frontend/`):**

```bash
npm run lint
npm run build
```

Test tích hợp chạy trên PostgreSQL thật, cần đã migrate và seed cùng `DATABASE_URL` và `JWT_SECRET` (ví dụ `docker compose up -d db`, rồi migrate và seed như Mục 6.3). Các test tự tạo dữ liệu riêng nhưng **không** nên chạy trên CSDL có dữ liệu thật.

**Kết quả:** 22 unit test và 33 test tích hợp đạt (chạy ngày 13/11/2026); lint và build backend, frontend đạt.

**Kiểm thử API bằng Postman (không cần giao diện):** bộ 51 request, 85 kiểm tra tự động xếp theo Task 1–10 ở `docs/postman/`. Khi hệ thống đang chạy (Mục 6.2), chạy ở thư mục gốc:

```bash
npx newman run docs/postman/brewlite-as1.postman_collection.json -e docs/postman/brewlite-as1-local.postman_environment.json
```

Hoặc Import 2 file vào Postman rồi **Run collection**. Kịch bản chi tiết: `docs/kich-ban-test-backend.md`.

**Ba test bắt buộc của Task 10:**

| Test | Nội dung | Vị trí |
|---|---|---|
| (a) | Chặn chuyển trạng thái sai | `src/orders/order-state.spec.ts`; nhóm "Task 8 + 10a" trong `test/assign1.e2e-spec.ts` |
| (b) | Gửi 2 lần (và 10 lần song song) cùng `Idempotency-Key` chỉ tạo 1 đơn | nhóm "Task 10b" |
| (c) | 20 yêu cầu song song khi kho còn 5: đúng 5 đơn thành công, kho về 0 | nhóm "Task 10c" |

---

## 11. Quy ước làm việc nhóm

**Nhánh:** `main` luôn chạy được, không push trực tiếp. Mỗi chức năng một nhánh `feature/<mô-tả-ngắn>`; sửa lỗi dùng `fix/<mô-tả-ngắn>`.

**Commit:** thông điệp ngắn, rõ, mỗi commit một việc (ví dụ `feat(cart): thêm xóa sản phẩm khỏi giỏ`).

**Pull Request:** mô tả task, việc đã làm, cách kiểm tra; có ít nhất một người khác xem trước khi gộp; chỉ gộp khi build không lỗi.

**Definition of Done** (task được tính điểm khi):

- Code chạy được, không lỗi build, đúng tiêu chí chấp nhận.
- Có commit rõ ràng và được review trong nhóm.
- API có validate đầu vào; giao diện xử lý loading và lỗi cơ bản.
- Có hướng dẫn chạy trong README.
- Được một thành viên khác nghiệm thu (không tự nghiệm thu task mình viết).

---

## 12. Tài liệu Scrum và báo cáo

| Nội dung | Vị trí |
|---|---|
| Product Backlog (10 task, điểm, trạng thái) | `docs/scrum/product-backlog.md` |
| Sprint Backlog 1, 2, 3 | `docs/scrum/sprint-1-backlog.md`, `sprint-2-backlog.md`, `sprint-3-backlog.md` |
| Burndown và cách tính | `docs/scrum/burndown-sprint-*.csv`, `burndown-ghi-chu.md` |
| Biên bản Planning, Review, Retrospective | `docs/scrum/minutes/` |
| Mẫu biên bản | `docs/scrum/meeting-minutes-template.md`, `retrospective-template.md` |
| Thỏa thuận nhóm | `docs/team-agreement.md` |
| ERD (khớp `schema.prisma`) | `docs/design/ERD_MemberB/` |
| Phân công, tiến độ, đóng góp | `docs/phan-cong.md`, `docs/tien-do.md`, `docs/bang-dong-gop.md` |
| Kịch bản kiểm thử backend, bộ Postman | `docs/kich-ban-test-backend.md`, `docs/postman/` |
| Báo cáo | `docs/report/main.tex` (LaTeX) |

**Nhịp Sprint:**

| Sprint | Thời gian | Task theo kế hoạch | Kết quả |
|---|---|---|---|
| 1 | 14–18/10 | 1, 2, 3, 4 | Xong Task 1; còn 9/11 điểm |
| 2 | 19–22/10 | 5, 6, 7 + tồn | Còn 8/22 điểm |
| 3 | 23–25/10 | 8, 9, 10 + tồn | Hoàn thành, đạt DoD; Review ngày 25/10 |
| Hoàn thiện | 26/10 – 14/11 | Thử lại toàn bộ luồng như khách hàng, hoàn thiện giao diện và luồng đặt hàng, báo cáo LaTeX | Hoàn thành |
| Nộp | 15/11 | – | – |

---

## 13. Xử lý sự cố thường gặp

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| `Cannot find module src/generated/prisma/client` | Chưa sinh Prisma client hoặc image cũ | Chạy `npx prisma generate --config prisma7.config.ts`; với Docker chạy `docker compose down` rồi `docker compose up --build` |
| Seed hoặc API báo bảng không tồn tại | Chưa migrate | `npx prisma migrate deploy --config prisma7.config.ts` (Docker tự migrate khi backend khởi động) |
| Đăng nhập báo sai mật khẩu với tài khoản mẫu | Chưa seed | Chạy seed (Mục 6.2) |
| `npm install` ở backend báo `Cannot read properties of null (reading 'edgesOut')` | Lỗi npm 10.x với peer dependency | Dùng `.npmrc` có `legacy-peer-deps=true`; nếu vẫn lỗi, cập nhật npm |
| Cảnh báo `EBADENGINE` | Node thấp hơn yêu cầu | Dùng Node 24.15+ (`nvm use`) |
| Frontend báo "Không kết nối được tới máy chủ BrewLite" | Backend chưa chạy hoặc sai `NEXT_PUBLIC_API_URL` | Chạy backend; kiểm tra http://localhost:3001/health |
| Giao diện chưa đổi sau khi cập nhật mã | Trình duyệt hoặc image Docker còn bản cũ | `docker compose up -d --build frontend`, rồi tải lại bằng Ctrl+Shift+R |
| Lỗi CORS trên trình duyệt | `FRONTEND_ORIGIN` không khớp | Sửa `FRONTEND_ORIGIN` trong `backend/.env` |
| Cổng bị chiếm (EADDRINUSE) | Tiến trình cũ ở 3000 hoặc 3001 | Tắt tiến trình đó hoặc đổi cổng |
| Đổi `NEXT_PUBLIC_API_URL` không có tác dụng | Biến được gắn lúc build | Build lại (`docker compose up --build`) |
| Docker chạy chậm hoặc lỗi trên Windows | Chưa bật WSL 2 | Bật WSL 2 trong Docker Desktop |
| Cảnh báo "LF will be replaced by CRLF" khi `git add` | Khác kiểu xuống dòng giữa Windows và Linux | Có thể bỏ qua |

---

## 14. Thành viên nhóm

| Ký hiệu | Họ tên | MSSV | Vai trò |
|---|---|---|---|
| A | Nguyễn Lê Nhựt Thắng | 3124560085 | Scrum Master, nền tảng, backend |
| B | Hồ Thiên Ngân | 3124410224 | Backend: dữ liệu, đơn hàng |
| C | Hà Thiên Long | 3124410193 | Frontend, kiểm thử, Product Owner tạm |
| D | Giản Thiên Lực | 3124410206 | Frontend |

**Giảng viên hướng dẫn:** Từ Lãng Phiêu

---

*README phiên bản 3.0, ngày 13/11/2026.*
