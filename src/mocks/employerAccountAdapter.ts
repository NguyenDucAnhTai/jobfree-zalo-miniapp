import type { EmployerDemoProfile, EmployerNotification, EmployerSavedAddress } from '../types/employerAccount'
export function validateEmployerProfile(profile: EmployerDemoProfile): string | undefined {
  if (!profile.displayName.trim()) return 'Vui lòng nhập tên hiển thị.'
  if (profile.displayName.trim().length > 40) return 'Tên hiển thị tối đa 40 ký tự.'
  if (profile.businessLabel.length > 50) return 'Nhãn đơn vị tối đa 50 ký tự.'
}
export function validateEmployerAddress(address: Pick<EmployerSavedAddress, 'label' | 'area'>): string | undefined {
  if (!address.label.trim()) return 'Vui lòng nhập tên địa chỉ.'
  if (address.label.trim().length > 40) return 'Tên địa chỉ tối đa 40 ký tự.'
  if (!address.area.trim()) return 'Vui lòng nhập khu vực hoặc mô tả địa điểm.'
  if (address.area.trim().length > 120) return 'Mô tả địa điểm tối đa 120 ký tự.'
}
export function nextEmployerAddressState(addresses: EmployerSavedAddress[], defaultId: string | undefined, action: { type: 'save'; address: EmployerSavedAddress } | { type: 'delete'; id: string } | { type: 'default'; id: string }) {
  if (action.type === 'save') {
    const exists = addresses.some((item) => item.id === action.address.id)
    const next = exists ? addresses.map((item) => item.id === action.address.id ? { ...action.address } : item) : [...addresses, { ...action.address }]
    return { addresses: next, defaultId: defaultId ?? action.address.id }
  }
  if (action.type === 'default') return addresses.some((item) => item.id === action.id) ? { addresses, defaultId: action.id } : { addresses, defaultId }
  const next = addresses.filter((item) => item.id !== action.id)
  const nextDefault = defaultId === action.id ? next[0]?.id : defaultId
  return { addresses: next, defaultId: nextDefault }
}
export function unreadEmployerNotificationCount(items: EmployerNotification[]) { return items.filter((item) => !item.read).length }
export function markEmployerNotificationRead(items: EmployerNotification[], id: string) { return items.map((item) => item.id === id ? { ...item, read: true } : item) }
