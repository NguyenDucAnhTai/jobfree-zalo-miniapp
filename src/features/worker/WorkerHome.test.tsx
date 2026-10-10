import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { workerHomeJobs } from '../../mocks/fixtures'
import { initialWorkerShifts } from '../../mocks/workerLifecycleFixtures'
import { getWorkerDashboardMetrics, workerDashboardSummaryFixture } from '../../mocks/workerDashboardFixtures'
import { WorkerHome } from './WorkerHome'

function shiftWithStatus(status: (typeof initialWorkerShifts)[number]['status']) {
  return { ...initialWorkerShifts[0], status }
}

describe('Worker home reference implementation', () => {
  it('renders the Worker PNG reference structure and navigation CTA', () => {
    const onNavigate = vi.fn()
    render(<WorkerHome onNavigate={onNavigate} onSelectOpportunity={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Tổng quan hôm nay' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ca sắp tới' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Điều khiển ca' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /khám phá việc mới/i })).toBeInTheDocument()
    expect(screen.getByText(`${workerHomeJobs.length} công việc trong dữ liệu demo`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: /xem việc mới/i }))
    expect(onNavigate).toHaveBeenCalledWith('opportunities')
  })

  it('filters the fixed Worker jobs and exposes an empty state when appropriate', () => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Nhận ngay' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Phụ chuyển tối nay')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nhận ngay' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu sớm' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Bắt đầu sớm' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows a labeled empty state when the mock has no jobs', () => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} jobs={[]} />)
    expect(screen.getByText('Chưa có công việc mới trong dữ liệu demo')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Không có việc theo bộ lọc' })).toHaveTextContent(/chưa có job theo bộ lọc này/i)
  })

  it('opens the selected opportunity detail with its ID', () => {
    const onNavigate = vi.fn()
    const onSelectOpportunity = vi.fn()
    render(<WorkerHome onNavigate={onNavigate} onSelectOpportunity={onSelectOpportunity} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Xem chi tiết' })[1])
    expect(onSelectOpportunity).toHaveBeenCalledWith(workerHomeJobs[1].id)
    expect(onNavigate).toHaveBeenCalledWith('opportunityDetail')
  })

  it('derives dashboard totals from the controlled dashboard fixture without implying payment settlement', () => {
    const metrics = getWorkerDashboardMetrics()
    expect(metrics).toEqual({ referenceIncome: 220000, completedShifts: 1, workedMinutes: 240, breakMinutes: null })
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} />)
    expect(screen.getByText('220.000đ')).toBeInTheDocument()
    expect(screen.getByText('Giá trị fixture minh họa · không phải tiền đã thanh toán')).toBeInTheDocument()
    expect(screen.getByText(workerDashboardSummaryFixture.dateLabel)).toBeInTheDocument()
    expect(screen.getByText('Chưa có dữ liệu nghỉ')).toBeInTheDocument()
  })

  it('shows zero metrics for an empty dashboard fixture rather than inventing totals', () => {
    expect(getWorkerDashboardMetrics({ dateLabel: '10/10/2026', completedShifts: [] })).toEqual({ referenceIncome: 0, completedShifts: 0, workedMinutes: 0, breakMinutes: null })
  })

  it('shows the scheduled shift as upcoming and opens its detail without a live countdown', () => {
    const onOpenShift = vi.fn()
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} onOpenShift={onOpenShift} shift={initialWorkerShifts[0]} />)
    expect(screen.getByText('Sắp tới · demo')).toBeInTheDocument()
    expect(screen.getByText('Theo lịch demo')).toBeInTheDocument()
    expect(screen.getByText(/không có đếm ngược trực tiếp/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /xem chi tiết ca/i }))
    expect(onOpenShift).toHaveBeenCalledWith(initialWorkerShifts[0].id)
  })

  it.each([
    ['scheduled', 'Ca sắp tới'],
    ['en_route', 'Ca đang diễn ra'],
    ['checked_in', 'Ca đang diễn ra'],
    ['completed', 'Ca theo dõi'],
  ] as const)('uses the appropriate heading for %s shifts', (status, heading) => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} shift={shiftWithStatus(status)} />)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('shows an empty shift card when no suitable shift is supplied', () => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Chưa có ca sắp tới')
  })

  it('keeps all shift controls disabled with a clear demo explanation', () => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} />)
    for (const action of ['COD', 'Check-in', 'Dịch vụ', 'Báo cáo', 'Nghỉ']) {
      expect(screen.getByRole('button', { name: new RegExp(`${action}, chưa hỗ trợ trong demo`, 'i') })).toBeDisabled()
    }
  })

  it('assigns distinct reference color tones to safe, disabled shift controls', () => {
    render(<WorkerHome onNavigate={vi.fn()} onSelectOpportunity={vi.fn()} />)
    for (const [label, tone] of [['COD', 'cod'], ['Check-in', 'checkin'], ['Dịch vụ', 'service'], ['Báo cáo', 'report'], ['Nghỉ', 'break']]) {
      expect(screen.getByRole('button', { name: new RegExp(`${label}, chưa hỗ trợ trong demo`, 'i') })).toHaveClass(`worker-shift-control--${tone}`)
    }
  })
})
