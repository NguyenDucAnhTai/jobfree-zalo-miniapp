import type { UiContext } from '../types/domain'

export function SharedHeader({ context, onOpenNewOffer }: { context: UiContext; onOpenNewOffer?: () => void }) {
  return (
    <header className={`shared-header${context === 'worker' ? ' worker-shared-header' : ''}`}>
      {context === 'worker' ? (
        <>
          <div className="worker-avatar" aria-label="Ảnh đại diện demo của Nam">N</div>
          <div className="header-copy"><span>Chào Nam</span><strong>JobFree</strong></div>
        </>
      ) : (
        <>
          <div className="brand-mark" aria-label="JobFree">J</div>
          <div className="header-copy"><span>Chào buổi sáng,</span><strong>Minh Anh</strong></div>
        </>
      )}
      <button className="icon-button notification-button" type="button" aria-label={context === 'worker' && onOpenNewOffer ? 'Mở thông báo việc mới demo' : 'Thông báo chưa hỗ trợ trong demo'} disabled={context === 'employer' || !onOpenNewOffer} onClick={onOpenNewOffer}>
        <span aria-hidden="true">♧</span>
      </button>
    </header>
  )
}
