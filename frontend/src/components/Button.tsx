import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/cx'
import { Icon } from './Icon'

type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'emerald'
type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-xs',
  dark: 'bg-slate-950 text-white hover:bg-slate-800 shadow-sm',
  outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
  emerald: 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-xs',
  lg: 'h-10 px-6 text-sm',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  iconRight?: string
  children?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', icon, iconRight, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="text-base" />}
      {children}
      {iconRight && <Icon name={iconRight} className="text-sm" />}
    </button>
  )
}
