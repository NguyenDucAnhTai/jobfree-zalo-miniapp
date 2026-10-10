import type { DemoAssignmentStatus, DemoConversationLink, DemoMessage } from '../types/jobfreeCommunications'
import type { UiContext } from '../types/domain'

export function authorizeDemoCommunication(input: { role: UiContext; conversationRole: UiContext; requestId: string; jobId: string; assignmentId?: string; assignmentStatus: DemoAssignmentStatus; scenario: DemoConversationLink['scenario']; action: 'chat' | 'call' }): { allowed: boolean; readOnly: boolean; reason: string } {
  if (!input.assignmentId || input.assignmentStatus === 'none') return { allowed: false, readOnly: false, reason: 'Chưa có assignment hợp lệ.' }
  if (input.role !== input.conversationRole) return { allowed: false, readOnly: false, reason: 'Cuộc hội thoại thuộc ngữ cảnh demo khác.' }
  if (input.assignmentStatus === 'replaced' || input.assignmentStatus === 'cancelled' || input.scenario === 'blocked' || input.scenario === 'unavailable') return { allowed: false, readOnly: false, reason: 'Kênh liên hệ demo hiện không khả dụng cho trạng thái assignment này.' }
  if (input.role !== 'employer' && input.role !== 'worker') return { allowed: false, readOnly: false, reason: 'Ngữ cảnh demo không hợp lệ.' }
  if (!input.requestId || !input.jobId) return { allowed: false, readOnly: false, reason: 'Thiếu liên kết công việc demo.' }
  if (input.assignmentStatus === 'completed' || input.scenario === 'read_only') return { allowed: input.action === 'chat', readOnly: true, reason: input.action === 'chat' ? 'Lịch sử hội thoại chỉ đọc sau khi hoàn tất.' : 'Cuộc gọi không khả dụng với công việc đã hoàn tất.' }
  return { allowed: true, readOnly: false, reason: 'Kênh liên hệ demo được mở theo assignment.' }
}

export function appendDemoMessage(messages: DemoMessage[], role: UiContext, text: string, conversationId: string): DemoMessage[] {
  const clean = text.trim()
  if (!clean || clean.length > 500) return messages
  const next: DemoMessage = { id: `${conversationId}-LOCAL-${String(messages.length + 1).padStart(3, '0')}`, sender: role, text: clean, occurredAt: '2026-10-10T15:00:00+07:00', read: false }
  return [...messages, next]
}
