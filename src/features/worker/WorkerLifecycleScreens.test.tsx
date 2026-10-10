import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WorkerJobs } from './WorkerJobs'
import { WorkerNewJobModal } from './WorkerNewJobModal'
import { WorkerOfferDetail } from './WorkerOfferDetail'
import { WorkerSchedule } from './WorkerSchedule'
import { WorkerShiftDetail } from './WorkerShiftDetail'
import { WorkerWallet } from './WorkerWallet'
import { getWorkerJobs, getWorkerTransactions, getWorkerWalletSummary } from '../../mocks/workerLifecycleAdapter'
import { decideWorkerOffer } from '../../mocks/workerLifecycleAdapter'
import { initialWorkerAssignments, initialWorkerShifts, workerOffers, workerWalletTransactions } from '../../mocks/workerLifecycleFixtures'
import { formatShiftEventTime } from '../../utils/workerShiftTimeline'
import { demoConversationLinks } from '../../mocks/jobfreeCommunicationsFixtures'
import { resolveDemoCommunicationAuthorization } from '../../mocks/jobfreeCommunicationsAdapter'

function contactAuthorization(link: (typeof demoConversationLinks)[number], action: 'chat' | 'send_message' | 'call', assignments = initialWorkerAssignments, shifts = initialWorkerShifts) {
  return resolveDemoCommunicationAuthorization({ ...link, action, workerAssignments: assignments, workerShifts: shifts })
}

