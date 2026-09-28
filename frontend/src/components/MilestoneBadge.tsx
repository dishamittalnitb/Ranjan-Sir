import { Icon } from './Icon'
import { ProgressBar } from './ProgressBar'
import type { Crest } from '../types/models'

interface MilestoneBadgeProps {
  crest: Crest
}

export function MilestoneBadge({ crest }: MilestoneBadgeProps) {
  return (
    <div className="flex flex-col justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 hover:border-outline hover:shadow-md transition-all group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-wider text-secondary font-mono">{crest.id}</span>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{crest.status}</span>
        </div>
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 text-amber-400 flex items-center justify-center my-3 shadow-sm group-hover:scale-105 transition-transform">
          <Icon name="military_tech" className="text-[28px]" />
        </div>
        <div className="flex flex-col gap-0.5 mt-2 text-center">
          <span className="text-[10px] text-secondary uppercase tracking-wider">{crest.sub}</span>
          <h4 className="text-sm font-semibold text-on-surface tracking-tight mt-0.5">{crest.title}</h4>
        </div>
      </div>
      <div className="w-full flex flex-col gap-1.5 mt-5 pt-4 border-t border-outline-variant/30">
        <ProgressBar value={crest.pct} className="h-1.5" />
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>Pacing</span>
          <span className="font-medium text-on-surface font-mono">{crest.prog}</span>
        </div>
      </div>
    </div>
  )
}
