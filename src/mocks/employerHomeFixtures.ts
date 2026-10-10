import type { Destination } from '../types/domain'

export type EmployerServiceArt = 'moving' | 'cleaning' | 'delivery' | 'events'

export interface EmployerHomeBannerFixture {
  id: string
  eyebrow: string
  title: string
  description: string
  cta: string
  destination: Destination
  artwork: EmployerServiceArt
  artworkLabel: string
}

export const employerHomeBanners: EmployerHomeBannerFixture[] = [
  {
    id: 'support', eyebrow: 'CẦN NGƯỜI HỖ TRỢ?', title: 'Tìm người phù hợp, việc xong nhẹ nhàng.',
    description: 'Đăng nhu cầu dịch vụ trong vài bước đơn giản.', cta: 'Tạo yêu cầu', destination: 'requestDraft',
    artwork: 'events', artworkLabel: 'Nhân viên hỗ trợ sắp xếp sự kiện',
  },
  {
    id: 'moving', eyebrow: 'KHO VẬN & LOGISTICS', title: 'Cần hỗ trợ bốc xếp?',
    description: 'Tạo yêu cầu cho ca làm phù hợp với nhu cầu.', cta: 'Xem dịch vụ', destination: 'services',
    artwork: 'moving', artworkLabel: 'Hai người hỗ trợ chuyển thùng hàng',
  },
  {
    id: 'more-help', eyebrow: 'DỊCH VỤ THEO NHU CẦU', title: 'Thêm người hỗ trợ, công việc gọn hơn.',
    description: 'Khám phá các dịch vụ dọn dẹp và hỗ trợ sự kiện.', cta: 'Khám phá dịch vụ', destination: 'services',
    artwork: 'cleaning', artworkLabel: 'Nhân viên vệ sinh đang lau cửa kính',
  },
] as const

export const employerQuickUtilities = [
  { id: 'create', label: 'Tạo yêu cầu', detail: 'Bắt đầu bản nháp demo', destination: 'requestDraft' },
  { id: 'track', label: 'Theo dõi công việc', detail: 'Xem lịch sử yêu cầu', destination: 'history' },
  { id: 'services', label: 'Xem dịch vụ', detail: 'Chọn nhu cầu phù hợp', destination: 'services' },
] as const
