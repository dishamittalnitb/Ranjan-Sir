import type { FormEvent } from 'react'
import { Icon } from './Icon'

interface ChatComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  placeholder?: string
  disabled?: boolean
}

export function ChatComposer({ value, onChange, onSubmit, placeholder = 'Ask a question or type a message...', disabled = false }: ChatComposerProps) {
  return (
    <form className="relative flex items-center bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:border-slate-300 transition-colors p-2" onSubmit={onSubmit}>
      <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shrink-0" title="Attach notes or problem image">
        <Icon name="attach_file" className="text-xl" />
      </button>
      <input
        className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        placeholder={placeholder}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center space-x-1 shrink-0">
        <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
          <Icon name="mic" className="text-xl" />
        </button>
        <button type="submit" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm" disabled={disabled}>
          <Icon name="arrow_upward" className="text-base" />
        </button>
      </div>
    </form>
  )
}
