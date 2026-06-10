import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, BookmarkPlus, Copy, Check, ArrowUpRight, Pencil, Save, Trash2 } from 'lucide-react'
import * as monaco from 'monaco-editor'
import DeleteSnippetModal from '../components/DeleteSnippetModal.jsx'
import Toast from '../components/Toast.jsx'

const EXAMPLES = [
  { label: 'Hello World',         file: 'hello_world.py',         description: 'Your first Python program'         },
  { label: 'Fibonacci',           file: 'fibonacci.py',           description: 'Classic number sequence'           },
  { label: 'FizzBuzz',            file: 'fizzbuzz.py',            description: 'Divisibility with conditionals'    },
  { label: 'List Comprehensions', file: 'list_comprehensions.py', description: 'Concise list transformations'      },
  { label: 'Classes',             file: 'classes.py',             description: 'OOP with classes & inheritance'    },
  { label: 'Matplotlib',          file: 'matplotlib_plot.py',     description: 'Plot charts in the browser'        },
]

const SNIPPETS_KEY = 'playground-saved-snippets-v1'
const PENDING_KEY = 'playground-pending-load'

function loadSavedSnippets() {
  try { return JSON.parse(localStorage.getItem(SNIPPETS_KEY)) || [] } catch { return [] }
}

export default function SnippetsPage({ monacoTheme }) {
  const navigate = useNavigate()
  const [savedSnippets, setSavedSnippets] = useState(loadSavedSnippets)
  const [preview, setPreview] = useState(null)   // null | 'loading' | { id?, label, code }
  const [editing, setEditing] = useState(false)
  const [colorizedHtml, setColorizedHtml] = useState('')
  const [copied, setCopied] = useState(false)
  const [previewClosing, setPreviewClosing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const editContainerRef = useRef(null)
  const editEditorRef = useRef(null)

  // Colorize code when preview changes or theme changes
  useEffect(() => {
    if (!preview || preview === 'loading') { setColorizedHtml(''); return }
    setEditing(false)
    setColorizedHtml('')
    monaco.editor.colorize(preview.code, 'python', {}).then(setColorizedHtml)
  }, [preview?.code, monacoTheme])

  // Mount Monaco editor in edit mode
  useEffect(() => {
    if (!editing || !editContainerRef.current || !preview || preview === 'loading') return
    const editor = monaco.editor.create(editContainerRef.current, {
      value: preview.code,
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

  function closePreview() {
    setPreviewClosing(true)
  }

  function handlePanelAnimationEnd(e) {
    if (e.animationName === 'preview-panel-out') {
      setPreview(null)
      setPreviewClosing(false)
      setEditing(false)
    }
  }

  async function handleExampleClick({ label, file }) {
    setPreviewClosing(false)
    setPreview('loading')
    try {
      const res = await fetch(`/examples/${file}`)
      if (!res.ok) throw new Error()
      const code = await res.text()
      setPreview({ label, code })
    } catch {
      setPreview(null)
    }
  }

  function handleSavedClick({ id, label, code }) {
    setPreviewClosing(false)
    setPreview({ id, label, code })
  }

  function loadInPlayground(code) {
    try { localStorage.setItem(PENDING_KEY, code) } catch {}
    navigate('/playground')
  }

  function handleCopy() {
    if (!preview || preview === 'loading') return
    navigator.clipboard.writeText(preview.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSaveEdit() {
    const code = editEditorRef.current?.getValue() ?? preview.code
    const id = preview?.id
    if (!id) return
    const next = savedSnippets.map(s => s.id === id ? { ...s, code } : s)
    setSavedSnippets(next)
    setPreview(prev => ({ ...prev, code }))
    try { localStorage.setItem(SNIPPETS_KEY, JSON.stringify(next)) } catch {}
    setEditing(false)
    setToast({ id: Date.now(), message: 'Snippet updated' })
  }

  function confirmDelete() {
    const next = savedSnippets.filter(s => s.id !== deleteTarget.id)
    setSavedSnippets(next)
    if (preview?.id === deleteTarget.id) setPreview(null)
    try { localStorage.setItem(SNIPPETS_KEY, JSON.stringify(next)) } catch {}
    setToast({ id: Date.now(), message: 'Snippet deleted' })
  }

  const previewOpen = preview !== null
  const previewLoading = preview === 'loading'

  return (
    <main className="snippets-page flex-1 overflow-y-auto md:overflow-hidden landing-bg flex flex-col page-enter">
      <div className="landing-aurora" aria-hidden="true" />
      <div className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-xl font-bold text-app-fg">Snippets</h1>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-6 md:overflow-hidden">
          {/* Card list */}
          <div className="flex-1 min-w-0 md:overflow-y-auto">
            <section className="mb-10">
              <h2 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-4">Examples</h2>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {EXAMPLES.map(({ label, file, description }) => (
                  <button
                    key={file}
                    className={`snippet-card${preview?.label === label && !preview?.id ? ' snippet-card-active' : ''}`}
                    style={{ width: '100%' }}
                    onClick={() => handleExampleClick({ label, file })}
                  >
                    <span className="snippet-card-title">{label}</span>
                    {description && <span className="snippet-card-desc">{description}</span>}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-4">My Snippets</h2>
              {savedSnippets.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-app-muted border border-dashed border-app-border rounded-xl">
                  <BookmarkPlus size={26} style={{ opacity: 0.35 }} />
                  <p className="text-sm">No saved snippets yet.</p>
                  <p className="text-xs" style={{ opacity: 0.6 }}>Save code from the Playground to see it here.</p>
                </div>
              ) : (
                <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                  {savedSnippets.map(({ id, label, description, code }) => (
                    <div
                      key={id}
                      className={`snippet-card snippet-card-saved${preview?.id === id ? ' snippet-card-active' : ''}`}
                      style={{ width: '100%' }}
                    >
                      <button
                        className="snippet-card-body"
                        onClick={() => handleSavedClick({ id, label, code })}
                      >
                        <span className="snippet-card-title">{label}</span>
                        <span className="snippet-card-desc">{description || 'Saved snippet'}</span>
                      </button>
                      <button
                        className="snippet-card-delete"
                        title="Delete"
                        onClick={e => { e.stopPropagation(); setDeleteTarget({ id, label, description, code }) }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Side preview panel */}
          {previewOpen && (
            <div
              className={`snippets-preview-panel${previewClosing ? ' snippets-preview-closing' : ''}`}
              onAnimationEnd={previewClosing ? handlePanelAnimationEnd : undefined}
            >
              <div
                key={preview === 'loading' ? '__loading__' : String(preview.id ?? preview.label)}
                className="snippets-preview-content"
              >
              {previewLoading ? (
                <div className="modal-loading" style={{ padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</div>
              ) : (
                <>
                  <div className="snippets-preview-header">
                    <div className="modal-header-left">
                      <span className="modal-lang-badge">py</span>
                      <span className="modal-title">{preview.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {!editing && (
                        <>
                          <button className={`modal-code-btn modal-code-btn-copy${copied ? ' modal-code-btn-copied' : ''}`} onClick={handleCopy} title="Copy">
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                          {preview.id && (
                            <button className="modal-code-btn modal-code-btn-edit" onClick={() => setEditing(true)} title="Edit">
                              <Pencil size={13} />
                            </button>
                          )}
                          {preview.id && (
                            <button className="modal-code-btn" onClick={() => setDeleteTarget(preview)} title="Delete" style={{ color: 'var(--status-red)' }}>
                              <Trash2 size={13} />
                            </button>
                          )}
                          <button className="modal-code-btn modal-code-btn-load" onClick={() => loadInPlayground(preview.code)} title="Load in Playground">
                            <ArrowUpRight size={13} />
                          </button>
                        </>
                      )}
                      {editing && (
                        <>
                          <button className="modal-code-btn modal-code-btn-cancel-edit" onClick={() => setEditing(false)} title="Cancel">
                            <X size={13} />
                          </button>
                          <button className="modal-code-btn modal-code-btn-save" onClick={handleSaveEdit} title="Save changes">
                            <Save size={13} />
                          </button>
                        </>
                      )}
                      <button className="modal-close-btn" style={{ marginLeft: '4px' }} onClick={closePreview}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="snippets-preview-body">
                    {editing
                      ? <div className="snippets-preview-editor" ref={editContainerRef} />
                      : colorizedHtml
                        ? <pre className="modal-code" dangerouslySetInnerHTML={{ __html: colorizedHtml }} />
                        : <pre className="modal-code">{preview.code}</pre>
                    }
                  </div>
                </>
              )}
              </div>
            </div>
          )}
      </div>

      {deleteTarget && (
        <DeleteSnippetModal
          snippet={deleteTarget}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
      {toast && <Toast key={toast.id} message={toast.message} onDone={() => setToast(null)} />}
    </main>
  )
}
