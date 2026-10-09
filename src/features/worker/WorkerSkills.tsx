import { useMemo, useState } from 'react'
import { workerSkillOptions } from '../../mocks/fixtures'

export function WorkerSkills({ selectedIds, onChange, onSave }: {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  onSave: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => workerSkillOptions.filter((skill) => skill.label.toLowerCase().includes(query.toLowerCase()) || skill.group.toLowerCase().includes(query.toLowerCase())), [query])
  const groups = [...new Set(filtered.map((item) => item.group))]
  function toggle(id: string) { onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]) }
  return <main className="worker-core-page worker-skills-page">
    <button className="worker-back-button" type="button" onClick={onSave}>‹ Tài khoản</button>
    <p className="worker-core-kicker">HỒ SƠ NGHỀ NGHIỆP · DEMO</p><h1>Kỹ năng của bạn</h1>
    <section className="worker-core-card"><h2>Kỹ năng đã chọn</h2><div className="worker-skill-chips">{selectedIds.length ? selectedIds.map((id) => workerSkillOptions.find((skill) => skill.id === id)).filter((skill) => skill !== undefined).map((skill) => <button type="button" key={skill.id} aria-label={`Bỏ ${skill.label}`} onClick={() => toggle(skill.id)}>{skill.label} ×</button>) : <p>Chưa chọn kỹ năng nào.</p>}</div></section>
    <label className="worker-skill-search"><span>Tìm kỹ năng</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: đóng gói" /></label>
    {groups.map((group) => <section className="worker-skill-group" key={group}><h2>{group}</h2><div>{filtered.filter((skill) => skill.group === group).map((skill) => <button type="button" key={skill.id} className={`worker-skill-option${selectedIds.includes(skill.id) ? ' is-selected' : ''}`} aria-pressed={selectedIds.includes(skill.id)} onClick={() => toggle(skill.id)}><span>{selectedIds.includes(skill.id) ? '✓' : '+'}</span>{skill.label}</button>)}</div></section>)}
    <section className="worker-core-card worker-certificate-note"><h2>Chứng chỉ</h2><p>Chứng chỉ chỉ là mục xem trước. Chưa tải lên hoặc thẩm định tài liệu.</p></section>
    <button className="worker-core-primary" type="button" onClick={onSave}>Lưu kỹ năng demo</button>
    <p className="worker-core-disclaimer">DEMO · NON-PRODUCTION. Thay đổi chỉ lưu trong phiên xem thử hiện tại.</p>
  </main>
}
