export interface AnswerRequest {
  query: string
  session_id?: string
}

export interface AnswerResponse {
  answer: string
  session_id?: string | null
  sources: string[]
}

export interface UIComponentSchema {
  type: string
  props: Record<string, unknown>
}

export interface FlowStepResponse {
  session_id: string
  step_id: string
  screen_title?: string | null
  components: UIComponentSchema[]
  context_data: Record<string, unknown>
  can_go_back: boolean
  is_complete: boolean
}

export interface FlowActionRequest {
  session_id?: string
  step_id: string
  action_type: string
  payload: Record<string, unknown>
}

import type { Student } from '../types/models'

const API_BASE = 'http://localhost:8000'

export async function submitQuery(request: AnswerRequest): Promise<AnswerResponse> {
  const response = await fetch(`${API_BASE}/api/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as AnswerResponse
}

export async function fetchStudent(): Promise<Student> {
  const response = await fetch(`${API_BASE}/api/student`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as Student
}

export async function sendFlowAction(request: FlowActionRequest): Promise<FlowStepResponse> {
  const response = await fetch(`${API_BASE}/api/flow/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as FlowStepResponse
}
