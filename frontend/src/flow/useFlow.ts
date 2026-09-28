import { useCallback, useEffect, useRef, useState } from 'react'
import { sendFlowAction, type FlowStepResponse, type UIComponentSchema } from '../services/api'

export interface FlowState {
  sessionId: string | null
  stepId: string | null
  screenTitle: string | null
  components: UIComponentSchema[]
  canGoBack: boolean
  isComplete: boolean
  loading: boolean
  error: string | null
}

const INITIAL: FlowState = {
  sessionId: null,
  stepId: null,
  screenTitle: null,
  components: [],
  canGoBack: false,
  isComplete: false,
  loading: false,
  error: null,
}

export function useFlow() {
  const [flow, setFlow] = useState<FlowState>(INITIAL)
  const flowRef = useRef(flow)
  const startedRef = useRef(false)
  flowRef.current = flow

  const sendAction = useCallback(async (actionType: string, payload: Record<string, unknown> = {}) => {
    const current = flowRef.current
    setFlow((s) => ({ ...s, loading: true, error: null }))
    try {
      const res: FlowStepResponse = await sendFlowAction({
        session_id: current.sessionId ?? undefined,
        step_id: current.stepId ?? 'initial_prompt',
        action_type: actionType,
        payload,
      })
      setFlow({
        sessionId: res.session_id,
        stepId: res.step_id,
        screenTitle: res.screen_title ?? null,
        components: res.components,
        canGoBack: res.can_go_back,
        isComplete: res.is_complete,
        loading: false,
        error: null,
      })
    } catch (err) {
      setFlow((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : 'Something went wrong' }))
    }
  }, [])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    void sendAction('RESET')
  }, [sendAction])

  return { flow, sendAction }
}
