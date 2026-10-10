import { offerOutcomeMessages } from './workerLifecycleFixtures'
import type { WorkerAssignment, WorkerDecisionScenario, WorkerJob, WorkerOffer, WorkerShift, WorkerShiftStatus, WorkerTransaction } from '../types/workerLifecycle'

export type WorkerOfferDecisionResult = {
  offerStatus: WorkerOffer['status']
  result: 'accepted' | 'declined' | 'expired' | 'taken' | 'withdrawn' | 'superseded' | 'invalid' | 'already_resolved'
  message: string
  assignment?: WorkerAssignment
  shift?: WorkerShift
}

export function decideWorkerOffer(offer: WorkerOffer, decision: 'accept' | 'decline', scenario: WorkerDecisionScenario, existingAssignments: WorkerAssignment[]): WorkerOfferDecisionResult {
  if (offer.status !== 'offered') {
    return { offerStatus: offer.status, result: 'already_resolved', message: `Offer hiện có trạng thái ${offer.status}; không thể xử lý lại.` }
  }
  if (decision === 'decline') return { offerStatus: 'declined', result: 'declined', message: 'Bạn đã từ chối offer demo.' }
  if (scenario !== 'success') {
    const nextStatus = scenario === 'expired' ? 'expired' : scenario === 'withdrawn' ? 'withdrawn' : 'superseded'
    const result = scenario === 'expired' ? 'expired' : scenario === 'taken' ? 'taken' : scenario === 'withdrawn' ? 'withdrawn' : scenario === 'invalid' ? 'invalid' : 'superseded'
    return { offerStatus: nextStatus, result, message: offerOutcomeMessages[scenario] }
  }

  const existing = existingAssignments.find((assignment) => assignment.offerId === offer.id)
  if (existing) return { offerStatus: 'accepted', result: 'already_resolved', message: 'Offer demo này đã có assignment; không tạo bản ghi trùng.' }

  const jobId = `demo-worker-job-accepted-${offer.id}`
  const shiftId = `demo-shift-accepted-${offer.id}`
  const assignment: WorkerAssignment = { id: `demo-assignment-${offer.id}`, offerId: offer.id, jobId, shiftId, status: 'active' }
  const shift: WorkerShift = {
    id: shiftId, jobId, title: offer.title, description: offer.description, dateKey: offer.dateKey,
    schedule: `${offer.startTime} – ${offer.endTime}`, location: offer.location, pay: offer.totalPay,
    status: 'scheduled', timeline: [{ status: 'scheduled', label: 'Ca đã lên lịch từ fixture demo', time: offer.startTime }],
  }
  return { offerStatus: 'accepted', result: 'accepted', message: offerOutcomeMessages.success, assignment, shift }
}

const validShiftTransitions: Partial<Record<WorkerShiftStatus, WorkerShiftStatus>> = {
  scheduled: 'en_route', en_route: 'checked_in', checked_in: 'pending_confirmation', pending_confirmation: 'completed',
}

const transitionLabels: Partial<Record<WorkerShiftStatus, string>> = {
  en_route: 'Bắt đầu di chuyển · demo', checked_in: 'Check-in demo', pending_confirmation: 'Chờ xác nhận · demo', completed: 'Hoàn tất demo',
}

export function transitionWorkerShift(shift: WorkerShift, nextStatus: WorkerShiftStatus): WorkerShift | null {
  if (validShiftTransitions[shift.status] !== nextStatus) return null
  const time = transitionTime(shift, nextStatus)
  return { ...shift, status: nextStatus, timeline: [...shift.timeline, { status: nextStatus, label: transitionLabels[nextStatus] ?? nextStatus, time }] }
}

export function getWorkerJobs(assignments: WorkerAssignment[], shifts: WorkerShift[]): WorkerJob[] {
  return shifts.map((shift) => {
    const statusToGroup: Record<WorkerShiftStatus, WorkerJob['group']> = {
      scheduled: 'upcoming', en_route: 'in_progress', checked_in: 'in_progress', pending_confirmation: 'pending_confirmation',
      completed: 'completed', no_show: 'history', incident_pending: 'history', cancelled: 'history',
    }
    const assignment = assignments.find((item) => item.shiftId === shift.id)
    return {
      id: shift.jobId, title: shift.title, location: shift.location, dateKey: shift.dateKey, schedule: shift.schedule,
      pay: shift.pay, group: statusToGroup[shift.status], shiftId: shift.id,
      employerName: shift.id.endsWith('001') ? 'Hộ kinh doanh Linh Trung' : shift.id.endsWith('002') ? 'Shop Thời Trang Mia' : 'Đối tác demo',
      ...(assignment ? { assignmentId: assignment.id } : {}),
    }
  }).sort((a, b) => `${a.dateKey} ${a.schedule}`.localeCompare(`${b.dateKey} ${b.schedule}`))
}

export function getWorkerTransactions(shifts: WorkerShift[], fixed: WorkerTransaction[]): WorkerTransaction[] {
  const shiftEarnings: WorkerTransaction[] = shifts.filter((shift) => shift.status === 'completed').map((shift) => ({
    id: `demo-transaction-${shift.id}`, title: shift.title, dateLabel: formatDate(shift.dateKey), dateKey: shift.dateKey, amount: shift.pay, status: 'completed', kind: 'earning', jobId: shift.jobId,
  }))
  return [...shiftEarnings, ...fixed].sort((a, b) => b.dateKey.localeCompare(a.dateKey))
}

export function getWorkerWalletSummary(transactions: WorkerTransaction[]) {
  const completed = transactions.filter((transaction) => transaction.status === 'completed')
  const available = completed.reduce((sum, transaction) => sum + transaction.amount, 0)
  const pending = transactions.filter((transaction) => transaction.status === 'pending').reduce((sum, transaction) => sum + transaction.amount, 0)
  const earnings = completed.filter((transaction) => transaction.kind === 'earning').reduce((sum, transaction) => sum + transaction.amount, 0)
  return { available, pending, completedEarnings: earnings, completedJobs: new Set(completed.filter((item) => item.kind === 'earning' && item.jobId).map((item) => item.jobId)).size }
}

export function formatVnd(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(Math.abs(amount))}đ` }

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-')
  return `${day}/${month}/${year}`
}

function transitionTime(shift: WorkerShift, nextStatus: WorkerShiftStatus) {
  const [start, end] = shift.schedule.split(' – ')
  const source = nextStatus === 'en_route' ? start : nextStatus === 'checked_in' ? start : end
  const offset = nextStatus === 'en_route' ? -45 : nextStatus === 'checked_in' ? -15 : nextStatus === 'completed' ? 10 : 0
  const [hour, minute] = source.split(':').map(Number)
  const total = (hour * 60 + minute + offset + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
