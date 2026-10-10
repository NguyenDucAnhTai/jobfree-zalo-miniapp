import { describe, expect, it } from 'vitest'
import { resolveDemoCommunicationAuthorization } from './jobfreeCommunicationsAdapter'
import { demoConversationLinks, demoMessagesByConversation } from './jobfreeCommunicationsFixtures'
import { initialWorkerAssignments, initialWorkerShifts } from './workerLifecycleFixtures'

const link = (id: string) => demoConversationLinks.find((item) => item.conversationId === id)!
const resolve = (conversationId: string, overrides: Record<string, unknown> = {}) => {
  const item = link(conversationId)
  return resolveDemoCommunicationAuthorization({ ...item, action: 'chat', ...overrides } as Parameters<typeof resolveDemoCommunicationAuthorization>[0])
}

describe('live demo communication authorization', () => {
  it('allows a valid active Employer E1 assignment', () => expect(resolve('JF-CHAT-EMP-0105').allowed).toBe(true))
  it('allows a valid current Worker assignment and shift', () => expect(resolve('JF-CHAT-WORKER-001', { workerAssignments: initialWorkerAssignments, workerShifts: initialWorkerShifts }).allowed).toBe(true))
  it('rejects an invalid request/assignment pair', () => expect(resolve('JF-CHAT-EMP-0105', { assignmentId: 'JF-E1-ASSIGN-0107' }).allowed).toBe(false))
  it('rejects an invalid assignment/shift pair', () => expect(resolve('JF-CHAT-WORKER-001', { workerAssignments: initialWorkerAssignments, workerShifts: initialWorkerShifts, shiftId: 'demo-shift-002' }).allowed).toBe(false))
  it('rejects a cross-role conversation', () => expect(resolve('JF-CHAT-EMP-0105', { role: 'worker' }).allowed).toBe(false))
  it('makes completed Worker chat read only based on current state and denies calls', () => {
    const item = link('JF-CHAT-WORKER-002')
    const assignments = initialWorkerAssignments.map((value) => value.id === item.assignmentId ? { ...value, status: 'completed' as const } : value)
    const shifts = initialWorkerShifts.map((value) => value.id === item.shiftId ? { ...value, status: 'completed' as const } : value)
    expect(resolveDemoCommunicationAuthorization({ ...item, action: 'chat', workerAssignments: assignments, workerShifts: shifts }).readOnly).toBe(true)
    expect(resolveDemoCommunicationAuthorization({ ...item, action: 'call', workerAssignments: assignments, workerShifts: shifts }).allowed).toBe(false)
  })
  it('denies cancelled and replaced assignments from live state', () => {
    for (const status of ['cancelled', 'replaced'] as const) {
      const item = link('JF-CHAT-WORKER-001')
      const workerAssignments = initialWorkerAssignments.map((value) => value.id === item.assignmentId ? { ...value, status } : value)
      expect(resolve('JF-CHAT-WORKER-001', { workerAssignments, workerShifts: initialWorkerShifts, action: 'send_message' }).allowed).toBe(false)
    }
  })
  it('denies a call when the Employer current assignment is completed despite stale active conversation metadata', () => {
    const item = link('JF-CHAT-EMP-0105')
    const employerShifts = [{ requestId: item.requestId, assignmentId: item.assignmentId, shiftId: item.shiftId, shiftStatus: 'completed' }]
    expect(resolve('JF-CHAT-EMP-0105', { action: 'call', employerShifts }).allowed).toBe(false)
  })
  it('keeps local messages isolated by role-specific conversation IDs', () => {
    expect(demoMessagesByConversation['JF-CHAT-EMP-0105']).not.toBe(demoMessagesByConversation['JF-CHAT-WORKER-001'])
    expect(resolve('JF-CHAT-WORKER-001', { conversationId: 'JF-CHAT-EMP-0105', workerAssignments: initialWorkerAssignments, workerShifts: initialWorkerShifts }).allowed).toBe(false)
  })
})
