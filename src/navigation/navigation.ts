import type { Destination, UiContext } from '../types/domain'

export const navigationByContext: Record<UiContext, { id: Destination; label: string; icon: string }[]> = {
  employer: [
    { id: 'home', label: 'Trang chủ', icon: '⌂' },
    { id: 'services', label: 'Dịch vụ', icon: '▦' },
    { id: 'history', label: 'Công việc', icon: '▤' },
    { id: 'account', label: 'Tài khoản', icon: '○' },
  ],
  worker: [
    { id: 'home', label: 'Trang chủ', icon: '⌂' },
    { id: 'jobs', label: 'Việc của tôi', icon: '▣' },
    { id: 'schedule', label: 'Lịch trình', icon: '▦' },
    { id: 'wallet', label: 'Ví', icon: '▣' },
    { id: 'account', label: 'Tài khoản', icon: '○' },
  ],
}

export function isDestinationForContext(context: UiContext, destination: Destination) {
  if (navigationByContext[context].some((item) => item.id === destination)) return true
  return context === 'worker' && ['opportunities', 'opportunityDetail', 'skills', 'readiness', 'area'].includes(destination)
}

export function destinationLabel(context: UiContext, destination: Destination) {
  const labels: Partial<Record<Destination, string>> = {
    opportunities: 'Việc mới', opportunityDetail: 'Chi tiết việc', skills: 'Kỹ năng', readiness: 'Lịch rảnh', area: 'Khu vực làm việc',
  }
  return navigationByContext[context].find((item) => item.id === destination)?.label ?? labels[destination] ?? 'Trang chủ'
}
