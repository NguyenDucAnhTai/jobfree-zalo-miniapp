import { useState } from 'react'
import { workerDateLabel } from '../../utils/workerDate'
import { workerShiftStatusLabels } from '../../utils/workerShiftLabels'
import type { WorkerShift } from '../../types/workerLifecycle'

const calendarDays = ['2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14']

export function WorkerSchedule({ shifts, onOpenShift }: { shifts: WorkerShift[]; onOpenShift: (shiftId: string) => void }) {
  const [selected, setSelected] = useState('2026-10-10')
  const dayShifts = shifts.filter((shift) => shift.dateKey === selected)
  return <main className="worker-core-page worker-schedule-page">
    <p className="worker-core-kicker">THỜI GIAN LÀM VIỆC · DEMO</p><h1>Lịch trình</h1><p className="worker-schedule-intro">Quản lý thời gian rảnh và xem các ca làm minh họa.</p>
    <section className="worker-calendar-card" aria-label="Chọn ngày trong tháng 10 năm 2026"><div className="worker-calendar-heading"><strong>Tháng 10, 2026</strong><span aria-hidden="true">▦</span></div><div className="worker-calendar-days">{calendarDays.map((dateKey) => { const date = workerDateLabel(dateKey); return <button key={dateKey} type="button" aria-pressed={selected === dateKey} onClick={() => setSelected(dateKey)}><span>{date.weekday}</span><strong>{date.day}</strong></button> })}</div></section>
    <h2 className="worker-schedule-section-title">{selected === '2026-10-10' ? 'Ca ngày 10/10' : `Ca ngày ${selected.split('-').reverse().join('/')}`}</h2>
    {dayShifts.length ? <section className="worker-schedule-list" aria-label="Ca làm trong ngày">{dayShifts.map((shift) => <button className="worker-schedule-card" key={shift.id} type="button" onClick={() => onOpenShift(shift.id)}><span className="worker-schedule-icon" aria-hidden="true">▦</span><span className="worker-schedule-copy"><strong>{shift.schedule}</strong><b>{shift.title}</b><small>{shift.location}</small><em>{workerShiftStatusLabels[shift.status]}</em></span><span className="worker-schedule-pay">{formatMoney(shift.pay)}</span></button>)}</section> : <div className="worker-core-state" role="status"><span aria-hidden="true">▢</span><strong>Chưa có ca trong ngày này</strong><p>Lịch sử dụng ngày và dữ liệu cố định của bản demo.</p></div>}
    <p className="worker-core-disclaimer">Lịch và Việc của tôi dùng chung fixture ca làm. Không đồng bộ lịch thật.</p>
  </main>
}

function formatMoney(amount: number) { return `${new Intl.NumberFormat('vi-VN').format(amount)}đ` }
