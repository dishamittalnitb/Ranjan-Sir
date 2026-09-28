import type {
  Student,
  NavLink,
  ChatStarter,
  Subject,
  CoachingDay,
  QuestStage,
  SyllabusBar,
  Crest,
  CalendarCell,
  StepContext,
} from '../types/models'

export const student: Student = {
  fullName: 'Arjun Sharma',
  shortName: 'Arjun',
  enrollmentId: 'RS-2026-X10',
  tier: 'ACTIVE · TIER 1 MENTORSHIP',
  bio: 'Focused on foundational derivations, disciplined daily practice, and consistent problem solving within strict bedtime curfew.',
  boardGrade: 'CBSE — Class 10 (Secondary)',
  school: "The Mother's International School, New Delhi",
  examTarget: 'CBSE Board Examination 2026 · Target 96%+',
  cognitiveCap: '45 - 60 minutes bounded (Strict sleep curfew 22:30)',
  priorityDisciplines: ['Mathematics', 'Science (Physics/Chem)', 'English Literature'],
}

export const boardGradeOptions: string[] = [
  'CBSE — Class 10 (Secondary)',
  'CBSE — Class 11 (Science Core)',
  'CBSE — Class 12 (Board Sprint)',
  'ICSE — Class 10',
]

export const cognitiveCapOptions: string[] = [
  '45 - 60 minutes bounded (Strict sleep curfew 22:30)',
  '30 - 45 minutes sprint (Recovery / Light day)',
  '60 - 75 minutes maximum bound (Exam weekend)',
]

export const navLinks: NavLink[] = [
  { path: '/', label: 'Chat with Ranjan Sir', icon: 'chat_bubble' },
  { path: '/profile', label: 'Student Profile & Records', icon: 'badge' },
]

export const chatStarters: ChatStarter[] = [
  { icon: 'menu_book', label: 'Review Class 10 Math syllabus', primary: false },
  { icon: 'bolt', label: "Explain Ohm's Law derivation", primary: false },
  { icon: 'task_alt', label: 'What Should I Do Today?', primary: true },
]

export const subjects: Subject[] = [
  { id: 'physics', name: 'Physics', status: 'blocking', rationale: 'NLM prerequisite for Rotational Mechanics' },
  { id: 'maths', name: 'Maths', status: 'protect', rationale: 'Sequence and Series after heavy coaching' },
  { id: 'chemistry', name: 'Chemistry', status: 'healthy', rationale: 'Stable maintenance block' },
]

export const coachingLoad: CoachingDay[] = [
  { day: 'Mon 13', label: 'Regular', hours: '3.5 hrs', width: '45%', heavy: false },
  { day: 'Tue 14', label: 'Moderate', hours: '4.0 hrs', width: '53%', heavy: false },
  { day: 'Wed 15 (Today)', label: 'Heaviest', hours: '7.5 hrs', width: '100%', heavy: true },
]

export const questStages: QuestStage[] = [
  {
    order: '01',
    title: 'NLM Friction & Normal Reaction Bridge',
    status: 'completed',
    meta: 'Mastered & Verified',
    description: 'Prerequisites verified • Free Body Diagram contact points validated with zero friction penalty.',
    time: '20 min duration',
    subtime: 'Logged 08:15 AM',
  },
  {
    order: '02',
    title: 'Moment of Inertia & Parallel Axis Theorem',
    status: 'in-progress',
    meta: 'IN PROGRESS • 35 MIN',
    description: 'Tackle continuous mass integration, perpendicular planar lamina transformations, and symmetry shortcuts.',
    target: 'Target: 4 Problem Sets',
    remedial: 'Monotonic Torque Drill (15m)',
  },
  {
    order: '03',
    title: 'Rolling Without Slipping Dynamics',
    status: 'locked',
    meta: 'Locked',
    description: 'Requires verified equilibrium score (>80%) from Step 02.',
    time: '25 min allocated',
  },
  {
    order: '04',
    title: 'Daily Review & Nightly Wrap',
    status: 'goal',
    meta: 'Goal',
    description: 'Zero screen usage post 10:30 PM to guarantee full recovery.',
    time: 'Target 10:30 PM',
  },
]

export const syllabusBars: SyllabusBar[] = [
  { subject: 'Mathematics', done: 32, total: 45, width: '71.1%', color: 'bg-primary', strong: 'text-primary' },
  { subject: 'Science (Phys / Chem / Bio)', done: 36, total: 52, width: '69.2%', color: 'bg-emerald-600', strong: 'text-emerald-800' },
  { subject: 'English & Social Studies', done: 16, total: 29, width: '55.2%', color: 'bg-secondary', strong: 'text-secondary' },
]

