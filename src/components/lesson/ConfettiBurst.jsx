import { useRef, useEffect } from 'react'

export default function ConfettiBurst({ onDone }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const COLORS = ['#38bdf8', '#a78bfa', '#fbbf24', '#4ade80', '#f472b6', '#fb923c']
    const particles = Array.from({ length: 90 }, () => ({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.25,
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
    }))
    let raf, t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t++
      let alive = false
      for (const p of particles) {
        p.x += p.vx; p.vy += 0.15; p.y += p.vy; p.rot += p.rotV
        if (t > 55) p.alpha = Math.max(0, p.alpha - 0.018)
        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }
      if (alive) { raf = requestAnimationFrame(draw) } else { onDone?.() }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}
