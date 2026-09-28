import { cx } from '../lib/cx'
import { Icon } from './Icon'
import type { ChatStarter } from '../types/models'

interface ChatStartersProps {
  starters: ChatStarter[]
  onSelect: (label: string) => void
}

export function ChatStarters({ starters, onSelect }: ChatStartersProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {starters.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onSelect(s.label)}
          className={cx(
            'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-body-sm text-xs transition-colors text-left shadow-xs',
            s.primary
              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
              : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/60 text-on-surface-variant hover:text-on-surface',
          )}
        >
          <Icon name={s.icon} className={cx('text-[16px]', s.primary && 'text-emerald-600')} />
          {s.label}
        </button>
      ))}
    </div>
  )
}
