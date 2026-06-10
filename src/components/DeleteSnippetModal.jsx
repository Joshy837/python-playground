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
          <div className="flex items-center gap-[0.55rem] min-w-0">
            <Trash2 size={14} style={{ color: '#f87171' }} />
            <span className="text-[0.88rem] font-semibold text-app-fg truncate">Delete "{snippet.label}"?</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="flex flex-col gap-[0.3rem] p-4 pb-[0.9rem]">
          <p className="text-[0.75rem] text-app-muted mb-2">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
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
