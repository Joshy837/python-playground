import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, ChevronLeft, Check, ChevronRight, Terminal, HelpCircle, Trophy } from 'lucide-react'
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
  try { return JSON.parse(line.slice(marker.length)) } catch { return null }
}

function stripTestLine(stdout) {
  return stdout.split('\n').filter(l => !l.startsWith('__TESTS__:')).join('\n').trimEnd()
}

function editorHeight(code) {
  return Math.min(Math.max(code.split('\n').length * 22 + 20, 100), 300)
}

function QuizQuestion({ question }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null

  return (
    <div className="quiz-block">
      <p className="quiz-question-text">{question.question}</p>
      <div className="quiz-options">
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === question.answer
          let cls = 'quiz-option'
          if (answered) {
            if (isSelected && isCorrect) cls += ' quiz-option-correct'
            else if (isSelected) cls += ' quiz-option-wrong'
            else if (isCorrect) cls += ' quiz-option-reveal'
          }
          return (
            <button key={i} className={cls} onClick={() => !answered && setSelected(i)}>
              <span className="quiz-marker">
                {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <p className={`quiz-feedback ${selected === question.answer ? 'quiz-fb-correct' : 'quiz-fb-wrong'}`}>
          {selected === question.answer
            ? '✓ Correct!'
            : `✗ The answer is: ${question.options[question.answer]}.`}
          {question.explanation && ` ${question.explanation}`}
        </p>
      )}
    </div>
  )
}

const SLIDE_DEFS = {
  learn:     { label: 'Learn' },
  try:       { label: 'Try it' },
  quiz:      { label: 'Quiz' },
  challenge: { label: 'Challenge' },
}

function getSlides(step) {
  if (!step) return []
  return ['learn', 'challenge']
}

