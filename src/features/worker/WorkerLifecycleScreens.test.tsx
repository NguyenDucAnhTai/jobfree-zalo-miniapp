import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WorkerJobs } from './WorkerJobs'
import { WorkerNewJobModal } from './WorkerNewJobModal'
import { WorkerOfferDetail } from './WorkerOfferDetail'
import { WorkerSchedule } from './WorkerSchedule'
import { WorkerShiftDetail } from './WorkerShiftDetail'
import { WorkerWallet } from './WorkerWallet'
import { getWorkerJobs, getWorkerTransactions, getWorkerWalletSummary } from '../../mocks/workerLifecycleAdapter'
import { decideWorkerOffer } from '../../mocks/workerLifecycleAdapter'
import { initialWorkerAssignments, initialWorkerShifts, workerOffers, workerWalletTransactions } from '../../mocks/workerLifecycleFixtures'

describe('Worker lifecycle screens', () => {
  it('shows offer detail for the selected offer and exposes a stale outcome', () => {
    const onDecision = vi.fn((_, scenario) => decideWorkerOffer(workerOffers[1], 'accept', scenario, []))
    render(<WorkerOfferDetail offer={workerOffers[1]} status="offered" onBack={vi.fn()} onDecision={onDecision} onAccepted={vi.fn()} />)
    expect(screen.getByText(new RegExp(workerOffers[1].id))).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/kịch bản quyết định demo/i), { target: { value: 'expired' } })
    fireEvent.click(screen.getByRole('button', { name: /nhận việc demo/i }))
    expect(screen.getByText(/offer demo đã hết hạn/i)).toBeInTheDocument()
    expect(onDecision).toHaveBeenCalledWith('accept', 'expired')
  })

  it('supports modal close and shows a labeled modal title', () => {
    const onClose = vi.fn()
    render(<WorkerNewJobModal offer={workerOffers[0]} status="offered" resultMessage="" onClose={onClose} onViewDetails={vi.fn()} onDecision={() => decideWorkerOffer(workerOffers[0], 'accept', 'success', [])} />)
    expect(screen.getByRole('dialog', { name: 'Công việc mới cho bạn' })).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('filters My Jobs and opens the selected shift detail', () => {
    const jobs = getWorkerJobs(initialWorkerAssignments, initialWorkerShifts)
    const onOpenShift = vi.fn()
    render(<WorkerJobs jobs={jobs} onOpenShift={onOpenShift} />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'Chờ xác nhận' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Xem chi tiết ca' }))
    expect(onOpenShift).toHaveBeenCalledWith('demo-shift-002')
  })

  it('shows the same selected date shift on Schedule and Shift Detail', () => {
    const onOpenShift = vi.fn()
    render(<WorkerSchedule shifts={initialWorkerShifts} onOpenShift={onOpenShift} />)
    fireEvent.click(screen.getByText('11').closest('button')!)
    expect(screen.getByText('Đóng gói đơn livestream')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /đóng gói đơn livestream/i }))
    expect(onOpenShift).toHaveBeenCalledWith('demo-shift-002')

    const onTransition = vi.fn()
    const { unmount } = render(<WorkerShiftDetail shift={initialWorkerShifts[0]} onBack={vi.fn()} onTransition={onTransition} />)
    fireEvent.click(screen.getByRole('button', { name: /mô phỏng bắt đầu di chuyển/i }))
    expect(onTransition).toHaveBeenCalledWith('en_route')
    unmount()
  })

  it('derives wallet balances from transactions and keeps financial actions disabled', () => {
    const transactions = getWorkerTransactions(initialWorkerShifts, workerWalletTransactions)
    const summary = getWorkerWalletSummary(transactions)
    const onOpenTransaction = vi.fn()
    render(<WorkerWallet transactions={transactions} onOpenTransaction={onOpenTransaction} />)
    expect(screen.getByText(new Intl.NumberFormat('vi-VN').format(summary.available) + 'đ')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Rút tiền' })[0]).toBeDisabled()
    expect(screen.getByRole('button', { name: /liên kết ngân hàng/i })).toBeDisabled()
    fireEvent.click(within(screen.getByRole('button', { name: /đóng gói đơn/i })).getByText(/đóng gói đơn/i))
    expect(onOpenTransaction).toHaveBeenCalledWith('demo-transaction-demo-shift-003')
  })
})
