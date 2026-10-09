import { employerJobs, employerServices } from '../../mocks/fixtures'
import { AsyncStateView } from '../../components/AsyncStateView'
import type { AsyncState, Destination } from '../../types/domain'

export function EmployerHome({ onNavigate, onSelectService, homeState = 'success' }: {
  onNavigate: (destination: Destination) => void
  onSelectService: (serviceId: string) => void
  homeState?: AsyncState
}) {
  return (
    <main className="home-content">
      <section className="hero-card employer-hero">
        <div className="hero-card-copy">
          <span className="eyebrow">CẦN NGƯỜI HỖ TRỢ?</span>
          <h1>Tìm người phù hợp,<br />việc xong nhẹ nhàng.</h1>
          <p>Đăng nhu cầu dịch vụ trong vài bước đơn giản.</p>
          <button className="primary-button" type="button" onClick={() => onNavigate('requestDraft')}>Tạo yêu cầu <span aria-hidden="true">→</span></button>
        </div>
        <div className="hero-illustration employer-illustration" aria-hidden="true"><span>✦</span><div className="illustration-box">JF</div><i>✓</i></div>
      </section>

      <section className="section-block" aria-labelledby="services-title">
        <div className="section-heading"><div><span className="section-kicker">BẮT ĐẦU TỪ NHU CẦU</span><h2 id="services-title">Dịch vụ phổ biến</h2></div><button className="text-button" type="button" onClick={() => onNavigate('services')}>Xem tất cả <span aria-hidden="true">→</span></button></div>
        <div className="service-grid">
          {employerServices.map((service) => <button className="service-card" type="button" key={service.id} aria-label={`${service.title}: ${service.description}`} onClick={() => onSelectService(service.id)}>
            <span className={`service-icon service-icon-${service.id}`} aria-hidden="true">{service.icon}</span>
            <strong>{service.title}</strong><small>{service.description}</small>
          </button>)}
        </div>
      </section>

      <section className="section-block jobs-section" aria-labelledby="employer-jobs-title">
        <div className="section-heading"><div><span className="section-kicker">CẬP NHẬT GẦN ĐÂY</span><h2 id="employer-jobs-title">Công việc của bạn</h2></div><button className="text-button" type="button" onClick={() => onNavigate('history')}>Lịch sử <span aria-hidden="true">→</span></button></div>
        {homeState === 'success' && employerJobs.length ? employerJobs.map((job) => <article className="job-card employer-job-card" key={job.id}>
          <div className="job-card-top"><span className="job-category-mark" aria-hidden="true">↗</span><span className="status-pill status-searching"><i />{job.tag}</span></div>
          <h3>{job.title}</h3><p className="job-meta"><span aria-hidden="true">⌖</span>{job.location}</p>
          <div className="job-footer"><span><small>Thời gian</small><strong>{job.schedule}</strong></span><span><small>Ngân sách dự kiến</small><strong>{job.pay}</strong></span></div>
          <button className="employer-job-open" type="button" onClick={() => onNavigate('history')}>Theo dõi yêu cầu demo →</button>
        </article>) : <AsyncStateView state={homeState === 'success' ? 'empty' : homeState} />}
      </section>
    </main>
  )
}
