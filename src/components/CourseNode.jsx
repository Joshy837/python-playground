import { useState, useEffect } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Check, Lock } from 'lucide-react'
import { NODE_W, NODE_H } from '../data/courseTree.js'
import StepButton from './StepButton.jsx'

export default function CourseNode({ data }) {
  const { title, icon: Icon, unlocked, done, expanded, steps, onStepClick, isMobile } = data
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupExiting, setPopupExiting] = useState(false)

  useEffect(() => {
    if (expanded) {
      setPopupVisible(true)
      setPopupExiting(false)
    } else if (popupVisible) {
      setPopupExiting(true)
      const exitMs = (steps.length - 1) * 30 + 200
      const t = setTimeout(() => {
        setPopupVisible(false)
        setPopupExiting(false)
      }, exitMs)
      return () => clearTimeout(t)
    }
  }, [expanded])

  return (
    <div
      className={`flex flex-col items-center justify-center gap-[3px] rounded-[10px] border-2 transition-[opacity,box-shadow,border-color] duration-150 text-center px-[10px] ${done ? 'border-app-green bg-[color-mix(in_srgb,var(--status-green)_10%,var(--header-bg))]' : unlocked ? 'border-app-muted bg-app-surface hover:border-app-fg hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--text-primary)_12%,transparent)]' : 'border-app-border bg-app-surface opacity-45'}`}
      style={{ width: NODE_W, height: NODE_H, cursor: unlocked ? 'pointer' : 'default', overflow: 'visible', position: 'relative' }}
    >
      <Handle id="t"   type="target" position={Position.Top}    style={{ visibility: 'hidden' }} />
      <Handle id="b"   type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      <Handle id="l-s" type="source" position={Position.Left}   style={{ visibility: 'hidden' }} />
      <Handle id="l-t" type="target" position={Position.Left}   style={{ visibility: 'hidden' }} />
      <Handle id="r-s" type="source" position={Position.Right}  style={{ visibility: 'hidden' }} />
      <Handle id="r-t" type="target" position={Position.Right}  style={{ visibility: 'hidden' }} />
      <div className={`h-[13px] flex items-center ${done ? 'text-app-green' : 'text-app-muted'}`}>
        {done ? <Check size={13} /> : !unlocked ? <Lock size={13} /> : Icon ? <Icon size={13} /> : null}
      </div>
      <span className={`text-[0.75rem] font-semibold ${unlocked || done ? 'text-app-fg' : 'text-app-muted'}`}>{title}</span>

      {!isMobile && popupVisible && (
        <div
          className={`course-node-popup absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-[6px] w-[130px] justify-center${popupExiting ? ' course-node-popup-exit' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {steps.map((step, i) => (
            <StepButton
              key={i}
              done={step.done}
              unlocked={step.unlocked}
              number={i + 1}
              title={step.title}
              style={{ animationDelay: popupExiting ? `${(steps.length - 1 - i) * 30}ms` : `${i * 60}ms` }}
              onClick={e => { e.stopPropagation(); onStepClick(i) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
