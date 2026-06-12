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
      className={[
        'fixed bottom-6 left-1/2 -translate-x-1/2',
        'flex items-center gap-[0.45rem]',
        'py-2 px-4 rounded-[9px]',
        'border border-[color-mix(in_srgb,#4ade80_35%,var(--header-border))]',
        'bg-(--header-bg) text-[#4ade80]',
        'text-[0.8rem] font-medium whitespace-nowrap',
        'z-[1000] pointer-events-none',
        'shadow-[0_8px_24px_color-mix(in_srgb,#000_40%,transparent)]',
        dismissing
          ? 'animate-[toast-out_0.2s_ease_both]'
          : 'animate-[toast-in_0.2s_ease_both]',
      ].join(' ')}
      onAnimationEnd={
        dismissing
          ? (e) => {
              if (e.animationName === 'toast-out') onDone()
            }
          : undefined
      }
    >
      <Check size={13} />
      {message}
    </div>
  )
}
