import { useMemo, useState } from 'react'
import { AsyncStateView } from '../components/AsyncStateView'
import { BottomNavigation } from '../components/BottomNavigation'
import { RoleSwitcher } from '../components/RoleSwitcher'
import { SharedHeader } from '../components/SharedHeader'
import { EmployerHome } from '../features/employer/EmployerHome'
import { EmployerProfile, EmployerRequestDraftScreen, EmployerServiceCatalog } from '../features/employer/EmployerScreens'
import { EmployerRequestDetail, EmployerRequestHistory, EmployerRequestSummary } from '../features/employer/EmployerLifecycleScreens'
import { WorkerHome } from '../features/worker/WorkerHome'
import { WorkerNewJobModal } from '../features/worker/WorkerNewJobModal'
import { WorkerOpportunities } from '../features/worker/WorkerOpportunities'
import { WorkerOfferDetail } from '../features/worker/WorkerOfferDetail'
import { WorkerProfile } from '../features/worker/WorkerProfile'
import { WorkerReadiness } from '../features/worker/WorkerReadiness'
import { WorkerJobs } from '../features/worker/WorkerJobs'
import { WorkerSchedule } from '../features/worker/WorkerSchedule'
import { WorkerShiftDetail } from '../features/worker/WorkerShiftDetail'
import { WorkerSkills } from '../features/worker/WorkerSkills'
import { WorkerTransactionDetail, WorkerWallet } from '../features/worker/WorkerWallet'
import { ConversationScreen } from '../features/shared/ConversationScreen'
import { DemoCallScreen } from '../features/shared/DemoCallScreen'
import { EmployerE2Screen } from '../features/employer/EmployerE2Screens'
import { demoConversationLinks, demoMessagesByConversation } from '../mocks/jobfreeCommunicationsFixtures'
import { employerReviewFixtures } from '../mocks/employerCompletionFixtures'
import { createCompletionDecision, submitEmployerIncident, submitEmployerReview } from '../mocks/employerCompletionAdapter'
import type { EmployerCompletionDecision, EmployerDisputeCase, EmployerIncident, EmployerReview } from '../types/employerCompletion'
import type { DemoConversationLink, DemoMessage } from '../types/jobfreeCommunications'
import { emptyEmployerRequestDraft, workerProfileDemo, workerSavedSkillIds } from '../mocks/fixtures'
import { createDraftRequest, employerRequestScenarios, getEmployerRequestById } from '../mocks/employerRequestAdapter'
import { employerExtensionScopeKey } from '../mocks/employerLifecycleAdapter'
import { getEmployerShiftTracking } from '../mocks/employerLifecycleFixtures'
import { destinationLabel, isDestinationForContext } from '../navigation/navigation'
import { decideWorkerOffer, getWorkerJobs, getWorkerTransactions, transitionWorkerShift, type WorkerOfferDecisionResult } from '../mocks/workerLifecycleAdapter'
import { initialWorkerAssignments, initialWorkerShifts, workerOffers, workerWalletTransactions } from '../mocks/workerLifecycleFixtures'
import type { Destination, EmployerRequestDraft, EmployerWorkRequest, UiContext } from '../types/domain'
import type { WorkerDecisionScenario, WorkerOfferStatus, WorkerShiftStatus } from '../types/workerLifecycle'
import type { EmployerExtensionSessionState } from '../types/employerLifecycle'

