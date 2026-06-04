import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, ChevronLeft, Check, ChevronRight, ChevronDown, Terminal, HelpCircle, Trophy, RotateCcw } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode } from '../runner.js'
import { NODES } from '../data/courseTree.js'
import { loadStep } from '../data/loadStep.js'
import { useProgress } from '../hooks/useProgress.js'
import { useMonacoEditor } from '../hooks/useMonacoEditor.js'

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

function QuizQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null
  const correct = selected === question.answer

  return (
    <div className="quiz-block">
      <p className="quiz-question-text">{question.question}</p>
      <div className="quiz-options-wrap">
        <div className="quiz-options">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.answer
            let cls = 'quiz-option'
            if (answered && correct && isCorrect) cls += ' quiz-option-correct'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => {
                setSelected(i)
                if (i === question.answer) onAnswer?.()
              }}>
                <span className="quiz-marker">
                  {answered && correct && isCorrect ? '✓' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
        {answered && !correct && (
          <div className="quiz-wrong-overlay">
            <span className="quiz-overlay-text">Not quite — give it another go.</span>
            <button className="quiz-try-again-btn" onClick={() => setSelected(null)}>
              <RotateCcw size={13} />
              Try again
            </button>
          </div>
        )}
      </div>
      {answered && correct && (
        <div className="quiz-feedback quiz-fb-correct">
          ✓ Correct!{question.explanation && ` ${question.explanation}`}
        </div>
      )}
    </div>
  )
}

// revealedUpTo: 0=description only, 1=+try-it, 2=+quiz, 3=+challenge
// when no quiz: 0=description, 1=+try-it, 2=+challenge

function ContinueArrow({ onClick, preview, disabled }) {
  return (
    <div className="lesson-continue-wrap">
      <button className="lesson-continue-btn" onClick={onClick} disabled={disabled} data-disabled={disabled ? 'true' : undefined}>
        <ChevronDown size={36} />
      </button>
      {disabled && (
        <span className="lesson-continue-hint">Answer the question{preview ? 's' : ''} above to continue</span>
      )}
      {preview && (
        <div className="lesson-spoiler">{preview}</div>
      )}
    </div>
  )
}

