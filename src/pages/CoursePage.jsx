import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactFlow, Background, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check, Lock } from 'lucide-react'
import { NODES, EDGES, NODE_W, NODE_H } from '../data/courseTree.js'
import { useProgress } from '../hooks/useProgress.js'

function CourseNode({ data }) {
  const { title, icon: Icon, unlocked, done } = data
  return (
    <div
      className={`course-node ${done ? 'course-node-done' : unlocked ? 'course-node-unlocked' : 'course-node-locked'}`}
      style={{ width: NODE_W, height: NODE_H, cursor: unlocked ? 'pointer' : 'default' }}
    >
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <div className="course-node-icon">
        {done ? <Check size={13} /> : !unlocked ? <Lock size={13} /> : Icon ? <Icon size={13} /> : null}
      </div>
      <span className="course-node-title">{title}</span>
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  )
}

const nodeTypes = { courseNode: CourseNode }
const nodeOrigin = [0.5, 0.5]

export default function CoursePage() {
  const navigate = useNavigate()
  const { completed } = useProgress()

  const nodes = useMemo(() => NODES.map(node => ({
    id: node.id,
    type: 'courseNode',
    position: { x: node.x, y: node.y },
    data: {
      title: node.title,
      icon: node.icon,
      done: completed.includes(node.id),
      unlocked: node.requires.every(req => completed.includes(req)),
    },
  })), [completed])

  const edges = useMemo(() => EDGES.map(({ from, to }) => {
    const done = completed.includes(from)
    const unlocked = NODES.find(n => n.id === to)?.requires.every(req => completed.includes(req))
    return {
      id: `${from}-${to}`,
      source: from,
      target: to,
      animated: unlocked,
      style: {
        stroke: done ? 'var(--status-green)' : unlocked ? 'var(--text-muted)' : 'var(--header-border)',
        strokeDasharray: unlocked ? undefined : '5 4',
        strokeWidth: 2,
      },
    }
  }), [completed])

  const onNodeClick = useCallback((_, node) => {
    if (!node.data.unlocked && !node.data.done) return
    navigate(`/learn/${node.id}`)
  }, [navigate])

  const done = completed.length
  const total = NODES.length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 border-b" style={{ borderColor: 'var(--header-border)', background: 'var(--header-bg)' }}>
        <div>
          <h1 className="font-semibold text-sm">Python Fundamentals</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Click a node to open the lesson. Complete each topic to unlock the next.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-6">
          <div className="course-progress-bar">
            <div className="course-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{done} / {total}</span>
        </div>
      </div>

      {/* Tree canvas */}
      <div className="flex-1" style={{ background: 'var(--app-bg)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodeOrigin={nodeOrigin}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll={false}
      >
        <Background color="var(--header-border)" gap={28} size={1} />
      </ReactFlow>
      </div>
    </div>
  )
}
