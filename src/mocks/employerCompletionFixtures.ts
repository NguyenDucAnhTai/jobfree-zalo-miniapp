import type { EmployerDisputeCase, EmployerIncident, EmployerReview } from '../types/employerCompletion'
export const employerReviewFixtures: EmployerReview[] = []
export const employerIncidentFixtures: EmployerIncident[] = [
  { id: 'JF-INCIDENT-DEMO-0107-01', disputeId: 'JF-DISPUTE-DEMO-0107-01', requestId: 'JF-DEMO-0107', assignmentId: 'JF-E1-ASSIGN-0107', category: 'time', description: 'Fixture minh họa hai bên cần đối chiếu thời gian ca; không xác định lỗi hoặc trách nhiệm.', evidenceLabel: 'evidence-demo.png · metadata only', submittedAt: '2026-10-10T18:15:00+07:00' },
  { id: 'JF-INCIDENT-DEMO-0108-01', disputeId: 'JF-DISPUTE-DEMO-0108-01', requestId: 'JF-DEMO-0108', assignmentId: 'JF-E1-ASSIGN-0108', category: 'quality', description: 'Fixture minh họa trao đổi về phạm vi dịch vụ, không có kết luận phân xử.', evidenceLabel: 'Không có tệp', submittedAt: '2026-10-10T18:15:00+07:00' },
]
export const employerDisputeFixtures: EmployerDisputeCase[] = [
  { id: 'JF-DISPUTE-DEMO-0107-01', incidentId: 'JF-INCIDENT-DEMO-0107-01', requestId: 'JF-DEMO-0107', assignmentId: 'JF-E1-ASSIGN-0107', status: 'under_review', submittedAt: '2026-10-10T18:15:00+07:00', timeline: [{ label: 'Báo cáo demo đã gửi', occurredAt: '2026-10-10T18:15:00+07:00' }, { label: 'Đang xem xét · fixture chỉ đọc', occurredAt: '2026-10-10T18:20:00+07:00' }] },
  { id: 'JF-DISPUTE-DEMO-0108-01', incidentId: 'JF-INCIDENT-DEMO-0108-01', requestId: 'JF-DEMO-0108', assignmentId: 'JF-E1-ASSIGN-0108', status: 'resolved_demo', submittedAt: '2026-10-10T18:15:00+07:00', timeline: [{ label: 'Báo cáo demo đã gửi', occurredAt: '2026-10-10T18:15:00+07:00' }, { label: 'Đã đóng theo fixture demo, không có phán quyết thực tế', occurredAt: '2026-10-10T18:30:00+07:00' }] },
]