export const crests: Crest[] = [
  { id: 'Crest #01', status: 'Unlocked', title: '15 Sessions ≤ 45m', sub: 'Curfew Compliance Protocol', prog: '12 / 15', pct: '80%' },
  { id: 'Crest #02', status: 'Unlocked', title: '50 Zero-Error Proofs', sub: 'Pure Derivation & Proofs', prog: '44 / 50', pct: '88%' },
  { id: 'Crest #03', status: 'Mastered', title: '100% Pre-Exam Triage', sub: 'Exam Preparedness Readiness', prog: 'Completed', pct: '100%' },
  { id: 'Crest #04', status: 'In Progress', title: '90%+ HW Turnaround', sub: 'Academic Momentum', prog: '88% Current', pct: '72%' },
]

export const calendarCells: CalendarCell[] = [
  { day: 12, label: '50/50 Proof Numericals', time: '48 mins', done: true },
  { day: 13, label: 'Biology Genetics Punnett', time: '48 mins', done: true },
  { day: 14, label: 'Light Reflection Qs', time: '36 mins', done: true },
  { day: 15, label: 'Curfew Kept', time: '0 mins', rest: true },
  { day: 16, label: 'Trig Proofs Ex 8.4', time: '48 mins', done: true },
  { day: 17, label: 'Circuit Diagram Numericals', time: '48 mins', done: true },
  { day: 18, label: 'Math Triangles & Proofs', time: '48 mins', done: true, today: true },
]

export const stepContext: Record<string, StepContext> = {
  '/guided-1': {
    stepNumber: '01',
    stepTitle: 'Step 1 (Heavy Coaching Schedule)',
    rationale: 'Today is Wednesday (7.5h coaching load). Pre-emptive energy conservation triggered.',
    pedagogicalRule:
      'Take a breath. On days with heavy physical coaching, cognitive fatigue is normal. Triage prevents fatigue spirals before they damage high-weightage topics.',
    doubts: [
      'Can I postpone chemistry homework?',
      'How much sleep buffer do I need today?',
      'What if I want to study for 2 hours tonight?',
    ],
  },
  '/guided-2': {
    stepNumber: '02',
    stepTitle: 'Step 2 (Capacity Triage)',
    rationale: 'Wednesday fatigue detection active (-35% study capacity adjustment).',
    pedagogicalRule:
      'Historical logs show trying high-cognition problem solving on Wednesday evenings yields 42% lower retention and high burnout. We prioritize 1 essential high-yield task tonight instead.',
    doubts: ['Why lighter tonight?', "Won't I fall behind in Physics?", 'Can I do mock tests instead?'],
  },
  '/guided-3': {
    stepNumber: '03',
    stepTitle: 'Step 3 (Protecting the Week)',
    rationale: 'Burnout prevention algorithm engaged. Friday exam sprint is highest value.',
    pedagogicalRule: 'Burnout protection precedes backlog recovery. Sleep curfew at 22:30 is non-negotiable.',
    doubts: ['Can I just finish pending chemistry?', 'How does this protect my week?', 'What if I wake up early tomorrow at 5 AM?'],
  },
  '/guided-4': {
    stepNumber: '04',
    stepTitle: 'Step 4 (Subject Prioritization)',
    rationale: 'Physics prerequisite gap flagged in Newton\u2019s Laws of Motion.',
    pedagogicalRule:
      'Never start with passive review when a conceptual block threatens today\u2019s live lecture. Tackle the dependency first to unlock the evening class.',
    doubts: [
      'Can I swap Maths to first if my coaching test is tomorrow?',
      'What if I only have 45 minutes right now?',
      'Show prerequisite graph for Rotational Motion',
    ],
  },
  '/guided-5': {
    stepNumber: '05',
    stepTitle: 'Step 5 (Subject Blocker & 20m Bridge)',
    rationale: 'Torque and rolling require friction & normal reaction fluency from NLM.',
    pedagogicalRule:
      'Time-box prerequisite debt ruthlessly. You do not study the past at the expense of tonight\u2019s sleep.',
    doubts: [
      'What specific 3 formulas from NLM do I need?',
      "What if 20 minutes isn't enough?",
      'Will Rotational Mechanics homework be postponed?',
    ],
  },
  '/guided-6': {
    stepNumber: '06',
    stepTitle: 'Step 6 (Time-Boxed Prerequisite)',
    rationale: 'Torque and rolling require friction & normal reaction fluency from NLM.',
    pedagogicalRule:
      'Time-box prerequisite debt ruthlessly. You do not study the past at the expense of tonight\u2019s sleep.',
    doubts: [
      'What specific 3 formulas from NLM do I need?',
      "What if 20 minutes isn't enough?",
      'Will Rotational Mechanics homework be postponed?',
    ],
  },
  default: {
    stepNumber: '08',
    stepTitle: 'Dynamic Mentorship Session',
    rationale: 'Live sync active with Ranjan Sir curriculum planner.',
    pedagogicalRule: 'Maintain your 18-day streak by shutting down screens before 22:30 IST.',
    doubts: ['Review Class 10 Math syllabus', "Explain Ohm's Law derivation", 'What Should I Do Today?'],
  },
}
