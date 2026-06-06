import { useState, useEffect } from 'react'
import { X, Copy, Check, ArrowUpRight } from 'lucide-react'
import * as monaco from 'monaco-editor'

export default function SnippetModal({ snippet, onClose, onLoad, monacoTheme }) {
  const [copied, setCopied] = useState(false)
  const [colorizedHtml, setColorizedHtml] = useState('')
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
  }

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!snippet || snippet === 'loading') return
    setClosing(false)
    monaco.editor.colorize(snippet.code, 'python', {}).then(setColorizedHtml)
  }, [snippet?.code, monacoTheme])

  if (!snippet) return null

  if (snippet === 'loading') {
    return (
      <div className="modal-backdrop" onClick={handleClose}>
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
    <div
      className={`modal-backdrop${closing ? ' modal-backdrop-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal${closing ? ' modal-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={closing ? onClose : undefined}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="modal-lang-badge">py</span>
            <span className="modal-title">{snippet.label}</span>
          </div>
          <button className="modal-close-btn" onClick={handleClose}><X size={15} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-code-wrapper">
            <div className="modal-code-actions">
              <button
                className={`modal-code-btn${copied ? ' modal-code-btn-copied' : ''}`}
                onClick={handleCopy}
                title="Copy code"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              <button
                className="modal-code-btn modal-code-btn-load"
                onClick={() => { onLoad(snippet.code); handleClose() }}
                title="Load into Editor"
              >
                <ArrowUpRight size={13} />
              </button>
            </div>
            {colorizedHtml
              ? <pre className="modal-code" dangerouslySetInnerHTML={{ __html: colorizedHtml }} />
              : <pre className="modal-code">{snippet.code}</pre>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
