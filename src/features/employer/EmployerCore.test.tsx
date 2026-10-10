import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from '../../app/AppShell'
import { EmployerHome } from './EmployerHome'
import { EmployerServiceCatalog } from './EmployerScreens'
import { validateEmployerDraft } from './validateEmployerDraft'
import { emptyEmployerRequestDraft } from '../../mocks/fixtures'

describe('Employer core demo flows', () => {
  it('opens the catalog and selects a service into the request draft', () => {
    const onChoose = vi.fn()
    render(<EmployerServiceCatalog onChoose={onChoose} />)

    fireEvent.click(screen.getByRole('button', { name: /bốc xếp/i }))

    expect(onChoose).toHaveBeenCalledWith('moving')
    expect(screen.getByRole('heading', { name: 'Kho vận & Logistics' })).toBeInTheDocument()
  })

  it('validates required fields and accepts a consistent date/time range', () => {
    expect(validateEmployerDraft(emptyEmployerRequestDraft)).toMatchObject({
      serviceId: expect.any(String),
      details: expect.any(String),
      location: expect.any(String),
    })
    expect(validateEmployerDraft({
      serviceId: 'moving',
      details: 'Hỗ trợ chuyển hàng lên tầng hai',
      location: 'Quận 1, TP. Hồ Chí Minh',
      date: '2026-10-10',
      startTime: '08:00',
      endTime: '12:00',
    })).toEqual({})
    expect(validateEmployerDraft({ ...emptyEmployerRequestDraft, serviceId: 'moving', details: 'Mô tả công việc hợp lệ', location: 'Quận 1, TP.HCM', startTime: '12:00', endTime: '08:00' })).toHaveProperty('time')
  })

  it('routes the saved draft to its summary and keeps it isolated while switching roles', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tạo yêu cầu' }))
    fireEvent.change(screen.getByLabelText('Dịch vụ'), { target: { value: 'moving' } })
    fireEvent.change(screen.getByLabelText('Mô tả công việc'), { target: { value: 'Hỗ trợ chuyển đồ lên tầng hai' } })
    fireEvent.change(screen.getByLabelText('Địa điểm làm việc (dữ liệu demo)'), { target: { value: 'Quận 1, TP. Hồ Chí Minh' } })
    fireEvent.click(screen.getByRole('button', { name: /lưu bản nháp demo/i }))

    expect(screen.getByRole('heading', { name: 'Xem lại yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText('Hỗ trợ chuyển đồ lên tầng hai')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /chỉnh sửa yêu cầu/i }))
    expect(screen.getByLabelText('Mô tả công việc')).toHaveValue('Hỗ trợ chuyển đồ lên tầng hai')

    fireEvent.click(screen.getByRole('button', { name: 'Người làm' }))
    expect(screen.getByRole('heading', { name: 'Tổng quan hôm nay' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Mô tả công việc')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Người thuê' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tạo yêu cầu' }))
    expect(screen.getByLabelText('Mô tả công việc')).toHaveValue('Hỗ trợ chuyển đồ lên tầng hai')
  })

  it('opens the Employer profile from its own navigation and labels unsupported items', () => {
    render(<AppShell />)
    const employerNavigation = screen.getByRole('navigation', { name: /người thuê/i })
    fireEvent.click(within(employerNavigation).getByRole('button', { name: 'Tài khoản' }))

    expect(screen.getByRole('heading', { name: 'Tài khoản' })).toBeInTheDocument()
    expect(screen.getByText(/thông tin giả lập/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /phương thức thanh toán, chưa hỗ trợ trong demo/i })).toBeDisabled()
  })

  it('can render explicit empty, loading and error states for recent requests', () => {
    const props = { onNavigate: vi.fn(), onSelectService: vi.fn() }
    const { rerender } = render(<EmployerHome {...props} homeState="empty" />)
    expect(screen.getByRole('status')).toHaveTextContent(/chưa có dữ liệu/i)
    rerender(<EmployerHome {...props} homeState="loading" />)
    expect(screen.getByRole('status')).toHaveTextContent(/đang tải thông tin/i)
    rerender(<EmployerHome {...props} homeState="error" />)
    expect(screen.getByRole('status')).toHaveTextContent(/chưa thể tải thông tin/i)
  })
})
