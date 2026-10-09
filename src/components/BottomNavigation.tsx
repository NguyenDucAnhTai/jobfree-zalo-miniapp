import type { Destination, UiContext } from '../types/domain'
import { navigationByContext } from '../navigation/navigation'

export function BottomNavigation({ context, active, onNavigate }: {
  context: UiContext
  active: Destination
  onNavigate: (destination: Destination) => void
}) {
  return (
    <nav className="bottom-navigation" aria-label={`Điều hướng ${context === 'employer' ? 'người thuê' : 'người làm'}`}>
      {navigationByContext[context].map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-item${active === item.id ? ' is-active' : ''}`}
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
