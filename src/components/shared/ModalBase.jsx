import { useState, useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

/**
 * Shared modal shell: backdrop, closing animation, Escape key, and header.
 *
 * Props:
 *   onClose      – called after the exit animation completes
 *   className    – inner modal class name (default: 'modal')
 *   accentColor  – CSS color string used for header gradient/border (default: 'var(--accent-try)')
 *   headerIcon   – ReactNode shown left of the title
 *   title        – header title text
 *   onEscape     – optional (close: fn) => void to override default Escape behaviour
 *   children     – ReactNode or (close: fn) => ReactNode
 */
export default function ModalBase({
  onClose,
  className = 'modal',
  accentColor = 'var(--accent-try)',
  headerIcon,
  title,
  onEscape,
  children,
}) {
  const [closing, setClosing] = useState(false)
  const handleClose = useCallback(() => setClosing(true), [])

  // Always-current escape handler without re-binding the listener
  const escapeRef = useRef(null)
  useEffect(() => {
    escapeRef.current = onEscape ? () => onEscape(handleClose) : handleClose
  })

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') escapeRef.current?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      className={`modal-backdrop${closing ? ' modal-backdrop-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${className}${closing ? ' modal-closing' : ''}`}
        style={{ '--modal-accent': accentColor }}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={
          closing
            ? (e) => {
                if (e.animationName === 'modal-out') onClose()
              }
            : undefined
        }
      >
        {(headerIcon != null || title != null) && (
          <div className="flex items-center justify-between py-3 px-4 border-b border-[color-mix(in_srgb,var(--modal-accent)_18%,var(--header-border))] bg-[radial-gradient(ellipse_130%_160%_at_-5%_50%,color-mix(in_srgb,var(--modal-accent)_12%,transparent)_0%,transparent_60%),color-mix(in_srgb,var(--header-bg)_85%,var(--app-bg))] shrink-0">
            <div className="flex items-center gap-[0.55rem] min-w-0">
              {headerIcon}
              <span className="text-[0.88rem] font-semibold text-app-fg truncate">
                {title}
              </span>
            </div>
            <button
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn"
              onClick={handleClose}
            >
              <X size={15} />
            </button>
          </div>
        )}
        {typeof children === 'function' ? children(handleClose) : children}
      </div>
    </div>
  )
}
