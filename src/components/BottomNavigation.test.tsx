import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BottomNavigation } from './BottomNavigation'

describe('BottomNavigation', () => {
  it('renders the five Worker tabs with accessible SVG icons and route state', () => {
    const onNavigate = vi.fn()
    render(<BottomNavigation context="worker" active="schedule" onNavigate={onNavigate} />)
    const navigation = screen.getByRole('navigation', { name: 'Điều hướng người làm' })
    expect(within(navigation).getAllByRole('button')).toHaveLength(5)
    for (const label of ['Trang chủ', 'Việc của tôi', 'Lịch trình', 'Ví', 'Tài khoản']) {
      expect(within(navigation).getByRole('button', { name: label })).toBeInTheDocument()
    }
    expect(within(navigation).getByRole('button', { name: 'Lịch trình' })).toHaveAttribute('aria-current', 'page')
    expect(navigation.querySelectorAll('svg.navigation-svg')).toHaveLength(5)
    expect(navigation.textContent).not.toMatch(/[⌂▦▤▣○]/)
    fireEvent.click(within(navigation).getByRole('button', { name: 'Ví' }))
    expect(onNavigate).toHaveBeenCalledWith('wallet')
  })

  it('preserves the Employer navigation labels and destinations', () => {
    const onNavigate = vi.fn()
    render(<BottomNavigation context="employer" active="history" onNavigate={onNavigate} />)
    const navigation = screen.getByRole('navigation', { name: 'Điều hướng người thuê' })
    expect(within(navigation).getAllByRole('button')).toHaveLength(4)
    expect(within(navigation).getByRole('button', { name: 'Công việc' })).toHaveAttribute('aria-current', 'page')
    fireEvent.click(within(navigation).getByRole('button', { name: 'Dịch vụ' }))
    expect(onNavigate).toHaveBeenCalledWith('services')
  })
})
