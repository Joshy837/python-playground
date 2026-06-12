import { useEffect, useRef } from 'react'
import { useReactFlow, useOnViewportChange } from '@xyflow/react'
import { NODES, NODE_W, NODE_H } from '../../data/courseTree.js'

export default function MobileZoomFitter({ isMobile }) {
  const { setViewport } = useReactFlow()
  const lockedX = useRef(null)

  useEffect(() => {
    if (!isMobile) { lockedX.current = null; return }
    const w = window.innerWidth
    const xs = NODES.map(n => n.vx)
    const graphLeft = Math.min(...xs) - NODE_W / 2
    const graphRight = Math.max(...xs) + NODE_W / 2
    const graphWidth = graphRight - graphLeft
    const zoom = (w * 0.82) / graphWidth
    const viewportX = w / 2 - ((graphLeft + graphRight) / 2) * zoom
    const viewportY = 20 + (NODE_H / 2) * zoom
    lockedX.current = viewportX
    setViewport({ x: viewportX, y: viewportY, zoom })
  }, [isMobile, setViewport])

  useOnViewportChange({
    onChange: viewport => {
      if (lockedX.current !== null && Math.abs(viewport.x - lockedX.current) > 0.5) {
        setViewport({ ...viewport, x: lockedX.current })
      }
    },
  })

  return null
}
