import type { UiContext } from '../types/domain'

export function SharedHeader({ context }: { context: UiContext }) {
  const greeting = context === 'employer' ? 'Chào buổi sáng,' : 'Sẵn sàng cho ngày mới,'
  return (
    <header className="shared-header">
      <div className="brand-mark" aria-label="JobFree">J</div>
      <div className="header-copy"><span>{greeting}</span><strong>{context === 'employer' ? 'Minh Anh' : 'Hải Nam'}</strong></div>
      <button className="icon-button notification-button" type="button" aria-label="Thông báo demo">
        <span aria-hidden="true">♧</span><i />
      </button>
    </header>
  )
}
