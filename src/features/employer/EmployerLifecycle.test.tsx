import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from '../../app/AppShell'
import { employerRequestScenarios } from '../../mocks/employerRequestAdapter'
import { isDestinationForContext } from '../../navigation/navigation'
import { EmployerRequestDetail, EmployerRequestHistory, EmployerRequestSummary } from './EmployerLifecycleScreens'
import { emptyEmployerRequestDraft } from '../../mocks/fixtures'
import type { WorkRequestStatus } from '../../types/domain'

describe('Employer request lifecycle demo', () => {
  it('converts the draft into an editable summary with a labeled quote preview', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tạo yêu cầu' }))
    fireEvent.change(screen.getByLabelText('Dịch vụ'), { target: { value: 'moving' } })
    fireEvent.change(screen.getByLabelText('Mô tả công việc'), { target: { value: 'Hỗ trợ chuyển đồ lên tầng hai' } })
    fireEvent.change(screen.getByLabelText('Địa điểm làm việc (dữ liệu demo)'), { target: { value: 'Quận 1, TP. Hồ Chí Minh' } })
    fireEvent.click(screen.getByRole('button', { name: /lưu bản nháp demo/i }))

    expect(screen.getByRole('heading', { name: 'Xem lại yêu cầu' })).toBeInTheDocument()
    expect(screen.getByText('Bốc xếp')).toBeInTheDocument()
    expect(screen.getByText('Hỗ trợ chuyển đồ lên tầng hai')).toBeInTheDocument()
    expect(screen.getByText('320.000 ₫')).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent(/không phải báo giá production/i)

    fireEvent.click(screen.getByRole('button', { name: /chỉnh sửa yêu cầu/i }))
    expect(screen.getByLabelText('Mô tả công việc')).toHaveValue('Hỗ trợ chuyển đồ lên tầng hai')
    fireEvent.click(screen.getByRole('button', { name: /tóm tắt yêu cầu/i }))
    expect(screen.getByRole('heading', { name: 'Xem lại yêu cầu' })).toBeInTheDocument()
  })

  it('routes a draft summary to history and then opens the new draft detail', () => {
    render(<AppShell />)
    fireEvent.click(screen.getByRole('button', { name: 'Tạo yêu cầu' }))
    fireEvent.change(screen.getByLabelText('Dịch vụ'), { target: { value: 'cleaning' } })
    fireEvent.change(screen.getByLabelText('Mô tả công việc'), { target: { value: 'Dọn khu vực làm việc sau sự kiện' } })
    fireEvent.change(screen.getByLabelText('Địa điểm làm việc (dữ liệu demo)'), { target: { value: 'Quận 3, TP. Hồ Chí Minh' } })
    fireEvent.click(screen.getByRole('button', { name: /lưu bản nháp demo/i }))
    fireEvent.click(screen.getByRole('button', { name: /lưu và xem danh sách demo/i }))

    expect(screen.getByRole('heading', { name: 'Lịch sử yêu cầu' })).toBeInTheDocument()
    const draftCard = screen.getByRole('button', { name: /JF-DEMO-DRAFT-LOCAL/i })
    fireEvent.click(draftCard)
    expect(screen.getByRole('heading', { name: 'JF-DEMO-DRAFT-LOCAL' })).toBeInTheDocument()
    expect(screen.getByText('Chưa có người làm')).toBeInTheDocument()
  })

  it('filters history by exact lifecycle status and opens a selected request', () => {
    const onOpen = vi.fn()
    render(<EmployerRequestHistory requests={employerRequestScenarios} onOpen={onOpen} />)

    fireEvent.click(screen.getByRole('button', { name: 'Funding thất bại' }))

    expect(screen.getByText(/JF-DEMO-0103/)).toBeInTheDocument()
    expect(screen.queryByText(/JF-DEMO-0102/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /JF-DEMO-0103/i }))
    expect(onOpen).toHaveBeenCalledWith('JF-DEMO-0103')
  })

  it('offers deterministic empty, loading, error and offline history states', () => {
    render(<EmployerRequestHistory requests={employerRequestScenarios} onOpen={vi.fn()} />)
    const stateSelect = screen.getByRole('combobox', { name: 'Tình huống danh sách demo' })

    fireEvent.change(stateSelect, { target: { value: 'empty' } })
    expect(screen.getByRole('status')).toHaveTextContent('Chưa có yêu cầu demo')
    fireEvent.change(stateSelect, { target: { value: 'loading' } })
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải danh sách demo')
    fireEvent.change(stateSelect, { target: { value: 'error' } })
    expect(screen.getByRole('status')).toHaveTextContent('Chưa thể tải danh sách')
    fireEvent.change(stateSelect, { target: { value: 'offline' } })
    expect(screen.getByRole('status')).toHaveTextContent('Đang ngoại tuyến')
  })

  it('shows matching without a worker and assigned state with a synthetic assignment and shift', () => {
    const matching = employerRequestScenarios.find((request) => request.status === 'matching')!
    const assigned = employerRequestScenarios.find((request) => request.status === 'assigned')!
    const props = { onBack: vi.fn(), onSelectScenario: vi.fn() }

    const { rerender } = render(<EmployerRequestDetail request={matching} {...props} />)
    expect(screen.getByText('Chưa có người làm')).toBeInTheDocument()
    expect(screen.getByText(/Employer không chọn ứng viên/i)).toBeInTheDocument()
    expect(screen.queryByText(/Người làm demo An/i)).not.toBeInTheDocument()

    rerender(<EmployerRequestDetail request={assigned} {...props} />)
    expect(screen.getByText('Người làm demo An N.')).toBeInTheDocument()
    expect(screen.getByText(/Ca làm demo:/i)).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Chọn tình huống mẫu' }), { target: { value: 'JF-DEMO-0108' } })
    expect(props.onSelectScenario).toHaveBeenCalledWith('JF-DEMO-0108')
  })

  it('renders all required fixed lifecycle states and never makes Worker nav expose Employer routes', () => {
    const requiredStatuses: WorkRequestStatus[] = [
      'draft', 'funding_pending', 'funding_failed', 'matching', 'assigned',
      'replacement_matching', 'awaiting_employer_decision', 'completed', 'cancelled',
    ]
    expect(employerRequestScenarios.map((request) => request.status)).toEqual(requiredStatuses)
    expect(new Set(employerRequestScenarios.map((request) => request.id)).size).toBe(requiredStatuses.length)
    expect(isDestinationForContext('worker', 'history')).toBe(false)
    expect(isDestinationForContext('worker', 'requestSummary')).toBe(false)
    expect(isDestinationForContext('employer', 'history')).toBe(true)
  })

  it('keeps Employer request history hidden after switching into Worker context', () => {
    render(<AppShell />)
    const employerNav = screen.getByRole('navigation', { name: /người thuê/i })
    fireEvent.click(within(employerNav).getByRole('button', { name: 'Công việc' }))
    fireEvent.click(screen.getByRole('button', { name: /JF-DEMO-0105/i }))
    expect(screen.getByRole('heading', { name: 'JF-DEMO-0105' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Người làm' }))
    expect(screen.getByRole('heading', { name: /job phù hợp với bạn/i })).toBeInTheDocument()
    expect(screen.queryByText('JF-DEMO-0105')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /người làm/i })).toBeInTheDocument()
  })

  it('shows a stable summary when the quote adapter is used with the saved draft', () => {
    const draft = { ...emptyEmployerRequestDraft, serviceId: 'moving', details: 'Hỗ trợ chuyển đồ lên tầng hai', location: 'Quận 1, TP. HCM' }
    const request = employerRequestScenarios[0]
    render(<EmployerRequestSummary request={{ ...request, details: draft.details, serviceLabel: 'Bốc xếp' }} draft={draft} onEdit={vi.fn()} onHistory={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Báo giá mô phỏng' })).toBeInTheDocument()
    expect(screen.getAllByText(/4 giờ/)).toHaveLength(2)
  })
})
