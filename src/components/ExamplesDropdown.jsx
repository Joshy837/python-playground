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
    <div ref={ref} className="relative">
      <button
        className={`flex items-center gap-[0.35rem] px-[0.6rem] py-[0.25rem] rounded-md border text-[0.75rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap bg-app-select text-app-fg ${open ? 'border-app-muted' : 'border-app-select-border'}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>Examples</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-250 shrink-0 text-app-muted ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`examples-dropdown-menu${open ? ' examples-dropdown-menu-open' : ''}`}>
        {examples.map(({ label, file }) => (
          <button
            key={file}
            className="block w-full text-left px-3 py-[0.4rem] bg-transparent border-0 text-app-fg text-[0.78rem] cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-app-btn"
            onClick={() => { onSelect(file); setOpen(false) }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
