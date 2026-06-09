import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, GraduationCap, BookOpen, Zap, Globe, Lock } from 'lucide-react'

const features = [
  {
    icon: Terminal,
    title: 'Playground',
    description: 'Write and run Python instantly in the browser. No installs, no setup — just code.',
    href: '/playground',
    accent: 'var(--accent-try)',
  },
  {
    icon: GraduationCap,
    title: 'Course',
    description: 'Work through Python fundamentals step by step with interactive exercises and a visual skill tree.',
    href: '/course',
    accent: 'var(--accent-quiz)',
  },
  {
    icon: BookOpen,
    title: 'Docs',
    description: 'Browse reference material with live, runnable code examples you can tweak and execute right on the page.',
    href: '/docs',
    accent: 'var(--accent-challenge)',
  },
]

const perks = [
  { icon: Globe, label: 'Runs entirely in your browser' },
  { icon: Zap,   label: 'Zero setup required' },
  { icon: Lock,  label: 'No account needed' },
]

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

// Tokenizer — maps to existing CSS accent variables
const TOKEN_RE = /(?<comment>#[^\n]*)|(?<string>f?"""[\s\S]*?"""|f?'''[\s\S]*?'''|f?"(?:[^"\\]|\\.)*"|f?'(?:[^'\\]|\\.)*')|(?<number>\b\d+(?:\.\d+)?\b)|(?<kw>\b(?:def|class|return|if|elif|else|for|while|in|import|from|as|with|pass|break|continue|lambda|and|or|not|is|None|True|False|yield|raise|try|except|finally|global|nonlocal|del|assert)\b)|(?<builtin>\b(?:print|range|len|sorted|list|dict|set|tuple|str|int|float|bool|type|zip|map|filter|enumerate|sum|min|max|abs|round|open|input|repr)\b)|(?<plain>[\s\S])/g

// Colors match Monaco theme definitions in monacoSetup.js / LessonPage TOKEN_COLORS
const DEMO_COLORS = {
  '':        { kw: '#e06c75', string: '#e5c07b', number: '#c678dd', comment: '#676f7d', builtin: '#56b6c2', plain: '#abb2bf' },
  'dark':    { kw: '#e06c75', string: '#e5c07b', number: '#c678dd', comment: '#676f7d', builtin: '#56b6c2', plain: '#abb2bf' },
  'light':   { kw: '#0000ff', string: '#a31515', number: '#098658', comment: '#008000', builtin: '#000000', plain: '#000000' },
  'hc-dark': { kw: '#c586c0', string: '#ce9178', number: '#b5cea8', comment: '#608b4e', builtin: '#9cdcfe', plain: '#ffffff' },
  'hc-light':{ kw: '#0f4a85', string: '#b94824', number: '#005000', comment: '#4d7a00', builtin: '#0f4a85', plain: '#000000' },
}

function usePageTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? '')
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(document.documentElement.dataset.theme ?? ''))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

function tokenize(code) {
  const tokens = []
  let last = null
  for (const m of code.matchAll(TOKEN_RE)) {
    const type = Object.keys(m.groups).find(k => m.groups[k] !== undefined)
    if (last && last.type === type) {
      last.text += m[0]
    } else {
      last = { type, text: m[0] }
      tokens.push(last)
    }
  }
  return tokens
}

const TOKENIZED = SNIPPETS.map(tokenize)

function CodeTypewriter() {
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
    <div className="landing-code-demo">
      <div className="landing-code-titlebar">
        <span className="landing-code-dot" style={{ background: '#ff5f57' }} />
        <span className="landing-code-dot" style={{ background: '#ffbd2e' }} />
        <span className="landing-code-dot" style={{ background: '#28ca41' }} />
      </div>
      <pre className="landing-code-pre">{spans}<span className="landing-code-cursor">▋</span></pre>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="landing-bg page-enter flex-1 overflow-y-auto">
      <div className="landing-aurora" aria-hidden="true" />
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-2xl mx-auto">
        <img src="/favicon.svg" alt="" width="56" height="56" className="rounded-2xl mb-6 shadow-lg" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Just Python It
        </h1>
        <p className="text-lg sm:text-xl max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Learn and experiment with Python — straight in your browser, powered by WebAssembly.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-opacity duration-150 hover:opacity-80"
            style={{ background: 'var(--accent-try)', color: '#0c1a26' }}
          >
            <Terminal size={16} />
            Open Playground
          </Link>
          <Link
            to="/course"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-colors duration-150"
            style={{ background: 'var(--btn-secondary-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--btn-secondary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--btn-secondary-bg)'}
          >
            <GraduationCap size={16} />
            Start the Course
          </Link>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-8 list-none p-0 m-0">
          {perks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Icon size={13} />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Code typewriter demo */}
      <section className="px-6 pb-12 max-w-2xl mx-auto">
        <CodeTypewriter />
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description, href, accent }) => (
            <Link
              key={title}
              to={href}
              className="group flex flex-col gap-3 p-5 rounded-xl border no-underline transition-colors duration-150"
              style={{
                background: 'var(--header-bg)',
                borderColor: 'var(--header-border)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--header-border)'}
            >
              <div
                className="flex items-center justify-center size-9 rounded-lg shrink-0"
                style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
