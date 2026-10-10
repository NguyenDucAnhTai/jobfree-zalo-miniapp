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

  it('opens the selected Worker Home opportunity detail, returns to opportunities, and keeps Employer isolated', () => {
    render(<AppShell />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    fireEvent.click(screen.getAllByRole('button', { name: 'Xem chi tiết' })[1])

    expect(screen.getByRole('heading', { name: 'Chi tiết công việc' })).toBeInTheDocument()
    expect(screen.getByText(/demo-worker-home-job-02/)).toBeInTheDocument()
    expect(screen.getByText(/không phân công thật/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '‹ Quay lại' }))
    expect(screen.getByRole('heading', { name: 'Việc mới' })).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Người thuê' })[0])
    expect(screen.getByRole('heading', { name: /dịch vụ phổ biến/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Chi tiết công việc' })).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Công việc' })[0])
    expect(screen.getByRole('heading', { name: 'Lịch sử yêu cầu' })).toBeInTheDocument()
  })

  it('accepts only the fixed success offer scenario, opens My Jobs and prevents duplicates', () => {
    render(<AppShell />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Mở thông báo việc mới demo' }))
    expect(screen.getByRole('dialog', { name: 'Công việc mới cho bạn' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /xác nhận nhận việc demo/i }))
    expect(screen.getByRole('heading', { name: 'Việc của tôi' })).toBeInTheDocument()
    expect(screen.getByText('Phụ chuyển tối nay')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)

    fireEvent.click(screen.getByRole('button', { name: 'Mở thông báo việc mới demo' }))
    expect(screen.getByRole('button', { name: 'Offer đã đóng' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Đóng thông báo việc mới' }))
    fireEvent.click(screen.getByRole('button', { name: 'Việc của tôi' }))
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('renders Schedule, Wallet and Shift routes only inside Worker context', () => {
    render(<AppShell />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Lịch trình' }))
    expect(screen.getByRole('heading', { name: 'Lịch trình' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Ví' }))
    expect(screen.getByRole('heading', { name: 'Ví của bạn' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Người thuê' })[0])
    expect(screen.getByRole('heading', { name: /dịch vụ phổ biến/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ví của bạn' })).not.toBeInTheDocument()
  })
})
