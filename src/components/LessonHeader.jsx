import { useState } from 'react'
import { useIsMobile } from '../hooks/useMedia.js'
import { ChevronLeft, Check, LayoutGrid } from 'lucide-react'
import StepButton from './StepButton.jsx'

export default function LessonHeader({ node, stepIdx, totalSteps, stepTitle, isStepComplete, isStepUnlocked, onBack, onNavigateToStep }) {
  const isMobile = useIsMobile()
  const [showStepSheet, setShowStepSheet] = useState(false)

  return (
    <>
      <div className="flex items-center gap-[0.65rem] px-4 py-[0.65rem] bg-app-surface border-b border-app-border shrink-0">
        <button onClick={onBack} className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn" title="Back to course">
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{node.title}</span>
          <span className="text-xs truncate text-app-muted">
            Step {stepIdx + 1} / {totalSteps} — {stepTitle}
          </span>
        </div>
        {isMobile ? (
          <button
            className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn"
            title="Jump to step"
            onClick={() => setShowStepSheet(true)}
          >
            <LayoutGrid size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            {node.steps.map((s, i) => {
              const done = isStepComplete(node.id, i)
              const current = i === stepIdx
              return (
                <button
                  key={i}
                  className={`w-[32px] h-[32px] rounded-full border-[2.5px] bg-app-bg text-[0.8rem] font-semibold cursor-pointer flex items-center justify-center shrink-0 p-0 transition-[border-color,color] duration-150 ${done ? 'border-app-green text-app-green' : current ? 'border-app-fg text-app-fg' : 'border-app-border text-app-muted hover:border-app-muted hover:text-app-fg'}`}
                  onClick={() => {
                    if (current) return
                    if (done || isStepUnlocked(node.id, i)) onNavigateToStep(i)
                  }}
                  title={s.title}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : <span>{i + 1}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {showStepSheet && (
        <>
          <div className="fixed inset-0 z-[100] bg-transparent" onClick={() => setShowStepSheet(false)} />
          <div className="course-sheet">
            <div className="w-9 h-1 rounded-sm bg-app-border mx-auto mb-[14px]" />
            <p className="text-[0.85rem] font-semibold text-app-fg text-center mb-[14px]">{node.title} — Steps</p>
            <div className="flex flex-wrap gap-[10px] justify-center">
              {node.steps.map((s, i) => {
                const done = isStepComplete(node.id, i)
                const current = i === stepIdx
                const unlocked = done || isStepUnlocked(node.id, i)
                return (
                  <StepButton
                    key={i}
                    done={done}
                    unlocked={unlocked}
                    current={current}
                    number={i + 1}
                    title={s.title}
                    onClick={() => {
                      if (!unlocked) return
                      setShowStepSheet(false)
                      if (!current) onNavigateToStep(i)
                    }}
                  />
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
