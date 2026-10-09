import { useState } from 'react'
import { AsyncStateView } from '../components/AsyncStateView'
import { BottomNavigation } from '../components/BottomNavigation'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { SharedHeader } from '../components/SharedHeader'
import { EmployerHome } from '../features/employer/EmployerHome'
import { EmployerProfile, EmployerRequestDraftScreen, EmployerServiceCatalog } from '../features/employer/EmployerScreens'
import { WorkerHome } from '../features/worker/WorkerHome'
import { emptyEmployerRequestDraft } from '../mocks/fixtures'
import { destinationLabel, isDestinationForContext } from '../navigation/navigation'
import type { Destination, EmployerRequestDraft, UiContext } from '../types/domain'

export function AppShell() {
  const [context, setContext] = useState<UiContext>('employer')
  const [destination, setDestination] = useState<Destination>('home')
  const [employerDraft, setEmployerDraft] = useState<EmployerRequestDraft>(emptyEmployerRequestDraft)
  const [draftSaved, setDraftSaved] = useState(false)

  function changeContext(nextContext: UiContext) {
    setContext(nextContext)
    setDestination('home')
  }

  function navigate(nextDestination: Destination) {
    const isEmployerDraft = context === 'employer' && nextDestination === 'requestDraft'
    setDestination(isEmployerDraft || isDestinationForContext(context, nextDestination) ? nextDestination : 'home')
  }

  function chooseService(serviceId: string) {
    setEmployerDraft((current) => ({ ...current, serviceId }))
    setDraftSaved(false)
    setDestination('requestDraft')
  }

  function updateEmployerDraft(nextDraft: EmployerRequestDraft) {
    setEmployerDraft(nextDraft)
    setDraftSaved(false)
  }

  const activeTab = destination === 'requestDraft' ? 'services' : destination
  const isHome = destination === 'home'
  const isEmployerScreen = context === 'employer'
  return (
    <div className={`app-shell context-${context}`} data-jobfree-context={context}>
      <div className="app-scroll-area">
        <SharedHeader context={context} />
        <RoleSwitcher key={context} context={context} onChange={changeContext} />
        {isHome ? (isEmployerScreen ? <EmployerHome onNavigate={navigate} onSelectService={chooseService} /> : <WorkerHome onNavigate={navigate} />) : isEmployerScreen && destination === 'services' ? (
          <EmployerServiceCatalog onChoose={chooseService} />
        ) : isEmployerScreen && destination === 'account' ? (
          <EmployerProfile onNavigate={navigate} />
        ) : isEmployerScreen && destination === 'requestDraft' ? (
          <EmployerRequestDraftScreen draft={employerDraft} saved={draftSaved} onChange={updateEmployerDraft} onSave={() => setDraftSaved(true)} onNavigate={navigate} />
        ) : (
          <main className="placeholder-content">
            <span className="placeholder-icon" aria-hidden="true">{['services', 'jobs', 'schedule', 'wallet'].includes(destination) ? '▦' : '⌂'}</span>
            <span className="section-kicker">ĐANG TRONG KẾ HOẠCH PHÁT TRIỂN</span>
            <h1>{destinationLabel(context, destination)}</h1>
            <p>Màn hình nghiệp vụ này được lên kế hoạch cho round sau. Nội dung hiện chỉ là placeholder demo.</p>
            <AsyncStateView state="empty" />
          </main>
        )}
      </div>
      <BottomNavigation context={context} active={activeTab} onNavigate={navigate} />
    </div>
  )
}
