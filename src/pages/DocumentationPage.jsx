import { useState, useEffect, useRef } from 'react'
import DocCard from '../components/docs/DocCard.jsx'

const CATEGORIES = [
  { label: 'Variables', file: 'variables' },
  { label: 'Operators', file: 'operators' },
  { label: 'Strings', file: 'strings' },
  { label: 'Lists', file: 'lists' },
  { label: 'Dictionaries', file: 'dictionaries' },
  { label: 'Control Flow', file: 'control-flow' },
  { label: 'Functions', file: 'functions' },
  { label: 'Error Handling', file: 'error-handling' },
  { label: 'Built-ins', file: 'builtins' },
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

export default function DocumentationPage({ pyodideReady, monacoTheme }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [visibleCategory, setVisibleCategory] = useState(CATEGORIES[0])
  const [items, setItems] = useState([])
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(null)
  const mainRef = useRef(null)

  useEffect(() => {
    fetchDocs(visibleCategory.file)
      .then(setItems)
      .catch(() => setItems([]))
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

  const CAT_BTN =
    'shrink-0 px-[0.65rem] py-[0.25rem] rounded-full border text-[0.75rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'
  const SIDEBAR_BTN =
    'block w-full text-left px-[0.6rem] py-[0.3rem] rounded-md border-0 bg-transparent text-[0.8rem] font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap'

  return (
    <div className="page-enter flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Mobile category nav (hidden on md+) */}
      <div className="flex flex-col border-b border-app-border bg-app-surface shrink-0 md:hidden">
        <div className="flex overflow-x-auto gap-[0.35rem] px-3 py-[0.45rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.file}
              onClick={() => handleCategoryChange(cat)}
              className={`${CAT_BTN} ${
                activeCategory === cat
                  ? 'text-app-fg bg-app-btn border-app-muted'
                  : 'text-app-muted border-app-output-border bg-transparent hover:text-app-fg hover:bg-app-btn'
              }`}
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
            {CATEGORIES.map((cat) => (
              <button
                key={cat.file}
                onClick={() => handleCategoryChange(cat)}
                className={`${SIDEBAR_BTN} ${
                  activeCategory === cat
                    ? 'text-app-fg bg-app-btn'
                    : 'text-app-muted hover:text-app-fg hover:bg-app-btn'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div
          className="flex-1 overflow-y-auto min-w-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--text-muted)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px]"
          ref={mainRef}
        >
          <div
            key={visibleCategory.file}
            className={`flex flex-col gap-4 p-4 sm:p-6 ${exiting ? 'doc-content-exit' : 'doc-content-enter'}`}
          >
            <h1 className="font-semibold text-base">{visibleCategory.label}</h1>
            {items.map((item) => (
              <DocCard
                key={item.name}
                item={item}
                pyodideReady={pyodideReady}
                monacoTheme={monacoTheme}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
