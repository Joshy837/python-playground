import { useState, useEffect } from 'react'
import { Trash2, X } from 'lucide-react'

export default function DeleteSnippetModal({ snippet, onConfirm, onClose }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleClose() { setClosing(true) }

  function handleDelete() {
    onConfirm()
    handleClose()
  }

  return (
    <div
      className={`modal-backdrop${closing ? ' modal-backdrop-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`delete-snippet-modal${closing ? ' modal-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={closing ? e => { if (e.animationName === 'modal-out') onClose() } : undefined}
      >
        <div className="delete-snippet-header">
          <div className="modal-header-left">
            <Trash2 size={14} style={{ color: '#f87171' }} />
            <span className="modal-title">Delete "{snippet.label}"?</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="delete-snippet-body">
          <p className="delete-snippet-hint">This action cannot be undone.</p>
          <div className="delete-snippet-actions">
            <button className="save-snippet-btn-cancel" onClick={handleClose}>Cancel</button>
            <button className="delete-snippet-btn-delete" onClick={handleDelete}>
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
