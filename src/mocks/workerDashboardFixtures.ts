export interface WorkerDashboardShiftFixture {
  id: string
  completed: boolean
  referencePay: number
  startTime: string
  endTime: string
  breakMinutes: number | null
}

export interface WorkerDashboardSummaryFixture {
  dateLabel: string
  completedShifts: WorkerDashboardShiftFixture[]
}

/** Fixed dashboard-only scenario. This does not create a lifecycle shift or wallet transaction. */
export const workerDashboardSummaryFixture: WorkerDashboardSummaryFixture = {
  dateLabel: '10/10/2026',
  completedShifts: [
    { id: 'dashboard-completed-shift-001', completed: true, referencePay: 220_000, startTime: '08:00', endTime: '12:00', breakMinutes: null },
  ],
} as const

export function getWorkerDashboardMetrics(fixture: WorkerDashboardSummaryFixture = workerDashboardSummaryFixture) {
  const completed = fixture.completedShifts.filter((shift) => shift.completed)
  const workedMinutes = completed.reduce((total, shift) => {
    const [startHour, startMinute] = shift.startTime.split(':').map(Number)
    const [endHour, endMinute] = shift.endTime.split(':').map(Number)
    return total + (endHour * 60 + endMinute - startHour * 60 - startMinute)
  }, 0)

  return {
    referenceIncome: completed.reduce((total, shift) => total + shift.referencePay, 0),
    completedShifts: completed.length,
    workedMinutes,
    breakMinutes: completed.reduce<number | null>((total, shift) => shift.breakMinutes === null ? total : (total ?? 0) + shift.breakMinutes, null),
  }
}
