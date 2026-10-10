import type { EmployerRequestDraft, EmployerRequestDraftErrors } from '../../types/domain'

const demoDate = '2026-10-09'

export function validateEmployerDraft(draft: EmployerRequestDraft): EmployerRequestDraftErrors {
  const errors: EmployerRequestDraftErrors = {}
  if (!draft.serviceId) errors.serviceId = 'Vui lòng chọn dịch vụ.'
  if (draft.details.trim().length < 10) errors.details = 'Mô tả cần ít nhất 10 ký tự.'
  if (draft.location.trim().length < 5) errors.location = 'Nhập địa điểm demo cụ thể hơn.'
  if (!draft.date || draft.date < demoDate) errors.date = 'Chọn ngày từ 09/10/2026 trở đi.'
  if (!draft.startTime || !draft.endTime || draft.endTime <= draft.startTime) errors.time = 'Giờ kết thúc phải sau giờ bắt đầu.'
  return errors
}
