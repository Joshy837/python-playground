import { useState, useEffect, useRef } from 'react'
import { X, BookmarkPlus } from 'lucide-react'

const DESC_MAX = 60

export default function SaveSnippetModal({ defaultName, defaultDescription = '', isEdit = false, onSave, onClose }) {
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)
  const [closing, setClosing] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleClose() { setClosing(true) }

  function handleSave() {
    onSave(name.trim() || defaultName, description.trim())
    handleClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.target === inputRef.current) handleSave()
  }

  return (
    <div
      className={`modal-backdrop${closing ? ' modal-backdrop-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`save-snippet-modal${closing ? ' modal-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={closing ? e => { if (e.animationName === 'modal-out') onClose() } : undefined}
      >
        <div className="flex items-center justify-between py-3 px-4 border-b border-[color-mix(in_srgb,var(--accent-try)_18%,var(--header-border))] bg-[radial-gradient(ellipse_130%_160%_at_-5%_50%,color-mix(in_srgb,var(--accent-try)_12%,transparent)_0%,transparent_60%),color-mix(in_srgb,var(--header-bg)_85%,var(--app-bg))] shrink-0">
          <div className="flex items-center gap-[0.55rem] min-w-0">
            <BookmarkPlus size={15} style={{ color: 'var(--accent)' }} />
            <span className="text-[0.88rem] font-semibold text-app-fg truncate">{isEdit ? 'Edit Snippet' : 'Add to Drawer'}</span>
          </div>
          <button className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="flex flex-col gap-[0.6rem] px-4 pt-[1.1rem] pb-4">
          <label className="text-[0.75rem] font-medium text-app-muted flex justify-between items-baseline">Snippet name</label>
          <input
            ref={inputRef}
            className="w-full py-2 px-[0.7rem] rounded-[8px] border border-app-border bg-app-bg text-app-fg text-[0.875rem] outline-none transition-[border-color] duration-150 focus:border-app-muted"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={defaultName}
            maxLength={60}
          />
          <label className="text-[0.75rem] font-medium text-app-muted flex justify-between items-baseline">
            Description
            <span className="text-[0.7rem] text-app-muted opacity-70">{description.length}/{DESC_MAX}</span>
          </label>
          <textarea
            className="w-full py-2 px-[0.7rem] rounded-[8px] border border-app-border bg-app-bg text-app-fg text-[0.875rem] outline-none transition-[border-color] duration-150 focus:border-app-muted resize-none font-[inherit] leading-[1.5]"
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, DESC_MAX))}
            placeholder="Optional — what does this snippet do?"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button className="py-[0.4rem] px-[0.85rem] rounded-[7px] border border-app-border bg-transparent text-app-muted text-[0.8rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn" onClick={handleClose}>Cancel</button>
            <button className="flex items-center gap-[0.35rem] py-[0.4rem] px-[0.85rem] rounded-[7px] border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)] text-[0.8rem] font-semibold cursor-pointer transition-[background-color] duration-150 hover:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]" onClick={handleSave}>
              <BookmarkPlus size={13} />
              {isEdit ? 'Save Changes' : 'Add to Drawer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
