import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConversationScreen } from './ConversationScreen'
import { DemoCallScreen } from './DemoCallScreen'
import { demoConversationLinks } from '../../mocks/jobfreeCommunicationsFixtures'

describe('communication demo screens', () => {
  it('renders empty conversation, appends local message and respects read-only mode', () => {
    const link = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-WORKER-002')!
    const onMessagesChange = vi.fn()
    const onBack = vi.fn()
    const onCall = vi.fn()
    const { rerender } = render(<ConversationScreen link={link} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={onBack} onCall={onCall} />)
    expect(screen.getByText('Chưa có tin nhắn')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Tin nhắn'), { target: { value: 'Nội dung an toàn demo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Gửi' }))
    expect(onMessagesChange).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ sender: 'worker', text: 'Nội dung an toàn demo' })]))
    const completed = { ...link, assignmentStatus: 'completed' as const, scenario: 'read_only' as const }
    rerender(<ConversationScreen link={completed} role="worker" messages={[]} onMessagesChange={onMessagesChange} onBack={onBack} onCall={onCall} />)
    expect(screen.getByText('Lịch sử chỉ đọc sau khi ca hoàn tất.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Gửi' })).not.toBeInTheDocument()
  })
  it('presents an unavailable call for completed assignment without requesting device capabilities', () => {
    const link = demoConversationLinks.find((item) => item.conversationId === 'JF-CHAT-EMP-0108')!
    render(<DemoCallScreen link={link} role="employer" onBack={() => undefined} />)
    expect(screen.getByText(/cuộc gọi không khả dụng/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Bắt đầu demo' })).not.toBeInTheDocument()
  })
})
