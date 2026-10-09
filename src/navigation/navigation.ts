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
    { id: 'jobs', label: 'Việc mới', icon: '✳' },
    { id: 'active', label: 'Đang làm', icon: '▤' },
    { id: 'income', label: 'Thu nhập', icon: '↗' },
    { id: 'account', label: 'Tài khoản', icon: '○' },
  ],
}

export function isDestinationForContext(context: UiContext, destination: Destination) {
  return navigationByContext[context].some((item) => item.id === destination)
}

export function destinationLabel(context: UiContext, destination: Destination) {
  return navigationByContext[context].find((item) => item.id === destination)?.label ?? 'Trang chủ'
}
