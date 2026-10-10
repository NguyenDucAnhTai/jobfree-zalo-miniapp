import { getWorkerDashboardMetrics, workerDashboardSummaryFixture } from '../../mocks/workerDashboardFixtures'

const metrics = getWorkerDashboardMetrics()

export function WorkerDashboardOverview() {
  const hours = Math.floor(metrics.workedMinutes / 60)
  const minutes = metrics.workedMinutes % 60

  return (
    <section className="worker-dashboard-overview" aria-labelledby="worker-dashboard-heading">
      <div className="worker-dashboard-overview-heading"><div><span className="worker-dashboard-eyebrow">TỔNG QUAN · DEMO</span><h1 id="worker-dashboard-heading">Tổng quan hôm nay</h1></div><span className="worker-dashboard-date">{workerDashboardSummaryFixture.dateLabel}</span></div>
      <div className="worker-dashboard-income"><span>Thu nhập tham khảo</span><strong>{new Intl.NumberFormat('vi-VN').format(metrics.referenceIncome)}đ</strong><small>Giá trị fixture minh họa · không phải tiền đã thanh toán</small></div>
      <div className="worker-dashboard-metrics">
        <div><strong>{metrics.completedShifts}</strong><span>Ca hoàn thành</span></div>
        <div><strong>{hours}h{minutes ? `${minutes}p` : ''}</strong><span>Thời gian làm</span></div>
        <div><strong>{metrics.breakMinutes === null ? '—' : `${metrics.breakMinutes}p`}</strong><span>{metrics.breakMinutes === null ? 'Chưa có dữ liệu nghỉ' : 'Thời gian nghỉ'}</span></div>
      </div>
      <p className="worker-dashboard-disclaimer">DEMO · NON-PRODUCTION. Số liệu từ kịch bản dashboard cố định.</p>
    </section>
  )
}
