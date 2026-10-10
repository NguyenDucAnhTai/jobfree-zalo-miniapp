export function WorkerReadiness({ ready, onChange }: { ready: boolean; onChange: (ready: boolean) => void }) {
  return <main className="worker-core-page worker-readiness-page">
    <p className="worker-core-kicker">TRẠNG THÁI CÔNG VIỆC · DEMO</p><h1>Lịch rảnh & trạng thái</h1>
    <section className="worker-readiness-card"><span className={`worker-readiness-mark${ready ? ' is-ready' : ''}`} aria-hidden="true">{ready ? '✓' : 'Ⅱ'}</span><h2>{ready ? 'Sẵn sàng xem việc' : 'Đang tạm nghỉ'}</h2><p>{ready ? 'Bạn có thể xem danh sách cơ hội việc làm minh họa.' : 'Bật trạng thái khi bạn muốn xem các cơ hội việc làm demo.'}</p><button className="worker-core-primary" type="button" aria-pressed={ready} onClick={() => onChange(!ready)}>{ready ? 'Tạm nghỉ (demo)' : 'Bật sẵn sàng (demo)'}</button></section>
    <p className="worker-core-disclaimer">Thay đổi này chỉ ảnh hưởng giao diện demo. Không gửi trạng thái tới dịch vụ điều phối hoặc Employer.</p>
  </main>
}
