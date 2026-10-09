import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell role context', () => {
  it('starts in employer context and shows its home and navigation', () => {
    render(<AppShell />)

    expect(screen.getByRole('heading', { name: /dịch vụ phổ biến/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /người thuê/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /việc mới quanh đây/i })).not.toBeInTheDocument()
  })

  it('switches to worker home and resets worker navigation to home', () => {
    render(<AppShell />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])

    expect(screen.getByRole('heading', { name: /việc mới quanh đây/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /ca làm sắp tới/i })).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: /người làm/i })
    expect(within(navigation).getByRole('button', { name: 'Trang chủ' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('heading', { name: /dịch vụ phổ biến/i })).not.toBeInTheDocument()
  })

  it('keeps role navigation isolated and returns to home on context change', () => {
    render(<AppShell />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Công việc' })[0])
    expect(screen.getByRole('heading', { name: 'Công việc' })).toBeInTheDocument()
    expect(screen.getByText(/chưa thuộc Round 1/i)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    expect(screen.getByRole('heading', { name: /việc mới quanh đây/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Công việc' })).not.toBeInTheDocument()

    const navigation = screen.getByRole('navigation', { name: /người làm/i })
    expect(within(navigation).queryByRole('button', { name: 'Dịch vụ' })).not.toBeInTheDocument()
  })
})
