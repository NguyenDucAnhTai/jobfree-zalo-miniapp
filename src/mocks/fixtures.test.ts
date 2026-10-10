import { describe, expect, it } from 'vitest'
import { employerJobs, employerServices, workerHomeJobs, workerOffers, workerShift } from './fixtures'
import { isDestinationForContext, navigationByContext } from '../navigation/navigation'

describe('demo fixtures and navigation', () => {
  it('uses distinct deterministic employer and worker fixtures', () => {
    expect(employerJobs.map((job) => job.id)).not.toEqual(workerOffers.map((job) => job.id))
    expect(employerServices.length).toBeGreaterThan(0)
    expect(workerShift.id).toMatch(/^demo-worker-/)
    expect(workerOffers.every((offer) => offer.id.startsWith('demo-worker-'))).toBe(true)
    expect(workerHomeJobs.every((job) => /^(10|11|12)\/10\/2026 · /.test(job.schedule))).toBe(true)
    expect(employerJobs[0].schedule).toBe('10/10/2026 · 14:00')
  })

  it('limits destinations to the selected context', () => {
    expect(navigationByContext.employer.map((item) => item.id)).toEqual(['home', 'services', 'history', 'account'])
    expect(navigationByContext.worker.map((item) => item.id)).toEqual(['home', 'jobs', 'schedule', 'wallet', 'account'])
    expect(isDestinationForContext('employer', 'income')).toBe(false)
    expect(isDestinationForContext('worker', 'services')).toBe(false)
    expect(isDestinationForContext('employer', 'requestDraft')).toBe(false)
  })
})
