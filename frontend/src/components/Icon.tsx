import type { HTMLAttributes } from 'react'
import { cx } from '../lib/cx'

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string
  filled?: boolean
}

export function Icon({ name, className, filled = false, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cx('material-symbols-outlined select-none', filled && 'font-variation-settings "FILL" 1', className)}
      {...props}
    >
      {name}
    </span>
  )
}
