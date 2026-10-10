import { useState } from 'react'
import { employerProfileItems, employerServices } from '../../mocks/fixtures'
import type { FormEvent } from 'react'
import type { Destination, EmployerRequestDraft } from '../../types/domain'
import { validateEmployerDraft } from './validateEmployerDraft'

export function EmployerServiceCatalog({ onChoose }: { onChoose: (serviceId: string) => void }) {
  const categories = [...new Set(employerServices.map((service) => service.category))]
  return (
    <main className="employer-page-content">
      <PageHeading eyebrow="DỊCH VỤ JOBFREE" title="Chọn dịch vụ" detail="Chọn nhu cầu phù hợp để bắt đầu tạo yêu cầu demo." />
      {categories.map((category, index) => <section className="catalog-group" key={category} aria-labelledby={`catalog-${index}`}>
        <h2 id={`catalog-${index}`}>{category}</h2>
        <div className="catalog-list">{employerServices.filter((service) => service.category === category).map((service) => (
          <button className="catalog-card" type="button" key={service.id} onClick={() => onChoose(service.id)}>
            <span className={`service-icon service-icon-${service.id}`} aria-hidden="true">{service.icon}</span>
            <span className="catalog-card-copy"><strong>{service.title}</strong><small>{service.description}</small><small className="catalog-price">{service.countLabel} · Giá tham khảo demo</small></span>
            <span className="catalog-arrow" aria-hidden="true">›</span>
          </button>
        ))}</div>
      </section>)}
    </main>
  )
}

export function EmployerProfile({ onNavigate }: { onNavigate: (destination: Destination) => void }) {
  return (
    <main className="employer-page-content">
      <PageHeading eyebrow="TÀI KHOẢN DEMO" title="Tài khoản" detail="Thông tin giả lập, không liên kết danh tính thật." />
      <section className="employer-profile-card">
        <span className="employer-profile-avatar" aria-hidden="true">MA</span>
        <div><strong>Minh Anh</strong><small>Người thuê · Hồ sơ demo</small></div>
        <span className="demo-profile-tag">DEMO</span>
      </section>
      <h2 className="employer-subheading">Quản lý tài khoản</h2>
      <div className="profile-menu-list">{employerProfileItems.map((item) => item.id === 'requests' ? (
        <button type="button" className="profile-menu-item" key={item.id} onClick={() => onNavigate('history')}>
          <span><strong>{item.label}</strong><small>{item.description}</small></span><b aria-hidden="true">›</b>
        </button>
      ) : (
        <button type="button" className="profile-menu-item is-disabled" key={item.id} disabled aria-label={`${item.label}, chưa hỗ trợ trong demo`}>
          <span><strong>{item.label}</strong><small>{item.description}</small></span><b aria-hidden="true">›</b>
        </button>
      ))}</div>
      <button className="primary-button profile-create-button" type="button" onClick={() => onNavigate('requestDraft')}>Tạo yêu cầu công việc <span aria-hidden="true">→</span></button>
    </main>
  )
}

const demoDate = '2026-10-09'

export function EmployerRequestDraftScreen({
  draft,
  backDestination,
  onChange,
  onSave,
  onNavigate,
}: {
  draft: EmployerRequestDraft
  backDestination?: Destination
  onChange: (draft: EmployerRequestDraft) => void
  onSave: () => void
  onNavigate: (destination: Destination) => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const errors = validateEmployerDraft(draft)
  const service = employerServices.find((item) => item.id === draft.serviceId)
  const update = (changes: Partial<EmployerRequestDraft>) => onChange({ ...draft, ...changes })
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    onSave()
  }

  return (
    <main className="employer-page-content request-draft-page">
      <button className="back-link" type="button" onClick={() => onNavigate(backDestination ?? (service ? 'services' : 'home'))}>
        {backDestination === 'requestSummary' ? '← Tóm tắt yêu cầu' : '← Quay lại'}
      </button>
      <PageHeading eyebrow="BẢN NHÁP DEMO" title="Tạo yêu cầu" detail="Thông tin chỉ lưu trong trạng thái demo của phiên này." />
      <form className="draft-form" onSubmit={save} noValidate>
        <label className="form-field"><span>Dịch vụ</span>
          <select value={draft.serviceId} onChange={(event) => update({ serviceId: event.target.value })} aria-invalid={submitted && Boolean(errors.serviceId)} aria-describedby={submitted ? 'service-error' : undefined}>
            <option value="">Chọn dịch vụ</option>
            {employerServices.map((item) => <option value={item.id} key={item.id}>{item.title} · {item.category}</option>)}
          </select>
          {submitted && errors.serviceId && <small id="service-error" className="field-error">{errors.serviceId}</small>}
        </label>
        <label className="form-field"><span>Mô tả công việc</span>
          <textarea value={draft.details} onChange={(event) => update({ details: event.target.value })} placeholder="Ví dụ: Hỗ trợ chuyển các thùng hàng lên tầng 2" rows={3} aria-invalid={submitted && Boolean(errors.details)} aria-describedby={submitted ? 'details-error' : undefined} />
          {submitted && errors.details && <small id="details-error" className="field-error">{errors.details}</small>}
        </label>
        <label className="form-field"><span>Địa điểm làm việc (dữ liệu demo)</span>
          <input value={draft.location} onChange={(event) => update({ location: event.target.value })} placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh" aria-invalid={submitted && Boolean(errors.location)} aria-describedby={submitted ? 'location-error' : undefined} />
          {submitted && errors.location && <small id="location-error" className="field-error">{errors.location}</small>}
        </label>
        <label className="form-field"><span>Ngày làm</span>
          <input type="date" min={demoDate} value={draft.date} onChange={(event) => update({ date: event.target.value })} aria-invalid={submitted && Boolean(errors.date)} aria-describedby={submitted ? 'date-error' : undefined} />
          {submitted && errors.date && <small id="date-error" className="field-error">{errors.date}</small>}
        </label>
        <fieldset className="time-fields"><legend>Khung giờ</legend>
          <label className="form-field"><span>Bắt đầu</span><input type="time" value={draft.startTime} onChange={(event) => update({ startTime: event.target.value })} /></label>
          <label className="form-field"><span>Kết thúc</span><input type="time" value={draft.endTime} onChange={(event) => update({ endTime: event.target.value })} /></label>
          {submitted && errors.time && <small className="field-error time-error">{errors.time}</small>}
        </fieldset>
        <section className="draft-summary" aria-live="polite"><span className="section-kicker">TÓM TẮT YÊU CẦU DEMO</span>
          <strong>{service?.title ?? 'Chưa chọn dịch vụ'}</strong>
          <p>{draft.details.trim() || 'Mô tả công việc sẽ hiển thị tại đây.'}</p>
          <small>{draft.location.trim() || 'Chưa nhập địa điểm'} · {draft.date || 'Chưa chọn ngày'} · {draft.startTime}–{draft.endTime}</small>
          <small className="summary-demo-warning">Chưa tạo công việc thật; không có thanh toán hoặc gửi yêu cầu lên hệ thống.</small>
        </section>
        <button className="primary-button draft-submit" type="submit">Lưu bản nháp demo <span aria-hidden="true">✓</span></button>
      </form>
    </main>
  )
}

function PageHeading({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <div className="page-heading"><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{detail}</p></div>
}
