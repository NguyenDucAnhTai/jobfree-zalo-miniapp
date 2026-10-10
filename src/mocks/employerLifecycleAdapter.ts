import type { EmployerExtensionDuration, EmployerExtensionRequest, EmployerExtensionScenario, EmployerShiftTracking } from '../types/employerLifecycle'

const referenceFees: Record<EmployerExtensionDuration, number> = { 30: 25_000, 60: 50_000, 120: 100_000 }
const scenarioMessages: Record<EmployerExtensionScenario, string> = {
  submitted: 'Đã ghi nhận lựa chọn trong phiên demo. Giờ ca chưa thay đổi.',
  pending: 'Yêu cầu demo đang chờ kết quả. Giờ ca chưa thay đổi.',
  approved_demo: 'Kịch bản demo được duyệt. Giờ kết thúc hiệu lực chỉ áp dụng cho màn hình demo.',
  rejected_demo: 'Kịch bản demo từ chối yêu cầu. Giờ ca giữ nguyên.',
  unavailable: 'Tình huống demo hiện không khả dụng. Giờ ca giữ nguyên.',
  expired: 'Yêu cầu demo đã hết hạn. Giờ ca giữ nguyên.',
}

export function addMinutesToIso(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

export function formatDemoClock(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso))
}

export type EmployerExtensionResult = { ok: true; request: EmployerExtensionRequest } | { ok: false; reason: 'invalid_duration' | 'not_extendable' | 'duplicate_pending' }

export function createEmployerExtensionRequest(
  tracking: EmployerShiftTracking,
  durationMinutes: number,
  scenario: EmployerExtensionScenario = 'submitted',
  existing: EmployerExtensionRequest[] = [],
): EmployerExtensionResult {
  if (![30, 60, 120].includes(durationMinutes)) return { ok: false, reason: 'invalid_duration' }
  if (!['en_route', 'checked_in'].includes(tracking.shiftStatus)) return { ok: false, reason: 'not_extendable' }
  if (existing.some((item) => item.shiftId === tracking.shiftId && ['submitted', 'pending'].includes(item.scenario))) {
    return { ok: false, reason: 'duplicate_pending' }
  }
  const duration = durationMinutes as EmployerExtensionDuration
  const proposedEndAt = addMinutesToIso(tracking.effectiveEndAt, duration)
  return {
    ok: true,
    request: {
      id: `JF-E1-EXT-${tracking.requestId}-${duration}`,
      requestId: tracking.requestId,
      assignmentId: tracking.assignmentId,
      shiftId: tracking.shiftId,
      durationMinutes: duration,
      originalEndAt: tracking.scheduledEndAt,
      proposedEndAt,
      ...(scenario === 'approved_demo' ? { effectiveEndAt: proposedEndAt } : {}),
      referenceFee: referenceFees[duration],
      scenario,
      createdAt: '2026-10-10T16:00:00+07:00',
      message: scenarioMessages[scenario],
    },
  }
}
