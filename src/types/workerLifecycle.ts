export type WorkerOfferStatus = 'offered' | 'accepted' | 'declined' | 'expired' | 'withdrawn' | 'superseded'
export type WorkerDecisionScenario = 'success' | 'expired' | 'taken' | 'withdrawn' | 'superseded' | 'invalid'
export type WorkerAssignmentStatus = 'active' | 'completed' | 'cancelled'
export type WorkerShiftStatus = 'scheduled' | 'en_route' | 'checked_in' | 'pending_confirmation' | 'completed' | 'no_show' | 'incident_pending' | 'cancelled'
export type WorkerShiftEventStatus = Exclude<WorkerShiftStatus, 'scheduled'>
export type WorkerJobGroup = 'upcoming' | 'in_progress' | 'pending_confirmation' | 'completed' | 'history'

export interface WorkerShiftTimelineEvent {
  status: WorkerShiftEventStatus
  label: string
  occurredAt: string
}

export interface WorkerOffer {
  id: string
  opportunityId: string
  title: string
  description: string
  category: string
  schedule: string
  dateKey: string
  startTime: string
  endTime: string
  durationHours: number
  location: string
  referencePay: number
  totalPay: number
  employerName: string
  employerRating: string
  conditions: string[]
  status: WorkerOfferStatus
}

export interface WorkerAssignment {
  id: string
  offerId: string
  jobId: string
  shiftId: string
  status: WorkerAssignmentStatus
}

export interface WorkerShift {
  id: string
  jobId: string
  title: string
  description: string
  dateKey: string
  schedule: string
  scheduledStartAt: string
  scheduledEndAt: string
  displayOnly?: boolean
  location: string
  pay: number
  status: WorkerShiftStatus
  timeline: WorkerShiftTimelineEvent[]
}

export interface WorkerJob {
  id: string
  title: string
  location: string
  dateKey: string
  schedule: string
  pay: number
  group: WorkerJobGroup
  status: WorkerShiftStatus
  timeline: WorkerShiftTimelineEvent[]
  shiftId?: string
  employerName: string
  assignmentId?: string
}

export interface WorkerTransaction {
  id: string
  title: string
  dateLabel: string
  amount: number
  status: 'pending' | 'completed'
  kind: 'earning' | 'withdrawal'
  dateKey: string
  jobId?: string
}
