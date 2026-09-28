import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { Avatar } from '../components/Monogram'
import { StatusChip } from '../components/StatusChip'
import { ProgressBar } from '../components/ProgressBar'
import { MetricCard } from '../components/MetricCard'
import { CalendarGrid } from '../components/CalendarGrid'
import { MilestoneBadge } from '../components/MilestoneBadge'
import { student as initialStudent, boardGradeOptions, cognitiveCapOptions, syllabusBars, crests, calendarCells } from '../data/mockData'
import { fetchStudent } from '../services/api'
import type { Student } from '../types/models'

const inputCls =
  'h-9 px-3 rounded-lg border border-outline-variant/80 bg-surface-container-lowest text-on-surface text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all'

const labelCls = 'font-label-caps text-xs text-on-surface-variant uppercase font-semibold'

function StreakCard() {
  return (
    <MetricCard
      icon="local_fire_department"
      iconTone="amber"
      title="Consistency Streak"
      subtitle="Strict Bedtime Curfew"
      badge="18d"
      footerLeft="Curfew Protocol (< 22:30 IST)"
      footerRight={<span className="text-amber-700 font-semibold">Maintained</span>}
    >
      <div className="flex items-baseline justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight text-on-surface font-mono leading-none">18</span>
            <span className="text-amber-600 font-mono font-semibold text-[15px]">days</span>
          </div>
          <span className="text-[11px] text-secondary mt-1 font-mono">Current Sprint Run</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-mono">34</span>
            <span className="text-[10px] text-secondary font-mono">Peak</span>
          </div>
          <span className="text-[11px] text-secondary mt-1 font-mono">94.2% Curfew Kept</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-secondary uppercase font-mono tracking-wider font-semibold">7-Day Sprint Cadence</span>
          <span className="text-[10px] font-mono font-semibold text-amber-700">100% On Time</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 pt-0.5">
          {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-center">
              <span className="text-[9px] text-amber-900 font-bold font-mono">{day}</span>
              <Icon name="check" className="text-[13px] text-amber-600 font-bold" />
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 py-1.5 rounded-md bg-surface-container-low border border-outline-variant/50 text-center">
            <span className="text-[9px] text-secondary font-medium font-mono">S</span>
            <Icon name="bedtime" className="text-[13px] text-secondary" />
          </div>
          <div className="flex flex-col items-center gap-1 py-1.5 rounded-md bg-surface-container-low/60 border border-dashed border-outline-variant/50 text-center opacity-60">
            <span className="text-[9px] text-secondary font-medium font-mono">S</span>
            <Icon name="schedule" className="text-[13px] text-secondary" />
          </div>
        </div>
      </div>
    </MetricCard>
  )
}

function SyllabusCard() {
  return (
    <MetricCard
      icon="menu_book"
      iconTone="slate"
      title="Syllabus Coverage"
      subtitle="CBSE Target 2026"
      badge="Class 10"
      footerLeft="Board Exam Pacing"
      footerRight={<span className="text-emerald-700 font-medium">On Pace for 96%+</span>}
    >
      <div className="flex items-baseline justify-between pt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-on-surface font-mono leading-none">84</span>
          <span className="text-xs text-secondary font-mono">/ 126 topics</span>
        </div>
        <div className="text-right">
          <span className="text-lg text-emerald-800 font-bold font-mono">66.7%</span>
          <p className="text-[10px] text-secondary uppercase font-mono tracking-wider">Completed</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-0.5">
        {syllabusBars.map((bar) => (
          <div key={bar.subject} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface font-medium">{bar.subject}</span>
              <span className="font-mono text-on-surface text-[11px]">
                <strong className={`${bar.strong} font-bold`}>{bar.done}</strong> / {bar.total}
              </span>
            </div>
            <ProgressBar value={bar.width} color={bar.color} className="h-1" />
          </div>
        ))}
      </div>
    </MetricCard>
  )
}

function CognitiveCapCard() {
  return (
    <MetricCard
      icon="timer"
      iconTone="slate"
      title="Daily Cognitive Cap"
      subtitle="Strict 45–60m Bound"
      badge="48m Avg"
      footerLeft="Fatigue Prevention"
      footerRight={<span className="text-emerald-700 font-medium">0 Over-Cap Events</span>}
    >
      <div className="flex items-baseline justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-on-surface font-mono leading-none">48</span>
            <span className="text-xs text-secondary font-mono">mins</span>
          </div>
          <span className="text-[11px] text-secondary mt-1 font-mono">Within 60m Ceiling</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-lg font-bold text-emerald-800 font-mono">91.8%</span>
          <span className="text-[11px] text-secondary mt-1 font-mono">420+ Qs Solved</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] text-secondary uppercase font-mono tracking-wider font-semibold">Daily Study Duration</span>
          <span className="text-[10px] text-amber-700 font-mono font-medium">Cap: 60m</span>
        </div>
        <div className="grid grid-cols-7 gap-2 items-end h-16 pt-2">
          {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full bg-emerald-600 rounded-xs" style={{ height: '80%' }} />
              <span className="text-[9px] text-secondary font-mono">{d}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 h-full justify-end">
            <div className="w-full bg-amber-400 rounded-xs" style={{ height: '100%' }} title="Max 60m Bound Hit" />
            <span className="text-[9px] text-amber-900 font-bold font-mono">S</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 h-full justify-end">
            <div className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xs" style={{ height: '12%' }} />
            <span className="text-[9px] text-secondary font-mono">S</span>
          </div>
        </div>
      </div>
    </MetricCard>
  )
}

interface ProfileForm {
  bio: string
  fullName: string
  boardGrade: string
  school: string
  examTarget: string
  cognitiveCap: string
}

function toForm(s: Student): ProfileForm {
  return {
    bio: s.bio,
    fullName: s.fullName,
    boardGrade: s.boardGrade,
    school: s.school,
    examTarget: s.examTarget,
    cognitiveCap: s.cognitiveCap,
  }
}

export default function ProfileScreen() {
  const [savedAlert, setSavedAlert] = useState(false)
  const [student, setStudent] = useState<Student>(initialStudent)
  const [form, setForm] = useState<ProfileForm>(toForm(initialStudent))

  useEffect(() => {
    let active = true
    fetchStudent()
      .then((s) => {
        if (active) {
          setStudent(s)
          setForm(toForm(s))
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const set = (key: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    setSavedAlert(true)
    setTimeout(() => setSavedAlert(false), 2500)
  }

  const handleReset = () => {
    setForm((f) => ({ ...f, fullName: student.fullName, bio: student.bio }))
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface custom-scroll">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-8">
        <div className="rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/60 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col items-center max-w-4xl mx-auto w-full">
            <div className="relative group cursor-pointer mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container ring-4 ring-surface-container-low shadow-sm flex items-center justify-center">
                <Avatar label="AS" className="w-full h-full text-2xl" />
              </div>
              <button
                aria-label="Update Avatar"
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-1.5 rounded-full shadow hover:bg-inverse-surface transition-colors flex items-center justify-center"
                type="button"
              >
                <Icon name="photo_camera" className="text-[14px]" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5 mb-5">
              <h2 className="text-xl md:text-2xl font-semibold text-on-surface">{form.fullName}</h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-secondary">Enrollment ID:</span>
                <span className="text-xs text-on-surface bg-surface-container-low px-2 py-0.5 rounded font-mono border border-outline-variant/40">{student.enrollmentId}</span>
                <StatusChip tone="verified" pulse>
                  {student.tier}
                </StatusChip>
              </div>
            </div>

            <div className="w-full flex flex-col gap-1.5 mb-6 max-w-2xl">
              <label className={`${labelCls} text-center`} htmlFor="studentBio">
                BIO
              </label>
              <textarea
                id="studentBio"
                rows={2}
                className="w-full p-2.5 rounded-lg border border-outline-variant/80 bg-surface-container-lowest text-on-surface text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-center resize-none"
                value={form.bio}
                onChange={set('bio')}
              />
            </div>

            <div className="w-full border-t border-outline-variant/40 pt-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Full Name</label>
                  <input className={inputCls} type="text" value={form.fullName} onChange={set('fullName')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Board &amp; Grade</label>
                  <div className="relative">
                    <select className={`${inputCls} w-full pr-8 appearance-none`} value={form.boardGrade} onChange={set('boardGrade')}>
                      {boardGradeOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <Icon name="unfold_more" className="absolute right-2.5 top-2 pointer-events-none text-on-surface-variant text-[18px]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Registered Institution</label>
                  <input className={inputCls} type="text" value={form.school} onChange={set('school')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Core Examination Target</label>
                  <input className={inputCls} type="text" value={form.examTarget} onChange={set('examTarget')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Daily Cognitive Cap &amp; Curfew</label>
                  <div className="relative">
                    <select className={`${inputCls} w-full pr-8 appearance-none`} value={form.cognitiveCap} onChange={set('cognitiveCap')}>
                      {cognitiveCapOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <Icon name="unfold_more" className="absolute right-2.5 top-2 pointer-events-none text-on-surface-variant text-[18px]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Current Priority Disciplines</label>
                  <div className="min-h-9 p-1 rounded-lg border border-outline-variant/80 bg-surface-container-lowest flex flex-wrap items-center gap-1.5">
                    {student.priorityDisciplines.map((d) => (
                      <span key={d} className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface text-xs">
                        {d}
                      </span>
                    ))}
                    <span className="text-secondary px-1.5 text-xs font-medium cursor-pointer hover:text-slate-900">+ Add</span>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                  <button
                    className="h-9 px-4 rounded-lg border border-outline-variant/80 text-xs font-medium text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                    type="button"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    className={`h-9 px-5 rounded-lg text-on-primary text-xs font-medium shadow-xs transition-colors flex items-center gap-2 ${savedAlert ? 'bg-emerald-600' : 'bg-primary hover:bg-inverse-surface'}`}
                    type="button"
                    onClick={handleSave}
                  >
                    <Icon name={savedAlert ? 'check_circle' : 'save'} className="text-[16px]" />
                    <span>{savedAlert ? 'Profile Verified & Saved' : 'Update Profile'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <div>
              <h3 className="text-xl text-on-surface font-semibold tracking-tight">Performance Logs</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                <Icon name="local_fire_department" className="text-[15px] text-amber-500" />
                18-DAY STREAK ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StreakCard />
            <SyllabusCard />
            <CognitiveCapCard />
          </div>
        </div>

        <CalendarGrid cells={calendarCells} />

        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-on-surface">Milestones and Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {crests.map((crest) => (
              <MilestoneBadge key={crest.id} crest={crest} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
