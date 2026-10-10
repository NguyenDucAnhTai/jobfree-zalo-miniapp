import { useState } from 'react'
import { formatVnd, getWorkerWalletSummary } from '../../mocks/workerLifecycleAdapter'
import type { WorkerTransaction } from '../../types/workerLifecycle'

export function WorkerWallet({ transactions, onOpenTransaction }: { transactions: WorkerTransaction[]; onOpenTransaction: (transactionId: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'earning' | 'withdrawal'>('all')
  const summary = getWorkerWalletSummary(transactions)
  const visible = transactions.filter((transaction) => filter === 'all' || transaction.kind === filter)
  return <main className="worker-core-page worker-wallet-page">
    <p className="worker-core-kicker">TÀI CHÍNH MINH HỌA · DEMO</p><h1>Ví của bạn</h1>
    <section className="worker-wallet-balance"><span>Số dư khả dụng · demo</span><strong>{formatVnd(summary.available)}</strong><button type="button" disabled title="Tính năng thanh toán chưa được tích hợp">Rút tiền</button><button type="button" disabled title="Không thu thập thông tin ngân hàng trong demo">Liên kết ngân hàng</button></section>
    <section className="worker-wallet-pending"><span>Đang xử lý · minh họa</span><strong>{formatVnd(summary.pending)}</strong></section>
    <section className="worker-wallet-metrics" aria-label="Tổng quan thu nhập demo"><div><span>Thu nhập đã hoàn tất</span><strong>{formatVnd(summary.completedEarnings)}</strong></div><div><span>Việc hoàn thành</span><strong>{summary.completedJobs}</strong></div><div><span>Giao dịch</span><strong>{transactions.length}</strong></div></section>
    <div className="worker-wallet-heading"><h2>Giao dịch gần đây</h2><div className="worker-wallet-filters" role="group" aria-label="Lọc giao dịch">{([{ value: 'all', label: 'Tất cả' }, { value: 'earning', label: 'Thu nhập' }, { value: 'withdrawal', label: 'Rút tiền' }] as const).map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div></div>
    {visible.length ? <section className="worker-transaction-list" aria-label="Danh sách giao dịch demo">{visible.map((transaction) => <button key={transaction.id} className="worker-transaction-row" type="button" onClick={() => onOpenTransaction(transaction.id)}><span className={`worker-transaction-mark${transaction.kind === 'withdrawal' ? ' is-withdrawal' : ''}`} aria-hidden="true">{transaction.kind === 'earning' ? '▣' : '⌂'}</span><span className="worker-transaction-copy"><strong>{transaction.title}</strong><small>{transaction.dateLabel} · {transaction.status === 'pending' ? 'Đang xử lý' : transaction.kind === 'earning' ? 'Đã ghi nhận demo' : 'Giao dịch minh họa'}</small></span><b className={transaction.amount < 0 ? 'is-negative' : transaction.status === 'pending' ? 'is-pending' : ''}>{transaction.amount < 0 ? '−' : '+'}{formatVnd(transaction.amount)}</b></button>)}</section> : <div className="worker-core-state" role="status"><strong>Chưa có giao dịch ở mục này</strong><p>Các giao dịch được tổng hợp từ fixture demo.</p></div>}
    <p className="worker-core-disclaimer">Không có API thanh toán. Nút rút tiền và liên kết ngân hàng đang bị vô hiệu hóa.</p>
  </main>
}

export function WorkerTransactionDetail({ transaction, onBack }: { transaction: WorkerTransaction; onBack: () => void }) {
  return <main className="worker-core-page worker-transaction-detail"><button className="worker-back-button" type="button" onClick={onBack}>‹ Ví của bạn</button><p className="worker-core-kicker">GIAO DỊCH {transaction.id} · DEMO</p><h1>Chi tiết giao dịch</h1><section className="worker-core-card"><h2>{transaction.title}</h2><p>{transaction.dateLabel}</p><strong className={transaction.amount < 0 ? 'is-negative' : ''}>{transaction.amount < 0 ? '−' : '+'}{formatVnd(transaction.amount)}</strong><p>Trạng thái: {transaction.status === 'pending' ? 'Đang xử lý minh họa' : 'Ghi nhận demo'}</p><p>Mã công việc: {transaction.jobId ?? 'Không liên kết công việc'}</p><span>DEMO · NON-PRODUCTION — không có tiền thật được chuyển.</span></section></main>
}
