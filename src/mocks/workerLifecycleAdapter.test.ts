import { describe, expect, it } from 'vitest'
import { decideWorkerOffer, getWorkerJobs, getWorkerTransactions, getWorkerWalletSummary, transitionWorkerShift } from './workerLifecycleAdapter'
import { initialWorkerAssignments, initialWorkerShifts, offerDecisionScenarios, workerOffers, workerWalletTransactions } from './workerLifecycleFixtures'

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

  it('allows only sequential shift transitions and uses deterministic times', () => {
    const original = initialWorkerShifts[0]
    expect(transitionWorkerShift(original, 'completed')).toBeNull()
    const enRoute = transitionWorkerShift(original, 'en_route')!
    const checkedIn = transitionWorkerShift(enRoute, 'checked_in')!
    const pending = transitionWorkerShift(checkedIn, 'pending_confirmation')!
    const complete = transitionWorkerShift(pending, 'completed')!
    expect(complete.timeline.map((item) => item.time)).toEqual(['18:00', '17:15', '17:45', '22:00', '22:10'])
    expect(original.status).toBe('scheduled')
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
