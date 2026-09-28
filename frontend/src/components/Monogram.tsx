import { cx } from '../lib/cx'

interface MonogramProps {
  className?: string
}

export function Monogram({ className }: MonogramProps) {
  return (
    <svg viewBox="0 0 40 40" className={cx('shrink-0 object-contain rounded', className)} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#091426" />
      <text x="20" y="27" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="18" fill="#ffffff">
        RS
      </text>
    </svg>
  )
}

interface AvatarProps {
  label?: string
  className?: string
}

export function Avatar({ label = 'AS', className }: AvatarProps) {
  return (
    <div className={cx('rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs', className)}>
      {label}
    </div>
  )
}
