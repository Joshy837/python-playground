import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

export default function Toast({ message, onDone }) {
  const [dismissing, setDismissing] = useState(false)

  useEffect(() => {
    const dismiss = setTimeout(() => setDismissing(true), 2200)
    return () => clearTimeout(dismiss)
  }, [])

  return (
    <div
      className={`toast${dismissing ? ' toast-dismissing' : ''}`}
      onAnimationEnd={dismissing ? e => { if (e.animationName === 'toast-out') onDone() } : undefined}
    >
      <Check size={13} />
      {message}
    </div>
  )
}
