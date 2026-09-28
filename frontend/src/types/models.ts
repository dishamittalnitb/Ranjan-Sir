export type SubjectStatus = 'blocking' | 'protect' | 'healthy'

export interface Subject {
  id: string
  name: string
  status: SubjectStatus
  rationale: string
}

export interface NavLink {
  path: string
  label: string
  icon: string
}

export interface ChatStarter {
  icon: string
  label: string
  primary: boolean
}

export interface CoachingDay {
  day: string
  label: string
  hours: string
  width: string
  heavy: boolean
}

export type QuestStageStatus = 'completed' | 'in-progress' | 'locked' | 'goal'

export interface QuestStage {
  order: string
  title: string
  status: QuestStageStatus
  meta: string
  description: string
  time?: string
  subtime?: string
  target?: string
  remedial?: string
}

export interface SyllabusBar {
  subject: string
  done: number
  total: number
  width: string
  color: string
  strong: string
}

export interface Crest {
  id: string
  status: string
  title: string
  sub: string
  prog: string
  pct: string
}

export interface CalendarCell {
  day: number
  label: string
  time: string
  done?: boolean
  rest?: boolean
  today?: boolean
}

export interface StepContext {
  stepNumber: string
  stepTitle: string
  rationale: string
  pedagogicalRule: string
  doubts: string[]
}

export interface Student {
  fullName: string
  shortName: string
  enrollmentId: string
  tier: string
  bio: string
  boardGrade: string
  school: string
  examTarget: string
  cognitiveCap: string
  priorityDisciplines: string[]
}

export interface ChatMessage {
  role: 'user' | 'mentor'
  text: string
}
