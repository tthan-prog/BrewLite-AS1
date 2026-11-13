// Kiểu dữ liệu đơn hàng trả về từ API (GET /orders/me, GET /orders/:id).

export type ApiOrderItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  size: string;
  sugar: number;
  ice: number;
  product: { id: number; name: string; imageUrl: string | null };
  toppings: { toppingId: number; quantity: number; price: number; topping: { name: string } }[];
};

export type ApiOrderDetail = {
  id: number;
  status: string;
  subtotal: number;
  discount: number;
  promoCode: string | null;
  total: number;
  createdAt: string;
  items: ApiOrderItem[];
};

/** Thành tiền một dòng: (giá theo size + topping) × số lượng. */
export function lineTotal(item: ApiOrderItem) {
  const toppingTotal = item.toppings.reduce((sum, t) => sum + t.price * t.quantity, 0);
  return (item.unitPrice + toppingTotal) * item.quantity;
}

export function statusTone(status: string) {
  if (status === "PAYMENT_FAILED" || status === "CANCELLED") return "bad";
  if (status === "PENDING") return "";
  return "ok";
}
