import type { DemoConversationLink, DemoMessage } from '../types/jobfreeCommunications'

// Distinct role-specific records; there is deliberately no claim that Employer and Worker IDs identify one transaction.
export const demoConversationLinks: DemoConversationLink[] = [
  { conversationId: 'JF-CHAT-EMP-0105', role: 'employer', requestId: 'JF-DEMO-0105', jobId: 'JF-DEMO-0105', assignmentId: 'JF-E1-ASSIGN-0105', shiftId: 'JF-E1-SHIFT-0105', assignmentStatus: 'active', participantName: 'Người làm demo An N.', participantInitials: 'AN', jobTitle: 'Phụ sự kiện', scenario: 'populated' },
  { conversationId: 'JF-CHAT-EMP-0107', role: 'employer', requestId: 'JF-DEMO-0107', jobId: 'JF-DEMO-0107', assignmentId: 'JF-E1-ASSIGN-0107', shiftId: 'JF-E1-SHIFT-0107', assignmentStatus: 'active', participantName: 'Minh T. · Worker demo', participantInitials: 'MT', jobTitle: 'Dọn dẹp', scenario: 'populated' },
  { conversationId: 'JF-CHAT-EMP-0108', role: 'employer', requestId: 'JF-DEMO-0108', jobId: 'JF-DEMO-0108', assignmentId: 'JF-E1-ASSIGN-0108', shiftId: 'JF-E1-SHIFT-0108', assignmentStatus: 'completed', participantName: 'Linh P. · Worker demo', participantInitials: 'LP', jobTitle: 'Phụ sự kiện', scenario: 'read_only' },
  { conversationId: 'JF-CHAT-WORKER-001', role: 'worker', requestId: 'JF-WORKER-DEMO-001', jobId: 'demo-worker-job-001', assignmentId: 'demo-assignment-existing-001', shiftId: 'demo-shift-001', assignmentStatus: 'active', participantName: 'Hộ kinh doanh Linh Trung · đối tác demo', participantInitials: 'LT', jobTitle: 'Phụ chuyển vật dụng', scenario: 'populated' },
  { conversationId: 'JF-CHAT-WORKER-002', role: 'worker', requestId: 'JF-WORKER-DEMO-002', jobId: 'demo-worker-job-002', assignmentId: 'demo-assignment-existing-002', shiftId: 'demo-shift-002', assignmentStatus: 'active', participantName: 'Shop Thời Trang Mia · đối tác demo', participantInitials: 'MI', jobTitle: 'Đóng gói đơn livestream', scenario: 'empty' },
  { conversationId: 'JF-CHAT-WORKER-003', role: 'worker', requestId: 'JF-WORKER-DEMO-003', jobId: 'demo-worker-job-003', assignmentId: 'demo-assignment-existing-003', shiftId: 'demo-shift-003', assignmentStatus: 'completed', participantName: 'Shop Thời Trang Mia · đối tác demo', participantInitials: 'MI', jobTitle: 'Đóng gói đơn', scenario: 'read_only' },
]

export const demoMessagesByConversation: Record<string, DemoMessage[]> = {
  'JF-CHAT-EMP-0105': [
    { id: 'EMP-0105-M01', sender: 'participant', text: 'Tôi đã đến điểm hẹn theo thông tin công việc demo.', occurredAt: '2026-10-10T13:50:00+07:00', read: true },
    { id: 'EMP-0105-M02', sender: 'employer', text: 'Cảm ơn bạn, tôi đang ở sảnh chính.', occurredAt: '2026-10-10T13:52:00+07:00', read: true },
  ],
  'JF-CHAT-EMP-0107': [{ id: 'EMP-0107-M01', sender: 'participant', text: 'Tôi đã hoàn tất ca demo, vui lòng kiểm tra tóm tắt.', occurredAt: '2026-10-10T18:02:00+07:00', read: true }],
  'JF-CHAT-WORKER-001': [{ id: 'WORKER-001-M01', sender: 'participant', text: 'Bạn vui lòng đến khu vực nhận hàng theo mô tả công việc nhé.', occurredAt: '2026-10-10T17:30:00+07:00', read: true }],
}
