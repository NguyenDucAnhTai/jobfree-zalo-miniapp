import { describe, expect, it } from 'vitest'
import { createCompletionDecision, submitEmployerIncident, submitEmployerReview } from './employerCompletionAdapter'

describe('Employer E2 mock adapters', () => {
  it('creates one request-linked completion decision without a settlement record', () => {
    const decision = createCompletionDecision('REQ-1', 'ASSIGN-1', 'SHIFT-1', 'confirmed_demo')!
    expect(decision).toMatchObject({ requestId: 'REQ-1', assignmentId: 'ASSIGN-1', shiftId: 'SHIFT-1', status: 'confirmed_demo' })
    expect(createCompletionDecision('REQ-1', 'ASSIGN-1', 'SHIFT-1', 'confirmed_demo', decision)).toBeNull()
    expect(JSON.stringify(decision)).not.toMatch(/payment|earning|settlement/i)
  })
  it('validates review stars and prevents duplicate request-assignment reviews', () => {
    const value = { requestId: 'REQ', assignmentId: 'ASSIGN', stars: 4, tags: [], feedback: '' }
    const saved = submitEmployerReview(value, [])!
    expect(submitEmployerReview(value, [saved])).toBeNull()
    expect(submitEmployerReview({ ...value, stars: 8 }, [])).toBeNull()
  })
  it('creates stable sequential incident and submitted case IDs', () => {
    const input = { requestId: 'REQ', assignmentId: 'ASSIGN', category: 'quality' as const, description: 'Demo description', evidenceLabel: 'none' }
    const first = submitEmployerIncident(input, [], [])
    const second = submitEmployerIncident(input, [first.incident], [])
    expect(first.incident.id).toBe('JF-INCIDENT-REQ-01')
    expect(second.incident.id).toBe('JF-INCIDENT-REQ-02')
    expect(first.dispute).toMatchObject({ id: first.incident.disputeId, status: 'submitted', requestId: 'REQ', assignmentId: 'ASSIGN' })
  })
})
