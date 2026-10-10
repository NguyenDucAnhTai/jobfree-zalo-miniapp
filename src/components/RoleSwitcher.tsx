import type { UiContext } from '../types/domain'

export function RoleSwitcher({ context, onChange }: { context: UiContext; onChange: (context: UiContext) => void }) {
  return (
    <section className="demo-banner">
      <div className="demo-copy"><span className="demo-dot" /><div><strong>DEMO · NON-PRODUCTION</strong><small>Chọn giao diện để xem thử</small></div></div>
      <div className="role-switch" role="group" aria-label="Ngữ cảnh demo">
        <button type="button" aria-pressed={context === 'employer'} onClick={() => onChange('employer')}>Người thuê</button>
        <button type="button" aria-pressed={context === 'worker'} onClick={() => onChange('worker')}>Người làm</button>
      </div>
    </section>
  )
}
