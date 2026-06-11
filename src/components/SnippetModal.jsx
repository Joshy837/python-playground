import { useState, useEffect, useRef } from 'react'
import { Copy, Check, ArrowUpRight, Pencil, Save, X } from 'lucide-react'
import * as monaco from 'monaco-editor'
import ModalBase from './ModalBase.jsx'
import { useMonacoColorize } from '../hooks/useMonacoColorize.js'

export default function SnippetModal({ snippet, onClose, onLoad, onSave, monacoTheme }) {
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const editContainerRef = useRef(null)
  const editEditorRef = useRef(null)

  const colorizedHtml = useMonacoColorize(
    snippet && snippet !== 'loading' ? snippet.code : null,
    monacoTheme,
  )

  useEffect(() => {
    if (!snippet || snippet === 'loading') return
    setEditing(false)
  }, [snippet?.code])

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
      <div className="modal-backdrop">
        <div className="modal">
          <div className="p-8 text-center text-[0.85rem] text-app-muted">Loading…</div>
        </div>
      </div>
    )
  }

  function handleCopy() {
    navigator.clipboard.writeText(snippet.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSaveEdit(close) {
    const code = editEditorRef.current?.getValue() ?? snippet.code
    onSave(code)
    setEditing(false)
    close()
  }

  const pyBadge = (
    <span className="text-[0.65rem] font-bold tracking-[0.07em] uppercase py-[0.18em] px-[0.55em] rounded-[5px] bg-[color-mix(in_srgb,var(--accent-try)_18%,transparent)] text-[var(--accent-try)] border border-[color-mix(in_srgb,var(--accent-try)_40%,transparent)] shrink-0 leading-[1.6]">py</span>
  )

  return (
    <ModalBase
      onClose={onClose}
      headerIcon={pyBadge}
      title={snippet.label}
      onEscape={close => editing ? setEditing(false) : close()}
    >
      {close => (
        <div className="flex-1 min-h-0 p-4 bg-[radial-gradient(ellipse_70%_55%_at_100%_100%,color-mix(in_srgb,var(--accent-quiz)_7%,transparent),transparent_65%),radial-gradient(ellipse_50%_40%_at_0%_0%,color-mix(in_srgb,var(--accent-try)_5%,transparent),transparent_60%),var(--app-bg)] flex flex-col">
          <div className="relative rounded-[9px] border border-[color-mix(in_srgb,var(--accent-try)_20%,var(--header-border))] bg-[var(--monaco-bg)] overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="absolute top-[0.55rem] right-[0.55rem] flex gap-[0.3rem] z-[1]">
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
                    onClick={() => { onLoad(snippet.code); close() }}
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
                    onClick={() => handleSaveEdit(close)}
                    title="Save changes"
                  >
                    <Save size={13} />
                  </button>
                </>
              )}
            </div>
            {editing
              ? <div className="relative flex-1 min-h-0">
                  <div ref={editContainerRef} style={{ position: 'absolute', inset: 0 }} />
                </div>
              : colorizedHtml
                ? <pre className="m-0 p-4 font-mono text-[0.82rem] leading-[1.65] text-app-stdout whitespace-pre overflow-auto flex-1 min-h-0" dangerouslySetInnerHTML={{ __html: colorizedHtml }} />
                : <pre className="m-0 p-4 font-mono text-[0.82rem] leading-[1.65] text-app-stdout whitespace-pre overflow-auto flex-1 min-h-0">{snippet.code}</pre>
            }
          </div>
        </div>
      )}
    </ModalBase>
  )
}
