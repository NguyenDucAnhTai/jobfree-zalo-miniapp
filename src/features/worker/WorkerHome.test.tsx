import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WorkerHome } from './WorkerHome'

describe('Worker home reference implementation', () => {
  it('renders the Worker PNG reference structure and navigation CTA', () => {
    const onNavigate = vi.fn()
    render(<WorkerHome onNavigate={onNavigate} />)

    expect(screen.getByRole('heading', { name: /sẵn sàng nhận việc hôm nay/i })).toBeInTheDocument()
    expect(screen.getByText(/có 8 job phù hợp gần bạn/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: /xem job gần tôi/i }))
    expect(onNavigate).toHaveBeenCalledWith('opportunities')
  })

  it('filters the fixed Worker jobs and exposes an empty state when appropriate', () => {
    render(<WorkerHome onNavigate={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Nhận ngay' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Phụ chuyển tối nay')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nhận ngay' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu sớm' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Bắt đầu sớm' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows a labeled empty state when the mock has no jobs', () => {
    render(<WorkerHome onNavigate={vi.fn()} jobs={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent(/chưa có job theo bộ lọc này/i)
  })
})
