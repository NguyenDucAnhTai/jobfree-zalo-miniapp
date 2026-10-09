export type UiContext = 'employer' | 'worker'
export type AsyncState = 'success' | 'empty' | 'loading' | 'error' | 'offline'
export type Destination = 'home' | 'services' | 'jobs' | 'history' | 'account' | 'income' | 'active'

export interface ServiceSummary {
  id: string
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
