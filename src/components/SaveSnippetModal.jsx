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
        <div className="modal-header">
          <div className="modal-header-left">
            <BookmarkPlus size={15} style={{ color: 'var(--accent)' }} />
            <span className="modal-title">{isEdit ? 'Edit Snippet' : 'Add to Drawer'}</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="save-snippet-body">
          <label className="save-snippet-label">Snippet name</label>
          <input
            ref={inputRef}
            className="save-snippet-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={defaultName}
            maxLength={60}
          />
          <label className="save-snippet-label">Description <span className="save-snippet-char-count">{description.length}/{DESC_MAX}</span></label>
          <textarea
            className="save-snippet-input save-snippet-textarea"
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, DESC_MAX))}
            placeholder="Optional — what does this snippet do?"
            rows={2}
          />
          <div className="save-snippet-actions">
            <button className="save-snippet-btn-cancel" onClick={handleClose}>Cancel</button>
            <button className="save-snippet-btn-save" onClick={handleSave}>
              <BookmarkPlus size={13} />
              {isEdit ? 'Save Changes' : 'Add to Drawer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
