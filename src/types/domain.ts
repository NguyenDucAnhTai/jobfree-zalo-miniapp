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
