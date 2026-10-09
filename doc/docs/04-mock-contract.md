# Mock contract — JobFree-ZMP-Mock/v0

**Chỉ là contract frontend nội bộ**, không phải API thật, không mô phỏng JWT/Supabase session.

## Interface đề xuất
```ts
export type UiContext = 'employer' | 'worker';
export type AsyncState = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'offline';
export interface MockResult<T> { data: T | null; state: AsyncState; message?: string }
export interface MockJobFreeClient {
  getEmployerHome(): Promise<MockResult<EmployerHome>>;
  getServiceCatalog(): Promise<MockResult<ServiceSummary[]>>;
  getEmployerRequests(): Promise<MockResult<RequestSummary[]>>;
  getWorkerHome(): Promise<MockResult<WorkerHome>>;
  getWorkerOffers(): Promise<MockResult<OfferSummary[]>>;
  getWorkerShifts(): Promise<MockResult<ShiftSummary[]>>;
}
```

Các type `EmployerHome`, `ServiceSummary`, `RequestSummary`, `WorkerHome`, `OfferSummary`, `ShiftSummary` là placeholders để Codex định nghĩa trong project; không phải DTO backend được duyệt.

## Test fixtures
- Tách namespace fixture `employer` và `worker`, không dùng chung hồ sơ/tokens.
- ID và timestamps cố định, không random tại runtime; mock clock có thể điều khiển.
- Scenarios: populated, empty, loading, error, offline, permission-gated, stale offer.
- Role switch phải hủy/ẩn state role cũ; kiểm tra back navigation và cached lists.
- UI actions thay đổi **local mock state**; không gọi production network.
- Hiển thị `DEMO · NON-PRODUCTION`.
- Mock chỉ chứa tên/địa điểm giả định, không CCCD, sinh trắc học, số tài khoản hay thông tin người thật.

## State enums tham chiếu (v2)
WorkRequest: `draft`, `funding_pending`, `funding_failed`, `matching`, `assigned`, `replacement_matching`, `awaiting_employer_decision`, `completed`, `cancelled`.
Offer: `offered`, `accepted`, `declined`, `expired`, `withdrawn`, `superseded`.
Assignment: `active`, `replaced`, `cancelled`.
Shift: `scheduled`, `en_route`, `checked_in`, `pending_confirmation`, `completed`, `no_show`, `incident_pending`, `cancelled`.

Các enum trên phục vụ mock UI, không khẳng định API/backend đã triển khai.
Nguồn: `docs/02-workflows/lifecycle-state-machine-v2-vi.md` và `docs/06-ui/05-screen-backend-map.md`.
