import type { DemoAssignmentStatus, DemoMessage } from '../types/jobfreeCommunications'
import type { UiContext } from '../types/domain'
import type { EmployerAssignmentView, EmployerShiftTracking } from '../types/employerLifecycle'
import type { WorkerAssignment, WorkerShift } from '../types/workerLifecycle'
import { employerAssignmentViews, employerShiftTrackingFixtures } from './employerLifecycleFixtures'
import { demoConversationLinks } from './jobfreeCommunicationsFixtures'

export type CommunicationAction = 'chat' | 'send_message' | 'call'
export interface CommunicationAuthorizationInput {
  role: UiContext
  requestId: string
  jobId: string
  assignmentId: string
  shiftId: string
  conversationId: string
  action: CommunicationAction
  workerAssignments?: WorkerAssignment[]
  workerShifts?: WorkerShift[]
  employerAssignments?: EmployerAssignmentView[]
  employerShifts?: EmployerShiftTracking[]
}
export interface CommunicationAuthorization {
  allowed: boolean
  readOnly: boolean
  currentAssignmentStatus: DemoAssignmentStatus
  reason: string
}

/** Pure resolver: fixture metadata validates the complete ID tuple, while live AppShell read models determine current authority. */
export function resolveDemoCommunicationAuthorization(input: CommunicationAuthorizationInput): CommunicationAuthorization {
  const denied = (reason: string, currentAssignmentStatus: DemoAssignmentStatus = 'none'): CommunicationAuthorization => ({ allowed: false, readOnly: false, currentAssignmentStatus, reason })
  const canonical = demoConversationLinks.find((item) => item.conversationId === input.conversationId)
  if (!canonical || canonical.role !== input.role || canonical.requestId !== input.requestId || canonical.jobId !== input.jobId || canonical.assignmentId !== input.assignmentId || canonical.shiftId !== input.shiftId) return denied('Liên kết request/job/assignment/shift/conversation không hợp lệ.')

  let currentStatus: DemoAssignmentStatus
  if (input.role === 'employer') {
    const assignments = input.employerAssignments ?? employerAssignmentViews
    const shifts = input.employerShifts ?? employerShiftTrackingFixtures
    const assignment = assignments.find((item) => item.requestId === input.requestId)
    if (!assignment || assignment.assignmentId !== input.assignmentId || assignment.shiftId !== input.shiftId) return denied('Không tìm thấy assignment Employer đang hiệu lực.')
    const shift = shifts.find((item) => item.requestId === input.requestId)
    if (!shift || shift.assignmentId !== input.assignmentId || shift.shiftId !== input.shiftId) return denied('Shift Employer không khớp assignment hiện tại.')
    currentStatus = shift.shiftStatus === 'completed' ? 'completed' : shift.shiftStatus === 'cancelled' ? 'cancelled' : assignment.status
  } else {
    const assignments = input.workerAssignments ?? []
    const shifts = input.workerShifts ?? []
    const assignment = assignments.find((item) => item.id === input.assignmentId)
    if (!assignment || assignment.jobId !== input.jobId || assignment.shiftId !== input.shiftId) return denied('Không tìm thấy assignment Worker đang hiệu lực.')
    const shift = shifts.find((item) => item.id === input.shiftId)
    if (!shift || shift.jobId !== input.jobId || shift.id !== assignment.shiftId) return denied('Shift Worker không khớp assignment hiện tại.')
    currentStatus = shift.status === 'completed' ? 'completed' : shift.status === 'cancelled' ? 'cancelled' : assignment.status
  }

  if (canonical.scenario === 'blocked' || canonical.scenario === 'unavailable' || currentStatus === 'replaced' || currentStatus === 'cancelled') return denied('Kênh liên hệ demo không khả dụng với assignment hiện tại.', currentStatus)
  if (currentStatus === 'completed') {
    if (input.action === 'chat') return { allowed: true, readOnly: true, currentAssignmentStatus: currentStatus, reason: 'Lịch sử hội thoại chỉ đọc sau khi hoàn tất.' }
    return denied(input.action === 'call' ? 'Cuộc gọi không khả dụng với công việc đã hoàn tất.' : 'Không thể gửi tin mới sau khi công việc hoàn tất.', currentStatus)
  }
  return { allowed: true, readOnly: false, currentAssignmentStatus: 'active', reason: 'Kênh liên hệ demo được mở theo assignment hiện tại.' }
}

export function appendDemoMessage(messages: DemoMessage[], role: UiContext, text: string, conversationId: string): DemoMessage[] {
  const clean = text.trim()
  if (!clean || clean.length > 500) return messages
  const next: DemoMessage = { id: `${conversationId}-LOCAL-${String(messages.length + 1).padStart(3, '0')}`, sender: role, text: clean, occurredAt: '2026-10-10T15:00:00+07:00', read: false }
  return [...messages, next]
}
