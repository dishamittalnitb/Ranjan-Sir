import { Icon } from './Icon'

interface TopBarProps {
  onToggleDoubt?: () => void
  queryText?: string
  showDoubtBtn?: boolean
}

export function TopBar({ onToggleDoubt, queryText = 'what to do today', showDoubtBtn = true }: TopBarProps) {
  return (
    <header className="h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 select-none z-20">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">Evening Session Calibrated</span>
          {queryText && (
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono">
              <span className="text-slate-400">Query:</span> &quot;{queryText}&quot;
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {showDoubtBtn && onToggleDoubt && (
          <button
            onClick={onToggleDoubt}
            className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition shadow-xs"
          >
            <Icon name="help" className="text-[15px] text-teal-600" />
            <span>Doubt Panel</span>
          </button>
        )}
      </div>
    </header>
  )
}
