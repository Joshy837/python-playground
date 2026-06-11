import { useState, useEffect, useRef } from 'react'
import { Play, Copy, Check, ArrowUpRight } from 'lucide-react'
import { runCode } from '../runner.js'
import { useMonacoColorize } from '../hooks/useMonacoColorize.js'

const PENDING_KEY = 'playground-pending-load'

const CATEGORIES = [
  { label: 'Variables',      file: 'variables' },
  { label: 'Operators',      file: 'operators' },
  { label: 'Strings',        file: 'strings' },
  { label: 'Lists',          file: 'lists' },
  { label: 'Dictionaries',   file: 'dictionaries' },
  { label: 'Control Flow',   file: 'control-flow' },
  { label: 'Functions',      file: 'functions' },
  { label: 'Error Handling', file: 'error-handling' },
  { label: 'Built-ins',      file: 'builtins' },
]

const docsCache = {}

async function fetchDocs(file) {
  if (docsCache[file]) return docsCache[file]
  const res = await fetch(`/docs/${file}.json`)
  if (!res.ok) throw new Error(`Failed to load docs: ${file}`)
  const data = await res.json()
  docsCache[file] = data
  return data
}

function DocCard({ item, pyodideReady, monacoTheme }) {
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const colorizedCode = useMonacoColorize(item.ex, monacoTheme)

  async function handleRun() {
    if (isRunning || !pyodideReady) return
    setIsRunning(true)
    setOutput(null)
    try {
      const result = await runCode(item.ex)
      setOutput(result)
    } finally {
      setIsRunning(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(item.ex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleLoadInEditor() {
    try { localStorage.setItem(PENDING_KEY, item.ex) } catch {}
    window.open('/playground', '_blank')
  }

  const hasOutput = output && (output.stdout || output.stderr || output.error)

  const OUTPUT_PRE = 'font-mono text-[0.76rem] leading-[1.55] whitespace-pre-wrap m-0'

  return (
    <div className="border border-app-output-border rounded-lg overflow-hidden min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Left: explanation */}
        <div className="p-[0.85rem_1rem] bg-app-surface flex flex-col gap-[0.4rem] border-b border-app-output-border sm:w-[38%] sm:shrink-0 sm:border-b-0 sm:border-r sm:border-r-app-output-border">
          <div className="text-[0.82rem] font-bold text-app-fg mb-[0.05rem]">{item.name}</div>
          <p className="text-[0.8rem] text-app-fg leading-[1.5] m-0">{item.desc}</p>
          <p className="text-[0.76rem] text-app-muted leading-[1.55] m-0">{item.detail}</p>
        </div>

        {/* Right: code + run button + output */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ background: 'var(--monaco-bg)' }}>
          <div
            className="flex items-center justify-end gap-[0.375rem] px-2 py-[0.3rem] border-b border-app-output-border shrink-0"
            style={{ background: 'color-mix(in srgb, var(--header-bg) 60%, var(--monaco-bg))' }}
          >
            <button
              className="inline-flex items-center gap-[0.3rem] border-none bg-transparent text-[#16a34a] font-semibold cursor-pointer transition-[background-color,opacity] duration-150 py-[0.2rem] px-[0.55rem] rounded-[5px] text-[0.72rem] shrink-0 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[color-mix(in_srgb,#16a34a_12%,transparent)]"
              onClick={handleRun}
              disabled={!pyodideReady || isRunning}
              title={isRunning ? 'Running…' : pyodideReady ? 'Run (click)' : 'Connecting to Python…'}
            >
              <Play size={11} fill="currentColor" stroke="none" />
              <span>{isRunning ? 'Running…' : 'Run'}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
            <div className="relative flex-1 min-w-0 overflow-hidden">
              <div className="absolute top-[0.55rem] right-[0.55rem] flex gap-[0.3rem] z-[1]">
                <button
                  className={`modal-code-btn${copied ? ' modal-code-btn-copied' : ''}`}
                  onClick={handleCopy}
                  title="Copy code"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button
                  className="modal-code-btn modal-code-btn-load"
                  onClick={handleLoadInEditor}
                  title="Load into Editor"
                >
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <pre
                className="p-[0.7rem_0.9rem] bg-transparent font-mono text-[0.78rem] leading-[1.65] text-app-stdout whitespace-pre overflow-x-auto m-0 flex-1 min-w-0"
                dangerouslySetInnerHTML={{ __html: colorizedCode || item.ex }}
              />
            </div>
            <div className="w-full shrink-0 border-t border-app-output-border px-[0.9rem] py-[0.5rem] bg-app-surface overflow-y-auto min-h-[2.5rem] sm:w-[40%] sm:border-t-0 sm:border-l sm:border-l-app-output-border">
              {hasOutput ? (
                <>
                  {output.error && <pre className={`text-app-error ${OUTPUT_PRE}`}>{output.error}</pre>}
                  {output.stderr && <pre className={`text-app-stderr ${OUTPUT_PRE}`}>{output.stderr}</pre>}
                  {output.stdout && <pre className={`text-app-stdout ${OUTPUT_PRE}`}>{output.stdout}</pre>}
                </>
              ) : (
                <span className="text-[0.72rem] text-app-muted">Run to see output</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationPage({ pyodideReady, monacoTheme }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [visibleCategory, setVisibleCategory] = useState(CATEGORIES[0])
  const [items, setItems] = useState([])
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    fetchDocs(visibleCategory.file).then(setItems).catch(() => setItems([]))
    mainRef.current?.scrollTo({ top: 0 })
  }, [visibleCategory])

  function handleCategoryChange(cat) {
    if (cat === activeCategory) return
    clearTimeout(exitTimer.current)
    setActiveCategory(cat)
    setExiting(true)
    exitTimer.current = setTimeout(() => {
      setVisibleCategory(cat)
      setExiting(false)
    }, 160)
  }

  const CAT_BTN = 'shrink-0 px-[0.65rem] py-[0.25rem] rounded-full border text-[0.75rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'
  const SIDEBAR_BTN = 'block w-full text-left px-[0.6rem] py-[0.3rem] rounded-md border-0 bg-transparent text-[0.8rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'

  return (
    <div className="page-enter flex flex-col flex-1 min-h-0 overflow-hidden">

      {/* Mobile category nav (hidden on md+) */}
      <div className="flex flex-col border-b border-app-border bg-app-surface shrink-0 md:hidden">
        <div className="flex overflow-x-auto gap-[0.35rem] px-3 py-[0.45rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(cat => (
            <button
              key={cat.file}
              onClick={() => handleCategoryChange(cat)}
              className={`${CAT_BTN} ${activeCategory === cat
                ? 'text-app-fg bg-app-btn border-app-muted'
                : 'text-app-muted border-app-output-border bg-transparent hover:text-app-fg hover:bg-app-btn'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (hidden on mobile) */}
        <aside className="bg-app-surface hidden md:flex flex-col w-44 shrink-0 border-r border-app-border overflow-y-auto">
          <div className="px-3 py-2.5 text-xs font-semibold tracking-wide uppercase text-app-muted border-b border-app-border shrink-0">
            Reference
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.file}
                onClick={() => handleCategoryChange(cat)}
                className={`${SIDEBAR_BTN} ${activeCategory === cat
                  ? 'text-app-fg bg-app-btn'
                  : 'text-app-muted hover:text-app-fg hover:bg-app-btn'}`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto min-w-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--text-muted)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px]" ref={mainRef}>
          <div
            key={visibleCategory.file}
            className={`flex flex-col gap-4 p-4 sm:p-6 ${exiting ? 'doc-content-exit' : 'doc-content-enter'}`}
          >
            <h1 className="font-semibold text-base">{visibleCategory.label}</h1>
            {items.map(item => (
              <DocCard key={item.name} item={item} pyodideReady={pyodideReady} monacoTheme={monacoTheme} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
