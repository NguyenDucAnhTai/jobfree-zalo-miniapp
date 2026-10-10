import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConversationScreen } from './ConversationScreen'
import { DemoCallScreen } from './DemoCallScreen'
import { demoConversationLinks } from '../../mocks/jobfreeCommunicationsFixtures'
import { resolveDemoCommunicationAuthorization } from '../../mocks/jobfreeCommunicationsAdapter'
import { initialWorkerAssignments, initialWorkerShifts } from '../../mocks/workerLifecycleFixtures'
import type { CommunicationAuthorizationInput } from '../../mocks/jobfreeCommunicationsAdapter'

const link = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-002')!
function currentAuth(action: CommunicationAuthorizationInput['action'], assignments = initialWorkerAssignments, shifts = initialWorkerShifts) {
  return resolveDemoCommunicationAuthorization({ ...link, action, workerAssignments: assignments, workerShifts: shifts })
}
afterEach(() => { vi.useRealTimers() })

describe('communication demo screens', () => {
  it('sends locally for active assignment, then renders completed history read-only', () => {
    const onMessagesChange = vi.fn(); const onBack = vi.fn(); const onCall = vi.fn()
    const { rerender } = render(<ConversationScreen link={link} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={onBack} onCall={onCall} authorize={(action) => currentAuth(action)} />)
    expect(screen.getByText('Chưa có tin nhắn')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tin nhắn'), { target: { value: 'Nội dung an toàn demo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi' }))
    expect(onMessagesChange).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ sender: 'worker', text: 'Nội dung an toàn demo' })]))
    const completedAssignments = initialWorkerAssignments.map((value) => value.id === link.assignmentId ? { ...value, status: 'completed' as const } : value)
    const completedShifts = initialWorkerShifts.map((value) => value.id === link.shiftId ? { ...value, status: 'completed' as const } : value)
    rerender(<ConversationScreen link={link} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={onBack} onCall={onCall} authorize={(action) => currentAuth(action, completedAssignments, completedShifts)} />)
    expect(screen.getByText('Lịch sử chỉ đọc sau khi ca hoàn tất.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Gửi' })).not.toBeInTheDocument()
  })

  it('denies message submission at action boundary when authorization is revoked', () => {
    const onMessagesChange = vi.fn(); let revoked = false
    const denied = { allowed: false, readOnly: false, currentAssignmentStatus: 'cancelled' as const, reason: 'Assignment đã bị hủy.' }
    const authorize = (action: CommunicationAuthorizationInput['action']) => revoked ? denied : action === 'chat' ? currentAuth(action) : denied
    const { rerender } = render(<ConversationScreen link={link} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={() => undefined} onCall={() => undefined} authorize={authorize} />)
    fireEvent.change(screen.getByLabelText('Tin nhắn'), { target: { value: 'Không được gửi' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi' }))
    expect(onMessagesChange).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Assignment đã bị hủy.')
    revoked = true
    rerender(<ConversationScreen link={link} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={() => undefined} onCall={() => undefined} authorize={authorize} />)
    expect(screen.queryByRole('button', { name: 'Gửi' })).not.toBeInTheDocument()
  })

  it('shows completed Employer call as unavailable without device access', () => {
    const employerLink = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-EMP-0108')!
    const authorize = () => resolveDemoCommunicationAuthorization({ ...employerLink, action: 'call' })
    render(<DemoCallScreen link={employerLink} role="employer" onBack={() => undefined} authorize={authorize} />)
    expect(screen.getByText(/cuộc gọi không khả dụng/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Bắt đầu demo' })).not.toBeInTheDocument()
  })

  it('runs a controlled dialing, connecting and connected sequence', () => {
    vi.useFakeTimers()
    render(<DemoCallScreen link={link} role="worker" onBack={() => undefined} authorize={() => currentAuth('call')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu demo' }))
    expect(screen.getByRole('status')).toHaveTextContent('Đang gọi demo')
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.getByRole('status')).toHaveTextContent('Đang kết nối demo')
    act(() => { vi.advanceTimersByTime(400) })
    expect(screen.getByRole('status')).toHaveTextContent('Đã kết nối demo')
  })

  it.each([0, 300])('End during %s ms of a call attempt is terminal', (elapsed) => {
    vi.useFakeTimers()
    render(<DemoCallScreen link={link} role="worker" onBack={() => undefined} authorize={() => currentAuth('call')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu demo' }))
    if (elapsed) act(() => { vi.advanceTimersByTime(elapsed) })
    fireEvent.click(screen.getByRole('button', { name: 'Kết thúc demo' }))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByRole('status')).toHaveTextContent('Cuộc gọi demo đã kết thúc')
  })

  it('cancels timers on unmount and resets a different conversation identity', () => {
    vi.useFakeTimers()
    const { unmount } = render(<DemoCallScreen link={link} role="worker" onBack={() => undefined} authorize={() => currentAuth('call')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu demo' }))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    const second = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-001')!
    const result = render(<DemoCallScreen link={link} role="worker" onBack={() => undefined} authorize={() => currentAuth('call')} />)
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu demo' }))
    result.rerender(<DemoCallScreen link={second} role="worker" onBack={() => undefined} authorize={() => resolveDemoCommunicationAuthorization({ ...second, action: 'call', workerAssignments: initialWorkerAssignments, workerShifts: initialWorkerShifts })} />)
    expect(screen.getByRole('status')).toHaveTextContent('Sẵn sàng mô phỏng')
    expect(vi.getTimerCount()).toBe(0)
  })
})
