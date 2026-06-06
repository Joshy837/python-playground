import { useState } from 'react'
import { BookOpen, ChevronUp, ChevronDown } from 'lucide-react'

export default function SnippetDrawer({ examples, onSelect }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="snippet-drawer">
      <button
        className={`snippet-drawer-toggle${open ? ' snippet-drawer-toggle-open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <BookOpen size={12} />
        <span>Drawer</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <div className={`snippet-cards-row${open ? ' snippet-cards-row-open' : ''}`}>
        {examples.map(({ label, file, description }) => (
          <button key={file} className="snippet-card" onClick={() => onSelect({ label, file })}>
            <span className="snippet-card-title">{label}</span>
            {description && <span className="snippet-card-desc">{description}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
