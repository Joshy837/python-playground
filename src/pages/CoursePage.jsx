import { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactFlow, Background } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { NODES, EDGES, NODE_W, NODE_H } from '../data/courseTree.js'
import { useProgress } from '../hooks/useProgress.js'
import { useIsMobile, usePageTheme } from '../hooks/useMedia.js'
import ProgressBar from '../components/ProgressBar.jsx'
import StepButton from '../components/StepButton.jsx'
import CourseNode from '../components/CourseNode.jsx'
import MobileZoomFitter from '../components/MobileZoomFitter.jsx'

const nodeTypes = { courseNode: CourseNode }
const nodeOrigin = [0.5, 0.5]

export default function CoursePage() {
  const navigate = useNavigate()
  const { completed, isStepComplete, isStepUnlocked } = useProgress()
  const theme = usePageTheme()
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

  const translateExtent = useMemo(() => {
    const PADDING = isMobile ? 80 : 400
    const xs = NODES.map(n => isMobile ? n.vx : n.x)
    const ys = NODES.map(n => isMobile ? n.vy : n.y)
    return [
      [Math.min(...xs) - NODE_W / 2 - PADDING, Math.min(...ys) - NODE_H / 2 - PADDING],
      [Math.max(...xs) + NODE_W / 2 + PADDING, Math.max(...ys) + NODE_H / 2 + PADDING],
    ]
  }, [isMobile])

  const done = completed.length
  const total = NODES.length

  const expandedNode = isMobile && expandedId ? nodes.find(n => n.id === expandedId) : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden page-enter">
      <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b" style={{ borderColor: 'var(--header-border)', background: 'var(--header-bg)' }}>
        <div>
          <h1 className="font-semibold text-sm">Python Fundamentals</h1>
          <p className="text-xs mt-0.5 text-app-muted">
            Select a topic to get started.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-6">
          <ProgressBar percent={(done / total) * 100} className="w-[80px]" />
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
          fitView={!isMobile}
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          translateExtent={translateExtent}
          panOnScroll
          zoomOnScroll={false}
        >
          <Background variant={isLight ? 'lines' : 'dots'} color="var(--course-dot)" gap={28} size={1} lineWidth={0.75} />
          <MobileZoomFitter isMobile={isMobile} />
        </ReactFlow>
      </div>

      {expandedNode && (
        <>
          <div className="fixed inset-0 z-[100] bg-transparent" onClick={closeSheet} />
          <div className={`course-sheet${sheetExiting ? ' course-sheet-exit' : ''}`}>
            <div className="w-9 h-1 rounded-sm bg-app-border mx-auto mb-[14px]" />
            <div className="text-[0.85rem] font-semibold text-app-fg text-center mb-[14px]">{expandedNode.data.title}</div>
            <div className="flex flex-wrap gap-[10px] justify-center">
              {expandedNode.data.steps.map((step, i) => (
                <StepButton
                  key={i}
                  done={step.done}
                  unlocked={step.unlocked}
                  number={i + 1}
                  title={step.title}
                  onClick={() => { closeSheet(); expandedNode.data.onStepClick(i) }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