describe('Worker lifecycle screens', () => {
  it('shows offer detail for the selected offer and exposes a stale outcome', () => {
    const onDecision = vi.fn((_, scenario) => decideWorkerOffer(workerOffers[1], 'accept', scenario, []))
    render(<WorkerOfferDetail offer={workerOffers[1]} status="offered" onBack={vi.fn()} onDecision={onDecision} onAccepted={vi.fn()} />)
    expect(screen.getByText(new RegExp(workerOffers[1].id))).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/kịch bản quyết định demo/i), { target: { value: 'expired' } })
    fireEvent.click(screen.getByRole('button', { name: /nhận việc demo/i }))
    expect(screen.getByText(/offer demo đã hết hạn/i)).toBeInTheDocument()
    expect(onDecision).toHaveBeenCalledWith('accept', 'expired')
  })

  it('supports modal close and shows a labeled modal title', () => {
    const onClose = vi.fn()
    render(<WorkerNewJobModal offer={workerOffers[0]} status="offered" resultMessage="" onClose={onClose} onViewDetails={vi.fn()} onDecision={() => decideWorkerOffer(workerOffers[0], 'accept', 'success', [])} />)
    expect(screen.getByRole('dialog', { name: 'Công việc mới cho bạn' })).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('filters My Jobs and opens the selected shift detail', () => {
    const jobs = getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)
    const onOpenShift = vi.fn()
    render(<WorkerJobs jobs={jobs} onOpenShift={onOpenShift} />)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    fireEvent.click(screen.getByRole('button', { name: 'Chờ xác nhận' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết ca' }))
    expect(onOpenShift).toHaveBeenCalledWith('demo-shift-002')
  })

  it('shows equally sized active contact actions and read-only history for completed assignments', () => {
    const jobs = getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)
    const getContactLink = (shiftId: string) => {
      const assignment = initialWorkerAssignments.find((item) => item.shiftId === shiftId)
      return assignment ? demoConversationLinks.find((item) => item.role === 'worker' && item.assignmentId === assignment.id) : undefined
    }
    const onOpenChat = vi.fn(); const onOpenCall = vi.fn()
    render(<WorkerJobs jobs={jobs} onOpenShift={vi.fn()} getContactLink={getContactLink} getContactAuthorization={(link, action) => contactAuthorization(link, action)} onOpenChat={onOpenChat} onOpenCall={onOpenCall} />)
    const active = screen.getByText('Phụ chuyển vật dụng').closest('article')!
    expect(within(active).getByRole('button', { name: 'Gọi' })).toBeInTheDocument()
    expect(within(active).getByRole('button', { name: 'Nhắn tin' })).toBeInTheDocument()
    fireEvent.click(within(active).getByRole('button', { name: 'Gọi' }))
    expect(onOpenCall).toHaveBeenCalledWith(demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-001'))

    const completed = screen.getByText('Đóng gói đơn').closest('article')!
    expect(within(completed).getByRole('button', { name: 'Xem tin nhắn' })).toBeInTheDocument()
    expect(within(completed).queryByRole('button', { name: 'Gọi' })).not.toBeInTheDocument()
    fireEvent.click(within(completed).getByRole('button', { name: 'Xem tin nhắn' }))
    expect(onOpenChat).toHaveBeenCalledWith(demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-003'))
  })

  it('blocks contact UI when current assignment authorization is cancelled', () => {
    const link = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-001')!
    const cancelledAssignments = initialWorkerAssignments.map((item) => item.id === link.assignmentId ? { ...item, status: 'cancelled' as const } : item)
    const jobs = getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)
    const getContactLink = (shiftId: string) => shiftId === link.shiftId ? link : undefined
    render(<WorkerJobs jobs={jobs} onOpenShift={vi.fn()} getContactLink={getContactLink} getContactAuthorization={(item, action) => contactAuthorization(item, action, cancelledAssignments)} onOpenChat={vi.fn()} onOpenCall={vi.fn()} />)
    const activeCard = screen.getByText('Phụ chuyển vật dụng').closest('article')!
    expect(within(activeCard).getByText(/liên hệ không khả dụng/i)).toBeInTheDocument()
    expect(within(activeCard).queryByRole('button', { name: 'Gọi' })).not.toBeInTheDocument()
    expect(within(activeCard).queryByRole('button', { name: 'Nhắn tin' })).not.toBeInTheDocument()
  })

  it.each([
    ['no_show', 'Không tham gia · demo fixture', 'Không tham gia · demo fixture', '2026-10-09'],
    ['incident_pending', 'Chờ xử lý sự cố · demo fixture', 'Ghi nhận sự cố · demo fixture', '2026-10-12'],
    ['cancelled', 'Đã hủy · demo fixture', 'Ca đã hủy · demo fixture', '2026-10-13'],
  ] as const)('presents %s as a read-only fixture in My Jobs, Schedule and Shift Detail', (status, listLabel, eventLabel, day) => {
    const shift = initialWorkerShifts.find((item) => item.status === status)!
    const onOpenShift = vi.fn()
    const { unmount } = render(<WorkerJobs jobs={getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)} onOpenShift={onOpenShift} />)
    fireEvent.click(screen.getByRole('button', { name: 'Lịch sử' }))
    const article = screen.getByText(shift.title).closest('article')!
    expect(within(article).getAllByText(listLabel).length).toBeGreaterThan(0)
    const jobTimeline = within(article).getByRole('list', { name: `Tiến trình demo ${shift.title}` })
    expect(within(jobTimeline).getByText(eventLabel)).toBeInTheDocument()
    expect(within(jobTimeline).getByText(formatShiftEventTime(shift.timeline[shift.timeline.length - 1].occurredAt))).toBeInTheDocument()
    fireEvent.click(within(article).getByRole('button', { name: 'Xem chi tiết ca' }))
    expect(onOpenShift).toHaveBeenCalledWith(shift.id)
    unmount()

    render(<WorkerSchedule shifts={initialWorkerShifts} onOpenShift={onOpenShift} />)
    const dateButton = screen.getByText(String(Number(day.slice(-2)))).closest('button')!
    fireEvent.click(dateButton)
    const scheduledCard = screen.getByRole('button', { name: new RegExp(shift.title) })
    expect(within(scheduledCard).getByText(listLabel)).toBeInTheDocument()
    fireEvent.click(scheduledCard)
    expect(onOpenShift).toHaveBeenLastCalledWith(shift.id)
    unmount()

    const onTransition = vi.fn()
    render(<WorkerShiftDetail shift={shift} onBack={vi.fn()} onTransition={onTransition} />)
    expect(screen.getAllByText(listLabel).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText(eventLabel).length).toBeGreaterThan(0)
    expect(screen.getByText(/chỉ đọc/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /mô phỏng|hoàn tất ca/i })).not.toBeInTheDocument()
    expect(onTransition).not.toHaveBeenCalled()
  })

  it('shows planned shift hours separately from full lifecycle event timestamps', () => {
    const shift = initialWorkerShifts[0]
    const transitioned = { ...shift, status: 'completed' as const, timeline: [
      { status: 'en_route' as const, label: 'Bắt đầu di chuyển · demo', occurredAt: '2026-10-10T17:15:00' },
      { status: 'checked_in' as const, label: 'Check-in demo', occurredAt: '2026-10-10T18:00:00' },
      { status: 'pending_confirmation' as const, label: 'Chờ xác nhận · demo', occurredAt: '2026-10-10T22:00:00' },
      { status: 'completed' as const, label: 'Hoàn tất demo', occurredAt: '2026-10-10T22:10:00' },
    ] }
    render(<WorkerShiftDetail shift={transitioned} onBack={vi.fn()} onTransition={vi.fn()} />)
    expect(screen.getByText('18:00 – 22:00')).toBeInTheDocument()
    expect(screen.getByText('10/10/2026 · 17:15')).toBeInTheDocument()
    expect(screen.getByText('10/10/2026 · 22:10')).toBeInTheDocument()
  })

  it('does not offer a transition from a completed shift', () => {
    const completed = initialWorkerShifts.find((shift) => shift.status === 'completed')!
    render(<WorkerShiftDetail shift={completed} onBack={vi.fn()} onTransition={vi.fn()} />)
    expect(screen.getAllByText('Đã hoàn thành · demo').length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: /mô phỏng|hoàn tất ca/i })).not.toBeInTheDocument()
  })

  it('keeps completed Shift Detail contact read-only and hides call', () => {
    const link = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-003')!
    const onOpenChat = vi.fn(); const onOpenCall = vi.fn()
    render(<WorkerShiftDetail shift={initialWorkerShifts[2]} onBack={vi.fn()} onTransition={vi.fn()} contactLink={link} getContactAuthorization={(item, action) => contactAuthorization(item, action)} onOpenChat={onOpenChat} onOpenCall={onOpenCall} />)
    fireEvent.click(screen.getByRole('button', { name: 'Xem tin nhắn' }))
    expect(onOpenChat).toHaveBeenCalledWith(link)
    expect(screen.queryByRole('button', { name: 'Gọi' })).not.toBeInTheDocument()
    expect(screen.getByText(/công việc đã kết thúc/i)).toBeInTheDocument()
  })

  it('shows the same selected date shift on Schedule and Shift Detail', () => {
    const onOpenShift = vi.fn()
    render(<WorkerSchedule shifts={initialWorkerShifts} onOpenShift={onOpenShift} />)
    fireEvent.click(screen.getByText('11').closest('button')!)
    expect(screen.getByText('Đóng gói đơn livestream')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /đóng gói đơn livestream/i }))
    expect(onOpenShift).toHaveBeenCalledWith('demo-shift-002')

    const onTransition = vi.fn()
    const { unmount } = render(<WorkerShiftDetail shift={initialWorkerShifts[0]} onBack={vi.fn()} onTransition={onTransition} />)
    fireEvent.click(screen.getByRole('button', { name: /mô phỏng bắt đầu di chuyển/i }))
    expect(onTransition).toHaveBeenCalledWith('en_route')
    unmount()
  })

  it('derives wallet balances from transactions and keeps financial actions disabled', () => {
    const transactions = getWorkerTransactions(initialWorkerShifts, workerWalletTransactions)
    const summary = getWorkerWalletSummary(transactions)
    const onOpenTransaction = vi.fn()
    render(<WorkerWallet transactions={transactions} onOpenTransaction={onOpenTransaction} />)
    expect(screen.getByText(new Intl.NumberFormat('vi-VN').format(summary.available) + 'đ')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Rút tiền' })[0]).toBeDisabled()
    expect(screen.getByRole('button', { name: /liên kết ngân hàng/i })).toBeDisabled()
    fireEvent.click(within(screen.getByRole('button', { name: /đóng gói đơn/i })).getByText(/đóng gói đơn/i))
    expect(onOpenTransaction).toHaveBeenCalledWith('demo-transaction-demo-shift-003')
  })
})
