import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, ChevronLeft, CheckCircle, ChevronRight } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode } from '../runner.js'
import { NODES } from '../data/courseTree.js'
import { useProgress } from '../hooks/useProgress.js'

function buildTestCode(userCode, tests) {
  const checks = tests.map(t =>
    `_check(${JSON.stringify(t.name)}, ${t.check}, ${JSON.stringify(t.msg)})`
  ).join('\n')
  return `${userCode}

import json as _json
_results = []

def _check(name, condition, msg=""):
    _results.append({"name": name, "passed": bool(condition), "error": "" if condition else msg})

${checks}

print("__TESTS__:" + _json.dumps(_results))
`
}

function parseTestResults(stdout) {
  const marker = '__TESTS__:'
  const line = stdout.split('\n').find(l => l.startsWith(marker))
  if (!line) return null
  try {
    return JSON.parse(line.slice(marker.length))
  } catch {
    return null
  }
}

function stripTestLine(stdout) {
  return stdout.split('\n').filter(l => !l.startsWith('__TESTS__:')).join('\n').trimEnd()
}

export default function LessonPage({ pyodideReady, monacoTheme }) {
  const { id, step } = useParams()
  const navigate = useNavigate()
  const node = NODES.find(n => n.id === id)

  // step param is 1-indexed in URL; default to step 1 if absent
  const stepIdx = step ? Math.max(0, parseInt(step, 10) - 1) : 0
  const currentStep = node?.steps[stepIdx]
  const isLastStep = node ? stepIdx === node.steps.length - 1 : true

  const { isComplete, isStepComplete, isStepUnlocked, markStepComplete } = useProgress()

  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const initialThemeRef = useRef(monacoTheme)
  const handleRunRef = useRef(null)

  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runtimeOutput, setRuntimeOutput] = useState(null)
  const [allPassed, setAllPassed] = useState(false)

  // reset state when step changes
  useEffect(() => {
    setTestResults(null)
    setRuntimeOutput(null)
    if (node && isStepComplete(node.id, stepIdx)) setAllPassed(true)
    else setAllPassed(false)
  }, [node?.id, stepIdx])

  useEffect(() => {
    if (!currentStep) return
    const editor = monaco.editor.create(editorContainerRef.current, {
      value: currentStep.starter,
      language: 'python',
      theme: initialThemeRef.current,
      fontSize: 14,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 12, bottom: 12 },
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
    })
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunRef.current?.()
    })
    return () => { editor.dispose(); editorRef.current = null }
  }, [node?.id, stepIdx])

  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(monacoTheme)
    }
  }, [monacoTheme])

  async function handleRun() {
    if (isRunning || !pyodideReady) return
    setIsRunning(true)
    setTestResults(null)
    setRuntimeOutput(null)
    try {
      const code = editorRef.current.getValue()
      const result = await runCode(buildTestCode(code, currentStep.tests))
      const userStdout = stripTestLine(result.stdout || '')
      const parsed = parseTestResults(result.stdout || '')
      setRuntimeOutput({
        stdout: userStdout,
        stderr: result.stderr || '',
        error: result.error || '',
      })
      if (parsed) {
        setTestResults(parsed)
        if (parsed.every(t => t.passed)) {
          setAllPassed(true)
          markStepComplete(node.id, stepIdx)
        }
      }
    } finally {
      setIsRunning(false)
    }
  }

  handleRunRef.current = handleRun

  if (!node || !currentStep) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-sm mb-3">Lesson not found.</p>
          <Link to="/course" className="nav-link">Back to course</Link>
        </div>
      </div>
    )
  }

  if (!isStepUnlocked(node.id, stepIdx) && !isStepComplete(node.id, stepIdx)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-sm mb-3">Complete the previous step first.</p>
          <Link to="/course" className="nav-link">Back to course</Link>
        </div>
      </div>
    )
  }

  const passed = testResults?.filter(t => t.passed).length ?? 0
  const total = currentStep.tests.length
  const totalSteps = node.steps.length

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
      {/* Instructions panel */}
      <div className="lesson-instructions md:w-2/5 shrink-0 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0" style={{ borderColor: 'var(--header-border)' }}>
          <button
            onClick={() => navigate('/course')}
            className="lesson-back-btn"
            title="Back to course"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">{node.title}</span>
            <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              Step {stepIdx + 1} / {totalSteps} — {currentStep.title}
            </span>
          </div>
          {isComplete(node.id) && (
            <CheckCircle size={15} className="ml-auto shrink-0" style={{ color: 'var(--status-green)' }} />
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 lesson-prose">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.instructions) }} />
        </div>
      </div>

      {/* Editor + output */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ borderLeft: '1px solid var(--header-border)' }}>
        {/* Toolbar */}
        <div className="examples-toolbar flex items-center gap-2 px-3 py-1.5 border-b shrink-0">
          <span className="text-muted text-xs">
            {testResults ? `${passed} / ${total} tests passing` : `${total} tests`}
          </span>
          <button
            className="run-btn ml-auto"
            data-running="false"
            disabled={!pyodideReady || isRunning}
            title={isRunning ? 'Running…' : 'Run Tests (Ctrl+Enter)'}
            onClick={handleRun}
          >
            <Play size={18} fill="currentColor" stroke="none" />
          </button>
        </div>

        {/* Monaco editor */}
        <div ref={editorContainerRef} className="flex-1 min-h-0 overflow-hidden" />

        {/* Test results */}
        {(testResults || runtimeOutput?.error || runtimeOutput?.stderr) && (
          <div className="lesson-results shrink-0 overflow-y-auto" style={{ maxHeight: '38%', borderTop: '1px solid var(--output-border)' }}>
            {(runtimeOutput?.error || runtimeOutput?.stderr) && (
              <div className="px-4 py-2">
                {runtimeOutput.error && <pre className="output-error text-xs whitespace-pre-wrap">{runtimeOutput.error}</pre>}
                {runtimeOutput.stderr && <pre className="output-stderr text-xs whitespace-pre-wrap">{runtimeOutput.stderr}</pre>}
              </div>
            )}
            {runtimeOutput?.stdout && (
              <div className="px-4 pt-2">
                <pre className="output-stdout text-xs whitespace-pre-wrap">{runtimeOutput.stdout}</pre>
              </div>
            )}
            {testResults && (
              <div className="px-4 py-3 flex flex-col gap-1.5">
                {testResults.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span style={{ color: t.passed ? 'var(--status-green)' : 'var(--status-red)', flexShrink: 0 }}>
                      {t.passed ? '✓' : '✗'}
                    </span>
                    <span style={{ color: t.passed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {t.name}
                      {!t.passed && t.error && <span className="output-error"> — {t.error}</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {allPassed && (
              <div className="px-4 pb-3 pt-1 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'var(--status-green)' }}>
                  {isLastStep ? `${node.title} complete!` : 'All tests pass!'}
                </span>
                {isLastStep ? (
                  <button
                    className="btn-secondary text-xs px-3 py-1 rounded-md"
                    onClick={() => navigate('/course')}
                  >
                    Back to course
                  </button>
                ) : (
                  <button
                    className="lesson-next-btn"
                    onClick={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}
                  >
                    Next step <ChevronRight size={13} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Minimal markdown renderer (bold, inline code, code blocks, headings, paragraphs)
function renderMarkdown(md) {
  let html = md
    // code blocks
    .replace(/```python\n([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${escHtml(code.trimEnd())}</code></pre>`)
    .replace(/```\n?([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${escHtml(code.trimEnd())}</code></pre>`)
    // headings
    .replace(/^## (.+)$/gm, '<h2 class="lesson-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="lesson-h1">$1</h1>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="lesson-inline-code">$1</code>')
    // list items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul class="lesson-list">${m}</ul>`)
    // paragraphs
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (/^<(h[12]|ul|pre|li)/.test(block)) return block
      return `<p class="lesson-p">${block.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')
  return html
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
