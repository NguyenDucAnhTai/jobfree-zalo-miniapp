const controls = [
  { title: 'COD', icon: '₫', tone: 'cod' },
  { title: 'Check-in', icon: '✓', tone: 'checkin' },
  { title: 'Dịch vụ', icon: '◇', tone: 'service' },
  { title: 'Báo cáo', icon: '!', tone: 'report' },
  { title: 'Nghỉ', icon: 'Ⅱ', tone: 'break' },
]

export function WorkerShiftControls() {
  return (
    <section className="worker-shift-controls" aria-labelledby="worker-shift-controls-heading">
      <div className="worker-home-section-heading"><div><span className="worker-dashboard-eyebrow">THAO TÁC CA</span><h2 id="worker-shift-controls-heading">Điều khiển ca</h2></div></div>
      <div className="worker-shift-control-grid">
        {controls.map((control) => <button key={control.title} className={`worker-shift-control worker-shift-control--${control.tone}`} type="button" disabled aria-label={`${control.title}, chưa hỗ trợ trong demo`}><span aria-hidden="true">{control.icon}</span><strong>{control.title}</strong></button>)}
      </div>
      <p className="worker-shift-controls-note">Các thao tác đang tắt trong demo. Không ghi nhận COD, GPS/check-in, sự cố hoặc thời gian nghỉ thật.</p>
    </section>
  )
}
