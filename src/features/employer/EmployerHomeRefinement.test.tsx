import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { employerServices, employerJobs } from '../../mocks/fixtures'
import { employerHomeBanners, employerQuickUtilities } from '../../mocks/employerHomeFixtures'
import { EmployerHome } from './EmployerHome'
import { EmployerServiceCatalog } from './EmployerScreens'

describe('Employer Home marketplace refinement', () => {
  it('renders all fixed banners with accessible indicators and routes the primary CTA to the draft', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)

    const carousel = screen.getByRole('region', { name: 'Khám phá dịch vụ JobFree' })
    expect(within(carousel).getAllByRole('button', { name: /^Banner \d:/ })).toHaveLength(3)
    expect(screen.getByText('Tìm người phù hợp,')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Nhân viên hỗ trợ sắp xếp sự kiện' })).toBeInTheDocument()
    fireEvent.click(within(carousel).getByRole('button', { name: 'Tạo yêu cầu' }))
    expect(onNavigate).toHaveBeenCalledWith('requestDraft')
  })

  it('moves between banners with controls, indicators and horizontal swipe gestures', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)
    const carousel = screen.getByRole('region', { name: 'Khám phá dịch vụ JobFree' })

    fireEvent.click(within(carousel).getByRole('button', { name: 'Banner tiếp theo' }))
    expect(screen.getByRole('heading', { name: 'Cần hỗ trợ bốc xếp?' })).toBeInTheDocument()
    fireEvent.click(within(carousel).getByRole('button', { name: /Banner 3:/ }))
    expect(screen.getByRole('heading', { name: 'Thêm người hỗ trợ, công việc gọn hơn.' })).toBeInTheDocument()
    fireEvent.click(within(carousel).getByRole('button', { name: 'Banner trước' }))
    expect(screen.getByRole('heading', { name: 'Cần hỗ trợ bốc xếp?' })).toBeInTheDocument()
    fireEvent.touchStart(carousel, { changedTouches: [{ clientX: 270 }] })
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 180 }] })
    expect(screen.getByRole('heading', { name: 'Thêm người hỗ trợ, công việc gọn hơn.' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Khám phá dịch vụ' }))
    expect(onNavigate).toHaveBeenCalledWith('services')
    expect(employerHomeBanners).toHaveLength(3)
  })

  it('keeps service IDs, selection callbacks and informative artwork in the home grid', () => {
    const onSelectService = vi.fn()
    render(<EmployerHome onNavigate={vi.fn()} onSelectService={onSelectService} />)
    for (const service of employerServices) {
      const button = screen.getByRole('button', { name: `${service.title}: ${service.description}` })
      const artwork = within(button).getByRole('img', { name: `Minh họa dịch vụ ${service.title}` })
      expect(artwork).toBeInTheDocument()
      expect(artwork).toHaveClass(`service-art--${service.id}`)
      expect((artwork as HTMLElement).style.backgroundColor).not.toBe('')
      fireEvent.click(button)
      expect(onSelectService).toHaveBeenLastCalledWith(service.id)
    }
  })

  it('uses the generated service artwork in the catalog without changing catalog selection', () => {
    const onChoose = vi.fn()
    render(<EmployerServiceCatalog onChoose={onChoose} />)
    const moving = screen.getByRole('button', { name: /bốc xếp/i })
    expect(within(moving).getByRole('img', { name: 'Minh họa dịch vụ Bốc xếp' })).toBeInTheDocument()
    fireEvent.click(moving)
    expect(onChoose).toHaveBeenCalledWith('moving')
  })

  it('routes utility cards to existing Employer destinations and presents the local guide panel', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)
    const utilities = screen.getByRole('region', { name: 'Tiện ích cho bạn' })
    for (const item of employerQuickUtilities) {
      fireEvent.click(within(utilities).getByRole('button', { name: new RegExp(item.label) }))
      expect(onNavigate).toHaveBeenLastCalledWith(item.destination)
    }
    fireEvent.click(within(utilities).getByRole('button', { name: /hướng dẫn sử dụng/i }))
    const guide = screen.getByRole('dialog', { name: 'Tạo và theo dõi yêu cầu' })
    expect(guide).toHaveTextContent('Thông tin chỉ nằm trong giao diện demo')
    fireEvent.click(within(guide).getByRole('button', { name: 'Bắt đầu tạo yêu cầu' }))
    expect(onNavigate).toHaveBeenLastCalledWith('requestDraft')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens recent request history and derives visible request content only from existing fixtures', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)
    const job = employerJobs[0]
    expect(screen.getByText(job.title)).toBeInTheDocument()
    expect(screen.getByText(job.schedule)).toBeInTheDocument()
    expect(screen.getByText(job.pay)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /theo dõi yêu cầu demo/i }))
    expect(onNavigate).toHaveBeenCalledWith('history')
  })

  it.each(['empty', 'loading', 'error', 'offline'] as const)('renders a labeled %s recent-request state', (homeState) => {
    render(<EmployerHome onNavigate={vi.fn()} onSelectService={vi.fn()} homeState={homeState} />)
    expect(screen.getByRole('status')).toHaveTextContent(homeState === 'empty' ? 'Chưa có dữ liệu' : homeState === 'loading' ? 'Đang tải thông tin' : homeState === 'offline' ? 'Bạn đang ngoại tuyến' : 'Chưa thể tải thông tin')
  })

  it('renders the empty request state when there are no request fixtures', () => {
    render(<EmployerHome onNavigate={vi.fn()} onSelectService={vi.fn()} jobs={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('Chưa có dữ liệu')
  })
})
