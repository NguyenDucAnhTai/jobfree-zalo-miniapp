import type { EmployerCompletionDecision, EmployerDisputeCase, EmployerIncident, EmployerReview } from '../types/employerCompletion'
export function createCompletionDecision(requestId: string, assignmentId: string, shiftId: string, status: 'confirmed_demo' | 'issue_reported_demo', existing?: EmployerCompletionDecision): EmployerCompletionDecision | null {
  if (existing) return null
  return { id: `JF-COMPLETION-${requestId}-${status}`, requestId, assignmentId, shiftId, status, decidedAt: '2026-10-10T18:10:00+07:00', note: status === 'confirmed_demo' ? 'Employer xác nhận hoàn tất trong phiên demo.' : 'Employer ghi nhận cần hỗ trợ thêm trong phiên demo.' }
}
export function submitEmployerReview(input: { requestId: string; assignmentId: string; stars: number; tags: string[]; feedback: string }, existing: EmployerReview[]): EmployerReview | null {
  if (input.stars < 1 || input.stars > 5 || existing.some((item) => item.requestId === input.requestId && item.assignmentId === input.assignmentId)) return null
  return { id: `JF-REVIEW-${input.requestId}-${input.assignmentId}`, ...input, submittedAt: '2026-10-10T18:12:00+07:00' }
}
export function submitEmployerIncident(input: Omit<EmployerIncident, 'id' | 'submittedAt' | 'disputeId'>, existing: EmployerIncident[], disputes: EmployerDisputeCase[]): { incident: EmployerIncident; dispute: EmployerDisputeCase } {
  const sequence = existing.filter((item) => item.requestId === input.requestId && item.assignmentId === input.assignmentId).length + 1
  const id = `JF-INCIDENT-${input.requestId}-${String(sequence).padStart(2, '0')}`
  const disputeId = `JF-DISPUTE-${input.requestId}-${String(sequence).padStart(2, '0')}`
  const incident: EmployerIncident = { ...input, id, disputeId, submittedAt: '2026-10-10T18:15:00+07:00' }
  const dispute: EmployerDisputeCase = { id: disputeId, incidentId: id, requestId: input.requestId, assignmentId: input.assignmentId, status: 'submitted', submittedAt: incident.submittedAt, timeline: [{ label: 'Báo cáo demo đã gửi', occurredAt: incident.submittedAt }] }
  void disputes
  return { incident, dispute }
}
