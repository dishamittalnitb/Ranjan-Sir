import { cx } from '../lib/cx'
import { Icon } from './Icon'
import type { CalendarCell } from '../types/models'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarGridProps {
  month?: string
  monthLabel?: string
  cells: CalendarCell[]
  onPrev?: () => void
  onNext?: () => void
}

export function CalendarGrid({ month = 'February 2026', monthLabel = 'Feb 2026', cells, onPrev, onNext }: CalendarGridProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 md:p-8 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <span className="text-xs uppercase text-secondary tracking-wider font-semibold">Cadence</span>
          <h3 className="text-xl font-semibold text-on-surface">{month}</h3>
        </div>
        <div className="flex items-center border border-outline-variant/60 rounded-lg p-0.5 bg-surface-container-lowest">
          <button onClick={onPrev} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant transition-colors" title="Previous Month">
            <Icon name="chevron_left" className="text-[18px]" />
          </button>
          <span className="px-3 text-xs text-on-surface font-medium select-none">{monthLabel}</span>
          <button onClick={onNext} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-low text-on-surface-variant transition-colors" title="Next Month">
            <Icon name="chevron_right" className="text-[18px]" />
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] flex flex-col gap-2">
          <div className="grid grid-cols-7 gap-2 text-center pb-1">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-xs font-semibold text-secondary uppercase">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={cx(
                  'h-20 p-2 rounded-lg flex flex-col justify-between transition-all',
                  cell.today
                    ? 'bg-primary text-on-primary border-2 border-primary ring-2 ring-primary/20 shadow'
                    : cell.rest
                      ? 'bg-surface-container-low border border-outline-variant/60'
                      : 'bg-emerald-50/80 border border-emerald-300',
                )}
              >
                <div className="flex justify-between items-center">
                  <span className={cx('text-xs font-bold', cell.today ? 'text-on-primary' : 'text-emerald-950')}>{cell.day}</span>
                  <span className={cx('text-[10px] font-mono font-bold', cell.today ? 'text-emerald-300' : 'text-emerald-800')}>{cell.time}</span>
                </div>
                <div className={cx('w-full rounded-full h-1 overflow-hidden my-1', cell.today ? 'bg-white/30' : 'bg-emerald-200')}>
                  <div className={cx('h-full rounded-full', cell.today ? 'bg-emerald-400' : 'bg-emerald-600')} style={{ width: cell.rest ? '0%' : '80%' }} />
                </div>
                <div className="flex flex-col truncate">
                  <span className={cx('text-[9px] uppercase font-bold truncate', cell.today ? 'text-emerald-300' : cell.rest ? 'text-secondary' : 'text-emerald-900')}>
                    {cell.rest ? 'Planned Rest' : cell.done ? 'Completed' : 'Scheduled'}
                  </span>
                  <span className={cx('text-[10px] truncate', cell.today ? 'text-white/80' : 'text-emerald-700')}>{cell.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
