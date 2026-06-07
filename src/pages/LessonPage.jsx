import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, ChevronLeft, Check, ChevronRight, HelpCircle, Trophy, RotateCcw } from 'lucide-react'
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

function ConfettiBurst({ onDone }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const COLORS = ['#38bdf8', '#a78bfa', '#fbbf24', '#4ade80', '#f472b6', '#fb923c']
    const particles = Array.from({ length: 90 }, () => ({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.25,
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
    }))
    let raf, t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t++
      let alive = false
      for (const p of particles) {
        p.x += p.vx; p.vy += 0.15; p.y += p.vy; p.rot += p.rotV
        if (t > 55) p.alpha = Math.max(0, p.alpha - 0.018)
        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }
      if (alive) { raf = requestAnimationFrame(draw) } else { onDone?.() }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}

function QuizQuestion({ question, number, onCorrect, onAnswer, isLast }) {
  const isFitb = !question.options
  const [selected, setSelected] = useState(null)
  const [fitbInput, setFitbInput] = useState('')
  const [fitbSubmitted, setFitbSubmitted] = useState(false)

  const [shuffledOptions] = useState(() => {
    if (!question.options) return null
    const opts = question.options.map((text, i) => ({ text, i }))
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]]
    }
    return opts
  })
  const shuffledAnswer = shuffledOptions ? shuffledOptions.findIndex(o => o.i === question.answer) : -1

  const answered = selected !== null
  const mcqCorrect = selected === shuffledAnswer

  const accepted = Array.isArray(question.answer) ? question.answer : [question.answer]
  const fitbCorrect = accepted.some(a => String(a).toLowerCase() === fitbInput.trim().toLowerCase())

  function submitFitb() {
    setFitbSubmitted(true)
    if (fitbCorrect) onCorrect?.()
  }

  const isCorrect = mcqCorrect || (fitbSubmitted && fitbCorrect)

  const feedbackRow = (
    <div className="quiz-feedback-row" style={{ visibility: isCorrect ? 'visible' : 'hidden' }}>
      <div className="quiz-feedback quiz-fb-correct">
        ✓ Correct!{question.explanation && ` ${question.explanation}`}
      </div>
      <button className="quiz-next-btn" onClick={onAnswer}>
        {isLast ? 'Done' : 'Next'} <ChevronRight size={14} />
      </button>
    </div>
  )

  if (isFitb) {
    return (
      <div className="mb-7">
        <p className="quiz-question-text"><span className="quiz-question-number">{number}.</span> {question.question}</p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="quiz-fitb-input"
            value={fitbInput}
            onChange={e => { setFitbInput(e.target.value); setFitbSubmitted(false) }}
            disabled={fitbSubmitted && fitbCorrect}
            onKeyDown={e => { if (e.key === 'Enter' && fitbInput.trim()) submitFitb() }}
            placeholder="Type your answer…"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="lesson-run-btn"
            disabled={(fitbSubmitted && fitbCorrect) || !fitbInput.trim()}
            onClick={submitFitb}
          >
            Check
          </button>
        </div>
        {fitbSubmitted && !fitbCorrect && (
          <p className="quiz-fitb-wrong">Not quite — give it another try.</p>
        )}
        {feedbackRow}
      </div>
    )
  }

  return (
    <div className="mb-7">
      <p className="quiz-question-text"><span className="quiz-question-number">{number}.</span> {question.question}</p>
      <div className="relative">
        <div className="flex flex-col gap-1.5">
          {shuffledOptions.map(({ text }, i) => {
            const optCorrect = i === shuffledAnswer
            let cls = 'quiz-option'
            if (answered && mcqCorrect && optCorrect) cls += ' quiz-option-correct'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => { setSelected(i); if (i === shuffledAnswer) onCorrect?.() }}>
                <span className="quiz-marker">
                  {answered && mcqCorrect && optCorrect ? '✓' : String.fromCharCode(65 + i)}
                </span>
                {text}
              </button>
            )
          })}
        </div>
        {answered && !mcqCorrect && (
          <div className="quiz-wrong-overlay">
            <span className="quiz-overlay-text">Not quite — give it another go.</span>
            <button className="quiz-try-again-btn" onClick={() => setSelected(null)}>
              <RotateCcw size={13} />
              Try again
            </button>
          </div>
        )}
      </div>
      {feedbackRow}
    </div>
  )
}

