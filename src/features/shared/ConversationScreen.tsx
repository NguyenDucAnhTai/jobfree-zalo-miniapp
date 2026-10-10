import { useEffect, useRef, useState } from 'react'
import type { DemoConversationLink, DemoMessage } from '../../types/jobfreeCommunications'
import type { UiContext } from '../../types/domain'
import { appendDemoMessage, type CommunicationAuthorization } from '../../mocks/jobfreeCommunicationsAdapter'

const quickMessages = ['Tôi đang chờ tại địa điểm.', 'Bạn có thể xác nhận thời gian không?', 'Tôi cần trao đổi thêm về công việc.']
function Icon({ kind }: { kind: 'phone' | 'message' }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={kind === 'phone' ? 'M7 3h3l2 5-2 1.5a14 14 0 0 0 4.5 4.5L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 5c0-1.1.9-2 2-2Z' : 'M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.5a2.5 2.5 0 0 1-1-2Z'} /></svg> }
export function ContactActions({ onChat, onCall, label = 'Liên hệ demo theo assignment', variant = 'default', mode = 'active', helperText }: { onChat: () => void; onCall: () => void; label?: string; variant?: 'default' | 'worker'; mode?: 'active' | 'readOnly' | 'disabled'; helperText?: string }) {
  if (variant === 'worker') return <section className={`demo-contact-actions worker-contact-actions state-${mode}`} aria-label={label}>
    {mode === 'active' ? <div className="worker-contact-grid"><button type="button" onClick={onCall}><Icon kind="phone" />Gọi</button><button type="button" onClick={onChat}><Icon kind="message" />Nhắn tin</button></div> : mode === 'readOnly' ? <button className="worker-contact-readonly" type="button" onClick={onChat}><Icon kind="message" />Xem tin nhắn</button> : <p className="worker-contact-unavailable" role="note">Liên hệ không khả dụng · {helperText ?? 'Không có assignment hợp lệ trong demo.'}</p>}
    <small>{helperText ?? (mode === 'readOnly' ? 'Công việc đã kết thúc; chỉ xem được lịch sử demo.' : 'Liên hệ demo · không gọi hoặc gửi tin thật')}</small>
  </section>
  return <div className="demo-contact-actions" aria-label={label}><button type="button" onClick={onCall}><Icon kind="phone" />Gọi</button><button type="button" onClick={onChat}><Icon kind="message" />Nhắn tin</button><small>Liên hệ demo · không gọi hoặc gửi tin thật</small></div>
}

export function ConversationScreen({ link, role, messages, onMessagesChange, onBack, onCall, authorize }: { link?: DemoConversationLink; role: UiContext; messages: DemoMessage[]; onMessagesChange: (messages: DemoMessage[]) => void; onBack: () => void; onCall: () => void; authorize: (action: 'chat' | 'send_message') => CommunicationAuthorization }) {
  const [draft, setDraft] = useState('')
  const [actionError, setActionError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const access = link ? authorize('chat') : { allowed: false, readOnly: false, currentAssignmentStatus: 'none' as const, reason: 'Không có cuộc hội thoại demo được liên kết.' }
  useEffect(() => { if (typeof endRef.current?.scrollIntoView === 'function') endRef.current.scrollIntoView({ block: 'end' }) }, [messages.length])
  if (!link || !access.allowed) return <main className="e2-screen"><button className="e2-back" onClick={onBack}>‹ Quay lại</button><section className="e2-card"><h1>Tin nhắn không khả dụng</h1><p>{access.reason}</p><span className="e2-demo-tag">DEMO · NON-PRODUCTION</span></section></main>
  function send(text = draft) {
    if (!link) return
    const sendAccess = authorize('send_message')
    if (!sendAccess.allowed || sendAccess.readOnly) { setActionError(sendAccess.reason); return }
    const clean = text.trim(); if (!clean || clean.length > 500) return
    onMessagesChange(appendDemoMessage(messages, role, clean, link.conversationId)); setDraft(''); setActionError('')
  }
  return <main className="demo-chat-screen">
    <header className="demo-chat-header"><button type="button" aria-label="Quay lại" onClick={onBack}>‹</button><span className="demo-chat-avatar">{link.participantInitials}</span><div><strong>{link.participantName}</strong><small>{link.jobTitle}</small><small>{link.conversationId}</small></div><button type="button" aria-label="Cuộc gọi demo" onClick={onCall}><Icon kind="phone" /></button></header>
    <div className="demo-chat-disclaimer">HỘI THOẠI DEMO · chỉ lưu cục bộ cho ngữ cảnh {role === 'employer' ? 'người thuê' : 'người làm'} · không gửi cho người khác</div>
    <section className="demo-chat-timeline" aria-label="Tin nhắn demo"><div className="demo-chat-date">10/10/2026</div>{messages.length ? messages.map((message) => <article key={message.id} className={`demo-chat-message ${message.sender === role ? 'is-outgoing' : 'is-incoming'}`}><p>{message.text}</p><time dateTime={message.occurredAt}>{new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(message.occurredAt))}</time>{message.sender === role && message.read && <small>Đã xem · fixture demo</small>}</article>) : <div className="demo-chat-empty"><strong>Chưa có tin nhắn</strong><span>Bạn có thể gửi nội dung demo trong phiên này.</span></div>}<div ref={endRef} /></section>
    {access.readOnly ? <div className="demo-chat-readonly" role="status">Lịch sử chỉ đọc sau khi ca hoàn tất.</div> : <><div className="demo-chat-quick" aria-label="Tin nhắn nhanh">{quickMessages.map((message) => <button type="button" key={message} onClick={() => send(message)}>{message}</button>)}</div><form className="demo-chat-composer" onSubmit={(event) => { event.preventDefault(); send() }}><label className="sr-only" htmlFor="demo-message">Tin nhắn</label><textarea id="demo-message" value={draft} maxLength={500} rows={1} placeholder="Nhập tin nhắn demo" onChange={(event) => setDraft(event.target.value)} /><span>{draft.length}/500</span><button type="submit" disabled={!draft.trim()}>Gửi</button></form>{actionError && <p className="demo-chat-readonly" role="alert">{actionError}</p>}</>}
  </main>
}
