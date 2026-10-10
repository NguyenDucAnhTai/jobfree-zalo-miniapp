export type UiContext = 'employer' | 'worker'
export type AsyncState = 'success' | 'empty' | 'loading' | 'error' | 'offline'
export type Destination =
  | 'home'
  | 'services'
  | 'jobs'
  | 'history'
  | 'account'
  | 'income'
  | 'active'
  | 'schedule'
  | 'wallet'
  | 'requestDraft'
  | 'requestSummary'
  | 'requestDetail'
  | 'opportunities'
  | 'opportunityDetail'
  | 'shiftDetail'
  | 'transactionDetail'
  | 'skills'
  | 'readiness'
  | 'area'
  | 'communicationChat'
  | 'communicationCall'
  | 'completion'
  | 'review'
  | 'incident'
  | 'dispute'

export type WorkRequestStatus =
  | 'draft'
  | 'funding_pending'
  | 'funding_failed'
  | 'matching'
  | 'assigned'
  | 'replacement_matching'
  | 'awaiting_employer_decision'
  | 'completed'
  | 'cancelled'

export type AssignmentStatus = 'active' | 'replaced' | 'cancelled'

export interface DemoQuotePreview {
  unitRate: number
  durationHours: number
  referenceTotal: number
  currency: 'VND'
  disclaimer: string
}

export interface WorkRequestTimelineEvent {
  id: string
  label: string
  occurredAt: string
  note: string
  completed: boolean
}

export interface DemoWorkerAssignment {
  displayName: string
  rating: string
  completedJobs: number
  status: AssignmentStatus
  shiftSchedule?: string
}

export interface EmployerWorkRequest {
  id: string
  serviceId: string
  serviceLabel: string
  details: string
  location: string
  schedule: string
  durationHours: number
  referenceBudget: number
  status: WorkRequestStatus
  createdAt: string
  timeline: WorkRequestTimelineEvent[]
  assignment?: DemoWorkerAssignment
}

export interface EmployerProfileItem {
  id: string
  label: string
  description: string
}

export interface EmployerRequestDraft {
  serviceId: string
  details: string
  location: string
  date: string
  startTime: string
  endTime: string
}

export interface EmployerRequestDraftErrors {
  serviceId?: string
  details?: string
  location?: string
  date?: string
  time?: string
}

export interface ServiceSummary {
  id: string
  category: string
  title: string
  description: string
  icon: string
  countLabel: string
}

export interface JobPreview {
  id: string
  title: string
  location: string
  schedule: string
  pay: string
  tag: string
}

export interface ShiftPreview {
  id: string
  title: string
  location: string
  schedule: string
  status: string
}

export interface WorkerHomeJob extends JobPreview {
  rating: string
  distanceLabel: string
  category: string
}

export interface WorkerProfileDemo {
  displayName: string
  initials: string
  rating: string
  completedJobs: number
  reliability: number
  serviceArea: string
  phoneLabel: string
  verificationStatus: 'verified' | 'unverified'
}

export interface WorkerSkillDemo {
  id: string
  label: string
  group: string
}

export interface WorkerOpportunity extends WorkerHomeJob {
  durationHours: number
}

export type WorkerOpportunityFilter = 'Tất cả' | 'Gần tôi' | 'Nhận ngay' | 'Lương cao' | 'Bắt đầu sớm'
