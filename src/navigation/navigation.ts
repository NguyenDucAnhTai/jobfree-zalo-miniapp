import type { Destination, UiContext } from '../types/domain'

export type NavigationIconName = 'home' | 'services' | 'jobs' | 'schedule' | 'wallet' | 'account'

export const navigationByContext: Record<UiContext, { id: Destination; label: string; icon: NavigationIconName }[]> = {
  employer: [
    { id: 'home', label: 'Trang chủ', icon: 'home' },
    { id: 'services', label: 'Dịch vụ', icon: 'services' },
    { id: 'history', label: 'Công việc', icon: 'jobs' },
    { id: 'account', label: 'Tài khoản', icon: 'account' },
  ],
  worker: [
    { id: 'home', label: 'Trang chủ', icon: 'home' },
    { id: 'jobs', label: 'Việc của tôi', icon: 'jobs' },
    { id: 'schedule', label: 'Lịch trình', icon: 'schedule' },
    { id: 'wallet', label: 'Ví', icon: 'wallet' },
    { id: 'account', label: 'Tài khoản', icon: 'account' },
  ],
}

export function isDestinationForContext(context: UiContext, destination: Destination) {
  if (navigationByContext[context].some((item) => item.id === destination)) return true
  if (['communicationChat', 'communicationCall', 'completion', 'review', 'incident', 'dispute'].includes(destination)) return true
  if (context === 'employer' && destination.startsWith('employer')) return true
  return context === 'worker' && ['opportunities', 'opportunityDetail', 'shiftDetail', 'transactionDetail', 'skills', 'readiness', 'area'].includes(destination)
}

export function destinationLabel(context: UiContext, destination: Destination) {
  const labels: Partial<Record<Destination, string>> = {
    opportunities: 'Việc mới', opportunityDetail: 'Chi tiết việc', shiftDetail: 'Chi tiết ca làm', transactionDetail: 'Chi tiết giao dịch', skills: 'Kỹ năng', readiness: 'Lịch rảnh', area: 'Khu vực làm việc', communicationChat: 'Tin nhắn demo', communicationCall: 'Cuộc gọi demo', completion: 'Xác nhận hoàn tất', review: 'Đánh giá', incident: 'Báo cáo sự cố', dispute: 'Hồ sơ hỗ trợ', employerProfileEdit: 'Hồ sơ cá nhân', employerAddresses: 'Địa chỉ của tôi', employerRebook: 'Đặt lại dịch vụ', employerNotifications: 'Thông báo', employerReviews: 'Đánh giá của tôi', employerCases: 'Phản ánh của tôi', employerCaseDetail: 'Chi tiết hồ sơ', employerSupport: 'Trung tâm trợ giúp', employerHelpArticle: 'Hướng dẫn', employerPaymentsInfo: 'Thanh toán demo', employerPrivacy: 'Quyền riêng tư', employerTerms: 'Điều khoản sử dụng', employerAppInfo: 'Thông tin ứng dụng', employerNotificationSettings: 'Cài đặt thông báo',
  }
  return navigationByContext[context].find((item) => item.id === destination)?.label ?? labels[destination] ?? 'Trang chủ'
}