// currentSection: 0=description, 1=quiz (if hasQuiz), 2=challenge (or 1 without quiz)


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
  const SECTION_QUIZ      = hasQuiz ? 1 : null
  const SECTION_CHALLENGE = hasQuiz ? 2 : 1

  const { isStepComplete, isStepUnlocked, markStepComplete, saveQuizProgress, getQuizAnsweredCount } = useProgress()

  const [currentSection, setCurrentSection] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runtimeOutput, setRuntimeOutput] = useState(null)
  const [allPassed, setAllPassed] = useState(false)
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0)
  const [activeQuizIndex, setActiveQuizIndex] = useState(0)
  const [exitingQuizIndex, setExitingQuizIndex] = useState(null)
  const quizAllAnswered = quizAnsweredCount >= (currentStep?.quiz?.length ?? 0)

  const challengeContainerRef = useRef(null)
  const challengeEditorRef = useRef(null)
  const quizContainerRef = useRef(null)
  const quizLockedHeightRef = useRef(0)
  const scrollContainerRef = useRef(null)
  const initialThemeRef = useRef(monacoTheme)

  function handleQuizCorrect() {
    const newCount = quizAnsweredCount + 1
    setQuizAnsweredCount(newCount)
    saveQuizProgress(node.id, stepIdx, newCount)
  }

  function handleQuizAdvance() {
    const container = quizContainerRef.current
    if (container) {
      const h = container.offsetHeight
      quizLockedHeightRef.current = Math.max(quizLockedHeightRef.current, h)
      container.style.minHeight = quizLockedHeightRef.current + 'px'
    }
    setExitingQuizIndex(activeQuizIndex)
    setActiveQuizIndex(i => i + 1)
    setTimeout(() => setExitingQuizIndex(null), 300)
  }

  useEffect(() => {
    if (!node) return
    setCurrentStep(null)
    setStepLoading(true)
    setTestResults(null)
    setRuntimeOutput(null)
    setQuizAnsweredCount(0)
    setActiveQuizIndex(0)
    setExitingQuizIndex(null)
    quizLockedHeightRef.current = 0
    setShowConfetti(false)
    loadStep(node.id, stepIdx).then(step => {
      const hasQ = (step.quiz?.length ?? 0) > 0
      const sectionMax = hasQ ? 2 : 1
      setCurrentStep(step)
      const complete = isStepComplete(node.id, stepIdx)
      const savedCount = hasQ ? getQuizAnsweredCount(node.id, stepIdx) : 0
      setAllPassed(complete)
      if (complete) {
        setCurrentSection(sectionMax)
      } else if (hasQ && savedCount >= step.quiz.length) {
        setQuizAnsweredCount(step.quiz.length)
        setActiveQuizIndex(step.quiz.length)
        setCurrentSection(sectionMax)
      } else if (savedCount > 0) {
        setQuizAnsweredCount(savedCount)
        setActiveQuizIndex(savedCount)
        setCurrentSection(1)
      } else {
        setCurrentSection(0)
      }
      setStepLoading(false)
    }).catch(() => setStepLoading(false))
  }, [node?.id, stepIdx])

  useEffect(() => { monaco.editor.setTheme(monacoTheme) }, [monacoTheme])

  const stepKey = `${node?.id ?? 'none'}-${stepIdx}`

  const [prevStepKey, setPrevStepKey] = useState(stepKey)
  if (prevStepKey !== stepKey) {
    setPrevStepKey(stepKey)
    setCurrentSection(0)
  }

  function goToSection(section) {
    setCurrentSection(section)
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
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
          setShowConfetti(true)
        }
      }
    } finally {
      setIsTestRunning(false)
    }
  }

  useMonacoEditor({
    active: currentSection === SECTION_CHALLENGE,
    containerRef: challengeContainerRef,
    editorRef: challengeEditorRef,
    initialCode: currentStep?.starter ?? '',
    stepKey,
    theme: initialThemeRef.current,
    onRun: handleRunChallenge,
    extraOptions: { fontSize: 13, padding: { top: 10, bottom: 10 }, folding: false },
    autoGrow: true,
  })

  if (!node) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-app-muted text-sm mb-3">Lesson not found.</p>
          <Link to="/course" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.8125rem] font-medium text-app-muted no-underline transition-colors duration-150 hover:text-app-fg hover:bg-app-btn">Back to course</Link>
        </div>
      </div>
    )
  }

  if (stepLoading || !currentStep) {
    return <div className="flex-1 flex items-center justify-center"><span className="text-app-muted text-sm">Loading…</span></div>
  }

  if (!isStepUnlocked(node.id, stepIdx) && !isStepComplete(node.id, stepIdx)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-app-muted text-sm mb-3">Complete the previous step first.</p>
          <Link to="/course" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.8125rem] font-medium text-app-muted no-underline transition-colors duration-150 hover:text-app-fg hover:bg-app-btn">Back to course</Link>
        </div>
      </div>
    )
  }

  const passed = testResults?.filter(t => t.passed).length ?? 0
  const total = currentStep.tests.length
  const totalSteps = node.steps.length

  const maxSection = hasQuiz ? 2 : 1
  const progressPct = allPassed ? 100 : currentSection === 0 ? 5 : Math.round(5 + (currentSection / maxSection) * 80)
  const nextDisabled = hasQuiz && currentSection === SECTION_QUIZ && !quizAllAnswered

  function sectionLabel(idx) {
    if (idx === 0) return 'Description'
    if (idx === SECTION_QUIZ) return 'Quiz'
    return 'Challenge'
  }

  function sectionAccent(idx) {
    if (idx === 0) return 'var(--accent-try)'
    if (idx === SECTION_QUIZ) return 'var(--accent-quiz)'
    return 'var(--accent-challenge)'
  }

  return (
    <div className="lesson-page page-enter">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Sticky header */}
      <div className="lesson-slide-header">
        <button onClick={() => navigate('/course')} className="lesson-back-btn" title="Back to course">
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{node.title}</span>
          <span className="text-xs truncate text-app-muted">
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

      {/* Progress bar */}
      <div className="lesson-progress-track">
        <div className="lesson-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Scrollable content */}
      <div className="lesson-slide-content" ref={scrollContainerRef}>
        <div className="lesson-slide-body">

          {/* Section 0: Description */}
          {currentSection === 0 && (
            <div className="lesson-prose lesson-section-pop">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.description, monacoTheme) }} />
            </div>
          )}

          {/* Section 1: Quiz */}
          {hasQuiz && currentSection === SECTION_QUIZ && (
            <div className="lesson-section--quiz lesson-section-pop">
              <p className="lesson-section-label"><HelpCircle size={12} />Check your understanding</p>
              <div className="quiz-progress-bar-track">
                <div
                  className="quiz-progress-bar-fill"
                  style={{ width: `${(quizAnsweredCount / currentStep.quiz.length) * 100}%` }}
                />
              </div>
              <p className="quiz-progress-label">{quizAnsweredCount} / {currentStep.quiz.length} answered</p>
              <div className="quiz-slide-container" ref={quizContainerRef}>
                {exitingQuizIndex !== null && (
                  <div className="quiz-slide-card quiz-slide-exit">
                    <QuizQuestion
                      question={currentStep.quiz[exitingQuizIndex]}
                      number={exitingQuizIndex + 1}
                      isLast={exitingQuizIndex === currentStep.quiz.length - 1}
                      onAnswer={() => {}}
                    />
                  </div>
                )}
                {activeQuizIndex < currentStep.quiz.length && (
                  <div key={`${node.id}-${stepIdx}-${activeQuizIndex}`} className="quiz-slide-card quiz-slide-enter">
                    <QuizQuestion
                      question={currentStep.quiz[activeQuizIndex]}
                      number={activeQuizIndex + 1}
                      isLast={activeQuizIndex === currentStep.quiz.length - 1}
                      onCorrect={handleQuizCorrect}
                      onAnswer={handleQuizAdvance}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2 (or 1): Challenge */}
          {currentSection === SECTION_CHALLENGE && (
            <div className="lesson-section--challenge lesson-section-pop">
              <p className="lesson-section-label"><Trophy size={12} />Challenge</p>
              <div className="lesson-task-text lesson-prose">
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentStep.task, monacoTheme) }} />
              </div>
              <div className="lesson-editor-box" style={{ marginTop: '1rem' }}>
                <div className="lesson-editor-toolbar">
                  <span className="text-xs text-app-muted">
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
                        {runtimeOutput.error && <pre className="text-app-error text-xs whitespace-pre-wrap">{runtimeOutput.error}</pre>}
                        {runtimeOutput.stderr && <pre className="text-app-stderr text-xs whitespace-pre-wrap">{runtimeOutput.stderr}</pre>}
                        {runtimeOutput.stdout && <pre className="text-app-stdout text-xs whitespace-pre-wrap">{runtimeOutput.stdout}</pre>}
                      </>
                    ) : (
                      <span className="text-xs text-app-muted">Run code to see output</span>
                    )}
                  </div>
                </div>
              </div>

              {testResults && (
                <div className="lesson-test-list">
                  {testResults.map((t, i) => (
                    <div key={i} className="flex items-start gap-[0.6rem] text-[0.84rem]">
                      <span className="shrink-0" style={{ color: t.passed ? 'var(--status-green)' : 'var(--status-red)' }}>
                        {t.passed ? '✓' : '✗'}
                      </span>
                      <span className={`text-sm ${t.passed ? 'text-app-muted' : 'text-app-fg'}`}>
                        {t.name}
                        {!t.passed && t.error && (
                          <span className="text-app-error block text-xs mt-0.5">{t.error}</span>
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
                    <button className="bg-app-btn text-app-fg transition-colors duration-150 hover:bg-app-btn-hover text-sm px-4 py-1.5 rounded-lg" onClick={() => navigate('/course')}>
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

      {/* Bottom navigation */}
      <div className="lesson-nav-bar-wrap">
        <div className="lesson-nav-bar">
          <div className="flex-1 flex items-center">
            {currentSection > 0 && (
              <button className="lesson-nav-btn" style={{ '--nav-btn-accent': sectionAccent(currentSection - 1) }} onClick={() => goToSection(currentSection - 1)}>
                <ChevronLeft size={15} className="shrink-0" />
                <span>{sectionLabel(currentSection - 1)}</span>
              </button>
            )}
          </div>

          <div className="lesson-slide-pips">
            {Array.from({ length: maxSection + 1 }).map((_, i) => (
              <div key={i} className={[
                'lesson-slide-pip',
                i === currentSection ? 'lesson-slide-pip-current' : '',
              ].join(' ')} />
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end">
            {currentSection < maxSection && (
              <button
                className="lesson-nav-btn lesson-nav-btn-fwd"
                style={{ '--nav-btn-accent': sectionAccent(currentSection + 1) }}
                onClick={() => goToSection(currentSection + 1)}
                disabled={nextDisabled}
              >
                <span>{sectionLabel(currentSection + 1)}</span>
                <ChevronRight size={15} className="shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

const TOKEN_COLORS = {
  'vs-dark':  { keyword: '#569cd6', string: '#ce9178', number: '#b5cea8', comment: '#6a9955', default: '#d4d4d4' },
  'vs':       { keyword: '#0000ff', string: '#a31515', number: '#098658', comment: '#008000', default: '#000000' },
  'hc-black': { keyword: '#c586c0', string: '#ce9178', number: '#b5cea8', comment: '#608b4e', default: '#ffffff' },
  'hc-light': { keyword: '#0f4a85', string: '#b94824', number: '#005000', comment: '#4d7a00', default: '#000000' },
}

function highlightWithMonaco(code, monacoTheme) {
  const colors = TOKEN_COLORS[monacoTheme] ?? TOKEN_COLORS['vs-dark']
  const lines = code.split('\n')
  const tokenizedLines = monaco.editor.tokenize(code, 'python')
  return lines.map((line, li) => {
    const tokens = tokenizedLines[li] ?? []
    if (tokens.length === 0) return escHtml(line)
    return tokens.map((tok, i) => {
      const text = line.slice(tok.offset, tokens[i + 1]?.offset ?? line.length)
      const base = tok.type.split('.')[0]
      const color = colors[base] ?? null
      const style = color
        ? `color:${color}${base === 'comment' ? ';font-style:italic' : ''}`
        : null
      return style ? `<span style="${style}">${escHtml(text)}</span>` : escHtml(text)
    }).join('')
  }).join('\n')
}

function renderMarkdown(md, monacoTheme) {
  let html = md
    .replace(/```python\n([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${highlightWithMonaco(code.trimEnd(), monacoTheme)}</code></pre>`)
    .replace(/```\n?([\s\S]*?)```/g, (_, code) =>
      `<pre class="lesson-code-block"><code>${highlightWithMonaco(code.trimEnd(), monacoTheme)}</code></pre>`)
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
      if (/^\|/.test(block)) {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
        const isSep = l => /^\|[\s\-:|]+\|$/.test(l)
        const parseRow = l => l.split('|').slice(1, -1).map(c => c.trim())
        const [header, ...rest] = lines
        const thead = `<tr>${parseRow(header).map(h => `<th class="lesson-th">${h}</th>`).join('')}</tr>`
        const tbody = rest.filter(l => !isSep(l))
          .map(l => `<tr>${parseRow(l).map(c => `<td class="lesson-td">${c}</td>`).join('')}</tr>`).join('')
        return `<table class="lesson-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`
      }
      return `<p class="lesson-p">${block.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')
  return html
}

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
