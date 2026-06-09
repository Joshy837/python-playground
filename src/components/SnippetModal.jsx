import { useState, useEffect, useRef } from 'react'
import { X, Copy, Check, ArrowUpRight, Pencil, Save } from 'lucide-react'
import * as monaco from 'monaco-editor'

export default function SnippetModal({ snippet, onClose, onLoad, onSave, monacoTheme }) {
  const [copied, setCopied] = useState(false)
  const [colorizedHtml, setColorizedHtml] = useState('')
  const [closing, setClosing] = useState(false)
  const [editing, setEditing] = useState(false)
  const editContainerRef = useRef(null)
  const editEditorRef = useRef(null)

  function handleClose() {
    setClosing(true)
  }

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') { editing ? setEditing(false) : handleClose() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [editing])

  useEffect(() => {
    if (!snippet || snippet === 'loading') return
    setClosing(false)
    setEditing(false)
    setColorizedHtml('')
    monaco.editor.colorize(snippet.code, 'python', {}).then(setColorizedHtml)
  }, [snippet?.code, monacoTheme])

  // spin up a Monaco editor when entering edit mode
  useEffect(() => {
    if (!editing || !editContainerRef.current) return
    const editor = monaco.editor.create(editContainerRef.current, {
      value: snippet.code,
      language: 'python',
      theme: monacoTheme,
      fontSize: 13,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 12, bottom: 12 },
      lineNumbers: 'on',
      folding: false,
      renderLineHighlight: 'none',
      overviewRulerLanes: 0,
    })
    editEditorRef.current = editor
    return () => {
      editor.dispose()
      editEditorRef.current = null
    }
  }, [editing])

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

  function handleSaveEdit() {
    const code = editEditorRef.current?.getValue() ?? snippet.code
    onSave(code)
    setEditing(false)
  }

  return (
    <div
      className={`modal-backdrop${closing ? ' modal-backdrop-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`modal${closing ? ' modal-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={closing ? (e => { if (e.animationName === 'modal-out') onClose() }) : undefined}
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
              {!editing && (
                <>
                  <button
                    className={`modal-code-btn modal-code-btn-copy${copied ? ' modal-code-btn-copied' : ''}`}
                    onClick={handleCopy}
                    title="Copy code"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  {onSave && (
                    <button
                      className="modal-code-btn modal-code-btn-edit"
                      onClick={() => setEditing(true)}
                      title="Edit code"
                    >
                      <Pencil size={13} />
                    </button>
                  )}
                  <button
                    className="modal-code-btn modal-code-btn-load"
                    onClick={() => { onLoad(snippet.code); handleClose() }}
                    title="Load into Editor"
                  >
                    <ArrowUpRight size={13} />
                  </button>
                </>
              )}
              {editing && (
                <>
                  <button
                    className="modal-code-btn modal-code-btn-cancel-edit"
                    onClick={() => setEditing(false)}
                    title="Cancel edit"
                  >
                    <X size={13} />
                  </button>
                  <button
                    className="modal-code-btn modal-code-btn-save"
                    onClick={handleSaveEdit}
                    title="Save changes"
                  >
                    <Save size={13} />
                  </button>
                </>
              )}
            </div>
            {editing
              ? <div className="modal-code-edit-container">
                  <div ref={editContainerRef} style={{ position: 'absolute', inset: 0 }} />
                </div>
              : colorizedHtml
                ? <pre className="modal-code" dangerouslySetInnerHTML={{ __html: colorizedHtml }} />
                : <pre className="modal-code">{snippet.code}</pre>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
