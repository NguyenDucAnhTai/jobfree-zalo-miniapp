import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell role context', () => {
  it('starts in employer context and shows its home and navigation', () => {
    render(<AppShell />)

    expect(screen.getByRole('heading', { name: /dịch vụ phổ biến/i })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /người thuê/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /job phù hợp với bạn/i })).not.toBeInTheDocument()
  })

  it('switches to worker home and resets worker navigation to home', () => {
    render(<AppShell />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])

    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.getByText('Phụ chuyển tối nay')).toBeInTheDocument()
    const navigation = screen.getByRole('navigation', { name: /người làm/i })
    expect(within(navigation).getByRole('button', { name: 'Trang chủ' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('heading', { name: /dịch vụ phổ biến/i })).not.toBeInTheDocument()
  })

  it('keeps role navigation isolated and returns to home on context change', () => {
    render(<AppShell />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Công việc' })[0])
    expect(screen.getByRole('heading', { name: 'Lịch sử yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText(/JF-DEMO-0101/)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Công việc' })).not.toBeInTheDocument()

    const navigation = screen.getByRole('navigation', { name: /người làm/i })
    expect(within(navigation).queryByRole('button', { name: 'Dịch vụ' })).not.toBeInTheDocument()
  })

  it('keeps Worker routes and profile state separate while Employer lifecycle stays available', () => {
    render(<AppShell />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Xem tất cả' }))
    expect(screen.getByRole('heading', { name: 'Việc mới' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Tài khoản' })[0])
    expect(screen.getByRole('heading', { name: 'Tài khoản' })).toBeInTheDocument()
    expect(screen.queryByText(/JF-DEMO-/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /lịch rảnh/i }))
    fireEvent.click(screen.getByRole('button', { name: /tạm nghỉ/i }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Trang chủ' })[0])
    expect(screen.getByText('Đang tạm nghỉ')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Người thuê' })[0])
    expect(screen.getByRole('heading', { name: /dịch vụ phổ biến/i })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Dịch vụ' })[0])
    fireEvent.click(screen.getByRole('button', { name: /dọn dẹp/i }))
    expect(screen.getByRole('heading', { name: /tạo yêu cầu/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /quay lại/i }))
    expect(screen.getByRole('heading', { name: 'Chọn dịch vụ' })).toBeInTheDocument()
  })
})
