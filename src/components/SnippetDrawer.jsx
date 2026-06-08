import { useState } from 'react'
import { BookOpen, ChevronUp, ChevronDown, X } from 'lucide-react'

export default function SnippetDrawer({ examples, onSelect, savedSnippets = [], onDeleteSnippet }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="snippet-drawer">
      <button
        className={`snippet-drawer-toggle${open ? ' snippet-drawer-toggle-open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <BookOpen size={12} />
        <span>Drawer</span>
        {savedSnippets.length > 0 && (
          <span className="snippet-drawer-count">{savedSnippets.length}</span>
        )}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <div className={`snippet-cards-row${open ? ' snippet-cards-row-open' : ''}`}>
        {examples.map(({ label, file, description }) => (
          <button key={file} className="snippet-card" onClick={() => onSelect({ label, file })}>
            <span className="snippet-card-title">{label}</span>
            {description && <span className="snippet-card-desc">{description}</span>}
          </button>
        ))}
        {savedSnippets.map(({ id, label, description, code }) => (
          <div key={id} className="snippet-card snippet-card-saved">
            <button
              className="snippet-card-body"
              onClick={() => onSelect({ label, code })}
            >
              <span className="snippet-card-title">{label}</span>
              <span className="snippet-card-desc">{description || 'Saved snippet'}</span>
            </button>
            <button
              className="snippet-card-delete"
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