export function AppShell() {
  const [context, setContext] = useState<UiContext>('employer')
  const [destination, setDestination] = useState<Destination>('home')
  const [employerDraft, setEmployerDraft] = useState<EmployerRequestDraft>(emptyEmployerRequestDraft)
  const [savedEmployerDraft, setSavedEmployerDraft] = useState<EmployerRequestDraft>()
  const [localDraftRequest, setLocalDraftRequest] = useState<EmployerWorkRequest>()
  const [selectedRequestId, setSelectedRequestId] = useState(employerRequestScenarios[0].id)
  const [employerExtensionSessions, setEmployerExtensionSessions] = useState<Record<string, EmployerExtensionSessionState>>({})
  const [workerReady, setWorkerReady] = useState(true)
  const [workerSkillIds, setWorkerSkillIds] = useState<string[]>(workerSavedSkillIds)
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>()
  const [workerOfferStatuses, setWorkerOfferStatuses] = useState<Record<string, WorkerOfferStatus>>(() => Object.fromEntries(workerOffers.map((offer) => [offer.id, offer.status])))
  const [workerAssignments, setWorkerAssignments] = useState(initialWorkerAssignments)
  const [workerShifts, setWorkerShifts] = useState(initialWorkerShifts)
  const [selectedShiftId, setSelectedShiftId] = useState<string>()
  const [shiftReturnDestination, setShiftReturnDestination] = useState<Destination>('jobs')
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>()
  const [newJobModalOpen, setNewJobModalOpen] = useState(false)
  const [modalDecisionMessage, setModalDecisionMessage] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [communicationBackDestination, setCommunicationBackDestination] = useState<Destination>('requestDetail')
  const [demoMessages, setDemoMessages] = useState<Record<string, DemoMessage[]>>(() => Object.fromEntries(Object.entries(demoMessagesByConversation).map(([id, messages]) => [id, [...messages]])))
  const [completionDecisions, setCompletionDecisions] = useState<Record<string, EmployerCompletionDecision>>({})
  const [employerReviews, setEmployerReviews] = useState<EmployerReview[]>(employerReviewFixtures)
  const [employerIncidents, setEmployerIncidents] = useState<EmployerIncident[]>([])
  const [employerDisputes, setEmployerDisputes] = useState<EmployerDisputeCase[]>([])

  function changeContext(nextContext: UiContext) {
    setContext(nextContext)
    setDestination('home')
    setNewJobModalOpen(false)
    setSelectedConversationId(undefined)
    setCommunicationBackDestination('requestDetail')
  }

  function navigate(nextDestination: Destination) {
    const isEmployerFlow = context === 'employer' && ['requestDraft', 'requestSummary', 'requestDetail'].includes(nextDestination)
    setDestination(isEmployerFlow || isDestinationForContext(context, nextDestination) ? nextDestination : 'home')
  }

  function chooseService(serviceId: string) {
    setEmployerDraft((current) => ({ ...current, serviceId }))
    setDestination('requestDraft')
  }

  function updateEmployerDraft(nextDraft: EmployerRequestDraft) {
    setEmployerDraft(nextDraft)
  }

  function saveEmployerDraft() {
    const request = createDraftRequest(employerDraft)
    setSavedEmployerDraft({ ...employerDraft })
    setLocalDraftRequest(request)
    setSelectedRequestId(request.id)
    setDestination('requestSummary')
  }

  function openRequest(requestId: string) {
    setSelectedRequestId(requestId)
    setDestination('requestDetail')
  }

  function openConversation(link: DemoConversationLink, route: 'communicationChat' | 'communicationCall') {
    setSelectedConversationId(link.conversationId)
    setCommunicationBackDestination(context === 'employer' ? 'requestDetail' : 'shiftDetail')
    setDestination(route)
  }

  function openWorkerJobContact(link: DemoConversationLink, route: 'communicationChat' | 'communicationCall') {
    setSelectedShiftId(link.shiftId)
    setShiftReturnDestination('jobs')
    openConversation(link, route)
  }

  const getWorkerContactLink = (shiftId: string) => {
    const assignment = workerAssignments.find((item) => item.shiftId === shiftId)
    return assignment ? demoConversationLinks.find((link) => link.role === 'worker' && link.assignmentId === assignment.id && link.shiftId === shiftId) : undefined
  }

  function selectRequestScenario(requestId: string) {
    setSelectedRequestId(requestId)
  }

  const workerJobs = useMemo(() => getWorkerJobs(workerAssignments, workerShifts), [workerAssignments, workerShifts])
  const workerTransactions = useMemo(() => getWorkerTransactions(workerShifts, workerWalletTransactions), [workerShifts])
  const selectedOffer = workerOffers.find((offer) => offer.opportunityId === selectedOpportunityId) ?? workerOffers[0]
  const modalOffer = workerOffers[0]
  const selectedShift = workerShifts.find((shift) => shift.id === selectedShiftId)
  const selectedTransaction = workerTransactions.find((transaction) => transaction.id === selectedTransactionId)
  const selectedConversation = demoConversationLinks.find((item) => item.conversationId === selectedConversationId && item.role === context)

  function handleOfferDecision(offerId: string, decision: 'accept' | 'decline', scenario: WorkerDecisionScenario): WorkerOfferDecisionResult {
    const offer = workerOffers.find((item) => item.id === offerId)
    if (!offer) return { offerStatus: 'superseded', result: 'invalid', message: 'Offer demo không tồn tại.' }
    const result = decideWorkerOffer({ ...offer, status: workerOfferStatuses[offer.id] }, decision, scenario, workerAssignments)
    setWorkerOfferStatuses((current) => ({ ...current, [offer.id]: result.offerStatus }))
    if (result.assignment && !workerAssignments.some((item) => item.offerId === result.assignment?.offerId)) {
      setWorkerAssignments((current) => [...current, result.assignment!])
      setWorkerShifts((current) => current.some((item) => item.id === result.shift?.id) ? current : [...current, result.shift!])
    }
    setModalDecisionMessage(result.message)
    return result
  }

  function changeShiftStatus(nextStatus: WorkerShiftStatus) {
    if (!selectedShift) return
    const updated = transitionWorkerShift(selectedShift, nextStatus)
    if (!updated) return
    setWorkerShifts((current) => current.map((shift) => shift.id === updated.id ? updated : shift))
    if (nextStatus === 'completed') setWorkerAssignments((current) => current.map((assignment) => assignment.shiftId === updated.id ? { ...assignment, status: 'completed' } : assignment))
  }

  const activeTab = destination === 'requestDraft' || destination === 'requestSummary' ? 'services' : destination === 'requestDetail' ? 'history' : destination === 'skills' || destination === 'readiness' ? 'account' : destination === 'opportunities' || destination === 'opportunityDetail' ? 'home' : destination === 'shiftDetail' ? 'jobs' : destination === 'transactionDetail' ? 'wallet' : destination
  const isHome = destination === 'home'
  const isEmployerScreen = context === 'employer'
  const selectedRequest = getEmployerRequestById(selectedRequestId, localDraftRequest)
  const selectedCompletion = selectedRequest ? completionDecisions[selectedRequest.id] : undefined
  const selectedEmployerShift = selectedRequest ? getEmployerShiftTracking(selectedRequest.id) : undefined
  const selectedExtensionScope = selectedEmployerShift ? employerExtensionScopeKey(selectedEmployerShift.requestId, selectedEmployerShift.shiftId) : undefined
  const employerRequests = localDraftRequest ? [localDraftRequest, ...employerRequestScenarios] : employerRequestScenarios
  return (
    <div className={`app-shell context-${context}`} data-jobfree-context={context}>
      <div className="app-scroll-area">
        <SharedHeader context={context} workerProfile={workerProfileDemo} workerReady={workerReady} onOpenNewOffer={context === 'worker' ? () => { setModalDecisionMessage(''); setNewJobModalOpen(true) } : undefined} />
        <RoleSwitcher key={context} context={context} onChange={changeContext} />
        {isHome ? (isEmployerScreen ? <EmployerHome onNavigate={navigate} onSelectService={chooseService} /> : <WorkerHome onNavigate={navigate} onSelectOpportunity={setSelectedOpportunityId} onOpenNewOffer={() => { setModalDecisionMessage(''); setNewJobModalOpen(true) }} onOpenShift={(id) => { setSelectedShiftId(id); setShiftReturnDestination('jobs'); setDestination('shiftDetail') }} shift={workerShifts.find((shift) => shift.status === 'checked_in') ?? workerShifts.find((shift) => shift.status === 'en_route') ?? workerShifts.find((shift) => shift.status === 'scheduled')} />) : isEmployerScreen && destination === 'services' ? (
          <EmployerServiceCatalog onChoose={chooseService} />
        ) : isEmployerScreen && destination === 'history' ? (
          <EmployerRequestHistory requests={employerRequests} onOpen={openRequest} />
        ) : isEmployerScreen && destination === 'account' ? (
          <EmployerProfile onNavigate={navigate} />
        ) : isEmployerScreen && destination === 'requestDraft' ? (
          <EmployerRequestDraftScreen draft={employerDraft} backDestination={localDraftRequest ? 'requestSummary' : 'services'} onChange={updateEmployerDraft} onSave={saveEmployerDraft} onNavigate={navigate} />
        ) : isEmployerScreen && destination === 'requestSummary' && localDraftRequest ? (
          <EmployerRequestSummary request={localDraftRequest} draft={savedEmployerDraft ?? employerDraft} onEdit={() => setDestination('requestDraft')} onHistory={() => setDestination('history')} />
        ) : isEmployerScreen && destination === 'requestDetail' && selectedRequest ? (
          <EmployerRequestDetail
            key={selectedRequest.id}
            request={selectedRequest}
            extensionState={selectedExtensionScope ? employerExtensionSessions[selectedExtensionScope] : undefined}
            onExtensionStateChange={(nextState) => {
              if (selectedExtensionScope && nextState.requestId === selectedRequest.id && nextState.shiftId === selectedEmployerShift?.shiftId) {
                setEmployerExtensionSessions((current) => ({ ...current, [selectedExtensionScope]: nextState }))
              }
            }}
            onBack={() => setDestination('history')}
            onSelectScenario={selectRequestScenario}
            onOpenChat={() => { const link = demoConversationLinks.find((item) => item.role === 'employer' && item.requestId === selectedRequest.id && item.assignmentStatus === 'active'); if (link) openConversation(link, 'communicationChat') }}
            onOpenCall={() => { const link = demoConversationLinks.find((item) => item.role === 'employer' && item.requestId === selectedRequest.id && item.assignmentStatus === 'active'); if (link) openConversation(link, 'communicationCall') }}
            onOpenCompletion={() => setDestination('completion')}
            onOpenReview={() => setDestination('review')}
            onOpenIncident={() => setDestination('incident')}
            onOpenDispute={() => setDestination('dispute')}
          />
        ) : !isEmployerScreen && destination === 'account' ? (
          <WorkerProfile profile={workerProfileDemo} skillCount={workerSkillIds.length} onNavigate={navigate} />
        ) : !isEmployerScreen && destination === 'skills' ? (
          <WorkerSkills selectedIds={workerSkillIds} onSave={(ids) => { setWorkerSkillIds(ids); setDestination('account') }} onCancel={() => setDestination('account')} />
        ) : !isEmployerScreen && destination === 'readiness' ? (
          <WorkerReadiness ready={workerReady} onChange={setWorkerReady} />
        ) : !isEmployerScreen && destination === 'opportunities' ? (
          <WorkerOpportunities onNavigate={navigate} onSelect={setSelectedOpportunityId} />
        ) : !isEmployerScreen && destination === 'opportunityDetail' && selectedOffer ? (
          <WorkerOfferDetail offer={selectedOffer} status={workerOfferStatuses[selectedOffer.id]} onBack={() => setDestination('opportunities')} onDecision={(decision, scenario) => handleOfferDecision(selectedOffer.id, decision, scenario)} onAccepted={() => setDestination('jobs')} />
        ) : !isEmployerScreen && destination === 'jobs' ? (
          <WorkerJobs jobs={workerJobs} getContactLink={getWorkerContactLink} onOpenChat={(link) => openWorkerJobContact(link, 'communicationChat')} onOpenCall={(link) => openWorkerJobContact(link, 'communicationCall')} onOpenShift={(id) => { setSelectedShiftId(id); setShiftReturnDestination('jobs'); setDestination('shiftDetail') }} />
        ) : !isEmployerScreen && destination === 'schedule' ? (
          <WorkerSchedule shifts={workerShifts} onOpenShift={(id) => { setSelectedShiftId(id); setShiftReturnDestination('schedule'); setDestination('shiftDetail') }} />
        ) : !isEmployerScreen && destination === 'shiftDetail' && selectedShift ? (
          <WorkerShiftDetail shift={selectedShift} contactLink={getWorkerContactLink(selectedShift.id)} onOpenChat={(link) => openConversation(link, 'communicationChat')} onOpenCall={(link) => openConversation(link, 'communicationCall')} onBack={() => setDestination(shiftReturnDestination)} onTransition={changeShiftStatus} />
        ) : !isEmployerScreen && destination === 'wallet' ? (
          <WorkerWallet transactions={workerTransactions} onOpenTransaction={(id) => { setSelectedTransactionId(id); setDestination('transactionDetail') }} />
        ) : !isEmployerScreen && destination === 'transactionDetail' && selectedTransaction ? (
          <WorkerTransactionDetail transaction={selectedTransaction} onBack={() => setDestination('wallet')} />
        ) : destination === 'communicationChat' ? (
          <ConversationScreen key={`${context}-${selectedConversationId ?? 'none'}`} link={selectedConversation} role={context} messages={selectedConversation ? (demoMessages[selectedConversation.conversationId] ?? []) : []} onMessagesChange={(messages) => { if (selectedConversation) setDemoMessages((current) => ({ ...current, [selectedConversation.conversationId]: messages })) }} onBack={() => setDestination(communicationBackDestination)} onCall={() => selectedConversation && openConversation(selectedConversation, 'communicationCall')} />
        ) : destination === 'communicationCall' ? (
          <DemoCallScreen key={`${context}-${selectedConversationId ?? 'none'}`} link={selectedConversation} role={context} onBack={() => setDestination(communicationBackDestination)} />
        ) : isEmployerScreen && ['completion', 'review', 'incident', 'dispute'].includes(destination) ? (
          <EmployerE2Screen screen={destination as 'completion' | 'review' | 'incident' | 'dispute'} request={selectedRequest} completion={selectedCompletion} onCompletion={(value) => { const decision = createCompletionDecision(value.requestId, value.assignmentId, value.shiftId, value.status as 'confirmed_demo' | 'issue_reported_demo', completionDecisions[value.requestId]); if (decision) setCompletionDecisions((current) => ({ ...current, [decision.requestId]: decision })) }} reviews={employerReviews} onReview={(value) => { const review = submitEmployerReview(value, employerReviews); if (review) setEmployerReviews((current) => current.some((item) => item.requestId === review.requestId && item.assignmentId === review.assignmentId) ? current : [...current, review]) }} incidents={employerIncidents} onIncident={(incident) => { const result = submitEmployerIncident({ requestId: incident.requestId, assignmentId: incident.assignmentId, category: incident.category, description: incident.description, evidenceLabel: incident.evidenceLabel }, employerIncidents, employerDisputes); setEmployerIncidents((current) => current.some((item) => item.id === result.incident.id) ? current : [...current, result.incident]); setEmployerDisputes((current) => current.some((item) => item.id === result.dispute.id) ? current : [...current, result.dispute]); setDestination('dispute') }} disputes={employerDisputes} onDispute={(value) => setEmployerDisputes((current) => current.some((item) => item.id === value.id) ? current.map((item) => item.id === value.id ? value : item) : [...current, value])} onBack={() => setDestination('requestDetail')} />
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
      {context === 'worker' && newJobModalOpen && <WorkerNewJobModal offer={modalOffer} status={workerOfferStatuses[modalOffer.id]} resultMessage={modalDecisionMessage} onClose={() => setNewJobModalOpen(false)} onViewDetails={() => { setSelectedOpportunityId(modalOffer.opportunityId); setNewJobModalOpen(false); setDestination('opportunityDetail') }} onDecision={() => { const result = handleOfferDecision(modalOffer.id, 'accept', 'success'); if (result.result === 'accepted') { setNewJobModalOpen(false); setDestination('jobs') } return result }} />}
    </div>
  )
}
