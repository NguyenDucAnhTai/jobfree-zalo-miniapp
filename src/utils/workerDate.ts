export function workerScheduleKey(schedule: string) {
  const [datePart = '', timePart = '00:00'] = schedule.split(' · ')
  const [day, month, year] = datePart.split('/')
  return `${year ?? '0000'}-${month ?? '00'}-${day ?? '00'}T${timePart.split('–')[0]?.trim() ?? '00:00'}`
}

export function workerDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'short', timeZone: 'UTC' }).format(date).replace('.', '')
  return { weekday, day: String(day), month: String(month).padStart(2, '0') }
}
