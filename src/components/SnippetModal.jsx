import { useState, useEffect } from 'react'
import { X, Copy, Check, ArrowRight } from 'lucide-react'

export default function SnippetModal({ snippet, onClose, onLoad }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!snippet) return null

  if (snippet === 'loading') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal">
          <div className="modal-loading">Loading…</div>
        </div>
      </div>
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{snippet.label}</span>
          <button className="modal-close-btn" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="modal-body">
          <pre className="modal-code">{snippet.code}</pre>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="modal-btn modal-btn-primary" onClick={() => { onLoad(snippet.code); onClose() }}>
            <ArrowRight size={13} />
            <span>Load into Editor</span>
          </button>
        </div>
      </div>
    </div>
  )
}
