# BrewLite

Ứng dụng đặt cà phê không dùng tiền mặt: khách xem menu, chọn size và topping, thêm vào giỏ, đăng nhập, thanh toán (mô phỏng) và theo dõi đơn hàng; nhân viên (STAFF) xử lý đơn qua API.

Bài tập lớn môn **Công nghệ Phần mềm**, Trường Đại học Sài Gòn, học kỳ I năm học 2026–2027, làm theo quy trình **Agile Scrum**. Hạn nộp: 15/11/2026.

> Đây là repository riêng của **Assignment 1**. Assignment 2 được thực hiện ở một repository khác, không dùng chung mã nguồn hay tài liệu với repository này.

## Trạng thái dự án (cập nhật 13/11/2026)

| Hạng mục | Tình trạng |
|---|---|
| Assignment 1 (10 task) | **Hoàn thành code cả 10 task**, chạy đầu-cuối từ giao diện đến CSDL |
| Kiểm thử | 22 unit test và 32 test tích hợp đạt (PostgreSQL thật); chạy lại ngày 13/11/2026 trên tag `assign1-final`: 22/22, 32/32 |
| Docker Compose | Chạy được 3 dịch vụ (db, backend, frontend); đã chạy thử trên Windows (Docker Desktop + WSL 2) |
| Nghiệm thu chéo (điều kiện tính điểm) | **Đã nghiệm thu, cả 10 task đạt DoD** (xác nhận 23/10/2026, xem `docs/scrum/dod-nghiem-thu.md`) |
| Bằng chứng Scrum | Product Backlog, 3 Sprint Backlog, Burndown, biên bản (`docs/scrum/`) |
| Báo cáo | LaTeX tại `docs/report/` (cách biên dịch trong `docs/report/README.md`) |
| Sprint 3 Review và Retrospective | Đã họp 25/10/2026 (`docs/scrum/minutes/06-sprint3-review-retro.md`) |
| Mốc mã nguồn | Tag `assign1-original` (`e7a627a`, 23/10/2026); tag `assign1-final` (`9581384`, 07/11/2026: thêm `frontend/public/.gitkeep` để `docker compose build` chạy trên bản clone sạch) |

