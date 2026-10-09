import { useState } from 'react'
import { AsyncStateView } from '../components/AsyncStateView'
import { BottomNavigation } from '../components/BottomNavigation'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { SharedHeader } from '../components/SharedHeader'
import { EmployerHome } from '../features/employer/EmployerHome'
import { WorkerHome } from '../features/worker/WorkerHome'
import { destinationLabel, isDestinationForContext } from '../navigation/navigation'
import type { Destination, UiContext } from '../types/domain'

export function AppShell() {
  const [context, setContext] = useState<UiContext>('employer')
  const [destination, setDestination] = useState<Destination>('home')

  function changeContext(nextContext: UiContext) {
    setContext(nextContext)
    setDestination('home')
  }

  function navigate(nextDestination: Destination) {
    setDestination(isDestinationForContext(context, nextDestination) ? nextDestination : 'home')
  }

  const isHome = destination === 'home'
  return (
    <div className={`app-shell context-${context}`} data-jobfree-context={context}>
      <div className="app-scroll-area">
        <SharedHeader context={context} />
        <RoleSwitcher key={context} context={context} onChange={changeContext} />
        {isHome ? (context === 'employer' ? <EmployerHome /> : <WorkerHome />) : (
          <main className="placeholder-content">
            <span className="placeholder-icon" aria-hidden="true">{destination === 'services' || destination === 'jobs' ? '▦' : '⌂'}</span>
            <span className="section-kicker">ĐANG TRONG KẾ HOẠCH PHÁT TRIỂN</span>
            <h1>{destinationLabel(context, destination)}</h1>
            <p>Màn hình này chưa thuộc Round 1. Nội dung và thao tác sẽ được bổ sung ở round phù hợp.</p>
            <AsyncStateView state="empty" />
          </main>
        )}
      </div>
      <BottomNavigation context={context} active={destination} onNavigate={navigate} />
    </div>
  )
}