export default function LessonPage({ pyodideReady, monacoTheme }) {
  const { id, step } = useParams()
  const navigate = useNavigate()
  const node = NODES.find(n => n.id === id)

  const stepIdx = step ? Math.max(0, parseInt(step, 10) - 1) : 0
  const currentStep = node?.steps[stepIdx]
  const isLastStep = node ? stepIdx === node.steps.length - 1 : true

  const slides = useMemo(() => getSlides(currentStep), [node?.id, stepIdx])
  const [slideIdx, setSlideIdx] = useState(0)
  const currentSlide = slides[slideIdx] ?? 'learn'

  const { isStepComplete, isStepUnlocked, markStepComplete } = useProgress()

  const [isTryRunning, setIsTryRunning] = useState(false)
  const [tryOutput, setTryOutput] = useState(null)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runtimeOutput, setRuntimeOutput] = useState(null)
  const [allPassed, setAllPassed] = useState(false)

  const tryContainerRef = useRef(null)
  const tryEditorRef = useRef(null)
  const challengeContainerRef = useRef(null)
  const challengeEditorRef = useRef(null)
  const runTryRef = useRef(null)
  const runChallengeRef = useRef(null)
  const initialThemeRef = useRef(monacoTheme)
  const savedTryCodeRef = useRef(null)
  const savedChallengeCodeRef = useRef(null)

  useEffect(() => {
    setSlideIdx(0)
    savedTryCodeRef.current = null
    savedChallengeCodeRef.current = null
    setTestResults(null)
    setRuntimeOutput(null)
    setTryOutput(null)
    setAllPassed(!!(node && isStepComplete(node.id, stepIdx)))
  }, [node?.id, stepIdx])

  useEffect(() => { monaco.editor.setTheme(monacoTheme) }, [monacoTheme])

  useEffect(() => {
    if (currentSlide !== 'learn' || !currentStep || !tryContainerRef.current) return
    const code = savedTryCodeRef.current ?? currentStep.example
    tryContainerRef.current.style.height = `${editorHeight(code)}px`
    const editor = monaco.editor.create(tryContainerRef.current, {
      value: code,
      language: 'python',
      theme: initialThemeRef.current,
      fontSize: 13,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 10, bottom: 10 },
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'off',
      folding: false,
      renderLineHighlight: 'none',
    })
    tryEditorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runTryRef.current?.())
    return () => {
      savedTryCodeRef.current = editor.getValue()
      editor.dispose()
      tryEditorRef.current = null
    }
  }, [currentSlide, node?.id, stepIdx])

  useEffect(() => {
    if (currentSlide !== 'challenge' || !currentStep || !challengeContainerRef.current) return
    const code = savedChallengeCodeRef.current ?? currentStep.starter
    challengeContainerRef.current.style.height = `${editorHeight(code)}px`
    const editor = monaco.editor.create(challengeContainerRef.current, {
      value: code,
      language: 'python',
      theme: initialThemeRef.current,
      fontSize: 13,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 10, bottom: 10 },
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: false,
    })
    challengeEditorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runChallengeRef.current?.())
    return () => {
      savedChallengeCodeRef.current = editor.getValue()
      editor.dispose()
      challengeEditorRef.current = null
    }
  }, [currentSlide, node?.id, stepIdx])

  async function handleRunTry() {
    if (isTryRunning || !pyodideReady) return
    setIsTryRunning(true)
    setTryOutput(null)
    try {
      const code = tryEditorRef.current?.getValue()
      if (!code) return
      const result = await runCode(code)
      setTryOutput({ stdout: result.stdout || '', stderr: result.stderr || '', error: result.error || '' })
    } finally {
      setIsTryRunning(false)
    }
  }
  runTryRef.current = handleRunTry

  async function handleRunChallenge() {
    if (isTestRunning || !pyodideReady) return
    setIsTestRunning(true)
    setTestResults(null)
    setRuntimeOutput(null)
    try {
      const code = challengeEditorRef.current?.getValue()
      if (!code) return
      const result = await runCode(buildTestCode(code, currentStep.tests))
      const userStdout = stripTestLine(result.stdout || '')
      const parsed = parseTestResults(result.stdout || '')
      setRuntimeOutput({ stdout: userStdout, stderr: result.stderr || '', error: result.error || '' })
      if (parsed) {
        setTestResults(parsed)
        if (parsed.every(t => t.passed)) {
          setAllPassed(true)
          markStepComplete(node.id, stepIdx)
        }
      }
    } finally {
      setIsTestRunning(false)
    }
  }
  runChallengeRef.current = handleRunChallenge

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
  const isLastSlide = slideIdx === slides.length - 1

  function handleBack() {
    if (slideIdx > 0) setSlideIdx(i => i - 1)
    else navigate('/course')
  }
  function handleNext() {
    if (slideIdx < slides.length - 1) setSlideIdx(i => i + 1)
  }

  return (
    <div className="lesson-page">

      {/* Sticky header */}
      <div className="lesson-slide-header">
        <button onClick={() => navigate('/course')} className="lesson-back-btn" title="Back to course">
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{node.title}</span>
          <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            Step {stepIdx + 1} / {totalSteps} — {currentStep.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {node.steps.map((s, i) => {
            const done = isStepComplete(node.id, i)
            const current = i === stepIdx
            return (
              <button
                key={i}
                className={[
                  'lesson-step-dot',
                  current ? 'lesson-step-dot-current' : '',
                  done ? 'lesson-step-dot-done' : '',
                ].join(' ')}
                onClick={() => {
                  if (current) return
                  if (done || isStepUnlocked(node.id, i))
                    navigate(`/learn/${node.id}/${i + 1}`)
                }}
                title={s.title}
              >
                {done ? <Check size={14} strokeWidth={3} /> : <span>{i + 1}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable slide content */}
      <div className="lesson-slide-content">
        <div className="lesson-slide-body">

          {currentSlide === 'learn' && (
            <>
              <div className="lesson-prose">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.description) }} />
              </div>
              <div className="lesson-section" style={{ marginTop: '1.75rem' }}>
                <p className="lesson-section-label"><Terminal size={12} />Try it yourself</p>
                <div className="lesson-editor-box">
                  <div className="lesson-editor-toolbar">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Python</span>
                    <button
                      className="lesson-run-btn"
                      disabled={!pyodideReady || isTryRunning}
                      onClick={handleRunTry}
                      title="Run (Ctrl+Enter)"
                    >
                      <Play size={12} fill="currentColor" stroke="none" />
                      {isTryRunning ? 'Running…' : 'Run'}
                    </button>
                  </div>
                  <div ref={tryContainerRef} />
                  {tryOutput && (
                    <div className="lesson-output">
                      {tryOutput.error && <pre className="output-error text-xs whitespace-pre-wrap">{tryOutput.error}</pre>}
                      {tryOutput.stderr && <pre className="output-stderr text-xs whitespace-pre-wrap">{tryOutput.stderr}</pre>}
                      {tryOutput.stdout
                        ? <pre className="output-stdout text-xs whitespace-pre-wrap">{tryOutput.stdout}</pre>
                        : !tryOutput.error && !tryOutput.stderr && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No output</span>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentSlide === 'challenge' && (
            <div className="lesson-section">
              {currentStep.quiz?.length > 0 && (
                <>
                  <p className="lesson-section-label"><HelpCircle size={12} />Check your understanding</p>
                  {currentStep.quiz.map((q, i) => (
                    <QuizQuestion key={`${node.id}-${stepIdx}-${i}`} question={q} />
                  ))}
                  <div style={{ marginTop: '2rem' }} />
                </>
              )}
              <p className="lesson-section-label"><Trophy size={12} />Challenge</p>
              <div className="lesson-task-text lesson-prose">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.task) }} />
              </div>
              <div className="lesson-editor-box" style={{ marginTop: '1rem' }}>
                <div className="lesson-editor-toolbar">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {testResults ? `${passed} / ${total} tests passing` : `${total} test${total !== 1 ? 's' : ''}`}
                  </span>
                  <button
                    className="lesson-run-btn"
                    disabled={!pyodideReady || isTestRunning}
                    onClick={handleRunChallenge}
                    title="Run Tests (Ctrl+Enter)"
                  >
                    <Play size={12} fill="currentColor" stroke="none" />
                    {isTestRunning ? 'Running…' : 'Run Tests'}
                  </button>
                </div>
                <div ref={challengeContainerRef} />
                {(runtimeOutput?.error || runtimeOutput?.stderr || runtimeOutput?.stdout) && (
                  <div className="lesson-output">
                    {runtimeOutput.error && <pre className="output-error text-xs whitespace-pre-wrap">{runtimeOutput.error}</pre>}
                    {runtimeOutput.stderr && <pre className="output-stderr text-xs whitespace-pre-wrap">{runtimeOutput.stderr}</pre>}
                    {runtimeOutput.stdout && <pre className="output-stdout text-xs whitespace-pre-wrap">{runtimeOutput.stdout}</pre>}
                  </div>
                )}
              </div>

              {testResults && (
                <div className="lesson-test-list">
                  {testResults.map((t, i) => (
                    <div key={i} className="lesson-test-row">
                      <span className="shrink-0" style={{ color: t.passed ? 'var(--status-green)' : 'var(--status-red)' }}>
                        {t.passed ? '✓' : '✗'}
                      </span>
                      <span className="text-sm" style={{ color: t.passed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {t.name}
                        {!t.passed && t.error && (
                          <span className="output-error block text-xs mt-0.5">{t.error}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {allPassed && (
                <div className="lesson-complete-bar">
                  <span className="text-sm font-semibold" style={{ color: 'var(--status-green)' }}>
                    {isLastStep ? `${node.title} complete!` : 'All tests pass!'}
                  </span>
                  {isLastStep ? (
                    <button className="btn-secondary text-sm px-4 py-1.5 rounded-lg" onClick={() => navigate('/course')}>
                      Back to course
                    </button>
                  ) : (
                    <button className="lesson-next-btn" onClick={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}>
                      Next step <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Nav bar — locked to bottom of viewport */}
      <div className="lesson-nav-bar">
        {slideIdx > 0 ? (
          <button onClick={handleBack} className="lesson-nav-btn">
            <ChevronLeft size={14} />
            Back
          </button>
        ) : (
          <div className="lesson-nav-btn-placeholder" />
        )}

        <div className="lesson-slide-pips">
          {slides.map((slideId, i) => (
            <span
              key={slideId}
              className={[
                'lesson-slide-pip',
                i === slideIdx ? 'lesson-slide-pip-current' : '',
                i < slideIdx ? 'lesson-slide-pip-done' : '',
              ].filter(Boolean).join(' ')}
              title={SLIDE_DEFS[slideId].label}
            />
          ))}
        </div>

        {isLastSlide ? (
          <div className="lesson-nav-btn-placeholder" />
        ) : (
          <button onClick={handleNext} className="lesson-nav-btn">
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>

    </div>
  )
}

function renderMarkdown(md) {
  let html = md
    .replace(/```python\n([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${escHtml(code.trimEnd())}</code></pre>`)
    .replace(/```\n?([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${escHtml(code.trimEnd())}</code></pre>`)
    .replace(/^## (.+)$/gm, '<h2 class="lesson-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="lesson-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="lesson-inline-code">$1</code>')
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul class="lesson-list">${m}</ul>`)
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
