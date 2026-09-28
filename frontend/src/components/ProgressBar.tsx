import { cx } from '../lib/cx'

interface ProgressBarProps {
  value: string
  color?: string
  track?: string
  className?: string
}

export function ProgressBar({ value, color = 'bg-primary', track = 'bg-surface-container-low', className }: ProgressBarProps) {
  return (
    <div className={cx('w-full rounded-full h-1.5 overflow-hidden', track, className)}>
      <div className={cx('h-full rounded-full', color)} style={{ width: value }} />
    </div>
  )
}
