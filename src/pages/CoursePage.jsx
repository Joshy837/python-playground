import { useMemo, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactFlow, Background, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check, Lock } from 'lucide-react'
import { NODES, EDGES, NODE_W, NODE_H } from '../data/courseTree.js'
import { useProgress } from '../hooks/useProgress.js'

function CourseNode({ data }) {
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
      className={`course-node ${done ? 'course-node-done' : unlocked ? 'course-node-unlocked' : 'course-node-locked'}`}
      style={{ width: NODE_W, height: NODE_H, cursor: unlocked ? 'pointer' : 'default', overflow: 'visible', position: 'relative' }}
    >
      <Handle id="t"   type="target" position={Position.Top}    style={{ visibility: 'hidden' }} />
      <Handle id="b"   type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      <Handle id="l-s" type="source" position={Position.Left}   style={{ visibility: 'hidden' }} />
      <Handle id="l-t" type="target" position={Position.Left}   style={{ visibility: 'hidden' }} />
      <Handle id="r-s" type="source" position={Position.Right}  style={{ visibility: 'hidden' }} />
      <Handle id="r-t" type="target" position={Position.Right}  style={{ visibility: 'hidden' }} />
      <div className="course-node-icon">
        {done ? <Check size={13} /> : !unlocked ? <Lock size={13} /> : Icon ? <Icon size={13} /> : null}
      </div>
      <span className="course-node-title">{title}</span>

      {!isMobile && popupVisible && (
        <div
          className={`course-node-popup${popupExiting ? ' course-node-popup-exit' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {steps.map((step, i) => (
            <button
              key={i}
              className={`course-step-btn ${step.done ? 'course-step-done' : step.unlocked ? 'course-step-available' : 'course-step-locked'}`}
              style={{ animationDelay: popupExiting ? `${(steps.length - 1 - i) * 30}ms` : `${i * 60}ms` }}
              disabled={!step.unlocked && !step.done}
              title={step.title}
              onClick={e => { e.stopPropagation(); onStepClick(i) }}
            >
              {step.done ? <Check size={11} /> : i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

const nodeTypes = { courseNode: CourseNode }
const nodeOrigin = [0.5, 0.5]

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = e => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? '')
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(document.documentElement.dataset.theme ?? ''))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

export default function CoursePage() {
  const navigate = useNavigate()
  const { completed, isStepComplete, isStepUnlocked } = useProgress()
  const theme = useTheme()
  const isLight = theme === 'light' || theme === 'hc-light'
  const isMobile = useIsMobile()
  const [expandedId, setExpandedId] = useState(null)
  const [sheetExiting, setSheetExiting] = useState(false)

  const closeSheet = useCallback(() => {
    setSheetExiting(true)
    setTimeout(() => {
      setExpandedId(null)
      setSheetExiting(false)
    }, 200)
  }, [])

  const nodes = useMemo(() => NODES.map(node => {
    const isDone = node.steps.every((_, i) => isStepComplete(node.id, i))
    const isNodeUnlocked = node.requires.every(req => completed.includes(req))
    return {
      id: node.id,
      type: 'courseNode',
      position: isMobile ? { x: node.vx, y: node.vy } : { x: node.x, y: node.y },
      data: {
        title: node.title,
        icon: node.icon,
        done: isDone,
        unlocked: isNodeUnlocked,
        expanded: expandedId === node.id,
        isMobile,
        steps: node.steps.map((s, i) => ({
          title: s.title,
          done: isStepComplete(node.id, i),
          unlocked: isStepUnlocked(node.id, i),
        })),
        onStepClick: stepIdx => navigate(`/learn/${node.id}/${stepIdx + 1}`),
      },
    }
  }), [completed, expandedId, isMobile])

  const edges = useMemo(() => EDGES.map(({ from, to }) => {
    const fromNode = NODES.find(n => n.id === from)
    const toNode = NODES.find(n => n.id === to)
    const dx = isMobile ? toNode.vx - fromNode.vx : toNode.x - fromNode.x
    const dy = isMobile ? toNode.vy - fromNode.vy : toNode.y - fromNode.y
    // Pick handles based on dominant direction of the edge
    let sourceHandle, targetHandle
    if (Math.abs(dx) >= Math.abs(dy)) {
      sourceHandle = dx >= 0 ? 'r-s' : 'l-s'
      targetHandle = dx >= 0 ? 'l-t' : 'r-t'
    } else {
      sourceHandle = 'b'
      targetHandle = 't'
    }
    const done = completed.includes(from)
    const unlocked = NODES.find(n => n.id === to)?.requires.every(req => completed.includes(req))
    return {
      id: `${from}-${to}`,
      source: from,
      target: to,
      sourceHandle,
      targetHandle,
      type: 'default',
      animated: unlocked,
      style: {
        stroke: done ? 'var(--status-green)' : unlocked ? 'var(--text-muted)' : 'var(--header-border)',
        strokeDasharray: unlocked ? undefined : '5 4',
        strokeWidth: 2,
      },
    }
  }), [completed, isMobile])

  const onNodeClick = useCallback((_, node) => {
    if (!node.data.unlocked && !node.data.done) return
    if (isMobile) {
      setSheetExiting(false)
      setExpandedId(prev => prev === node.id ? null : node.id)
    } else {
      setExpandedId(prev => prev === node.id ? null : node.id)
    }
  }, [isMobile])

  const onPaneClick = useCallback(() => {
    if (expandedId === null) return
    if (isMobile) closeSheet()
    else setExpandedId(null)
  }, [expandedId, isMobile, closeSheet])

  const done = completed.length
  const total = NODES.length

  const expandedNode = isMobile && expandedId ? nodes.find(n => n.id === expandedId) : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden page-enter">
      <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b" style={{ borderColor: 'var(--header-border)', background: 'var(--header-bg)' }}>
        <div>
          <h1 className="font-semibold text-sm">Python Fundamentals</h1>
          <p className="text-xs mt-0.5 text-app-muted">
            Click a node to choose a step, then click the step to begin.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-6">
          <div className="course-progress-bar">
            <div className="course-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="text-xs tabular-nums text-app-muted">{done} / {total}</span>
        </div>
      </div>

      <div className="flex-1" style={{ background: 'var(--course-bg)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodeOrigin={nodeOrigin}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnScroll={false}
        >
          <Background variant={isLight ? 'lines' : 'dots'} color="var(--course-dot)" gap={28} size={1} lineWidth={0.75} />
        </ReactFlow>
      </div>

      {expandedNode && (
        <>
          <div className="course-sheet-backdrop" onClick={closeSheet} />
          <div className={`course-sheet${sheetExiting ? ' course-sheet-exit' : ''}`}>
            <div className="course-sheet-handle" />
            <div className="course-sheet-title">{expandedNode.data.title}</div>
            <div className="course-sheet-steps">
              {expandedNode.data.steps.map((step, i) => (
                <button
                  key={i}
                  className={`course-step-btn ${step.done ? 'course-step-done' : step.unlocked ? 'course-step-available' : 'course-step-locked'}`}
                  disabled={!step.unlocked && !step.done}
                  title={step.title}
                  onClick={() => { closeSheet(); expandedNode.data.onStepClick(i) }}
                >
                  {step.done ? <Check size={11} /> : i + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
