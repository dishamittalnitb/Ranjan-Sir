import type { FormEvent } from 'react'
import { useState } from 'react'
import { cx } from '../lib/cx'
import { Icon } from './Icon'

interface DoubtMessage {
  text: string
  sender: 'user' | 'sir'
}

interface DoubtDeskProps {
  isOpen: boolean
  onClose: () => void
  stepNumber?: string
  stepTitle?: string
  rationale?: string
  pedagogicalRule?: string
  customDoubts?: string[]
}

const SIR_REPLY = "Ranjan Sir's guidance: Stay bounded to your curfew. Prioritize conceptual clarity over frantic speed."

export function DoubtDesk({ isOpen, onClose, stepNumber, stepTitle, rationale, pedagogicalRule, customDoubts }: DoubtDeskProps) {
  const [inputVal, setInputVal] = useState('')
  const [chatHistory, setChatHistory] = useState<DoubtMessage[]>([])

  if (!isOpen) return null

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    const value = inputVal.trim()
    if (!value) return
    setChatHistory((prev) => [...prev, { text: value, sender: 'user' }, { text: SIR_REPLY, sender: 'sir' }])
    setInputVal('')
  }

  const doubts = customDoubts?.length
    ? customDoubts
    : [
        'Can I postpone chemistry homework?',
        'How much sleep buffer do I need today?',
        "What if 20 minutes isn't enough for NLM?",
      ]

  return (
    <aside className="w-80 md:w-88 border-l border-slate-200/90 bg-[#fafafa] flex flex-col justify-between shrink-0 text-slate-800 z-30 transition-all duration-300 h-full shadow-lg sm:shadow-none">
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-[11px] font-bold tracking-wider uppercase text-slate-800 font-mono">Doubt Desk</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition" title="Close panel">
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll text-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <span>Tracked Context</span>
            <span>STEP {stepNumber || '01'}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 shadow-xs">
            <div className="text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Current Step:</span> {stepTitle || 'Academic Calibration'}
            </div>
            {rationale && (
              <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded p-2 flex items-start space-x-1.5">
                <Icon name="warning" className="text-amber-600 text-[14px] mt-0.5 shrink-0" />
                <span>{rationale}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Pedagogical Guidance</p>
            <span className="text-[10px] font-mono text-slate-400">Ranjan Sir's Rule</span>
          </div>
          <blockquote className="text-[11px] italic text-slate-700 leading-normal border-l-2 border-slate-300 pl-2">
            &quot;{pedagogicalRule || 'Burnout protection precedes backlog recovery. Sleep curfew at 22:30 is non-negotiable.'}&quot;
          </blockquote>
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Quick Inquiries</p>
          <div className="space-y-1.5">
            {doubts.map((doubt, idx) => (
              <button
                key={idx}
                onClick={() => setInputVal(doubt)}
                className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] transition shadow-xs hover:border-slate-300 group"
              >
                <span className="text-slate-400 font-mono text-[10px] mr-1.5">0{idx + 1}</span>
                <span className="group-hover:text-slate-900">&quot;{doubt}&quot;</span>
              </button>
            ))}
          </div>
        </div>

        {chatHistory.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <p className="text-[10px] font-mono uppercase text-slate-400">Session Transcript</p>
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={cx(
                  'p-2 rounded-lg text-[11px]',
                  msg.sender === 'user' ? 'bg-slate-100 text-slate-800 ml-3' : 'bg-emerald-50 text-emerald-900 mr-3 border border-emerald-200',
                )}
              >
                <strong>{msg.sender === 'user' ? 'You: ' : 'Sir: '}</strong> {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <form className="relative flex items-center" onSubmit={handleSend}>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            placeholder="Ask a doubt concurrently..."
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button className="absolute right-2 text-slate-400 hover:text-slate-700 p-1" type="submit" title="Send">
            <Icon name="arrow_upward" className="text-[16px]" />
          </button>
        </form>
      </div>
    </aside>
  )
}
