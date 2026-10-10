import { describe, expect, it } from 'vitest'
import { appendDemoMessage, authorizeDemoCommunication } from './jobfreeCommunicationsAdapter'
import { demoConversationLinks, demoMessagesByConversation } from './jobfreeCommunicationsFixtures'

describe('assignment-scoped demo communication', () => {
  const base = { role: 'employer' as const, conversationRole: 'employer' as const, requestId: 'REQ', jobId: 'JOB', assignmentId: 'ASSIGN', scenario: 'populated' as const, action: 'chat' as const }
  it('requires an explicit assignment and active state', () => {
    expect(authorizeDemoCommunication({ ...base, assignmentId: undefined, assignmentStatus: 'none' }).allowed).toBe(false)
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'active' }).allowed).toBe(true)
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'replaced' }).allowed).toBe(false)
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'cancelled' }).allowed).toBe(false)
    expect(authorizeDemoCommunication({ ...base, role: 'worker', assignmentStatus: 'active' }).allowed).toBe(false)
  })
  it('makes completed chat read-only and call unavailable; blocks unavailable fixtures', () => {
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'completed' }).readOnly).toBe(true)
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'completed', action: 'call' }).allowed).toBe(false)
    expect(authorizeDemoCommunication({ ...base, assignmentStatus: 'active', scenario: 'unavailable' }).allowed).toBe(false)
  })
  it('uses explicit separate role fixture links and local-only message append', () => {
    const employer = demoConversationLinks.find((link) => link.role === 'employer')!
    const worker = demoConversationLinks.find((link) => link.role === 'worker')!
    expect(employer.assignmentId).not.toBe(worker.assignmentId)
    const original = demoMessagesByConversation[worker.conversationId] ?? []
    const next = appendDemoMessage(original, 'worker', '<script>hello</script>', worker.conversationId)
    expect(next).toHaveLength(original.length + 1)
    expect(next.at(-1)?.text).toBe('<script>hello</script>')
    expect(original).toHaveLength(demoMessagesByConversation[worker.conversationId]?.length ?? 0)
    expect(appendDemoMessage(next, 'worker', ' '.repeat(501), worker.conversationId)).toBe(next)
  })
})
