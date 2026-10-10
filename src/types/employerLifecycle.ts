import type { AssignmentStatus, WorkRequestStatus } from './domain'
import type { WorkerShiftStatus } from './workerLifecycle'

/** Employer-facing read model. IDs explicitly link the existing request, assignment and shift demo fixtures. */
export interface EmployerAssignmentView {
  requestId: string
  assignmentId: string
  shiftId: string
  status: AssignmentStatus
  displayName: string
  initials: string
  rating: string
  completedJobs: number
  serviceLabel: string
  shiftSchedule: string
}

export interface EmployerShiftTracking {
  requestId: string
  assignmentId: string
  shiftId: string
  requestStatus: WorkRequestStatus
  shiftStatus: WorkerShiftStatus
  scheduledStartAt: string
  scheduledEndAt: string
  effectiveEndAt: string
  events: { id: string; label: string; occurredAt: string; note: string }[]
}

export type EmployerExtensionDuration = 30 | 60 | 120
export type EmployerExtensionScenario = 'submitted' | 'pending' | 'approved_demo' | 'rejected_demo' | 'unavailable' | 'expired'

export interface EmployerExtensionRequest {
  id: string
  requestId: string
  assignmentId: string
  shiftId: string
  durationMinutes: EmployerExtensionDuration
  originalEndAt: string
  proposedEndAt: string
  effectiveEndAt?: string
  referenceFee: number
  scenario: EmployerExtensionScenario
  createdAt: string
  message: string
}
