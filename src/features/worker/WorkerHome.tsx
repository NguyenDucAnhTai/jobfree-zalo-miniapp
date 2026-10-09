import { workerOffers, workerShift } from '../../mocks/fixtures'

export function WorkerHome() {
  return (
    <main className="home-content worker-content">
      <section className="hero-card worker-hero">
        <div className="hero-card-copy"><span className="eyebrow">MỖI NGÀY MỘT CƠ HỘI</span><h1>Việc tốt gần bạn,<br />chủ động chọn ca.</h1><p>Xem cơ hội phù hợp với thời gian của bạn.</p><button className="primary-button" type="button">Tìm việc mới <span aria-hidden="true">→</span></button></div>
        <div className="hero-illustration worker-illustration" aria-hidden="true"><span>✦</span><div className="illustration-person"><i /><b /><em /></div><div className="illustration-check">✓</div></div>
      </section>

      <section className="section-block" aria-labelledby="shift-title">
        <div className="section-heading"><div><span className="section-kicker">KẾ HOẠCH HÔM NAY</span><h2 id="shift-title">Ca làm sắp tới</h2></div><span className="date-chip">09 THÁNG 10</span></div>
        <article className="shift-card">
          <div className="shift-timeline"><span /><i /></div>
          <div className="shift-info"><div className="shift-status"><span className="pulse-dot" />{workerShift.status}</div><h3>{workerShift.title}</h3><p className="job-meta"><span aria-hidden="true">⌖</span>{workerShift.location}</p><div className="shift-time"><span aria-hidden="true">◷</span>{workerShift.schedule}</div></div>
          <button className="more-button" type="button" aria-label="Tùy chọn ca làm demo">···</button>
        </article>
      </section>

      <section className="section-block jobs-section" aria-labelledby="offers-title">
        <div className="section-heading"><div><span className="section-kicker">GỢI Ý DÀNH CHO BẠN</span><h2 id="offers-title">Việc mới quanh đây</h2></div><button className="text-button" type="button">Xem thêm <span aria-hidden="true">→</span></button></div>
        <div className="offer-list">{workerOffers.map((offer) => <article className="job-card offer-card" key={offer.id}>
          <div className="offer-card-heading"><div className="offer-icon" aria-hidden="true">✳</div><span className="status-pill status-new">{offer.tag}</span></div>
          <div className="offer-details"><div><h3>{offer.title}</h3><p className="job-meta"><span aria-hidden="true">⌖</span>{offer.location}</p><p className="job-meta"><span aria-hidden="true">◷</span>{offer.schedule}</p></div><strong className="offer-pay">{offer.pay}</strong></div>
          <div className="offer-card-footer"><span>Thông tin công việc demo</span><button className="arrow-button" type="button" aria-label={`Xem chi tiết ${offer.title}`}>→</button></div>
        </article>)}</div>
      </section>
      <p className="mock-note">Việc làm hiển thị là dữ liệu mô phỏng cho bản demo.</p>
    </main>
  )
}