function stripMarkdown(md) {
  return (md ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#+\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
}

export default function LessonPage({ pyodideReady, monacoTheme }) {
  const { id, step } = useParams()
  const navigate = useNavigate()
  const node = NODES.find(n => n.id === id)

  const stepIdx = step ? Math.max(0, parseInt(step, 10) - 1) : 0
  const isLastStep = node ? stepIdx === node.steps.length - 1 : true

  const [currentStep, setCurrentStep] = useState(null)
  const [stepLoading, setStepLoading] = useState(true)
  const hasQuiz = (currentStep?.quiz?.length ?? 0) > 0

  // Section indices
  const SECTION_TRY       = 1
  const SECTION_QUIZ      = hasQuiz ? 2 : null
  const SECTION_CHALLENGE = hasQuiz ? 3 : 2

  const { isStepComplete, isStepUnlocked, markStepComplete } = useProgress()

  const [revealedUpTo, setRevealedUpTo] = useState(0)
  const [isTryRunning, setIsTryRunning] = useState(false)
  const [tryOutput, setTryOutput] = useState(null)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runtimeOutput, setRuntimeOutput] = useState(null)
  const [allPassed, setAllPassed] = useState(false)
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0)
  const quizAllAnswered = quizAnsweredCount >= (currentStep?.quiz?.length ?? 0)

  const tryContainerRef = useRef(null)
  const tryEditorRef = useRef(null)
  const challengeContainerRef = useRef(null)
  const challengeEditorRef = useRef(null)
  const trySectionRef = useRef(null)
  const quizSectionRef = useRef(null)
  const challengeSectionRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const pendingScrollRef = useRef(null)
  const initialThemeRef = useRef(monacoTheme)

  useEffect(() => {
    if (!node) return
    setCurrentStep(null)
    setStepLoading(true)
    setTestResults(null)
    setRuntimeOutput(null)
    setTryOutput(null)
    setQuizAnsweredCount(0)
    loadStep(node.id, stepIdx).then(step => {
      const sectionMax = (step.quiz?.length ?? 0) > 0 ? 3 : 2
      setCurrentStep(step)
      const complete = isStepComplete(node.id, stepIdx)
      setAllPassed(complete)
      setRevealedUpTo(complete ? sectionMax : 0)
      setStepLoading(false)
    }).catch(() => setStepLoading(false))
  }, [node?.id, stepIdx])

  useEffect(() => { monaco.editor.setTheme(monacoTheme) }, [monacoTheme])

  useEffect(() => {
    const target = pendingScrollRef.current
    pendingScrollRef.current = null
    if (!target?.current || !scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const offset = target.current.getBoundingClientRect().top - container.getBoundingClientRect().top
    container.scrollBy({ top: offset, behavior: 'smooth' })
  }, [revealedUpTo])

  const stepKey = `${node?.id ?? 'none'}-${stepIdx}`

  function revealSection(section, ref) {
    pendingScrollRef.current = ref
    setRevealedUpTo(section)
  }

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

  useMonacoEditor({
    active: revealedUpTo >= SECTION_TRY,
    containerRef: tryContainerRef,
    editorRef: tryEditorRef,
    initialCode: currentStep?.example ?? '',
    stepKey,
    theme: initialThemeRef.current,
    onRun: handleRunTry,
    extraOptions: { fontSize: 13, padding: { top: 10, bottom: 10 }, lineNumbers: 'off', folding: false, renderLineHighlight: 'none' },
  })

  useMonacoEditor({
    active: revealedUpTo >= SECTION_CHALLENGE,
    containerRef: challengeContainerRef,
    editorRef: challengeEditorRef,
    initialCode: currentStep?.starter ?? '',
    stepKey,
    theme: initialThemeRef.current,
    onRun: handleRunChallenge,
    extraOptions: { fontSize: 13, padding: { top: 10, bottom: 10 }, folding: false },
  })

  if (!node) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-sm mb-3">Lesson not found.</p>
          <Link to="/course" className="nav-link">Back to course</Link>
        </div>
      </div>
    )
  }

  if (stepLoading || !currentStep) {
    return <div className="flex-1 flex items-center justify-center"><span className="text-muted text-sm">Loading…</span></div>
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

      {/* Scrollable content */}
      <div className="lesson-slide-content" ref={scrollContainerRef}>
        <div className="lesson-slide-body">

          {/* Section 1: Description */}
          <div className="lesson-prose">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.description) }} />
          </div>

          {revealedUpTo < SECTION_TRY ? (
            <ContinueArrow
              onClick={() => revealSection(SECTION_TRY, trySectionRef)}
              preview={<pre className="lesson-code-block" style={{ margin: 0 }}>{currentStep.example}</pre>}
            />
          ) : (
            <>
              {/* Section 2: Try it */}
              <div ref={trySectionRef} style={{ marginTop: '2.5rem' }}>
                <div className="lesson-section-divider" style={{ marginBottom: '2.25rem' }} />
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
                  <div className="lesson-editor-body">
                    <div ref={tryContainerRef} className="lesson-editor-pane" />
                    <div className="lesson-output-panel">
                      {tryOutput ? (
                        <>
                          {tryOutput.error && <pre className="output-error text-xs whitespace-pre-wrap">{tryOutput.error}</pre>}
                          {tryOutput.stderr && <pre className="output-stderr text-xs whitespace-pre-wrap">{tryOutput.stderr}</pre>}
                          {tryOutput.stdout
                            ? <pre className="output-stdout text-xs whitespace-pre-wrap">{tryOutput.stdout}</pre>
                            : !tryOutput.error && !tryOutput.stderr && (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No output</span>
                            )}
                        </>
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Run code to see output</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {hasQuiz ? (
                revealedUpTo < SECTION_QUIZ ? (
                  <ContinueArrow
                    onClick={() => revealSection(SECTION_QUIZ, quizSectionRef)}
                    preview={<p className="lesson-prose">{currentStep.quiz[0]?.question}</p>}
                  />
                ) : (
                  <>
                    {/* Section 3: Quiz */}
                    <div ref={quizSectionRef} style={{ marginTop: '2.5rem' }}>
                      <div className="lesson-section-divider" style={{ marginBottom: '2.25rem' }} />
                      <p className="lesson-section-label"><HelpCircle size={12} />Check your understanding</p>
                      {currentStep.quiz.map((q, i) => (
                        <QuizQuestion key={`${node.id}-${stepIdx}-${i}`} question={q} onAnswer={() => setQuizAnsweredCount(c => c + 1)} />
                      ))}
                    </div>

                    {revealedUpTo < SECTION_CHALLENGE && (
                      <ContinueArrow
                        onClick={() => revealSection(SECTION_CHALLENGE, challengeSectionRef)}
                        preview={<p className="lesson-prose">{stripMarkdown(currentStep.task)}</p>}
                        disabled={!quizAllAnswered}
                      />
                    )}
                  </>
                )
              ) : (
                revealedUpTo < SECTION_CHALLENGE && (
                  <ContinueArrow
                    onClick={() => revealSection(SECTION_CHALLENGE, challengeSectionRef)}
                    preview={<p className="lesson-prose">{stripMarkdown(currentStep.task)}</p>}
                  />
                )
              )}

              {/* Section 4: Challenge */}
              {revealedUpTo >= SECTION_CHALLENGE && (
                <div ref={challengeSectionRef} style={{ marginTop: '2.5rem' }}>
                  <div className="lesson-section-divider" style={{ marginBottom: '2.25rem' }} />
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
                    <div className="lesson-editor-body">
                      <div ref={challengeContainerRef} className="lesson-editor-pane" />
                      <div className="lesson-output-panel">
                        {(runtimeOutput?.error || runtimeOutput?.stderr || runtimeOutput?.stdout) ? (
                          <>
                            {runtimeOutput.error && <pre className="output-error text-xs whitespace-pre-wrap">{runtimeOutput.error}</pre>}
                            {runtimeOutput.stderr && <pre className="output-stderr text-xs whitespace-pre-wrap">{runtimeOutput.stderr}</pre>}
                            {runtimeOutput.stdout && <pre className="output-stdout text-xs whitespace-pre-wrap">{runtimeOutput.stdout}</pre>}
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Run code to see output</span>
                        )}
                      </div>
                    </div>
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
            </>
          )}

        </div>
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
