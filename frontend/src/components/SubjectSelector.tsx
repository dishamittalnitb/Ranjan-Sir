import { cx } from '../lib/cx'
import { Icon } from './Icon'
import { StatusChip } from './StatusChip'
import type { Subject, SubjectStatus } from '../types/models'

const statusLabel: Record<SubjectStatus, string> = {
  blocking: 'Blocking',
  protect: 'Protect',
  healthy: 'Healthy',
}

interface SubjectCardProps {
  subject: Subject
  selected: string
  onSelect: (id: string) => void
}

function SubjectCard({ subject, selected, onSelect }: SubjectCardProps) {
  const isSelected = selected === subject.id
  return (
    <div
      onClick={() => onSelect(subject.id)}
      className={cx(
        'flex items-center justify-between p-4 sm:p-5 rounded-xl cursor-pointer transition',
        isSelected ? 'border-2 border-amber-400/90 bg-amber-50/30 shadow-xs' : 'border border-slate-200 bg-white hover:border-slate-300',
      )}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center space-x-2.5 mb-1">
          <span className="text-base font-semibold text-slate-900">{subject.name}</span>
          <StatusChip tone={subject.status} className="normal-case tracking-normal font-medium">
            {statusLabel[subject.status]}
          </StatusChip>
        </div>
        <p className="text-xs text-slate-500 font-normal">{subject.rationale}</p>
      </div>
      <div className={cx('w-5 h-5 rounded-full flex items-center justify-center shrink-0', isSelected ? 'bg-amber-500 text-white' : 'border border-slate-300')}>
        {isSelected && <Icon name="check" className="text-[14px]" />}
      </div>
    </div>
  )
}

interface SubjectSelectorProps {
  subjects: Subject[]
  value: string
  onChange: (id: string) => void
}

export function SubjectSelector({ subjects, value, onChange }: SubjectSelectorProps) {
  return (
    <div className="space-y-3.5">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} selected={value} onSelect={onChange} />
      ))}
    </div>
  )
}
