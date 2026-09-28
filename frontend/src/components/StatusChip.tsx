import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

type StatusTone = 'blocking' | 'protect' | 'healthy' | 'verified' | 'attention' | 'neutral' | 'dark' | 'outline'

const tones: Record<StatusTone, string> = {
  blocking: 'bg-amber-100 text-amber-800 border-amber-300',
  protect: 'bg-slate-100 text-slate-700 border-slate-200',
  healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  attention: 'bg-amber-100 text-amber-800 border-amber-300',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  dark: 'bg-slate-900 text-white',
  outline: 'bg-surface-container-lowest text-primary border border-outline-variant/50',
}

interface StatusChipProps {
  tone?: StatusTone
  className?: string
  children: ReactNode
  pulse?: boolean
}

export function StatusChip({ tone = 'neutral', className, children, pulse = false }: StatusChipProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border',
        tones[tone],
        className,
      )}
    >
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {children}
    </span>
  )
}
