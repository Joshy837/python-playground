import * as monaco from 'monaco-editor'

const TOKEN_COLORS = {
  'monokai':  { keyword: '#e06c75', string: '#e5c07b', number: '#c678dd', comment: '#676f7d', default: '#abb2bf', function: '#98c379', class: '#61afef', builtin: '#56b6c2', constant: '#56b6c2' },
  'vs':       { keyword: '#0000ff', string: '#a31515', number: '#098658', comment: '#008000', default: '#000000' },
  'hc-black': { keyword: '#c586c0', string: '#ce9178', number: '#b5cea8', comment: '#608b4e', default: '#ffffff' },
  'hc-light': { keyword: '#0f4a85', string: '#b94824', number: '#005000', comment: '#4d7a00', default: '#000000' },
}

function resolveTokenColor(tokType, colors) {
  const type = tokType.replace(/\.python$/, '')
  if (type === 'entity.name.function') return [colors.function ?? null, false]
  if (type === 'entity.name.class')    return [colors.class    ?? null, false]
  if (type.startsWith('support.'))     return [colors.builtin  ?? null, false]
  if (type.startsWith('constant.'))    return [colors.constant ?? null, false]
  const base = type.split('.')[0]
  return [colors[base] ?? null, base === 'comment']
}

function highlightToNodes(code, monacoTheme) {
  const colors = TOKEN_COLORS[monacoTheme] ?? TOKEN_COLORS['monokai']
  const lines = code.split('\n')
  const tokenizedLines = monaco.editor.tokenize(code, 'python')
  return lines.flatMap((line, li) => {
    const tokens = tokenizedLines[li] ?? []
    const spans = tokens.length === 0
      ? [line]
      : tokens.map((tok, i) => {
          const text = line.slice(tok.offset, tokens[i + 1]?.offset ?? line.length)
          const [color, italic] = resolveTokenColor(tok.type, colors)
          return color
            ? <span key={`${li}-${i}`} style={{ color, ...(italic && { fontStyle: 'italic' }) }}>{text}</span>
            : text
        })
    return li < lines.length - 1 ? [...spans, '\n'] : spans
  })
}

const MD_CLS = {
  h1:         'text-[1.35rem] font-bold mb-4 leading-[1.3]',
  h2:         'text-[0.85rem] font-bold mt-6 mb-2 text-[var(--text-muted)] uppercase tracking-[0.05em]',
  p:          'mb-[0.9rem]',
  list:       'mb-[0.9rem] pl-5 list-disc flex flex-col gap-[0.3rem]',
  table:      'w-full border-collapse mb-[0.9rem] text-[0.85rem]',
  th:         'text-left font-semibold py-[0.45rem] px-[0.75rem] border-b-2 border-[var(--header-border)] text-[var(--text-muted)]',
  td:         'py-[0.4rem] px-[0.75rem] border-b border-[var(--header-border)] align-top group-last:border-b-0',
  inlineCode: 'font-mono text-[0.82em] py-[0.12em] px-[0.4em] rounded-[4px] bg-app-muted/15',
  codeBlock:  'bg-[var(--header-bg)] border border-[var(--header-border)] rounded-[8px] py-[0.9rem] px-[1.1rem] font-mono text-[0.82rem] leading-[1.65] overflow-x-auto mt-[0.75rem] mb-4 text-[var(--output-stdout)]',
}


function parseInline(text) {
  const parts = []
  const re = /\*\*(.+?)\*\*|`([^`]+)`/g
  let last = 0, k = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[0].startsWith('**')) {
      parts.push(<strong key={k++}>{m[1]}</strong>)
    } else {
      parts.push(<code key={k++} className={MD_CLS.inlineCode}>{m[2]}</code>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderBlock(block, key) {
  const h1m = block.match(/^# (.+)$/)
  if (h1m) return <h1 key={key} className={MD_CLS.h1}>{parseInline(h1m[1])}</h1>

  const h2m = block.match(/^## (.+)$/)
  if (h2m) return <h2 key={key} className={MD_CLS.h2}>{parseInline(h2m[1])}</h2>

  if (/^[*-] /m.test(block)) {
    return (
      <ul key={key} className={MD_CLS.list}>
        {block.split('\n').filter(l => /^[*-] /.test(l)).map((l, i) =>
          <li key={i}>{parseInline(l.replace(/^[*-] /, ''))}</li>
        )}
      </ul>
    )
  }

  if (/^\|/.test(block)) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const isSep = l => /^\|[\s\-:|]+\|$/.test(l)
    const parseRow = l => l.split('|').slice(1, -1).map(c => c.trim())
    const [header, ...rest] = lines
    return (
      <table key={key} className={MD_CLS.table}>
        <thead>
          <tr>{parseRow(header).map((h, i) => <th key={i} className={MD_CLS.th}>{parseInline(h)}</th>)}</tr>
        </thead>
        <tbody>
          {rest.filter(l => !isSep(l)).map((l, ri) => (
            <tr key={ri} className="group">
              {parseRow(l).map((c, ci) => <td key={ci} className={MD_CLS.td}>{parseInline(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const lines = block.split('\n')
  return (
    <p key={key} className={MD_CLS.p}>
      {lines.flatMap((line, i) =>
        i < lines.length - 1 ? [...parseInline(line), <br key={i} />] : parseInline(line)
      )}
    </p>
  )
}

export default function Markdown({ md, monacoTheme }) {
  const elements = []
  let key = 0
  for (const seg of md.split(/(```(?:python)?\n[\s\S]*?```)/g)) {
    const cm = seg.match(/^```(?:python)?\n([\s\S]*?)```$/)
    if (cm) {
      elements.push(
        <pre key={key++} className={MD_CLS.codeBlock}>
          <code>{highlightToNodes(cm[1].trimEnd(), monacoTheme)}</code>
        </pre>
      )
      continue
    }
    for (const block of seg.split(/\n\n+/)) {
      const trimmed = block.trim()
      if (trimmed) elements.push(renderBlock(trimmed, key++))
    }
  }
  return <>{elements}</>
}