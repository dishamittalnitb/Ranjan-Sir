import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon } from './Icon'

type IconTone = 'amber' | 'slate' | 'emerald'

interface MetricCardProps {
  icon: string
  iconTone?: IconTone
  title: string
  subtitle?: string
  badge?: ReactNode
  footerLeft?: ReactNode
  footerRight?: ReactNode
  className?: string
  children?: ReactNode
}

const toneMap: Record<IconTone, string> = {
  amber: 'bg-amber-50 text-amber-600 border-amber-200/80',
  slate: 'bg-surface-container-low text-primary border-outline-variant/50',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
}

export function MetricCard({
  icon,
  iconTone = 'slate',
  title,
  subtitle,
  badge,
  footerLeft,
  footerRight,
  className,
  children,
}: MetricCardProps) {
  return (
    <div
      className={cx(
        'rounded-xl p-6 bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col justify-between hover:border-outline hover:shadow-md transition-all group',
        className,
      )}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cx('w-9 h-9 rounded-lg flex items-center justify-center border group-hover:scale-105 transition-transform', toneMap[iconTone])}>
              <Icon name={icon} className="text-[20px]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">{title}</h4>
              <span className="text-[11px] text-secondary font-mono">{subtitle}</span>
            </div>
          </div>
          {badge && (
            <span className="text-[11px] font-mono font-bold text-on-surface bg-surface-container-low px-2.5 py-0.5 rounded-full border border-outline-variant/50">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>

      {(footerLeft || footerRight) && (
        <div className="pt-4 mt-5 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-secondary font-mono">
          <span className="truncate">{footerLeft}</span>
          <span className="shrink-0">{footerRight}</span>
        </div>
      )}
    </div>
  )
}
