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
        <div className="flex items-center justify-between py-3 px-4 border-b border-[color-mix(in_srgb,#f87171_18%,var(--header-border))] bg-[radial-gradient(ellipse_130%_160%_at_-5%_50%,color-mix(in_srgb,#f87171_10%,transparent)_0%,transparent_60%),color-mix(in_srgb,var(--header-bg)_85%,var(--app-bg))] shrink-0">
          <div className="flex items-center gap-[0.55rem] min-w-0">
            <Trash2 size={14} style={{ color: '#f87171' }} />
            <span className="text-[0.88rem] font-semibold text-app-fg truncate">Delete "{snippet.label}"?</span>
          </div>
          <button className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="flex flex-col gap-[0.3rem] p-4 pb-[0.9rem]">
          <p className="text-[0.75rem] text-app-muted mb-2">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button className="py-[0.4rem] px-[0.85rem] rounded-[7px] border border-app-border bg-transparent text-app-muted text-[0.8rem] font-medium cursor-pointer transition-[color,background-color] duration-150 hover:text-app-fg hover:bg-app-btn" onClick={handleClose}>Cancel</button>
            <button className="flex items-center gap-[0.35rem] py-[0.4rem] px-[0.85rem] rounded-[7px] border border-[color-mix(in_srgb,#f87171_40%,transparent)] bg-[color-mix(in_srgb,#f87171_15%,transparent)] text-[#f87171] text-[0.8rem] font-semibold cursor-pointer transition-[background-color] duration-150 hover:bg-[color-mix(in_srgb,#f87171_25%,transparent)]" onClick={handleDelete}>
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
