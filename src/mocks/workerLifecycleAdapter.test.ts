import { describe, expect, it } from 'vitest'
import { decideWorkerOffer, getWorkerJobs, getWorkerTransactions, getWorkerWalletSummary, transitionWorkerShift } from './workerLifecycleAdapter'
import { initialWorkerAssignments, initialWorkerShifts, offerDecisionScenarios, workerOffers, workerWalletTransactions } from './workerLifecycleFixtures'
import type { WorkerShift } from '../types/workerLifecycle'
import { shiftWindow } from '../utils/workerShiftTimeline'

describe('worker lifecycle demo adapter', () => {
  it('creates one consistent assignment and shift only for the success fixture', () => {
    const offer = workerOffers[0]
    const result = decideWorkerOffer(offer, 'accept', 'success', initialWorkerAssignments)
    expect(result.offerStatus).toBe('accepted')
    expect(result.assignment?.offerId).toBe(offer.id)
    expect(result.shift?.jobId).toBe(result.assignment?.jobId)
    expect(result.shift?.id).toBe(result.assignment?.shiftId)
    expect(decideWorkerOffer({ ...offer, status: 'accepted' }, 'accept', 'success', [...initialWorkerAssignments, result.assignment!]).result).toBe('already_resolved')
  })

  it.each(offerDecisionScenarios.filter((scenario) => scenario.value !== 'success'))('does not create assignment for %s outcome', ({ value }) => {
    const result = decideWorkerOffer(workerOffers[1], 'accept', value, initialWorkerAssignments)
    expect(result.assignment).toBeUndefined()
    expect(result.shift).toBeUndefined()
  })

  it('declines an offer once and rejects duplicate or stale decisions', () => {
    expect(decideWorkerOffer(workerOffers[0], 'decline', 'success', []).offerStatus).toBe('declined')
    expect(decideWorkerOffer({ ...workerOffers[0], status: 'declined' }, 'accept', 'success', []).result).toBe('already_resolved')
    expect(decideWorkerOffer({ ...workerOffers[0], status: 'expired' }, 'accept', 'success', []).offerStatus).toBe('expired')
  })

  it('keeps planned hours separate from deterministic chronological lifecycle events', () => {
    const original = initialWorkerShifts[0]
    expect(original.schedule).toBe('18:00 – 22:00')
    expect(original.scheduledStartAt).toBe('2026-10-10T18:00:00')
    expect(original.scheduledEndAt).toBe('2026-10-10T22:00:00')
    expect(original.timeline).toEqual([])
    expect(transitionWorkerShift(original, 'completed')).toBeNull()
    const enRoute = transitionWorkerShift(original, 'en_route')!
    const checkedIn = transitionWorkerShift(enRoute, 'checked_in')!
    const pending = transitionWorkerShift(checkedIn, 'pending_confirmation')!
    const complete = transitionWorkerShift(pending, 'completed')!
    expect(complete.timeline.map((item) => item.status)).toEqual(['en_route', 'checked_in', 'pending_confirmation', 'completed'])
    expect(complete.timeline.map((item) => item.occurredAt)).toEqual([
      '2026-10-10T17:15:00', '2026-10-10T18:00:00', '2026-10-10T22:00:00', '2026-10-10T22:10:00',
    ])
    expect(complete.timeline.every((item, index, events) => index === 0 || events[index - 1].occurredAt <= item.occurredAt)).toBe(true)
    expect(complete.timeline[0].label).toMatch(/bắt đầu di chuyển/i)
    expect(complete.timeline[1].label).toMatch(/check-in/i)
    expect(complete.timeline[2].label).toMatch(/chờ xác nhận/i)
    expect(complete.timeline[3].label).toMatch(/hoàn tất/i)
    const firstRun = transitionWorkerShift(original, 'en_route')
    const repeatedRun = transitionWorkerShift(original, 'en_route')
    expect(firstRun?.timeline).toEqual(repeatedRun?.timeline)
    expect(complete.schedule).toBe(original.schedule)
    expect(complete.scheduledStartAt).toBe(original.scheduledStartAt)
    expect(complete.scheduledEndAt).toBe(original.scheduledEndAt)
    expect(original.status).toBe('scheduled')
  })

  it('orders overnight lifecycle events by full deterministic date and keeps the planned window intact', () => {
    const { start, end } = shiftWindow('2026-10-10', '22:00 – 02:00')
    const overnight: WorkerShift = { ...initialWorkerShifts[0], dateKey: '2026-10-10', schedule: '22:00 – 02:00', scheduledStartAt: start, scheduledEndAt: end, timeline: [] }
    const enRoute = transitionWorkerShift(overnight, 'en_route')!
    const checkedIn = transitionWorkerShift(enRoute, 'checked_in')!
    const pending = transitionWorkerShift(checkedIn, 'pending_confirmation')!
    const complete = transitionWorkerShift(pending, 'completed')!
    expect(complete.timeline.map((event) => event.occurredAt)).toEqual([
      '2026-10-10T21:15:00', '2026-10-10T22:00:00', '2026-10-11T02:00:00', '2026-10-11T02:10:00',
    ])
    expect(complete.timeline.every((event, index, events) => index === 0 || events[index - 1].occurredAt <= event.occurredAt)).toBe(true)
    expect(complete.scheduledStartAt).toBe('2026-10-10T22:00:00')
    expect(complete.scheduledEndAt).toBe('2026-10-11T02:00:00')
  })

  it.each(['no_show', 'incident_pending', 'cancelled'] as const)('keeps %s as read-only fixture and does not create earnings', (status) => {
    const shift = initialWorkerShifts.find((item) => item.status === status)!
    expect(shift.displayOnly).toBe(true)
    expect(shift.timeline.length).toBeGreaterThan(0)
    expect(shift.timeline.every((event, index, events) => index === 0 || events[index - 1].occurredAt <= event.occurredAt)).toBe(true)
    expect(transitionWorkerShift(shift, 'en_route')).toBeNull()
    expect(transitionWorkerShift(shift, 'completed')).toBeNull()
    expect(initialWorkerShifts.find((item) => item.id === 'demo-shift-001')?.status).toBe('scheduled')
    const transactions = getWorkerTransactions(initialWorkerShifts, workerWalletTransactions)
    expect(transactions.some((transaction) => transaction.jobId === shift.jobId)).toBe(false)
    expect(getWorkerWalletSummary(transactions).available).toBe(520000)
  })

  it('shares the same shift fixtures across jobs, schedule and wallet totals', () => {
    const jobs = getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)
    expect(jobs.map((job) => job.shiftId)).toEqual(expect.arrayContaining(initialWorkerShifts.map((shift) => shift.id)))
    const transactions = getWorkerTransactions(initialWorkerShifts, workerWalletTransactions)
    const summary = getWorkerWalletSummary(transactions)
    expect(summary.available).toBe(transactions.filter((item) => item.status === 'completed').reduce((sum, item) => sum + item.amount, 0))
    expect(summary.pending).toBe(270000)
    expect(summary.available).toBe(520000)
  })
})
