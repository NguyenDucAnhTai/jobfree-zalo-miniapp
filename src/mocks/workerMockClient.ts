import type { AsyncState, WorkerOpportunity } from '../types/domain'
import { workerOpportunities } from './fixtures'

export interface WorkerOpportunityResult {
  state: AsyncState
  items: WorkerOpportunity[]
}

/** Deterministic local adapter. It never reads location or calls a service. */
export function getWorkerOpportunityMock(state: AsyncState = 'success'): WorkerOpportunityResult {
  return { state, items: state === 'success' ? workerOpportunities : [] }
}
