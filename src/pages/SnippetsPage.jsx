import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, BookmarkPlus, Copy, Check, ArrowUpRight, Pencil, Save, Trash2 } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { useSnippetManagement, PENDING_KEY } from '../hooks/useSnippetManagement.js'
import { useMonacoColorize } from '../hooks/useMonacoColorize.js'
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

export default function SnippetsPage({ monacoTheme }) {
  const navigate = useNavigate()
  const { savedSnippets, updateSnippet, deleteSnippet } = useSnippetManagement()
  const [preview, setPreview] = useState(null)   // null | 'loading' | { id?, label, code }
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [previewClosing, setPreviewClosing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const editContainerRef = useRef(null)
  const editEditorRef = useRef(null)

  const colorizedHtml = useMonacoColorize(
    preview && preview !== 'loading' ? preview.code : null,
    monacoTheme,
  )

  useEffect(() => { setEditing(false) }, [preview?.code])

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
    updateSnippet(id, code)
    setPreview(prev => ({ ...prev, code }))
    setEditing(false)
    setToast({ id: Date.now(), message: 'Snippet updated' })
  }

  function confirmDelete() {
    deleteSnippet(deleteTarget.id)
    if (preview?.id === deleteTarget.id) setPreview(null)
    setToast({ id: Date.now(), message: 'Snippet deleted' })
  }

  const previewOpen = preview !== null
  const previewLoading = preview === 'loading'

  return (
    <main className="flex-1 overflow-y-auto md:overflow-hidden relative bg-[radial-gradient(circle,color-mix(in_srgb,var(--text-muted)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px] bg-fixed text-app-fg flex flex-col page-enter">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_50%_at_25%_45%,color-mix(in_srgb,var(--accent-try)_9%,transparent)_0%,transparent_70%),radial-gradient(ellipse_50%_55%_at_80%_30%,color-mix(in_srgb,var(--accent-quiz)_8%,transparent)_0%,transparent_70%),radial-gradient(ellipse_45%_40%_at_55%_80%,color-mix(in_srgb,var(--accent-challenge)_7%,transparent)_0%,transparent_70%)] blur-[60px] pointer-events-none" aria-hidden="true" />
      <div className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-xl font-bold text-app-fg">Snippets</h1>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-6 md:overflow-hidden">
          {/* Card list */}
          <div className="flex-1 min-w-0 md:overflow-y-auto">
            <section className="mb-10">
              <h2 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-4">Examples</h2>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {EXAMPLES.map(({ label, file, description }) => {
                  const active = preview?.label === label && !preview?.id
                  return (
                    <button
                      key={file}
                      className={`flex flex-col gap-[0.3rem] w-full h-[100px] py-[0.85rem] px-4 rounded-[10px] border text-left cursor-pointer transition-[border-color,background-color] duration-150 ${active ? 'border-[color-mix(in_srgb,var(--accent-try)_60%,var(--header-border))] bg-[color-mix(in_srgb,var(--accent-try)_8%,var(--app-bg))]' : 'border-app-border bg-app-surface hover:border-app-muted hover:bg-app-btn'}`}
                      onClick={() => handleExampleClick({ label, file })}
                    >
                      <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${active ? 'text-[var(--accent-try)]' : 'text-app-fg'}`}>{label}</span>
                      {description && <span className="text-[0.78rem] text-app-muted leading-[1.4] line-clamp-2">{description}</span>}
                    </button>
                  )
                })}
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
                  {savedSnippets.map(({ id, label, description, code }) => {
                    const active = preview?.id === id
                    return (
                      <div
                        key={id}
                        className={`relative flex flex-row items-stretch w-full h-[100px] rounded-[10px] overflow-hidden border transition-[border-color,background-color] duration-150 ${active ? 'border-[color-mix(in_srgb,var(--accent-try)_60%,var(--header-border))] bg-[color-mix(in_srgb,var(--accent-try)_8%,var(--app-bg))]' : 'border-app-border bg-app-surface hover:border-app-muted hover:bg-app-btn-hover'}`}
                      >
                        <button
                          className="flex flex-col gap-[0.3rem] flex-1 py-[0.85rem] px-4 text-left cursor-pointer bg-transparent border-none min-w-0"
                          onClick={() => handleSavedClick({ id, label, code })}
                        >
                          <span className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${active ? 'text-[var(--accent-try)]' : 'text-app-fg'}`}>{label}</span>
                          <span className="text-[0.78rem] text-app-muted leading-[1.4] line-clamp-2">{description || 'Saved snippet'}</span>
                        </button>
                        <button
                          className="flex items-center justify-center px-[0.45rem] bg-transparent border-none border-l border-app-border text-app-muted cursor-pointer transition-[color,background-color] duration-150 rounded-[0_10px_10px_0] hover:text-[#f87171] hover:bg-[color-mix(in_srgb,#f87171_12%,transparent)]"
                          title="Delete"
                          onClick={e => { e.stopPropagation(); setDeleteTarget({ id, label, description, code }) }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Side preview panel */}
          {previewOpen && (
            <div
              className={`w-[500px] min-w-[300px] shrink-0 rounded-[10px] border border-app-border bg-app-surface overflow-hidden flex flex-col animate-[preview-panel-in_0.2s_ease] max-md:w-full max-md:max-h-[60vh] max-md:animate-[preview-panel-in-mobile_0.2s_ease]${previewClosing ? ' snippets-preview-closing' : ''}`}
              onAnimationEnd={previewClosing ? handlePanelAnimationEnd : undefined}
            >
              <div
                key={preview === 'loading' ? '__loading__' : String(preview.id ?? preview.label)}
                className="flex flex-col flex-1 min-h-0 overflow-hidden animate-[preview-content-in_0.15s_ease]"
              >
              {previewLoading ? (
                <div className="py-8 px-8 text-app-muted text-[0.85rem]">Loading…</div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 py-[0.6rem] px-[0.75rem] border-b border-app-border shrink-0">
                    <div className="flex items-center gap-[0.55rem] min-w-0">
                      <span className="text-[0.65rem] font-bold tracking-[0.07em] uppercase py-[0.18em] px-[0.55em] rounded-[5px] bg-[color-mix(in_srgb,var(--accent-try)_18%,transparent)] text-[var(--accent-try)] border border-[color-mix(in_srgb,var(--accent-try)_40%,transparent)] shrink-0 leading-[1.6]">py</span>
                      <span className="text-[0.88rem] font-semibold text-app-fg truncate">{preview.label}</span>
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
                      <button className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn" style={{ marginLeft: '4px' }} onClick={closePreview}>
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-0">
                    {editing
                      ? <div className="relative h-[min(400px,60vh)]" ref={editContainerRef} />
                      : colorizedHtml
                        ? <pre className="m-0 p-4 font-mono text-[0.82rem] leading-[1.65] text-app-stdout whitespace-pre overflow-x-auto min-h-full" dangerouslySetInnerHTML={{ __html: colorizedHtml }} />
                        : <pre className="m-0 p-4 font-mono text-[0.82rem] leading-[1.65] text-app-stdout whitespace-pre overflow-x-auto min-h-full">{preview.code}</pre>
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
