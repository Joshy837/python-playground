import { useEffect, useRef, useState } from 'react'
import { usePageTheme } from '../../hooks/useMedia.js'
import { tokenize } from '../../utils/tokenize.js'

const SNIPPETS = [
  `# say hello
name = "World"
print(f"Hello, {name}!")`,

  `# list comprehension
squares = [x**2 for x in range(1, 6)]
print(squares)`,

  `# fibonacci
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b
fib(8)`,

  `# sort by length
words = ["banana", "apple", "fig", "cherry"]
words.sort(key=len)
print(words)`,
]

const CHAR_DELAY = 40
const PAUSE_AFTER = 2400

// Colors match Monaco theme definitions in monacoSetup.js / LessonPage TOKEN_COLORS
const DEMO_COLORS = {
  '':        { kw: '#e06c75', string: '#e5c07b', number: '#c678dd', comment: '#676f7d', builtin: '#56b6c2', plain: '#abb2bf' },
  'dark':    { kw: '#e06c75', string: '#e5c07b', number: '#c678dd', comment: '#676f7d', builtin: '#56b6c2', plain: '#abb2bf' },
  'light':   { kw: '#0000ff', string: '#a31515', number: '#098658', comment: '#008000', builtin: '#000000', plain: '#000000' },
  'hc-dark': { kw: '#c586c0', string: '#ce9178', number: '#b5cea8', comment: '#608b4e', builtin: '#9cdcfe', plain: '#ffffff' },
  'hc-light':{ kw: '#0f4a85', string: '#b94824', number: '#005000', comment: '#4d7a00', builtin: '#0f4a85', plain: '#000000' },
}

const TOKENIZED = SNIPPETS.map(tokenize)

export default function CodeTypewriter() {
  const theme = usePageTheme()
  const colors = DEMO_COLORS[theme] ?? DEMO_COLORS['']
  const [charCount, setCharCount] = useState(0)
  const [snippetIdx, setSnippetIdx] = useState(0)
  const state = useRef({ charIdx: 0, snippetIdx: 0, pausing: false })

  useEffect(() => {
    let timer
    const s = state.current

    function tick() {
      const snippet = SNIPPETS[s.snippetIdx]
      if (s.pausing) {
        s.charIdx = 0
        s.snippetIdx = (s.snippetIdx + 1) % SNIPPETS.length
        s.pausing = false
        setCharCount(0)
        setSnippetIdx(s.snippetIdx)
        timer = setTimeout(tick, 200)
      } else if (s.charIdx < snippet.length) {
        s.charIdx++
        const ch = snippet[s.charIdx - 1]
        setCharCount(s.charIdx)
        const delay = ch === '\n' ? CHAR_DELAY * 4 : CHAR_DELAY + (Math.random() * 20 - 10)
        timer = setTimeout(tick, delay)
      } else {
        s.pausing = true
        timer = setTimeout(tick, PAUSE_AFTER)
      }
    }

    timer = setTimeout(tick, 500)
    return () => clearTimeout(timer)
  }, [])

  const spans = []
  let remaining = charCount
  for (let i = 0; i < TOKENIZED[snippetIdx].length && remaining > 0; i++) {
    const { type, text } = TOKENIZED[snippetIdx][i]
    const visible = text.slice(0, remaining)
    remaining -= visible.length
    spans.push(<span key={i} style={{ color: colors[type] }}>{visible}</span>)
  }

  return (
    <div className="bg-[var(--monaco-bg)] border border-app-border rounded-xl overflow-hidden relative z-[1]">
      <div className="flex items-center gap-[6px] px-[14px] py-[10px] border-b border-app-border bg-app-surface">
        <span className="inline-block w-[11px] h-[11px] rounded-full opacity-85" style={{ background: '#ff5f57' }} />
        <span className="inline-block w-[11px] h-[11px] rounded-full opacity-85" style={{ background: '#ffbd2e' }} />
        <span className="inline-block w-[11px] h-[11px] rounded-full opacity-85" style={{ background: '#28ca41' }} />
      </div>
      <pre className="m-0 px-6 py-5 font-mono text-[0.83rem] leading-[1.65] text-app-fg min-h-[9rem] whitespace-pre [tab-size:4]">{spans}<span className="landing-code-cursor">▋</span></pre>
    </div>
  )
}
