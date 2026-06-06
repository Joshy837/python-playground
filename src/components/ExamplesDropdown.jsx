import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ExamplesDropdown({ examples, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={ref} className="examples-dropdown">
      <button
        className={`examples-dropdown-trigger${open ? ' examples-dropdown-trigger-open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>Examples</span>
        <ChevronDown size={12} className={`examples-dropdown-chevron${open ? ' examples-dropdown-chevron-open' : ''}`} />
      </button>
      <div className={`examples-dropdown-menu${open ? ' examples-dropdown-menu-open' : ''}`}>
        {examples.map(({ label, file }) => (
          <button
            key={file}
            className="examples-dropdown-item"
            onClick={() => { onSelect(file); setOpen(false) }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
