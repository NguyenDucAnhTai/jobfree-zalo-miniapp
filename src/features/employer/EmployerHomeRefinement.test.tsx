import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { employerServices, employerJobs } from '../../mocks/fixtures'
import { employerHomeBanners, employerQuickUtilities } from '../../mocks/employerHomeFixtures'
import { employerServiceArtworkSources } from '../../mocks/employerServiceArtwork'
import { EmployerHome } from './EmployerHome'
import { EmployerServiceCatalog } from './EmployerScreens'

function readJpegDimensions(path: string): [number, number] {
  const bytes = readFileSync(path)
  let offset = 2

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error(`Invalid JPEG marker at ${offset}`)
    const marker = bytes[offset + 1]
    offset += 2
    if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue

    const segmentLength = bytes.readUInt16BE(offset)
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return [bytes.readUInt16BE(offset + 5), bytes.readUInt16BE(offset + 3)]
    }
    offset += segmentLength
  }

  throw new Error('JPEG dimensions were not found')
}

describe('Employer Home marketplace refinement', () => {
  it('renders all fixed banners with accessible indicators and routes the primary CTA to the draft', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)

    const carousel = screen.getByRole('region', { name: 'Khám phá dịch vụ JobFree' })
    expect(within(carousel).getAllByRole('button', { name: /^Banner \d:/ })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Tìm người phù hợp, việc xong nhẹ nhàng.' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Nhân viên hỗ trợ sắp xếp sự kiện' })).toBeInTheDocument()
    fireEvent.click(within(carousel).getByRole('button', { name: 'Tạo yêu cầu' }))
    expect(onNavigate).toHaveBeenCalledWith('requestDraft')
  })

  it('keeps every banner title as complete natural-wrapping text with a local image source', () => {
    const { container } = render(<EmployerHome onNavigate={vi.fn()} onSelectService={vi.fn()} />)
    const carousel = screen.getByRole('region', { name: 'Khám phá dịch vụ JobFree' })

    employerHomeBanners.forEach((banner, index) => {
      if (index > 0) fireEvent.click(within(carousel).getByRole('button', { name: `Banner ${index + 1}: ${banner.title}` }))
      const heading = within(carousel).getByRole('heading', { name: banner.title })
      expect(heading.textContent).toBe(banner.title)
      expect(heading.querySelector('br')).toBeNull()
      expect(within(carousel).getByRole('button', { name: banner.cta })).toBeInTheDocument()
      const image = within(carousel).getByRole('img', { name: banner.artworkLabel })
      expect(image).toHaveAttribute('src', employerServiceArtworkSources[banner.artwork])
    })

    expect(container.querySelector('.employer-banner')).toHaveClass('employer-banner--more-help')
  })

  it('routes each banner CTA to its fixture destination', () => {
    const onNavigate = vi.fn()
    render(<EmployerHome onNavigate={onNavigate} onSelectService={vi.fn()} />)
    const carousel = screen.getByRole('region', { name: 'Khám phá dịch vụ JobFree' })

    employerHomeBanners.forEach((banner, index) => {
      if (index > 0) fireEvent.click(within(carousel).getByRole('button', { name: `Banner ${index + 1}: ${banner.title}` }))
      fireEvent.click(within(carousel).getByRole('button', { name: banner.cta }))
      expect(onNavigate).toHaveBeenLastCalledWith(banner.destination)
    })
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
      const artwork = button.querySelector('.service-art')
      const image = button.querySelector('img')
      expect(artwork).toHaveClass(`service-art--${service.id}`)
      expect((artwork as HTMLElement).style.backgroundColor).not.toBe('')
      expect(image).toHaveAttribute('src', employerServiceArtworkSources[service.id as keyof typeof employerServiceArtworkSources])
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(image).toHaveStyle({ objectFit: 'contain', objectPosition: 'center' })
      const imagePath = resolve(process.cwd(), 'public', employerServiceArtworkSources[service.id as keyof typeof employerServiceArtworkSources].slice(1))
      expect(existsSync(imagePath)).toBe(true)
      expect(readJpegDimensions(imagePath)).toEqual([623, 623])
      fireEvent.click(button)
      expect(onSelectService).toHaveBeenLastCalledWith(service.id)
    }
  })

  it('uses the generated service artwork in the catalog without changing catalog selection', () => {
    const onChoose = vi.fn()
    render(<EmployerServiceCatalog onChoose={onChoose} />)
    const moving = screen.getByRole('button', { name: /bốc xếp/i })
    expect(moving.querySelector('img')).toHaveAttribute('src', employerServiceArtworkSources.moving)
    fireEvent.click(moving)
    expect(onChoose).toHaveBeenCalledWith('moving')
  })

  it('keeps a labeled fallback when an informative artwork fails to load', () => {
    render(<EmployerHome onNavigate={vi.fn()} onSelectService={vi.fn()} />)
    const image = screen.getByRole('img', { name: 'Nhân viên hỗ trợ sắp xếp sự kiện' })
    fireEvent.error(image)
    expect(screen.getByRole('img', { name: 'Nhân viên hỗ trợ sắp xếp sự kiện' })).toHaveClass('service-art-fallback')
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

describe('Employer artwork and CSS regression guard', () => {
  it('keeps the main stylesheet imported once and prevents regression to stretched sprite backgrounds', () => {
    const entry = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8')
    const styles = readFileSync(resolve(process.cwd(), 'src/App.css'), 'utf8')
    const spriteReferences = [...styles.matchAll(/employer-services-sprite\.png/g)]

    expect([...entry.matchAll(/import ['"]\.\/App\.css['"]/g)]).toHaveLength(1)
    expect(spriteReferences).toHaveLength(0)
    expect(styles).toContain('.employer-banner { min-height: 194px; display: grid;')
    expect(styles).toContain('.service-art img { display: block; width: 100%; height: 100%; object-fit: contain;')
  })
})
