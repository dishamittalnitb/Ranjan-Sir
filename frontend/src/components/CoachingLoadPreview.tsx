import { cx } from '../lib/cx'
import type { CoachingDay } from '../types/models'

interface CoachingLoadPreviewProps {
  days: CoachingDay[]
}

export function CoachingLoadPreview({ days }: CoachingLoadPreviewProps) {
  return (
    <div className="w-full max-w-lg bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider font-mono">Weekly Coaching Load</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50/60 border border-amber-200/70 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Today: Peak Day (7.5h)
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5 text-left">
        {days.map((d) => (
          <div key={d.day} className={cx('rounded-lg p-2.5', d.heavy ? 'bg-white border-2 border-slate-900 relative' : 'bg-white border border-slate-200/70')}>
            <div className={cx('flex items-center justify-between text-[11px] font-mono mb-1', d.heavy ? 'text-slate-900 font-semibold' : 'text-slate-500')}>
              <span>{d.day}</span>
              <span className={d.heavy ? 'text-[10px] text-amber-800 font-sans font-medium' : 'text-slate-400'}>{d.label}</span>
            </div>
            <div className={cx('text-xs mb-1', d.heavy ? 'font-bold text-slate-950' : 'font-semibold text-slate-800')}>{d.hours}</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className={cx('h-1.5 rounded-full', d.heavy ? 'bg-slate-950' : 'bg-slate-400')} style={{ width: d.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
