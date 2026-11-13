import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="container hero">
        <div>
          <span className="eyebrow">Cà phê ngon, ngày thêm vui</span>
          <h1>Một chút cà phê.<br /><span>Một ngày tuyệt vời.</span></h1>
          <p className="hero-copy">BrewLite giúp bạn đặt món yêu thích nhanh chóng, quản lý đơn hàng rõ ràng và dành nhiều thời gian hơn cho điều bạn thích.</p>
          <div className="hero-actions">
            <Link href="/menu" className="btn btn-primary">Đặt món ngay</Link>
            <Link href="/orders/history" className="btn btn-outline">Theo dõi đơn hàng</Link>
          </div>
          <div className="health-box"><span className="health-dot ok" /> Thanh toán không tiền mặt · Nhận đồ uống tại quầy</div>
        </div>
        <div className="hero-art" aria-label="Minh họa cốc cà phê BrewLite" role="img">
          <span className="art-leaf" /><span className="art-bean bean-one" /><span className="art-bean bean-two" /><span className="cup-handle" /><span className="cup" />
        </div>
      </section>
      <section className="container section" id="features">
        <div className="section-head"><div><h2>Đơn giản từ ngụm đầu tiên</h2><p>Chọn món, thanh toán và nhận đồ uống chỉ trong vài chạm.</p></div></div>
        <div className="feature-grid">
          <article className="feature-card"><h3>Chọn món theo ý bạn</h3><p>Chọn size, mức đường, mức đá và topping; giá được tính ngay khi bạn chọn.</p><Link className="text-link" href="/menu">Xem thực đơn</Link></article>
          <article className="feature-card"><h3>Thanh toán không tiền mặt</h3><p>Trả bằng ví điện tử hoặc thẻ, dùng mã khuyến mãi và tích điểm sau mỗi đơn đã thanh toán.</p><Link className="text-link" href="/register">Tạo tài khoản</Link></article>
          <article className="feature-card"><h3>Theo dõi đơn hàng</h3><p>Xem lại món đã đặt, trạng thái và tổng tiền của từng đơn trong tài khoản.</p><Link className="text-link" href="/orders/history">Mở lịch sử đơn</Link></article>
        </div>
      </section>
    </main>
  );
}
