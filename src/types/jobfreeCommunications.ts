import type { UiContext } from './domain'

export type DemoAssignmentStatus = 'active' | 'replaced' | 'cancelled' | 'completed' | 'none'
export type CommunicationScenario = 'populated' | 'empty' | 'unavailable' | 'read_only' | 'blocked'
export type DemoCallStatus = 'idle' | 'dialing_demo' | 'connecting_demo' | 'connected_demo' | 'unavailable' | 'ended'
export interface DemoConversationLink {
  conversationId: string
  role: UiContext
  requestId: string
  jobId: string
  assignmentId: string
  shiftId: string
  assignmentStatus: DemoAssignmentStatus
  participantName: string
  participantInitials: string
  jobTitle: string
  scenario: CommunicationScenario
}
export interface DemoMessage {
  id: string
  sender: 'participant' | UiContext
  text: string
  occurredAt: string
  read?: boolean
}
export interface DemoCallScenario {
  status: DemoCallStatus
  message: string
}
