import type { Destination } from '../../types/domain'
import type { WorkerProfileDemo } from '../../types/domain'

export function WorkerProfile({ profile, skillCount, onNavigate }: {
  profile: WorkerProfileDemo
  skillCount: number
  onNavigate: (destination: Destination) => void
}) {
  return <main className="worker-core-page worker-profile-page">
    <p className="worker-core-kicker">TÀI KHOẢN · DEMO</p>
    <h1>Tài khoản</h1>
    <section className="worker-profile-card" aria-label="Hồ sơ người làm demo">
      <div className="worker-profile-top"><span className="worker-avatar" aria-hidden="true">{profile.initials}</span><div><h2>{profile.displayName}</h2><p>{profile.phoneLabel}</p><span className="worker-demo-badge">Hồ sơ minh họa · {profile.verificationStatus === 'verified' ? 'đã xác thực demo' : 'chưa xác thực'}</span></div></div>
      <div className="worker-profile-stats"><div><strong>★ {profile.rating}</strong><span>Đánh giá demo</span></div><div><strong>{profile.completedJobs}</strong><span>Việc hoàn thành</span></div><div><strong>{profile.reliability}%</strong><span>Độ tin cậy demo</span></div></div>
    </section>
    <section className="worker-profile-menu" aria-label="Thông tin công việc">
      <h2>Hồ sơ làm việc</h2>
      <button type="button" onClick={() => onNavigate('skills')}><span><strong>Kỹ năng</strong><small>{skillCount} kỹ năng trong hồ sơ demo</small></span><b aria-hidden="true">›</b></button>
      <button type="button" onClick={() => onNavigate('readiness')}><span><strong>Lịch rảnh & trạng thái</strong><small>Chỉnh trạng thái sẵn sàng demo</small></span><b aria-hidden="true">›</b></button>
      <button type="button" onClick={() => onNavigate('area')}><span><strong>Khu vực làm việc</strong><small>{profile.serviceArea} · dữ liệu demo</small></span><b aria-hidden="true">›</b></button>
      <div className="worker-profile-menu-static"><strong>Giấy tờ xác minh</strong><small>Chưa kết nối VNeID hoặc eKYC</small></div>
    </section>
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Hồ sơ và các chỉ số chỉ phục vụ xem thử giao diện.</p>
  </main>
}
