import type { UiContext } from '../types/domain'
import type { WorkerProfileDemo } from '../types/domain'
import { workerProfileDemo } from '../mocks/fixtures'

export function SharedHeader({ context, onOpenNewOffer, workerProfile = workerProfileDemo, workerReady = true, employerUnreadCount = 0, employerDisplayName = 'Minh Anh', onOpenEmployerNotifications }: { context: UiContext; onOpenNewOffer?: () => void; workerProfile?: WorkerProfileDemo; workerReady?: boolean; employerUnreadCount?: number; employerDisplayName?: string; onOpenEmployerNotifications?: () => void }) {
  return (
    <header className={`shared-header${context === 'worker' ? ' worker-shared-header' : ''}`}>
      {context === 'worker' ? (
        <>
          <div className="worker-avatar" aria-label={`Ảnh đại diện demo của ${workerProfile.displayName}`}>{workerProfile.initials}</div>
          <div className="header-copy"><span>Xin chào,</span><strong>{workerProfile.displayName}</strong><small className="worker-header-readiness">{workerReady ? '● Sẵn sàng nhận việc · DEMO' : '● Đang tạm nghỉ · DEMO'}</small></div>
        </>
      ) : (
        <>
          <div className="brand-mark" aria-label="JobFree">J</div>
          <div className="header-copy"><span>Chào buổi sáng,</span><strong>{employerDisplayName}</strong></div>
        </>
      )}
      <button className="icon-button notification-button" type="button" aria-label={context === 'worker' && onOpenNewOffer ? 'Mở thông báo việc mới demo' : `Mở thông báo người thuê demo${employerUnreadCount ? `, ${employerUnreadCount} chưa đọc` : ''}`} disabled={context === 'worker' ? !onOpenNewOffer : !onOpenEmployerNotifications} onClick={context === 'worker' ? onOpenNewOffer : onOpenEmployerNotifications}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        {context === 'employer' && employerUnreadCount > 0 && <i aria-hidden="true">{employerUnreadCount}</i>}
      </button>
    </header>
  )
}