Chi tiết từng task ở [Mục 8](#8-api-và-tiến-độ-task).

---

## Mục lục

1. [Giới thiệu và phạm vi](#1-giới-thiệu-và-phạm-vi)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Môi trường phát triển](#3-môi-trường-phát-triển)
4. [Công cụ làm việc](#4-công-cụ-làm-việc)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Cài đặt và chạy](#6-cài-đặt-và-chạy)
7. [Biến môi trường](#7-biến-môi-trường)
8. [API và tiến độ task](#8-api-và-tiến-độ-task)
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
Xem menu → Chọn sản phẩm (size, topping) → Thêm vào giỏ → Xem giỏ, nhập mã khuyến mãi
        → Đăng nhập → Thanh toán (Ví/Thẻ mô phỏng) → Xác nhận đơn → Xem lịch sử đơn
```

**Đã làm:** menu từ API, chi tiết sản phẩm, giỏ hàng, đăng ký và đăng nhập (JWT, phân quyền CUSTOMER/STAFF), tạo đơn, thanh toán mô phỏng, xác nhận và lịch sử đơn, máy trạng thái đơn hàng, Idempotency-Key, kiểm soát tồn kho đồng thời, mã khuyến mãi, điểm thưởng.

**Ngoài phạm vi:** giao diện cho barista (STAFF thao tác qua API), cổng thanh toán thật, quản lý kho nguyên liệu, quên mật khẩu, hồ sơ cá nhân.

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
| Tài liệu | Google Drive, thư mục `docs/` | Báo cáo, slide, bản nháp |
| Sơ đồ | Mermaid, draw.io | ERD (`docs/design/ERD_MemberB`), state machine |
| Chạy và đóng gói | Docker Compose | `docker compose up --build` |
| Kiểm thử | Vitest, Supertest | Unit, e2e, test bắt buộc Task 10 |

Phạm vi chạy: bằng docker-compose trên máy nhóm hoặc máy giảng viên để demo.

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
│   └── src/app/                   # menu, login, register, orders/confirmation, orders/history
├── docs/
│   ├── team-agreement.md          # thỏa thuận nhóm
│   ├── message-to-lecturer.md     # bản nháp tin nhắn hỏi giảng viên
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
git clone https://github.com/tthan-prog/BrewLite.git
cd BrewLite
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

- Frontend: http://localhost:3000 (menu ở `/menu`)
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

## 8. API và tiến độ task

### 8.1. API

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
| POST | `/orders` | Tạo đơn PENDING; bắt buộc `Idempotency-Key`; giá theo size S/M/L (+0/+5.000/+10.000đ) và topping; trừ kho có điều kiện; mã khuyến mãi; `userId` lấy từ JWT | đăng nhập | 6, 10 |
| GET | `/orders/me` | Lịch sử đơn của tôi | đăng nhập | 9 |
| GET | `/orders/:id` | Chi tiết đơn (chủ đơn hoặc STAFF) | đăng nhập | 9 |
| GET | `/orders` | Tất cả đơn | STAFF | 6 |
| POST | `/payments` | Thanh toán mô phỏng (`WALLET` hoặc `CARD`; `simulate: "FAIL"` để ép lỗi khi demo); idempotent; PAID cộng điểm, lỗi thì PAYMENT_FAILED | đăng nhập | 8, 10 |
| PATCH | `/orders/:id/status` | STAFF chuyển PREPARING, READY, COMPLETED, CANCELLED (hủy hoàn kho) | STAFF | 10 |

`GET /health`, `GET /toppings`, `GET /auth/me`, `GET /orders/:id` và `PATCH /orders/:id/status` là bổ sung của nhóm (đề không nêu).

### 8.2. Tiến độ 10 task

"Xong" nghĩa là chức năng chạy đầu-cuối và có test. Task được tính điểm khi đạt Definition of Done và được nghiệm thu chéo.

| # | Task | Sprint | Người làm chính | Trạng thái | Nghiệm thu chéo |
|---|---|---|---|---|---|
| 1 | Khởi tạo dự án | 1 | Nguyễn Lê Nhựt Thắng | Xong | Đạt |
| 2 | API danh sách sản phẩm | 1 | Nguyễn Lê Nhựt Thắng (API); Hồ Thiên Ngân (schema, seed) | Xong | Đạt |
| 3 | Trang Menu | 1 | Giản Thiên Lực | Xong (gọi API; loading, lỗi, rỗng) | Đạt |
| 4 | Chi tiết, size, topping | 1 | Giản Thiên Lực | Xong (giá do server tính lại) | Đạt |
| 5 | Giỏ hàng | 2 | Giản Thiên Lực | Xong (thêm, sửa, xóa, tổng tiền, badge) | Đạt |
| 6 | API tạo đơn | 2 | Hồ Thiên Ngân | Xong (JWT, validate, PENDING) | Đạt |
| 7 | Đăng ký, đăng nhập | 2 | Nguyễn Lê Nhựt Thắng (backend); Hà Thiên Long (giao diện) | Xong (bcrypt, JWT, guard, trang `/login`, `/register`) | Đạt |
| 8 | Thanh toán không tiền mặt | 3 | Nguyễn Lê Nhựt Thắng | Xong (Ví/Thẻ mô phỏng, PAID/PAYMENT_FAILED, thử lại) | Đạt |
| 9 | Xác nhận, lịch sử đơn, bàn giao | 3 | Hà Thiên Long (giao diện); Nguyễn Lê Nhựt Thắng (API, Docker, README) | Xong (`/orders/me`, trang xác nhận, Docker, README) | Đạt |
| 10 | Nghiệp vụ nâng cao | 3 | Hồ Thiên Ngân (10b, 10c); Nguyễn Lê Nhựt Thắng (10a, 10d) | Xong (state machine, idempotency, tồn kho, khuyến mãi, điểm; test a, b, c) | Đạt |

**Giới hạn đã biết:** thanh toán chỉ mô phỏng; không có giao diện barista; trường đường/đá trong giỏ chỉ hiển thị, chưa lưu vào đơn; migration của các bảng bổ sung viết tay, cần đối chiếu với Prisma khi đổi môi trường.

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
| Tồn kho | Trừ bằng `updateMany` có điều kiện (stock ≥ số lượng) trong transaction; hủy đơn hoàn kho |
| Idempotency | Header `Idempotency-Key` bắt buộc khi tạo đơn và thanh toán; ràng buộc unique, gửi lại cùng khóa trả về kết quả cũ |
| Khuyến mãi | `WELCOME10`, `SAVE20K` (điều kiện đơn tối thiểu ở Mục 6.2) |
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

**Kết quả (23/10/2026, nhánh main):** 22 unit test và 32 test tích hợp đạt; build và lint backend sạch; lint và build frontend đạt.

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
| ERD | `docs/design/ERD_MemberB/` |
| Phân công, tiến độ, đóng góp | `docs/phan-cong.md`, `docs/tien-do.md`, `docs/bang-dong-gop.md` |
| Báo cáo | `docs/report/main.tex` (LaTeX) |

**Nhịp Sprint:**

| Sprint | Thời gian | Task theo kế hoạch | Kết quả |
|---|---|---|---|
| 1 | 14–18/10 | 1, 2, 3, 4 | Xong Task 1; còn 9/11 điểm |
| 2 | 19–22/10 | 5, 6, 7 + tồn | Còn 8/22 điểm |
| 3 | 23–25/10 | 8, 9, 10 + tồn | Hoàn thành, đạt DoD; Review ngày 25/10 |
| Hoàn thiện | 26/10 – 13/11 | Rà DoD, báo cáo LaTeX, tập demo | – |
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
| Frontend báo "Không kết nối được" | Backend chưa chạy hoặc sai `NEXT_PUBLIC_API_URL` | Chạy backend; kiểm tra http://localhost:3001/health |
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

**Giảng viên hướng dẫn:** Từ Lăng Phiêu

---

*README phiên bản 2.1: viết lại ngày 23/10/2026 sau khi hoàn thành code Assignment 1; ngày 13/11/2026 cập nhật hạn nộp, báo cáo LaTeX, thành viên và tách repository riêng. Cập nhật khi có thay đổi về cài đặt, cách chạy hoặc trạng thái nghiệm thu.*
