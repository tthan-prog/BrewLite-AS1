// Test tích hợp trên PostgreSQL thật. Cần: DATABASE_URL, JWT_SECRET, đã migrate + seed.
// Chạy: npm run test:e2e
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp, loginStaff, registerUser } from './helpers.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

describe('BrewLite API (e2e, PostgreSQL)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let http: ReturnType<INestApplication['getHttpServer']>;
  let alice: { token: string; id: number };
  let staffToken: string;
  const run = Date.now();
  let keySeq = 0;
  const key = () => `k-${run}-${++keySeq}`;

  const auth = (t: string) => ({ Authorization: `Bearer ${t}` });
  const item = (productId: number, quantity = 1, size = 'M') => ({
    productId,
    quantity,
    size,
  });

  async function newProduct(stock: number, price = 30000) {
    return prisma.product.create({
      data: { name: `Test ${run}-${keySeq++}`, price, stock },
    });
  }

  beforeAll(async () => {
    ({ app, prisma } = await createApp());
    http = app.getHttpServer();
    const a = await registerUser(app, `alice-${run}@test.dev`);
    alice = { token: a.accessToken, id: a.user.id };
    staffToken = (await loginStaff(app)).accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Task 7: đăng ký / đăng nhập', () => {
    it('hash mật khẩu bằng bcrypt và không lộ mật khẩu', async () => {
      const row = await prisma.user.findUniqueOrThrow({ where: { id: alice.id } });
      expect(row.password).toMatch(/^\$2[aby]\$/);
      expect(row.password).not.toContain('secret123');
    });

    it('trùng email -> 409; sai mật khẩu -> 401; email sai định dạng -> 400', async () => {
      await request(http)
        .post('/auth/register')
        .send({ email: `alice-${run}@test.dev`, password: 'secret123' })
        .expect(409);
      await request(http)
        .post('/auth/login')
        .send({ email: `alice-${run}@test.dev`, password: 'wrong-pass' })
        .expect(401);
      await request(http)
        .post('/auth/register')
        .send({ email: 'khong-phai-email', password: 'secret123' })
        .expect(400);
    });

    it('đăng ký công khai không thể tự cấp quyền STAFF', async () => {
      await request(http)
        .post('/auth/register')
        .send({ email: `evil-${run}@test.dev`, password: 'secret123', role: 'STAFF' })
        .expect(400); // role bị từ chối bởi whitelist
    });

    it('đăng ký nhận thêm tên hiển thị (giao diện gửi name)', async () => {
      const res = await request(http)
        .post('/auth/register')
        .send({ name: 'Nguyễn Văn A', email: `named-${run}@test.dev`, password: 'secret123' })
        .expect(201);
      expect(res.body.user.name).toBe('Nguyễn Văn A');
    });

    it('đăng nhập đúng trả JWT dùng được', async () => {
      const res = await request(http)
        .post('/auth/login')
        .send({ email: `alice-${run}@test.dev`, password: 'secret123' })
        .expect(200);
      await request(http).get('/auth/me').set(auth(res.body.accessToken)).expect(200);
    });
  });

  describe('Task 2: sản phẩm', () => {
    it('GET /products trả danh sách có id, name, price, imageUrl', async () => {
      const res = await request(http).get('/products').expect(200);
      expect(res.body.length).toBeGreaterThanOrEqual(12);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          imageUrl: expect.any(String),
        }),
      );
    });

    it('GET /products/:id: có -> 200, không có -> 404, id sai -> 400', async () => {
      await request(http).get('/products/1').expect(200);
      await request(http).get('/products/999999').expect(404);
      await request(http).get('/products/abc').expect(400);
    });
  });

  describe('Task 6: tạo đơn', () => {
    it('cần đăng nhập (401 khi thiếu token)', async () => {
      await request(http).post('/orders').send({ items: [item(1)] }).expect(401);
    });

    it('validate: thiếu items, size sai, số lượng <= 0 -> 400', async () => {
      const h = { ...auth(alice.token), 'Idempotency-Key': key() };
      await request(http).post('/orders').set(h).send({}).expect(400);
      await request(http).post('/orders').set(h).send({ items: [] }).expect(400);
      await request(http)
        .post('/orders')
        .set(h)
        .send({ items: [item(1, 1, 'XL')] })
        .expect(400);
      await request(http)
        .post('/orders')
        .set(h)
        .send({ items: [item(1, 0)] })
        .expect(400);
    });

    it('tính giá theo size (S+0, M+5.000, L+10.000) và topping', async () => {
      const p = await newProduct(50, 30000);
      const topping = await prisma.topping.findFirstOrThrow();
      const res = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({
          items: [
            { productId: p.id, quantity: 2, size: 'L', toppings: [{ toppingId: topping.id, quantity: 1 }] },
          ],
        })
        .expect(201);
      // (30.000 + 10.000 + topping) * 2
      expect(res.body.subtotal).toBe((30000 + 10000 + topping.price) * 2);
      expect(res.body.status).toBe('PENDING');
      expect(res.body.userId).toBe(alice.id);
    });

    it('userId trong body bị bỏ qua: đơn luôn thuộc người đăng nhập', async () => {
      const p = await newProduct(5);
      const res = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ userId: 1, items: [item(p.id)] })
        .expect(201);
      expect(res.body.userId).toBe(alice.id);
    });

    it('mã khuyến mãi: WELCOME10 giảm 10% khi đủ điều kiện', async () => {
      const p = await newProduct(5, 60000);
      const res = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ items: [item(p.id, 1, 'S')], promoCode: 'welcome10' })
        .expect(201);
      expect(res.body.subtotal).toBe(60000);
      expect(res.body.discount).toBe(6000);
      expect(res.body.total).toBe(54000);
    });
  });

  describe('Task 10b: Idempotency-Key', () => {
    it('gửi 2 lần cùng key chỉ tạo 1 đơn và chỉ trừ kho 1 lần', async () => {
      const p = await newProduct(10);
      const k = key();
      const body = { items: [item(p.id, 2)] };
      const h = { ...auth(alice.token), 'Idempotency-Key': k };

      const r1 = await request(http).post('/orders').set(h).send(body).expect(201);
      const r2 = await request(http).post('/orders').set(h).send(body).expect(201);

      expect(r2.body.id).toBe(r1.body.id);
      expect(await prisma.order.count({ where: { items: { some: { productId: p.id } } } })).toBe(1);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: p.id } })).stock).toBe(8);
    });

    it('cùng key nhưng nội dung khác -> 409', async () => {
      const p = await newProduct(10);
      const h = { ...auth(alice.token), 'Idempotency-Key': key() };
      await request(http).post('/orders').set(h).send({ items: [item(p.id, 1)] }).expect(201);
      await request(http).post('/orders').set(h).send({ items: [item(p.id, 2)] }).expect(409);
    });

    it('10 yêu cầu song song cùng key vẫn chỉ tạo 1 đơn', async () => {
      const p = await newProduct(10);
      const h = { ...auth(alice.token), 'Idempotency-Key': key() };
      const body = { items: [item(p.id, 1)] };
      const results = await Promise.all(
        Array.from({ length: 10 }, () => request(http).post('/orders').set(h).send(body)),
      );
      const ok = results.filter((r) => r.status === 201);
      expect(new Set(ok.map((r) => r.body.id)).size).toBe(1);
      expect(await prisma.order.count({ where: { items: { some: { productId: p.id } } } })).toBe(1);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: p.id } })).stock).toBe(9);
    });

    it('thiếu header Idempotency-Key -> 400', async () => {
      await request(http).post('/orders').set(auth(alice.token)).send({ items: [item(1)] }).expect(400);
    });
  });

  describe('Task 10c: tồn kho đồng thời', () => {
    it('20 người đặt song song, kho 5 -> đúng 5 đơn thành công, kho về 0, không âm', async () => {
      const p = await newProduct(5);
      const results = await Promise.all(
        Array.from({ length: 20 }, () =>
          request(http)
            .post('/orders')
            .set({ ...auth(alice.token), 'Idempotency-Key': key() })
            .send({ items: [item(p.id, 1)] }),
        ),
      );
      const created = results.filter((r) => r.status === 201).length;
      const rejected = results.filter((r) => r.status === 400).length;
      const fresh = await prisma.product.findUniqueOrThrow({ where: { id: p.id } });
      expect(created).toBe(5);
      expect(rejected).toBe(15);
      expect(fresh.stock).toBe(0);
    });

    it('đơn thất bại giữa chừng được rollback, kho không bị trừ', async () => {
      const p = await newProduct(10);
      await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ items: [item(p.id, 3), item(999999, 1)] })
        .expect(404);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: p.id } })).stock).toBe(10);
    });
  });

  describe('Task 8 + 10a: thanh toán và trạng thái', () => {
    async function makeOrder(price = 50000, stock = 5) {
      const p = await newProduct(stock, price);
      const res = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ items: [item(p.id, 1, 'S')] })
        .expect(201);
      return { order: res.body, product: p };
    }
    const pay = (orderId: number, body: object = {}, k = key(), token = alice.token) =>
      request(http)
        .post('/payments')
        .set({ ...auth(token), 'Idempotency-Key': k })
        .send({ orderId, method: 'WALLET', ...body });

    it('thanh toán thành công -> PAID và cộng điểm (1 điểm / 10.000đ)', async () => {
      const before = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      const { order } = await makeOrder(50000);
      const res = await pay(order.id).expect(200);
      expect(res.body.order.status).toBe('PAID');
      expect(res.body.payment.status).toBe('SUCCESS');
      const after = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      expect(after - before).toBe(5);
    });

    it('thanh toán lỗi -> PAYMENT_FAILED, thử lại được rồi PAID', async () => {
      const { order } = await makeOrder();
      const f = await pay(order.id, { method: 'CARD', simulate: 'FAIL' }).expect(200);
      expect(f.body.order.status).toBe('PAYMENT_FAILED');
      const ok = await pay(order.id, { method: 'CARD' }).expect(200);
      expect(ok.body.order.status).toBe('PAID');
    });

    it('gửi lại cùng Idempotency-Key không thanh toán lần hai', async () => {
      const { order } = await makeOrder(50000);
      const before = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      const k = key();
      const a = await pay(order.id, {}, k).expect(200);
      const b = await pay(order.id, {}, k).expect(200);
      expect(b.body.payment.id).toBe(a.body.payment.id);
      expect(b.body.replayed).toBe(true);
      expect(await prisma.payment.count({ where: { orderId: order.id } })).toBe(1);
      const after = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      expect(after - before).toBe(5); // chỉ cộng một lần
    });

    it('đơn đã PAID thì thanh toán lại bằng key mới -> 400', async () => {
      const { order } = await makeOrder();
      await pay(order.id).expect(200);
      await pay(order.id).expect(400);
    });

    it('không thanh toán được đơn của người khác (404)', async () => {
      const bob = await registerUser(app, `bob-${run}-${keySeq}@test.dev`);
      const { order } = await makeOrder();
      await pay(order.id, {}, key(), bob.accessToken).expect(404);
    });

    it('STAFF đi hết luồng PAID -> PREPARING -> READY -> COMPLETED', async () => {
      const { order } = await makeOrder();
      await pay(order.id).expect(200);
      for (const status of ['PREPARING', 'READY', 'COMPLETED']) {
        const r = await request(http)
          .patch(`/orders/${order.id}/status`)
          .set(auth(staffToken))
          .send({ status })
          .expect(200);
        expect(r.body.status).toBe(status);
      }
    });

    it('chuyển trạng thái sai bị chặn (400): PENDING -> READY, PAID -> COMPLETED', async () => {
      const { order } = await makeOrder();
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'READY' }).expect(400);
      await pay(order.id).expect(200);
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'COMPLETED' }).expect(400);
    });

    it('STAFF không được đặt tay PAID; CUSTOMER không được gọi PATCH (403)', async () => {
      const { order } = await makeOrder();
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'PAID' }).expect(400);
      await request(http).patch(`/orders/${order.id}/status`).set(auth(alice.token)).send({ status: 'CANCELLED' }).expect(403);
    });

    it('hủy đơn hoàn lại tồn kho; đơn đã hủy không đi tiếp được', async () => {
      const { order, product } = await makeOrder(50000, 5);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(4);
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'CANCELLED' }).expect(200);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(5);
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'PREPARING' }).expect(400);
    });

    it('hủy đơn đã PAID trừ lại điểm thưởng', async () => {
      const { order } = await makeOrder(50000);
      const before = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      await pay(order.id).expect(200);
      await request(http).patch(`/orders/${order.id}/status`).set(auth(staffToken)).send({ status: 'CANCELLED' }).expect(200);
      const after = (await prisma.user.findUniqueOrThrow({ where: { id: alice.id } })).points;
      expect(after).toBe(before);
    });
  });

  describe('Task 9: lịch sử đơn', () => {
    it('GET /orders/me chỉ trả đơn của mình', async () => {
      const bob = await registerUser(app, `carol-${run}@test.dev`);
      const mine = await request(http).get('/orders/me').set(auth(alice.token)).expect(200);
      expect(mine.body.length).toBeGreaterThan(0);
      expect(mine.body.every((o: { userId: number }) => o.userId === alice.id)).toBe(true);
      const theirs = await request(http).get('/orders/me').set(auth(bob.accessToken)).expect(200);
      expect(theirs.body).toEqual([]);
    });

    it('GET /orders/:id: chủ đơn 200, người khác 404; GET /orders chỉ STAFF', async () => {
      const bob = await registerUser(app, `dave-${run}@test.dev`);
      const p = await newProduct(3);
      const o = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ items: [item(p.id)] })
        .expect(201);
      await request(http).get(`/orders/${o.body.id}`).set(auth(alice.token)).expect(200);
      await request(http).get(`/orders/${o.body.id}`).set(auth(bob.accessToken)).expect(404);
      await request(http).get('/orders').set(auth(alice.token)).expect(403);
      await request(http).get('/orders').set(auth(staffToken)).expect(200);
    });

    it('đơn lưu mức đường/đá; chi tiết đơn có tên món và topping; mức sai -> 400', async () => {
      const p = await newProduct(5);
      const topping = await prisma.topping.findFirstOrThrow();
      const o = await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({
          items: [
            { ...item(p.id), sugar: 30, ice: 0, toppings: [{ toppingId: topping.id, quantity: 1 }] },
            item(p.id, 1, 'S'),
          ],
        })
        .expect(201);
      const detail = await request(http).get(`/orders/${o.body.id}`).set(auth(alice.token)).expect(200);
      const [first, second] = detail.body.items;
      expect([first.sugar, first.ice]).toEqual([30, 0]);
      expect([second.sugar, second.ice]).toEqual([100, 100]); // không chọn -> mặc định 100%
      expect(first.product.name).toBe(p.name);
      expect(first.toppings[0].topping.name).toBe(topping.name);
      await request(http)
        .post('/orders')
        .set({ ...auth(alice.token), 'Idempotency-Key': key() })
        .send({ items: [{ ...item(p.id), sugar: 45 }] })
        .expect(400);
    });
  });
});
