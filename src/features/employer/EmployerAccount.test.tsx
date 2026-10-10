import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from '../../app/AppShell'
import { employerAddressFixtures, employerNotificationFixtures } from '../../mocks/employerAccountFixtures'
import { markEmployerNotificationRead, nextEmployerAddressState, unreadEmployerNotificationCount, validateEmployerAddress, validateEmployerProfile } from '../../mocks/employerAccountAdapter'
import { employerProfileFixture } from '../../mocks/employerAccountFixtures'

describe('Employer E3 account utilities', () => {
  it('validates synthetic profile and saved address fields', () => {
    expect(validateEmployerProfile({ ...employerProfileFixture, displayName: ' ' })).toMatch(/tên/i)
    expect(validateEmployerProfile({ ...employerProfileFixture, displayName: 'Minh Anh' })).toBeUndefined()
    expect(validateEmployerAddress({ label: '', area: 'Quận 1' })).toMatch(/tên địa chỉ/i)
    expect(validateEmployerAddress({ label: 'Nhà', area: '' })).toMatch(/khu vực/i)
    expect(validateEmployerAddress({ label: 'Nhà', area: 'Quận 1' })).toBeUndefined()
  })

  it('keeps address edits isolated and safely reassigns the default after deletion', () => {
    const edited = nextEmployerAddressState(employerAddressFixtures, 'JF-ADDR-001', { type: 'save', address: { ...employerAddressFixtures[0], label: 'Nhà mới' } })
    expect(edited.addresses[0].label).toBe('Nhà mới')
    expect(edited.addresses[1]).toEqual(employerAddressFixtures[1])
    const deleted = nextEmployerAddressState(edited.addresses, 'JF-ADDR-001', { type: 'delete', id: 'JF-ADDR-001' })
    expect(deleted.defaultId).toBe('JF-ADDR-002')
    expect(new Set(deleted.addresses.map((a) => a.id)).size).toBe(deleted.addresses.length)
  })

  it('derives unread badge and marks individual or all notifications read', () => {
    expect(unreadEmployerNotificationCount(employerNotificationFixtures)).toBe(2)
    const one = markEmployerNotificationRead(employerNotificationFixtures, 'JF-NOTI-0105-ASSIGNED')
    expect(unreadEmployerNotificationCount(one)).toBe(1)
    expect(unreadEmployerNotificationCount(one.map((n) => ({ ...n, read: true })))).toBe(0)
  })

  it('edits and saves profile locally, then reflects it on account home', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    expect(screen.getByRole('heading', { name: 'Tài khoản' })).toBeInTheDocument()
    expect(screen.getAllByText('Minh Anh').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Sửa' }))
    fireEvent.change(screen.getByLabelText('Tên hiển thị'), { target: { value: 'Lan Demo' } })
    fireEvent.change(screen.getByLabelText('Loại người thuê'), { target: { value: 'shop' } })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu trong phiên demo' }))
    expect(screen.getAllByText('Lan Demo').length).toBeGreaterThan(0)
    expect(screen.getByText(/Cửa hàng · DEMO/)).toBeInTheDocument()
  }, 15000)

  it('supports address add, default selection and location-only draft prefill', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /địa chỉ của tôi/i }))
    fireEvent.click(screen.getByRole('button', { name: /thêm địa chỉ demo/i }))
    fireEvent.change(screen.getByLabelText('Tên địa chỉ'), { target: { value: 'Văn phòng' } })
    fireEvent.change(screen.getByLabelText('Loại địa chỉ'), { target: { value: 'office' } })
    fireEvent.change(screen.getByLabelText('Khu vực / mô tả địa điểm'), { target: { value: 'Phường 3, Quận 3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }))
    const office = screen.getByText('Phường 3, Quận 3').closest('article')!
    expect(within(office).getByText('Phường 3, Quận 3')).toBeInTheDocument()
    fireEvent.click(within(office).getByRole('button', { name: 'Dùng cho bản nháp' }))
    expect(screen.getByLabelText('Địa điểm làm việc (dữ liệu demo)')).toHaveValue('Phường 3, Quận 3')
    expect(screen.getByLabelText('Dịch vụ')).toHaveValue('')
  }, 15000)

  it('cancels address edits and confirms default deletion with safe reassignment', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /địa chỉ của tôi/i }))
    const home = screen.getByText('Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh').closest('article')!
    fireEvent.click(within(home).getByRole('button', { name: 'Sửa' }))
    fireEvent.change(screen.getByLabelText('Tên địa chỉ'), { target: { value: 'Bản sửa chưa lưu' } })
    fireEvent.click(screen.getByRole('button', { name: 'Huỷ' }))
    expect(within(home).getByText('Nhà', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.queryByText('Bản sửa chưa lưu')).not.toBeInTheDocument()
    const updatedHome = screen.getByText('Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh').closest('article')!
    fireEvent.click(within(updatedHome).getByRole('button', { name: 'Xoá' }))
    expect(confirm).toHaveBeenCalled()
    const store = screen.getByText('Phường Đa Kao, Quận 1, TP. Hồ Chí Minh').closest('article')!
    expect(within(store).getByText('Mặc định')).toBeInTheDocument()
    confirm.mockRestore()
  }, 15000)

  it('rebooks a completed request into a new draft requiring fresh time and budget review', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /đặt lại dịch vụ/i }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Tạo bản nháp mới' })[0])
    expect(screen.getByLabelText('Dịch vụ')).toHaveValue('events')
    expect(screen.getByLabelText('Mô tả công việc')).toHaveValue('Hỗ trợ sắp xếp bàn ghế cho buổi gặp mặt.')
    expect(screen.getByLabelText('Ngày làm')).toHaveValue('')
    expect(screen.getByLabelText('Bắt đầu')).toHaveValue('')
    expect(screen.getByLabelText('Kết thúc')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('Ngày làm'), { target: { value: '2026-10-15' } })
    fireEvent.change(screen.getByLabelText('Bắt đầu'), { target: { value: '09:00' } })
    fireEvent.change(screen.getByLabelText('Kết thúc'), { target: { value: '13:00' } })
    fireEvent.click(screen.getByRole('button', { name: /lưu bản nháp demo/i }))
    expect(screen.getByRole('heading', { name: 'Xem lại yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText('JF-DEMO-DRAFT-LOCAL')).toBeInTheDocument()
    expect(screen.queryByText(/assignment.*JF-E1-ASSIGN-0108/i)).not.toBeInTheDocument()
  }, 15000)

  it('uses the account bell, marks linked notifications read and opens the exact request', () => {
    render(<AppShell />)
    const bell = screen.getByRole('button', { name: /mở thông báo người thuê demo, 2 chưa đọc/i })
    fireEvent.click(bell)
    expect(screen.getByRole('heading', { name: 'Thông báo' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tình huống thông báo demo'), { target: { value: 'empty' } })
    expect(screen.getByRole('status')).toHaveTextContent(/chưa có thông báo/i)
    fireEvent.change(screen.getByLabelText('Tình huống thông báo demo'), { target: { value: 'success' } })
    fireEvent.click(screen.getByRole('button', { name: /đã có worker được ghép/i }))
    expect(screen.getByRole('heading', { name: 'JF-DEMO-0105' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /lịch sử yêu cầu/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    expect(screen.getByRole('button', { name: /mở thông báo người thuê demo, 1 chưa đọc/i })).toBeInTheDocument()
  }, 15000)

  it('opens the selected dispute case by exact case ID, not an arbitrary request match', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /phản ánh và tranh chấp/i }))
    fireEvent.click(screen.getByRole('button', { name: /JF-DISPUTE-DEMO-0108-01/i }))
    expect(screen.getByText(/JF-DISPUTE-DEMO-0108-01 · resolved_demo/i)).toBeInTheDocument()
    expect(screen.getByText(/JF-DEMO-0108 · JF-E1-ASSIGN-0108/)).toBeInTheDocument()
    expect(screen.queryByText(/JF-DEMO-0107 · JF-E1-ASSIGN-0107/)).not.toBeInTheDocument()
  }, 15000)

  it('keeps Employer account utilities unavailable in Worker context', () => {
    render(<AppShell />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Người làm' })[0])
    expect(screen.queryByRole('button', { name: 'Địa chỉ của tôi' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    expect(screen.queryByRole('heading', { name: 'Tài khoản' })).toBeInTheDocument()
    expect(screen.queryByText('Minh Anh')).not.toBeInTheDocument()
  }, 15000)

  it('opens support articles and local notification preferences without live support actions', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /trung tâm trợ giúp/i }))
    fireEvent.click(screen.getByRole('button', { name: /matching hoạt động thế nào/i }))
    expect(screen.getByText(/Employer không chọn Worker từ danh sách ứng viên/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /gửi ticket|gặp nhân viên/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '‹ Tài khoản' }))
    fireEvent.click(screen.getByRole('button', { name: /cài đặt thông báo/i }))
    const updates = screen.getByRole('checkbox', { name: /cập nhật yêu cầu demo/i })
    fireEvent.click(updates)
    expect(updates).not.toBeChecked()
  }, 15000)
})
