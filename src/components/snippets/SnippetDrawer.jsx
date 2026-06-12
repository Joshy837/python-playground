import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronUp, ChevronDown, X, ArrowUpRight } from 'lucide-react'

export default function SnippetDrawer({ examples, onSelect, savedSnippets = [], onDeleteSnippet }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-3 left-3 right-3 z-10 rounded-[10px] overflow-hidden border border-[var(--accent-try)] bg-app-surface shadow-[0_8px_32px_color-mix(in_srgb,#000_40%,transparent)]">
      <div className="flex items-center gap-1">
        <button
          className={`flex items-center gap-[0.35rem] w-full py-[0.35rem] px-3 bg-transparent border-none text-app-muted text-[0.72rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn${open ? ' border-b border-app-border' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          <BookOpen size={12} />
          <span>Drawer</span>
          {savedSnippets.length > 0 && (
            <span className="text-[0.65rem] font-semibold bg-[--accent-try]/20 text-[var(--accent-try)] rounded-full px-[0.35rem] leading-[1.5]">
              {savedSnippets.length}
            </span>
          )}
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <Link
          to="/snippets"
          className="flex items-center gap-[0.35rem] shrink-0 py-[0.35rem] px-3 bg-transparent border-none text-app-muted text-[0.72rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn no-underline"
          title="View all snippets"
        >
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className={`flex gap-2 overflow-x-auto overflow-y-hidden [scrollbar-width:thin] transition-[max-height,opacity,padding] duration-[400ms] ${open ? 'max-h-[120px] opacity-100 py-2 px-3' : 'max-h-0 opacity-0 px-3'}`}>
        {examples.map(({ label, file, description }) => (
          <button
            key={file}
            className="flex flex-col gap-[0.2rem] shrink-0 w-[140px] py-[0.55rem] px-[0.7rem] rounded-lg border border-app-border bg-app-bg text-left cursor-pointer transition-[border-color,background-color] duration-150 hover:border-app-muted hover:bg-app-btn"
            onClick={() => onSelect({ label, file })}
          >
            <span className="text-[0.78rem] font-semibold text-app-fg whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
            {description && <span className="text-[0.7rem] text-app-muted leading-[1.4] line-clamp-2">{description}</span>}
          </button>
        ))}
        {savedSnippets.map(({ id, label, description, code }) => (
          <div
            key={id}
            className="relative flex flex-row items-stretch shrink-0 w-[140px] rounded-lg overflow-hidden border border-[color-mix(in_srgb,var(--accent-try)_30%,var(--header-border))] bg-app-bg transition-[border-color] duration-150 hover:border-[var(--accent-try)]"
          >
            <button
              className="flex flex-col gap-[0.2rem] flex-1 py-[0.55rem] px-[0.7rem] text-left cursor-pointer bg-transparent border-none min-w-0"
              onClick={() => onSelect({ id, label, code })}
            >
              <span className="text-[0.78rem] font-semibold text-app-fg whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
              <span className="text-[0.7rem] text-app-muted leading-[1.4] line-clamp-2">{description || 'Saved snippet'}</span>
            </button>
            <button
              className="flex items-center justify-center px-[0.45rem] bg-transparent border-none border-l border-app-border text-app-muted cursor-pointer transition-[color,background-color] duration-150 rounded-[0_8px_8px_0] hover:text-[#f87171] hover:bg-[#f87171]/12"
              title="Delete"
              onClick={e => { e.stopPropagation(); onDeleteSnippet(id) }}
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
