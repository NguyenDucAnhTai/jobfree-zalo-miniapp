import { useState } from 'react'
import { AsyncStateView } from '../../components/AsyncStateView'
import { NavigationIcon } from '../../components/NavigationIcon'
import { ServiceArtwork } from '../../components/ServiceArtwork'
import { employerJobs, employerServices } from '../../mocks/fixtures'
import { employerQuickUtilities } from '../../mocks/employerHomeFixtures'
import type { AsyncState, Destination, JobPreview } from '../../types/domain'
import { EmployerHomeCarousel } from './EmployerHomeCarousel'

export function EmployerHome({ onNavigate, onSelectService, homeState = 'success', jobs = employerJobs }: {
  onNavigate: (destination: Destination) => void
  onSelectService: (serviceId: string) => void
  homeState?: AsyncState
  jobs?: JobPreview[]
}) {
  const [guideOpen, setGuideOpen] = useState(false)
  return (
    <main className="home-content employer-home">
      <p className="employer-demo-label"><span aria-hidden="true">●</span> DEMO · NON-PRODUCTION</p>
      <EmployerHomeCarousel onNavigate={onNavigate} />

      <section className="section-block" aria-labelledby="services-title">
        <div className="section-heading"><div><span className="section-kicker">BẮT ĐẦU TỪ NHU CẦU</span><h2 id="services-title">Dịch vụ phổ biến</h2></div><button className="text-button" type="button" onClick={() => onNavigate('services')}>Xem tất cả <span aria-hidden="true">→</span></button></div>
        <div className="service-grid">
          {employerServices.map((service) => <button className={`service-card service-card--${service.id}`} type="button" key={service.id} aria-label={`${service.title}: ${service.description}`} onClick={() => onSelectService(service.id)}>
            <ServiceArtwork service={service.id as 'moving' | 'cleaning' | 'delivery' | 'events'} label={`Minh họa dịch vụ ${service.title}`} />
            <strong>{service.title}</strong><small>{service.description}</small>
          </button>)}
        </div>
      </section>

      <section className="employer-utilities" aria-labelledby="employer-utilities-title">
        <div className="section-heading"><div><span className="section-kicker">LỐI TẮT</span><h2 id="employer-utilities-title">Tiện ích cho bạn</h2></div></div>
        <div className="employer-utility-grid">
          {employerQuickUtilities.map((utility) => <button className={`employer-utility-card employer-utility-card--${utility.id}`} type="button" key={utility.id} onClick={() => onNavigate(utility.destination)}>
            <span className="employer-utility-icon"><NavigationIcon name={utility.id === 'create' ? 'home' : utility.id === 'track' ? 'jobs' : 'services'} /></span>
            <span><strong>{utility.label}</strong><small>{utility.detail}</small></span><b aria-hidden="true">›</b>
          </button>)}
          <button className="employer-utility-card employer-utility-card--guide" type="button" onClick={() => setGuideOpen(true)}>
            <span className="employer-utility-icon"><NavigationIcon name="account" /></span>
            <span><strong>Hướng dẫn sử dụng</strong><small>Cách tạo và theo dõi yêu cầu</small></span><b aria-hidden="true">›</b>
          </button>
        </div>
      </section>

      <section className="section-block jobs-section" aria-labelledby="employer-jobs-title">
        <div className="section-heading"><div><span className="section-kicker">CẬP NHẬT GẦN ĐÂY</span><h2 id="employer-jobs-title">Công việc của bạn</h2></div><button className="text-button" type="button" onClick={() => onNavigate('history')}>Lịch sử <span aria-hidden="true">→</span></button></div>
        {homeState === 'success' && jobs.length ? jobs.map((job) => <article className="job-card employer-job-card" key={job.id}>
          <div className="employer-recent-top"><ServiceArtwork service="moving" label="Minh họa hỗ trợ chuyển đồ" className="employer-recent-art" /><span className="status-pill status-searching"><i />{job.tag}</span></div>
          <h3>{job.title}</h3><p className="job-meta"><span aria-hidden="true">⌖</span>{job.location}</p>
          <div className="job-footer"><span><small>Thời gian</small><strong>{job.schedule}</strong></span><span><small>Ngân sách dự kiến</small><strong>{job.pay}</strong></span></div>
          <button className="employer-job-open" type="button" onClick={() => onNavigate('history')}>Theo dõi yêu cầu demo <span aria-hidden="true">→</span></button>
        </article>) : <AsyncStateView state={homeState === 'success' ? 'empty' : homeState} />}
      </section>
      <p className="employer-home-disclaimer">Dịch vụ và tình trạng công việc dùng dữ liệu mô phỏng cố định.</p>

      {guideOpen && <div className="employer-guide-backdrop" role="presentation" onClick={() => setGuideOpen(false)}>
        <section className="employer-guide-panel" role="dialog" aria-modal="true" aria-labelledby="employer-guide-title" onClick={(event) => event.stopPropagation()}>
          <button className="employer-guide-close" type="button" aria-label="Đóng hướng dẫn" onClick={() => setGuideOpen(false)}>×</button>
          <span className="section-kicker">HƯỚNG DẪN DEMO</span><h2 id="employer-guide-title">Tạo và theo dõi yêu cầu</h2>
          <ol><li>Chọn một dịch vụ phù hợp với nhu cầu.</li><li>Điền mô tả, địa điểm và thời gian trong bản nháp.</li><li>Xem lại tóm tắt rồi mở lịch sử để theo dõi trạng thái demo.</li></ol>
          <p>Thông tin chỉ nằm trong giao diện demo. Không gửi yêu cầu hoặc thanh toán thật.</p>
          <button className="employer-guide-action" type="button" onClick={() => { setGuideOpen(false); onNavigate('requestDraft') }}>Bắt đầu tạo yêu cầu <span aria-hidden="true">→</span></button>
        </section>
      </div>}
    </main>
  )
}
