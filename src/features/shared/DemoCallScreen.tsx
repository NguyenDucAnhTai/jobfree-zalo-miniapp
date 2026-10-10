import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoCallStatus, DemoConversationLink } from '../../types/jobfreeCommunications'
import type { UiContext } from '../../types/domain'
import type { CommunicationAuthorization } from '../../mocks/jobfreeCommunicationsAdapter'
export function DemoCallScreen({ link, role, onBack, authorize }: { link?: DemoConversationLink; role: UiContext; onBack: () => void; authorize: () => CommunicationAuthorization }) {
  const [storedStatus, setStoredStatus] = useState<DemoCallStatus>('idle')
  const [statusIdentity, setStatusIdentity] = useState('')
  const timers = useRef<number[]>([])
  const attempt = useRef(0)
  const identity = `${role}:${link?.conversationId ?? 'none'}:${link?.assignmentId ?? 'none'}`
  const access = link ? authorize() : { allowed: false, readOnly: false, currentAssignmentStatus: 'none' as const, reason: 'Không có assignment demo được liên kết.' }
  const status = !access.allowed ? 'unavailable' : statusIdentity === identity ? storedStatus : 'idle'
  const clearTimers = useCallback(() => { timers.current.forEach((timer) => window.clearTimeout(timer)); timers.current = [] }, [])

  useEffect(() => {
    clearTimers()
    attempt.current += 1
    return () => { clearTimers(); attempt.current += 1 }
  }, [identity, clearTimers])

  useEffect(() => {
    if (access.allowed) return
    clearTimers()
    const thisAttempt = ++attempt.current
    const timer = window.setTimeout(() => {
      if (attempt.current === thisAttempt) setStoredStatus('unavailable')
    }, 0)
    timers.current = [timer]
  }, [access.allowed, clearTimers, identity])

  function start() {
    const fresh = authorize()
    if (!fresh.allowed || fresh.currentAssignmentStatus !== 'active') return
    clearTimers()
    const thisAttempt = ++attempt.current
    setStatusIdentity(identity)
    setStoredStatus('dialing_demo')
    const toConnecting = window.setTimeout(() => {
      if (attempt.current !== thisAttempt) return
      const current = authorize()
      if (!current.allowed || current.currentAssignmentStatus !== 'active') return
      setStoredStatus('connecting_demo')
    }, 300)
    const toConnected = window.setTimeout(() => {
      if (attempt.current !== thisAttempt) return
      const current = authorize()
      if (!current.allowed || current.currentAssignmentStatus !== 'active') return
      setStoredStatus('connected_demo')
    }, 700)
    timers.current = [toConnecting, toConnected]
  }

  function end() {
    clearTimers()
    attempt.current += 1
    setStatusIdentity(identity)
    setStoredStatus('ended')
  }

  return <main className="demo-call-screen"><button className="e2-back" type="button" onClick={onBack}>‹ Quay lại</button><span className="e2-demo-tag">CUỘC GỌI DEMO · KHÔNG KẾT NỐI THẬT</span><span className="demo-call-avatar">{link?.participantInitials ?? '?'}</span><h1>{link?.participantName ?? 'Không khả dụng'}</h1><p>{link?.jobTitle} · {link?.assignmentId}</p><strong role="status">{access.allowed ? status === 'idle' ? 'Sẵn sàng mô phỏng' : status === 'dialing_demo' ? 'Đang gọi demo…' : status === 'connecting_demo' ? 'Đang kết nối demo…' : status === 'connected_demo' ? 'Đã kết nối demo (giao diện)' : status === 'ended' ? 'Cuộc gọi demo đã kết thúc' : access.reason : access.reason}</strong><p className="e2-disclaimer">Không dùng microphone, số điện thoại, WebRTC, Zalo API hoặc telephony. Trạng thái chỉ đổi trong giao diện này.</p>{access.allowed && <div className="demo-call-actions">{(status === 'idle' || status === 'ended' || status === 'unavailable') ? <button type="button" onClick={start}>Bắt đầu demo</button> : <button type="button" className="is-end" onClick={end}>Kết thúc demo</button>}</div>}</main>
}
