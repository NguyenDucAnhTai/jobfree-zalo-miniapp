import type { WorkerShiftEventStatus, WorkerShiftStatus, WorkerShiftTimelineEvent } from '../types/workerLifecycle'

const eventLabels: Record<WorkerShiftEventStatus, string> = {
  en_route: 'Bắt đầu di chuyển · demo',
  checked_in: 'Check-in demo',
  pending_confirmation: 'Chờ xác nhận · demo',
  completed: 'Hoàn tất demo',
  no_show: 'Không tham gia · demo fixture',
  incident_pending: 'Ghi nhận sự cố · demo fixture',
  cancelled: 'Ca đã hủy · demo fixture',
}

export function shiftWindow(dateKey: string, schedule: string) {
  const [startText, endText] = schedule.split(' – ')
  const start = atTime(dateKey, startText)
  let end = atTime(dateKey, endText)
  if (end <= start) end = addMinutes(end, 24 * 60)
  return { start, end }
}

export function shiftEventTime(dateKey: string, schedule: string, status: WorkerShiftEventStatus): string {
  const { start, end } = shiftWindow(dateKey, schedule)
  switch (status) {
    case 'en_route': return addMinutes(start, -45)
    case 'checked_in': return start
    case 'pending_confirmation': return end
    case 'completed': return addMinutes(end, 10)
    case 'no_show': return addMinutes(start, 30)
    case 'incident_pending': return addMinutes(start, 120)
    case 'cancelled': return addMinutes(start, -60)
  }
}

export function createShiftTimeline(dateKey: string, schedule: string, status: WorkerShiftStatus): WorkerShiftTimelineEvent[] {
  const progress: Record<WorkerShiftStatus, WorkerShiftEventStatus[]> = {
    scheduled: [],
    en_route: ['en_route'],
    checked_in: ['en_route', 'checked_in'],
    pending_confirmation: ['en_route', 'checked_in', 'pending_confirmation'],
    completed: ['en_route', 'checked_in', 'pending_confirmation', 'completed'],
    no_show: ['no_show'],
    incident_pending: ['en_route', 'checked_in', 'incident_pending'],
    cancelled: ['cancelled'],
  }
  return progress[status].map((eventStatus) => ({
    status: eventStatus,
    label: eventLabels[eventStatus],
    occurredAt: shiftEventTime(dateKey, schedule, eventStatus),
  }))
}

export function formatShiftEventTime(occurredAt: string) {
  const [date, time] = occurredAt.split('T')
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year} · ${time.slice(0, 5)}`
}

function atTime(dateKey: string, time: string) {
  return `${dateKey}T${time}:00`
}

function addMinutes(timestamp: string, minutes: number) {
  const [date, time] = timestamp.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const value = new Date(Date.UTC(year, month - 1, day, hour, minute + minutes))
  return `${value.toISOString().slice(0, 16)}:00`
}
