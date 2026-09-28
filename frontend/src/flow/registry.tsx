import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { ChatComposer } from '../components/ChatComposer'
import { ChatStarters } from '../components/ChatStarters'
import { CoachingLoadPreview } from '../components/CoachingLoadPreview'
import { GuidedStepCard } from '../components/GuidedStepCard'
import { Icon } from '../components/Icon'
import { MetricCard } from '../components/MetricCard'
import { QuestTimeline } from '../components/QuestTimeline'
import { SubjectSelector } from '../components/SubjectSelector'
import type { UIComponentSchema } from '../services/api'
import type { ChatStarter, CoachingDay, QuestStage, Subject } from '../types/models'

export type ActionHandler = (actionType: string, payload?: Record<string, unknown>) => void

export interface ComponentRendererProps {
  component: UIComponentSchema
  onAction: ActionHandler
}

type Renderer = (props: ComponentRendererProps) => ReactNode

type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'emerald'
type IconTone = 'amber' | 'slate' | 'emerald'

interface ActionButtonSpec {
  label?: string
  action_type?: string
  payload?: Record<string, unknown>
  variant?: string
}

function HeroHeader({ component }: ComponentRendererProps) {
  const { title, subtitle, icon } = component.props as { title?: string; subtitle?: string; icon?: string }
  return (
    <div className="flex flex-col items-center text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-semibold mb-4 shadow-sm">
          <Icon name={icon} className="text-[28px]" />
        </div>
      )}
      {title && <h1 className="text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">{title}</h1>}
      {subtitle && <p className="mt-2 text-sm text-on-surface-variant max-w-md">{subtitle}</p>}
    </div>
  )
}

function PromptInput({ component, onAction }: ComponentRendererProps) {
  const placeholder = (component.props.placeholder as string) ?? 'Ask a question or type a message...'
  const [value, setValue] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const query = value.trim()
    if (!query) return
    onAction('SUBMIT_QUERY', { query })
    setValue('')
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm p-3">
      <ChatComposer value={value} onChange={setValue} onSubmit={submit} placeholder={placeholder} />
    </div>
  )
}

function Starters({ component, onAction }: ComponentRendererProps) {
  const options = (component.props.options as ChatStarter[]) ?? []
  return <ChatStarters starters={options} onSelect={(label) => onAction('SUBMIT_QUERY', { query: label })} />
}

function AnswerCard({ component }: ComponentRendererProps) {
  const { answer, sources } = component.props as { answer?: string; sources?: string[] }
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-secondary">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Ranjan Sir
      </div>
      <div className="bg-emerald-50 border border-emerald-200 text-slate-800 text-sm rounded-2xl rounded-tl-md px-4 py-3 whitespace-pre-line leading-relaxed">{answer}</div>
      {sources && sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sources.map((source) => (
            <span key={source} className="text-[10px] font-mono text-on-surface bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/40">
              {source}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionButtons({ component, onAction }: ComponentRendererProps) {
  const buttons = (component.props.buttons as ActionButtonSpec[]) ?? []
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {buttons.map((button, i) => (
        <Button key={i} variant={(button.variant as ButtonVariant) ?? 'primary'} onClick={() => onAction(button.action_type ?? 'RETRY', button.payload ?? {})}>
          {button.label}
        </Button>
      ))}
    </div>
  )
}

function StepCard({ component, onAction }: ComponentRendererProps) {
  const spec = component.props as {
    eyebrow?: string
    chip?: string
    headline?: string
    body?: string
    primary?: { label?: string; action_type?: string; payload?: Record<string, unknown> }
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      <GuidedStepCard
        eyebrow={spec.eyebrow}
        headline={spec.headline ?? ''}
        body={spec.body}
        primaryLabel={spec.primary?.label}
        onPrimary={spec.primary ? () => onAction(spec.primary?.action_type ?? 'NEXT_STEP', spec.primary?.payload ?? {}) : undefined}
      >
        {spec.chip && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {spec.chip}
          </div>
        )}
      </GuidedStepCard>
    </div>
  )
}

function LoadPreview({ component }: ComponentRendererProps) {
  const days = (component.props.days as CoachingDay[]) ?? []
  return (
    <div className="w-full max-w-lg mx-auto">
      <CoachingLoadPreview days={days} />
    </div>
  )
}

function SubjectSelect({ component, onAction }: ComponentRendererProps) {
  const spec = component.props as { heading?: string; title?: string; subtitle?: string; subjects?: Subject[] }
  const [selected, setSelected] = useState('physics')

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      {spec.heading && <p className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-2">{spec.heading}</p>}
      {spec.title && <h1 className="text-3xl lg:text-4xl font-serif text-slate-900 font-normal tracking-tight leading-tight">{spec.title}</h1>}
      {spec.subtitle && <p className="text-sm text-slate-600 mt-2.5 font-normal leading-relaxed">{spec.subtitle}</p>}
      <div className="mt-6">
        <SubjectSelector subjects={spec.subjects ?? []} value={selected} onChange={setSelected} />
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="dark" onClick={() => onAction('SELECT_OPTION', { subject: selected })}>
          Start with {selected.charAt(0).toUpperCase() + selected.slice(1)}
        </Button>
      </div>
    </div>
  )
}

function Quest({ component, onAction }: ComponentRendererProps) {
  const spec = component.props as { title?: string; subtitle?: string; stages?: QuestStage[] }
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        {spec.title && <h1 className="font-editorial text-3xl lg:text-4xl text-on-surface tracking-tight leading-none font-normal">{spec.title}</h1>}
        {spec.subtitle && <p className="text-sm text-secondary max-w-2xl">{spec.subtitle}</p>}
      </div>
      <QuestTimeline stages={spec.stages ?? []} />
      <div className="flex justify-end">
        <Button variant="dark" onClick={() => onAction('NEXT_STEP')}>
          Continue to Quest Hub
        </Button>
      </div>
    </div>
  )
}

function Metric({ component }: ComponentRendererProps) {
  const spec = component.props as {
    icon?: string
    iconTone?: IconTone
    title?: string
    subtitle?: string
    big?: string
    unit?: string
    badge?: string
    footerLeft?: string
    footerRight?: string
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <MetricCard
        icon={spec.icon ?? 'schedule'}
        iconTone={spec.iconTone ?? 'slate'}
        title={spec.title ?? ''}
        subtitle={spec.subtitle}
        badge={spec.badge}
        footerLeft={spec.footerLeft}
        footerRight={spec.footerRight}
      >
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-4xl font-bold text-on-surface font-mono leading-none">{spec.big}</span>
          {spec.unit && <span className="text-xs text-secondary font-mono">{spec.unit}</span>}
        </div>
      </MetricCard>
    </div>
  )
}

export const registry: Record<string, Renderer> = {
  HeroHeader,
  PromptInput,
  ChatStarters: Starters,
  AnswerCard,
  ActionButtons,
  GuidedStepCard: StepCard,
  CoachingLoadPreview: LoadPreview,
  SubjectSelector: SubjectSelect,
  QuestTimeline: Quest,
  MetricCard: Metric,
}
