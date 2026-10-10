import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { workerHomeJobs } from '../../mocks/fixtures'
import { WorkerHome } from './WorkerHome'

describe('Worker home reference implementation', () => {
  it('renders the Worker PNG reference structure and navigation CTA', () => {
    const onNavigate = vi.fn()
    render(<WorkerHome onNavigate={onNavigate} onSelectOpportunity={vi.fn()} />)

    expect(screen.getByRole('heading', { name: /sẵn sàng nhận việc hôm nay/i })).toBeInTheDocument()
    expect(screen.getByText(`Có ${workerHomeJobs.length} job phù hợp gần bạn`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: /xem job gần tôi/i }))
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
    expect(screen.getByText('Chưa có job phù hợp gần bạn')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/chưa có job theo bộ lọc này/i)
  })

  it('opens the selected opportunity detail with its ID', () => {
    const onNavigate = vi.fn()
    const onSelectOpportunity = vi.fn()
    render(<WorkerHome onNavigate={onNavigate} onSelectOpportunity={onSelectOpportunity} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Xem chi tiết' })[1])
    expect(onSelectOpportunity).toHaveBeenCalledWith(workerHomeJobs[1].id)
    expect(onNavigate).toHaveBeenCalledWith('opportunityDetail')
  })
})
