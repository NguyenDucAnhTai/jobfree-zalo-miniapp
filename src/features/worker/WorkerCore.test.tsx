import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WorkerOpportunities } from './WorkerOpportunities'
import { WorkerProfile } from './WorkerProfile'
import { WorkerReadiness } from './WorkerReadiness'
import { WorkerSkills } from './WorkerSkills'
import { workerProfileDemo, workerSkillOptions } from '../../mocks/fixtures'

describe('Worker core demo screens', () => {
  it('shows profile metrics and routes profile entries to their own screens', () => {
    const onNavigate = vi.fn()
    render(<WorkerProfile profile={workerProfileDemo} skillCount={2} onNavigate={onNavigate} />)
    expect(screen.getByText(/chưa xác thực/i)).toBeInTheDocument()
    expect(screen.getByText('92%')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /kỹ năng/i }))
    expect(onNavigate).toHaveBeenCalledWith('skills')
    fireEvent.click(screen.getByRole('button', { name: /lịch rảnh/i }))
    expect(onNavigate).toHaveBeenCalledWith('readiness')
  })

  it('filters and saves Worker skills in local demo state', () => {
    const onSave = vi.fn((ids: string[]) => ids)
    const onCancel = vi.fn()
    render(<WorkerSkills selectedIds={['moving']} onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'đóng gói' } })
    expect(screen.getByRole('button', { name: /đóng gói hàng hóa/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /hỗ trợ sự kiện/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /đóng gói hàng hóa/i }))
    expect(onSave).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /lưu kỹ năng demo/i }))
    expect(onSave).toHaveBeenCalledWith(['moving', 'packing'])
    fireEvent.click(screen.getByRole('button', { name: /tài khoản/i }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(workerSkillOptions.length).toBeGreaterThan(0)
  })

  it('toggles availability with an explicit demo-only action', () => {
    const onChange = vi.fn()
    render(<WorkerReadiness ready onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /tạm nghỉ/i }))
    expect(onChange).toHaveBeenCalledWith(false)
    expect(screen.getByText(/không gửi trạng thái/i)).toBeInTheDocument()
  })

  it('filters opportunities and exposes empty, loading, error and offline states', () => {
    const onSelect = vi.fn()
    const onNavigate = vi.fn()
    const { rerender } = render(<WorkerOpportunities onSelect={onSelect} onNavigate={onNavigate} />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'Nhận ngay' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.click(within(screen.getByRole('article')).getByRole('button', { name: 'Xem chi tiết' }))
    expect(onSelect).toHaveBeenCalledWith('demo-worker-home-job-01')
    expect(onNavigate).toHaveBeenCalledWith('opportunityDetail')
    const select = screen.getByLabelText(/trạng thái giao diện demo/i)
    for (const [state, label] of [['empty', /chưa có việc mới/i], ['loading', /đang tải cơ hội/i], ['error', /chưa thể hiển thị/i], ['offline', /đang ngoại tuyến/i]] as const) {
      fireEvent.change(select, { target: { value: state } })
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    rerender(<WorkerOpportunities onSelect={onSelect} onNavigate={onNavigate} />)
  })
})
