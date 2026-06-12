import { useState, useEffect, useRef } from 'react'
import { Copy, Check, ArrowUpRight, Pencil, Save, X, Trash2 } from 'lucide-react'
import * as monaco from 'monaco-editor'
import ColorizedCodeBlock from '../shared/ColorizedCodeBlock.jsx'

export default function SnippetPreview({ snippet, monacoTheme, onLoad, onSave, onDelete, onClose, className = '' }) {
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const editContainerRef = useRef(null)
  const editEditorRef = useRef(null)

  const code = snippet && snippet !== 'loading' ? snippet.code : null

  useEffect(() => { setEditing(false) }, [code])

  useEffect(() => {
    if (!editing || !editContainerRef.current || !code) return
    const editor = monaco.editor.create(editContainerRef.current, {
      value: code,
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
    return () => { editor.dispose(); editEditorRef.current = null }
  }, [editing])

  // When editing, intercept Escape before ModalBase closes the modal
  useEffect(() => {
    if (!editing) return
    function handler(e) {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); setEditing(false) }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [editing])

  function handleCopy() {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSaveEdit() {
    const newCode = editEditorRef.current?.getValue() ?? code
    onSave?.(newCode)
    setEditing(false)
  }

  if (!snippet || snippet === 'loading') {
    return (
      <div className={`py-8 px-8 text-app-muted text-[0.85rem] ${className}`}>Loading…</div>
    )
  }

  return (
    <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-2 py-[0.6rem] px-[0.75rem] border-b border-app-border shrink-0">
        <div className="flex items-center gap-[0.55rem] min-w-0">
          <span className="text-[0.65rem] font-bold tracking-[0.07em] uppercase py-[0.18em] px-[0.55em] rounded-[5px] bg-[color-mix(in_srgb,var(--accent-try)_18%,transparent)] text-[var(--accent-try)] border border-[color-mix(in_srgb,var(--accent-try)_40%,transparent)] shrink-0 leading-[1.6]">py</span>
          <span className="text-[0.88rem] font-semibold text-app-fg truncate">{snippet.label}</span>
        </div>
        <div className="flex items-center gap-1">
          {!editing ? (
            <>
              <button className={`modal-code-btn modal-code-btn-copy${copied ? ' modal-code-btn-copied' : ''}`} onClick={handleCopy} title="Copy">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {onSave && (
                <button className="modal-code-btn modal-code-btn-edit" onClick={() => setEditing(true)} title="Edit">
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button className="modal-code-btn" style={{ color: 'var(--status-red)' }} onClick={onDelete} title="Delete">
                  <Trash2 size={13} />
                </button>
              )}
              <button className="modal-code-btn modal-code-btn-load" onClick={() => onLoad(snippet.code)} title="Load in Playground">
                <ArrowUpRight size={13} />
              </button>
            </>
          ) : (
            <>
              <button className="modal-code-btn modal-code-btn-cancel-edit" onClick={() => setEditing(false)} title="Cancel">
                <X size={13} />
              </button>
              <button className="modal-code-btn modal-code-btn-save" onClick={handleSaveEdit} title="Save changes">
                <Save size={13} />
              </button>
            </>
          )}
          {onClose && (
            <button
              className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn"
              style={{ marginLeft: '4px' }}
              onClick={onClose}
              title="Close"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {editing
          ? <div className="relative h-[min(400px,60vh)]" ref={editContainerRef} />
          : <ColorizedCodeBlock
              code={code}
              monacoTheme={monacoTheme}
              className="m-0 p-4 font-mono text-[0.82rem] leading-[1.65] text-app-stdout whitespace-pre overflow-x-auto min-h-full"
            />
        }
      </div>
    </div>
  )
}
