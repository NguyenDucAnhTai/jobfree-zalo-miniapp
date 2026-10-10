import type { AsyncState } from '../types/domain'

const stateCopy: Record<Exclude<AsyncState, 'success'>, { title: string; detail: string }> = {
  empty: { title: 'Chưa có dữ liệu', detail: 'Nội dung demo sẽ xuất hiện ở đây khi có thông tin.' },
  loading: { title: 'Đang tải thông tin', detail: 'Đây là trạng thái minh họa trong bản demo.' },
  error: { title: 'Chưa thể tải thông tin', detail: 'Vui lòng thử lại sau. Đây là dữ liệu demo.' },
  offline: { title: 'Bạn đang ngoại tuyến', detail: 'Bản demo cần kết nối để làm mới thông tin.' },
}

export function AsyncStateView({ state }: { state: Exclude<AsyncState, 'success'> }) {
  const copy = stateCopy[state]
  return (
    <div className="state-card" role="status" data-state={state}>
      <span className="state-dot" aria-hidden="true" />
      <div><strong>{copy.title}</strong><p>{copy.detail}</p></div>
    </div>
  )
}
