import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { employerRequestScenarios } from '../../mocks/employerRequestAdapter'
import { createEmployerExtensionRequest } from '../../mocks/employerLifecycleAdapter'
import { employerAssignmentViews, employerShiftTrackingFixtures } from '../../mocks/employerLifecycleFixtures'
import { EmployerRequestDetail } from './EmployerLifecycleScreens'

const noops = { onBack: () => undefined, onSelectScenario: () => undefined }

describe('Employer E1 lifecycle demo', () => {
  it('shows controlled matching states without exposing selectable Worker candidates', () => {
    render(<EmployerRequestDetail request={employerRequestScenarios.find((item) => item.status === 'matching')!} {...noops} />)
    expect(screen.getByRole('status')).toHaveTextContent('Đang tìm người làm phù hợp')
    expect(screen.getByRole('combobox', { name: 'Tình huống matching demo' })).toBeInTheDocument()
    expect(screen.getByText(/không có danh sách ứng viên để chọn/i)).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Tình huống matching demo' }), { target: { value: 'awaiting' } })
    expect(screen.getByRole('status')).toHaveTextContent('Đang chờ kết quả ghép')
    fireEvent.change(screen.getByRole('combobox', { name: 'Tình huống matching demo' }), { target: { value: 'empty' } })
    expect(screen.getByRole('status')).toHaveTextContent('Chưa tìm thấy người làm phù hợp')
    fireEvent.change(screen.getByRole('combobox', { name: 'Tình huống matching demo' }), { target: { value: 'unavailable' } })
    expect(screen.getByRole('status')).toHaveTextContent('Tạm thời chưa thể hiển thị kết quả')
  })

  it('shows only linked synthetic assigned Worker detail and never marks a replaced Worker active', () => {
    const assigned = employerRequestScenarios.find((item) => item.id === 'JF-DEMO-0105')!
    const { rerender } = render(<EmployerRequestDetail request={assigned} {...noops} />)
    expect(screen.getByText('Người làm demo An N.')).toBeInTheDocument()
    expect(screen.getByText(/4\.9 · 28 việc demo/)).toBeInTheDocument()
    expect(screen.getByText('Worker đã ghép · DEMO')).toBeInTheDocument()

    const replaced = employerRequestScenarios.find((item) => item.status === 'replacement_matching')!
    rerender(<EmployerRequestDetail request={replaced} {...noops} />)
    expect(screen.getByText('Worker cũ · assignment đã kết thúc')).toBeInTheDocument()
    expect(screen.queryByText('Worker đã ghép · DEMO')).not.toBeInTheDocument()
    expect(screen.getByText('Đang tìm người làm mới')).toBeInTheDocument()
  })

  it('uses explicit linked IDs and chronological shift events while preserving scheduled times', () => {
    expect(employerAssignmentViews.map((item) => item.requestId)).toEqual(employerShiftTrackingFixtures.map((item) => item.requestId))
    for (const tracking of employerShiftTrackingFixtures) {
      expect(tracking.assignmentId).toBe(employerAssignmentViews.find((item) => item.requestId === tracking.requestId)?.assignmentId)
      expect(tracking.shiftId).toBe(employerAssignmentViews.find((item) => item.requestId === tracking.requestId)?.shiftId)
      expect(tracking.events.every((item, index, events) => index === 0 || Date.parse(events[index - 1].occurredAt) <= Date.parse(item.occurredAt))).toBe(true)
      expect(Date.parse(tracking.scheduledEndAt)).toBeGreaterThan(Date.parse(tracking.scheduledStartAt))
    }
    render(<EmployerRequestDetail request={employerRequestScenarios.find((item) => item.id === 'JF-DEMO-0105')!} {...noops} />)
    expect(screen.getByRole('heading', { name: 'Trạng thái ca' })).toBeInTheDocument()
    expect(screen.getByText('Đang làm việc (demo)')).toBeInTheDocument()
    expect(screen.getByText('Ca đang thực hiện')).toBeInTheDocument()
  })

  it.each([
    [30, '2026-10-10T11:30:00.000Z', 25_000],
    [60, '2026-10-10T12:00:00.000Z', 50_000],
    [120, '2026-10-10T13:00:00.000Z', 100_000],
  ] as const)('creates +%s minute proposal without changing the original schedule', (minutes, expectedEnd, expectedFee) => {
    const tracking = employerShiftTrackingFixtures[0]
    const result = createEmployerExtensionRequest(tracking, minutes)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.request.proposedEndAt).toBe(expectedEnd)
    expect(result.request.referenceFee).toBe(expectedFee)
    expect(result.request.effectiveEndAt).toBeUndefined()
    expect(tracking.scheduledEndAt).toBe('2026-10-10T18:00:00+07:00')
  })

  it('handles crossing midnight and only approved demo outcome exposes adjusted effective time', () => {
    const tracking = { ...employerShiftTrackingFixtures[0], scheduledEndAt: '2026-10-10T23:45:00+07:00', effectiveEndAt: '2026-10-10T23:45:00+07:00' }
    const pending = createEmployerExtensionRequest(tracking, 30, 'pending')
    expect(pending.ok && pending.request.proposedEndAt).toBe('2026-10-10T17:15:00.000Z')
    expect(pending.ok && pending.request.effectiveEndAt).toBeUndefined()
    const approved = createEmployerExtensionRequest(tracking, 30, 'approved_demo')
    expect(approved.ok && approved.request.effectiveEndAt).toBe('2026-10-10T17:15:00.000Z')
    expect(tracking.scheduledEndAt).toContain('23:45')
  })

  it('assigns unique deterministic IDs and chains a later extension from the prior approved demo end', () => {
    const tracking = employerShiftTrackingFixtures[0]
    const first = createEmployerExtensionRequest(tracking, 30, 'approved_demo')
    expect(first.ok).toBe(true)
    if (!first.ok) return
    const second = createEmployerExtensionRequest(tracking, 30, 'approved_demo', [first.request])
    expect(second.ok).toBe(true)
    if (!second.ok) return
    expect(second.request.id).not.toBe(first.request.id)
    expect(second.request.id).toContain(tracking.requestId)
    expect(second.request.requestId).toBe(tracking.requestId)
    expect(second.request.assignmentId).toBe(tracking.assignmentId)
    expect(second.request.shiftId).toBe(tracking.shiftId)
    expect(second.request.originalEndAt).toBe(tracking.scheduledEndAt)
    expect(second.request.proposedEndAt).toBe('2026-10-10T12:00:00.000Z')
    expect(second.request.effectiveEndAt).toBe(second.request.proposedEndAt)
    expect(tracking.effectiveEndAt).toBe(tracking.scheduledEndAt)
  })

  it('blocks invalid and duplicate pending extensions', () => {
    const tracking = employerShiftTrackingFixtures[0]
    expect(createEmployerExtensionRequest(tracking, 45).ok).toBe(false)
    expect(createEmployerExtensionRequest({ ...tracking, shiftStatus: 'completed' }, 30).ok).toBe(false)
    const pending = createEmployerExtensionRequest(tracking, 30, 'pending')
    expect(pending.ok).toBe(true)
    if (pending.ok) expect(createEmployerExtensionRequest(tracking, 60, 'submitted', [pending.request])).toMatchObject({ ok: false, reason: 'duplicate_pending' })
  })

  it('submits a demo extension without changing schedule and differentiates approved fixture result', () => {
    const request = employerRequestScenarios.find((item) => item.id === 'JF-DEMO-0105')!
    const { unmount } = render(<EmployerRequestDetail request={request} {...noops} />)
    fireEvent.click(screen.getByRole('button', { name: /đề nghị gia hạn ca/i }))
    fireEvent.click(screen.getByRole('radio', { name: '+30 phút' }))
    fireEvent.click(screen.getByRole('button', { name: 'Gửi đề nghị demo' }))
    expect(screen.getByRole('status')).toHaveTextContent('Đã ghi nhận lựa chọn trong phiên demo')
    expect(screen.getByText(/Giờ kết thúc gốc: 18:00 · đề xuất: 18:30/)).toBeInTheDocument()
    expect(employerShiftTrackingFixtures[0].scheduledEndAt).toBe('2026-10-10T18:00:00+07:00')

    unmount()
    const approvedView = render(<EmployerRequestDetail request={request} {...noops} />)
    fireEvent.click(screen.getByRole('button', { name: /đề nghị gia hạn ca/i }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Kết quả extension demo' }), { target: { value: 'approved_demo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi đề nghị demo' }))
    expect(screen.getByRole('status')).toHaveTextContent('Kịch bản demo được duyệt')
    expect(screen.getByText(/hiệu lực demo: 18:30/)).toBeInTheDocument()
    approvedView.rerender(<EmployerRequestDetail key="JF-DEMO-0107" request={employerRequestScenarios.find((item) => item.id === 'JF-DEMO-0107')!} {...noops} />)
    expect(screen.queryByText(/hiệu lực demo: 18:30/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /đề nghị gia hạn ca/i })).not.toBeInTheDocument()
  })

  it('traps keyboard focus in the extension modal, closes on Escape, and restores trigger focus', () => {
    render(<EmployerRequestDetail request={employerRequestScenarios.find((item) => item.id === 'JF-DEMO-0105')!} {...noops} />)
    const trigger = screen.getByRole('button', { name: /đề nghị gia hạn ca/i })
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Gia hạn ca làm' })
    const close = screen.getByRole('button', { name: 'Đóng' })
    expect(close).toHaveFocus()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Gửi đề nghị demo' })).toHaveFocus()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
