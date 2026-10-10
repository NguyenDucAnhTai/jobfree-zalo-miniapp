export type CompletionDecisionStatus = 'pending_confirmation' | 'confirmed_demo' | 'issue_reported_demo' | 'already_decided'
export interface EmployerCompletionDecision { id: string; requestId: string; assignmentId: string; shiftId: string; status: CompletionDecisionStatus; decidedAt: string; note: string }
export interface EmployerReview { id: string; requestId: string; assignmentId: string; stars: number; tags: string[]; feedback: string; submittedAt: string }
export type EmployerIncidentCategory = 'late_arrival' | 'no_show' | 'quality' | 'scope' | 'time' | 'property' | 'other'
export type EmployerDisputeStatus = 'submitted' | 'under_review' | 'needs_information' | 'resolved_demo' | 'closed_demo'
export interface EmployerIncident { id: string; requestId: string; assignmentId: string; category: EmployerIncidentCategory; description: string; evidenceLabel: string; submittedAt: string; disputeId: string }
export interface EmployerDisputeCase { id: string; incidentId: string; requestId: string; assignmentId: string; status: EmployerDisputeStatus; submittedAt: string; timeline: { label: string; occurredAt: string }[] }
