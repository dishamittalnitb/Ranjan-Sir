import { cx } from '../lib/cx'
import { Icon } from './Icon'
import type { QuestStage, QuestStageStatus } from '../types/models'

interface QuestTimelineProps {
  stages: QuestStage[]
  onEngage?: () => void
  onInspectFork?: () => void
}

function markerName(status: QuestStageStatus): string {
  switch (status) {
    case 'completed':
      return 'check'
    case 'in-progress':
      return 'play_arrow'
    case 'goal':
      return 'flag'
    default:
      return 'lock'
  }
}

export function QuestTimeline({ stages, onEngage, onInspectFork }: QuestTimelineProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
      <div className="space-y-6 relative z-10">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed'
          const isActive = stage.status === 'in-progress'
          const isLocked = stage.status === 'locked' || stage.status === 'goal'

          return (
            <div key={stage.order} className={cx('flex items-start gap-4', isLocked && 'opacity-70')}>
              <div
                className={cx(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                  isCompleted
                    ? 'bg-emerald-50 border-2 border-emerald-500/80 text-emerald-600'
                    : isActive
                      ? 'bg-slate-900 border-2 border-slate-900 text-white shadow-md'
                      : 'bg-slate-100 border border-slate-200 text-slate-400',
                )}
              >
                <Icon name={markerName(stage.status)} className={cx('text-xl font-bold', isActive && 'animate-pulse')} />
              </div>

              <div className="flex-1 space-y-3">
                <div className={cx('bg-white rounded-xl p-5', isActive ? 'border-2 border-slate-900 shadow-xs' : 'border border-slate-200 shadow-xs')}>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className={cx('font-mono text-xs font-bold', isActive ? 'text-slate-900' : 'text-slate-400')}>{stage.order}</span>
                      <span
                        className={cx(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                          isActive ? 'bg-slate-900 text-white' : isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {stage.meta}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-xs font-mono text-emerald-600 flex items-center gap-1">
                        <Icon name="sensors" className="text-sm" /> Live Sync Active
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-base font-semibold text-slate-900">{stage.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-xl">{stage.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {stage.time && <span className="text-xs text-slate-600 font-mono">{stage.time}</span>}
                    {stage.subtime && <span className="text-xs text-slate-400 font-mono">{stage.subtime}</span>}
                    {stage.target && <span className="text-xs text-slate-600">{stage.target}</span>}
                    {isActive && onEngage && (
                      <button
                        onClick={onEngage}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span>Engage Problem Set</span>
                        <Icon name="arrow_forward" className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                {isActive && stage.remedial && (
                  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Icon name="call_split" className="text-sm text-slate-600" />
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">Adaptive Remedial Fork:</span>
                        <span className="ml-1 text-slate-800 font-medium">{stage.remedial}</span>
                      </div>
                    </div>
                    <button onClick={onInspectFork} className="text-xs text-slate-600 underline hover:text-slate-900">
                      Inspect route
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
