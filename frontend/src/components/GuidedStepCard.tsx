import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon } from './Icon'

interface GuidedStepCardProps {
  eyebrow?: string
  headline: string
  body?: string
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  prevLabel?: string
  onPrev?: () => void
  className?: string
  children?: ReactNode
}

export function GuidedStepCard({
  eyebrow,
  headline,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  prevLabel = 'Previous step',
  onPrev,
  className,
  children,
}: GuidedStepCardProps) {
  return (
    <div className={cx('flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto', className)}>
      <main className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
        <article className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 flex flex-col justify-between min-h-[540px] text-slate-900 my-auto p-8">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-8">
            {children}

            {eyebrow && (
              <div className="mb-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider px-2 py-1 bg-slate-100 rounded">{eyebrow}</span>
              </div>
            )}

            <h1 className="serif-display text-3xl sm:text-4xl text-slate-900 font-normal leading-snug max-w-xl mb-8">{headline}</h1>

            {body && <p className="text-sm text-slate-600 max-w-xl mb-6 leading-relaxed">{body}</p>}

            {(primaryLabel || secondaryLabel) && (
              <div className="flex items-center gap-4 mb-8">
                {primaryLabel && onPrimary && (
                  <button
                    onClick={onPrimary}
                    className="px-7 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium rounded-full shadow-sm hover:shadow transition-all"
                  >
                    {primaryLabel}
                  </button>
                )}
                {secondaryLabel && onSecondary && (
                  <button onClick={onSecondary} className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-600 transition-colors">
                    {secondaryLabel}
                  </button>
                )}
              </div>
            )}

            {onPrev && (
              <div>
                <button onClick={onPrev} className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                  <Icon name="chevron_left" className="text-sm" /> {prevLabel}
                </button>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  )
}
