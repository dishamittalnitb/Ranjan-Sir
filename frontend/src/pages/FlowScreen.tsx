import { Icon } from '../components/Icon'
import { DynamicRenderer } from '../flow/DynamicRenderer'
import { useFlow } from '../flow/useFlow'

export default function FlowScreen() {
  const { flow, sendAction } = useFlow()

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface custom-scroll">
      <div className="w-full px-6 py-8 flex flex-col gap-6">
        {flow.screenTitle && flow.stepId !== 'initial_prompt' && (
          <div className="text-[11px] font-mono uppercase tracking-wider text-secondary text-center">{flow.screenTitle}</div>
        )}

        <DynamicRenderer components={flow.components} onAction={sendAction} />

        {flow.loading && (
          <div className="flex items-center justify-center gap-2 text-xs text-secondary font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ranjan Sir is composing…
          </div>
        )}

        {flow.error && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-error/40 bg-error-container/40 text-on-error-container text-xs px-3 py-2.5 max-w-3xl mx-auto w-full">
            <span className="flex items-center gap-2">
              <Icon name="error" className="text-base text-error" />
              {flow.error}
            </span>
          </div>
        )}

        {flow.canGoBack && !flow.loading && (
          <button onClick={() => sendAction('BACK')} className="self-center text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
            <Icon name="arrow_back" className="text-sm" />
            Back
          </button>
        )}
      </div>
    </div>
  )
}
