import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useIsMobile } from '../hooks/useMedia.js'
import { Play, ChevronLeft, Check, ChevronRight, HelpCircle, Trophy, RotateCcw, LayoutGrid } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode } from '../runner.js'
import { NODES } from '../data/courseTree.js'
import { loadStep } from '../data/loadStep.js'
import { useProgress } from '../hooks/useProgress.js'
import { useMonacoEditor } from '../hooks/useMonacoEditor.js'

const NAV_BTN_CLS = "inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.8rem] rounded-[8px] relative border border-[color-mix(in_srgb,var(--nav-btn-accent,var(--header-border))_45%,var(--header-border))] bg-[color-mix(in_srgb,var(--nav-btn-accent,transparent)_8%,var(--btn-secondary-bg))] text-[var(--text-primary)] text-[0.82rem] font-medium cursor-pointer transition-[background-color,border-color] duration-[150ms] enabled:hover:bg-[color-mix(in_srgb,var(--nav-btn-accent,transparent)_14%,var(--btn-secondary-hover))] enabled:hover:border-[color-mix(in_srgb,var(--nav-btn-accent,var(--header-border))_70%,var(--header-border))] disabled:opacity-[0.35] disabled:cursor-not-allowed"

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

function QuizQuestion({ question, number, onCorrect, onAnswer, onBack, isLast, isCompleted, shuffledOptions }) {
  const isFitb = !question.options
  const [selected, setSelected] = useState(null)
  const [fitbInput, setFitbInput] = useState('')
  const [fitbSubmitted, setFitbSubmitted] = useState(false)

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

  const prevBtn = onBack ? (
    <button className="flex items-center gap-[0.2rem] text-[0.78rem] text-app-muted bg-transparent border-none cursor-pointer py-[0.2rem] px-[0.5rem] rounded-[6px] transition-[color,background] duration-150 hover:text-app-fg hover:bg-app-btn" onClick={onBack}>
      <ChevronLeft size={14} />Previous
    </button>
  ) : <div />

  const actionRow = (
    <div className="flex items-center justify-between gap-4 mt-2">
      {prevBtn}
      <div className="flex items-center gap-3" style={{ visibility: isCorrect ? 'visible' : 'hidden' }}>
        <div className="mt-[0.6rem] text-[0.83rem] px-[0.85rem] py-[0.55rem] rounded-[7px] bg-app-surface leading-[1.5] text-app-green">
          ✓ Correct!{question.explanation && ` ${question.explanation}`}
        </div>
        <button className="inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.9rem] rounded-[6px] text-[0.8rem] font-semibold bg-[var(--accent-quiz)] text-white border-none cursor-pointer whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-85" onClick={onAnswer}>
          {isLast ? 'Continue' : 'Next'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )

  if (isCompleted) {
    const correctText = String(Array.isArray(question.answer) ? question.answer[0] : question.answer)
    return (
      <div className="mb-7">
        <p className="text-[0.9rem] font-semibold text-app-fg mb-3 leading-[1.5]"><span className="text-app-muted mr-[0.15rem]">{number}.</span> {question.question}</p>
        {shuffledOptions ? (
          <div className="flex flex-col gap-1.5">
            {shuffledOptions.map(({ text }, i) => (
              <button key={i} className={`quiz-option flex items-center gap-3 py-[0.55rem] px-[0.85rem] rounded-[8px] border border-app-border bg-transparent text-app-fg text-[0.86rem] text-left cursor-pointer transition-[border-color,background-color] duration-[120ms] w-full hover:border-app-muted hover:bg-app-surface${i === shuffledAnswer ? ' quiz-option-correct !border-app-green !bg-[color-mix(in_srgb,var(--status-green)_10%,transparent)] !text-app-green cursor-default' : ''}`} disabled style={{ opacity: i === shuffledAnswer ? 1 : 0.38 }}>
                <span className="quiz-marker text-[0.75rem] font-bold w-[18px] h-[18px] rounded-full bg-[color-mix(in_srgb,var(--text-muted)_20%,transparent)] inline-flex items-center justify-center shrink-0">{i === shuffledAnswer ? '✓' : String.fromCharCode(65 + i)}</span>
                {text}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <input type="text" className="flex-1 py-2 px-3 rounded-[8px] border border-app-border bg-transparent text-app-fg text-[0.86rem] outline-none transition-[border-color] duration-[120ms] font-[inherit] disabled:opacity-60 disabled:cursor-default focus:border-app-muted" value={correctText} readOnly disabled />
          </div>
        )}
        <div className="flex items-center justify-between gap-4 mt-2">
          {prevBtn}
          <div className="flex items-center gap-3">
            <div className="mt-[0.6rem] text-[0.83rem] px-[0.85rem] py-[0.55rem] rounded-[7px] bg-app-surface leading-[1.5] text-app-green">
              ✓ Correct!{question.explanation && ` ${question.explanation}`}
            </div>
            <button className="inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.9rem] rounded-[6px] text-[0.8rem] font-semibold bg-[var(--accent-quiz)] text-white border-none cursor-pointer whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-85" onClick={onAnswer}>
              {isLast ? 'Continue' : 'Next'} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isFitb) {
    return (
      <div className="mb-7">
        <p className="text-[0.9rem] font-semibold text-app-fg mb-3 leading-[1.5]"><span className="text-app-muted mr-[0.15rem]">{number}.</span> {question.question}</p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 py-2 px-3 rounded-[8px] border border-app-border bg-transparent text-app-fg text-[0.86rem] outline-none transition-[border-color] duration-[120ms] font-[inherit] disabled:opacity-60 disabled:cursor-default focus:border-app-muted"
            value={fitbInput}
            onChange={e => { setFitbInput(e.target.value); setFitbSubmitted(false) }}
            disabled={fitbSubmitted && fitbCorrect}
            onKeyDown={e => { if (e.key === 'Enter' && fitbInput.trim()) submitFitb() }}
            placeholder="Type your answer…"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="inline-flex items-center gap-[0.3rem] border-none bg-transparent text-[#16a34a] font-semibold cursor-pointer transition-[background-color,opacity] duration-150 py-[0.22rem] px-[0.65rem] rounded-[6px] text-[0.75rem] ml-auto disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[color-mix(in_srgb,#16a34a_12%,transparent)]"
            disabled={(fitbSubmitted && fitbCorrect) || !fitbInput.trim()}
            onClick={submitFitb}
          >
            Check
          </button>
        </div>
        {fitbSubmitted && !fitbCorrect && (
          <p className="mt-2 text-[0.83rem] text-app-red">Not quite — give it another try.</p>
        )}
        {actionRow}
      </div>
    )
  }

  return (
    <div className="mb-7">
      <p className="text-[0.9rem] font-semibold text-app-fg mb-3 leading-[1.5]"><span className="text-app-muted mr-[0.15rem]">{number}.</span> {question.question}</p>
      <div className="relative">
        <div className="flex flex-col gap-1.5">
          {shuffledOptions.map(({ text }, i) => {
            const optCorrect = i === shuffledAnswer
            let cls = 'quiz-option flex items-center gap-3 py-[0.55rem] px-[0.85rem] rounded-[8px] border border-app-border bg-transparent text-app-fg text-[0.86rem] text-left cursor-pointer transition-[border-color,background-color] duration-[120ms] w-full hover:border-app-muted hover:bg-app-surface'
            if (answered && mcqCorrect && optCorrect) cls += ' quiz-option-correct !border-app-green !bg-[color-mix(in_srgb,var(--status-green)_10%,transparent)] !text-app-green cursor-default'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => { setSelected(i); if (i === shuffledAnswer) onCorrect?.() }}>
                <span className="quiz-marker text-[0.75rem] font-bold w-[18px] h-[18px] rounded-full bg-[color-mix(in_srgb,var(--text-muted)_20%,transparent)] inline-flex items-center justify-center shrink-0">
                  {answered && mcqCorrect && optCorrect ? '✓' : String.fromCharCode(65 + i)}
                </span>
                {text}
              </button>
            )
          })}
        </div>
        {answered && !mcqCorrect && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.9rem] rounded-[10px] bg-[color-mix(in_srgb,var(--app-bg)_75%,transparent)] backdrop-blur-sm">
            <span className="text-[0.88rem] font-semibold text-app-red">Not quite — give it another go.</span>
            <button className="flex items-center gap-[0.4rem] py-[0.4rem] px-4 rounded-[7px] border border-app-border text-app-fg bg-app-surface text-[0.83rem] font-medium cursor-pointer transition-[border-color,background] duration-150 hover:border-app-muted hover:bg-app-bg" onClick={() => setSelected(null)}>
              <RotateCcw size={13} />
              Try again
            </button>
          </div>
        )}
      </div>
      {actionRow}
    </div>
  )
}

// currentSection: 0=description, 1=quiz (if hasQuiz), 2=challenge (or 1 without quiz)

export default function LessonPage({ pyodideReady, monacoTheme }) {
  const { id, step } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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

  const isMobile = useIsMobile()
  const [showStepSheet, setShowStepSheet] = useState(false)

  const [currentSection, setCurrentSection] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runtimeOutput, setRuntimeOutput] = useState(null)
  const [allPassed, setAllPassed] = useState(false)
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0)
  const [activeQuizIndex, setActiveQuizIndex] = useState(0)
  const [exitingQuizIndex, setExitingQuizIndex] = useState(null)
  const [navDirection, setNavDirection] = useState('forward')
  const quizAllAnswered = quizAnsweredCount >= (currentStep?.quiz?.length ?? 0)

  const challengeContainerRef = useRef(null)
  const challengeEditorRef = useRef(null)
  const quizContainerRef = useRef(null)
  const quizShufflesRef = useRef([])
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
    const isLastQuestion = activeQuizIndex === currentStep.quiz.length - 1
    setNavDirection('forward')
    setExitingQuizIndex(activeQuizIndex)
    setActiveQuizIndex(i => i + 1)
    setTimeout(() => {
      setExitingQuizIndex(null)
      if (isLastQuestion) goToSection(SECTION_CHALLENGE)
    }, 300)
  }

  function handleQuizBack() {
    if (activeQuizIndex === 0) return
    const container = quizContainerRef.current
    if (container) {
      const h = container.offsetHeight
      quizLockedHeightRef.current = Math.max(quizLockedHeightRef.current, h)
      container.style.minHeight = quizLockedHeightRef.current + 'px'
    }
    setNavDirection('back')
    setExitingQuizIndex(activeQuizIndex)
    setActiveQuizIndex(i => i - 1)
    setTimeout(() => setExitingQuizIndex(null), 300)
  }

  function handleQuizReset() {
    setQuizAnsweredCount(0)
    saveQuizProgress(node.id, stepIdx, 0)
    setNavDirection('back')
    setExitingQuizIndex(null)
    setActiveQuizIndex(0)
    quizLockedHeightRef.current = 0
    if (quizContainerRef.current) quizContainerRef.current.style.minHeight = ''
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
      quizShufflesRef.current = (step.quiz ?? []).map(q => {
        if (!q.options) return null
        const opts = q.options.map((text, i) => ({ text, i }))
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]]
        }
        return opts
      })
      setCurrentStep(step)
      const complete = isStepComplete(node.id, stepIdx)
      const savedCount = hasQ ? getQuizAnsweredCount(node.id, stepIdx) : 0
      setAllPassed(complete)
      if (hasQ && savedCount > 0) {
        setQuizAnsweredCount(savedCount)
        setActiveQuizIndex(savedCount)
      }
      setCurrentSection(location.state?.section === 'challenge' ? (hasQ ? 2 : 1) : 0)
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
  const nextDisabled = hasQuiz && currentSection === SECTION_QUIZ && !quizAllAnswered && !allPassed

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
    <div className="flex-1 min-h-0 flex flex-col bg-transparent overflow-hidden page-enter">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      {/* Sticky header */}
      <div className="flex items-center gap-[0.65rem] px-4 py-[0.65rem] bg-app-surface border-b border-app-border shrink-0">
        <button onClick={() => navigate('/course')} className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn" title="Back to course">
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{node.title}</span>
          <span className="text-xs truncate text-app-muted">
            Step {stepIdx + 1} / {totalSteps} — {currentStep.title}
          </span>
        </div>
        {isMobile ? (
          <button
            className="flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border-none bg-transparent text-app-muted cursor-pointer transition-[color,background-color] duration-150 shrink-0 hover:text-app-fg hover:bg-app-btn"
            title="Jump to step"
            onClick={() => setShowStepSheet(true)}
          >
            <LayoutGrid size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            {node.steps.map((s, i) => {
              const done = isStepComplete(node.id, i)
              const current = i === stepIdx
              return (
                <button
                  key={i}
                  className={`w-[32px] h-[32px] rounded-full border-[2.5px] bg-app-bg text-[0.8rem] font-semibold cursor-pointer flex items-center justify-center shrink-0 p-0 transition-[border-color,color] duration-150 ${done ? 'border-app-green text-app-green' : current ? 'border-app-fg text-app-fg' : 'border-app-border text-app-muted hover:border-app-muted hover:text-app-fg'}`}
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
        )}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-app-border shrink-0 relative">
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--accent-try)] to-[var(--accent-challenge)] [transition:width_0.55s_cubic-bezier(0.4,0,0.2,1)] rounded-[0_2px_2px_0] shadow-[0_0_8px_color-mix(in_srgb,var(--accent-try)_50%,transparent)]" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-[radial-gradient(circle,color-mix(in_srgb,var(--text-muted)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px]" ref={scrollContainerRef}>
        <div className="max-w-[740px] w-full mx-auto px-6 pt-9 pb-12">

          {/* Section 0: Description */}
          {currentSection === 0 && (
            <div className="text-[0.9rem] leading-[1.75] text-app-fg lesson-section-pop">
              <Markdown md={currentStep.description} monacoTheme={monacoTheme} />
            </div>
          )}

          {/* Section 1: Quiz */}
          {hasQuiz && currentSection === SECTION_QUIZ && (
            <div className="lesson-section--quiz lesson-section-pop">
              <p className="lesson-section-label flex items-center gap-[0.35rem] text-[0.68rem] font-bold uppercase tracking-[0.09em] text-app-muted mb-4"><HelpCircle size={12} />Check your understanding</p>
              <div className="h-[6px] bg-app-border rounded-full overflow-hidden mb-[0.4rem]">
                <div
                  className="h-full bg-[var(--accent-quiz)] rounded-full transition-[width] duration-[350ms] ease"
                  style={{ width: `${(quizAnsweredCount / currentStep.quiz.length) * 100}%` }}
                />
              </div>
              <p className="text-[0.72rem] text-app-muted mb-6">{quizAnsweredCount} / {currentStep.quiz.length} answered</p>
              <div className="overflow-hidden relative" ref={quizContainerRef}>
                {exitingQuizIndex !== null && (
                  <div className={`quiz-slide-card ${navDirection === 'back' ? 'quiz-slide-exit-back' : 'quiz-slide-exit'}`}>
                    <QuizQuestion
                      question={currentStep.quiz[exitingQuizIndex]}
                      number={exitingQuizIndex + 1}
                      isLast={exitingQuizIndex === currentStep.quiz.length - 1}
                      isCompleted={exitingQuizIndex < quizAnsweredCount}
                      shuffledOptions={quizShufflesRef.current[exitingQuizIndex]}
                      onAnswer={() => {}}
                    />
                  </div>
                )}
                {activeQuizIndex < currentStep.quiz.length && (
                  <div key={`${node.id}-${stepIdx}-${activeQuizIndex}`} className={`quiz-slide-card ${navDirection === 'back' ? 'quiz-slide-enter-back' : 'quiz-slide-enter'}`}>
                    <QuizQuestion
                      question={currentStep.quiz[activeQuizIndex]}
                      number={activeQuizIndex + 1}
                      isLast={activeQuizIndex === currentStep.quiz.length - 1}
                      isCompleted={activeQuizIndex < quizAnsweredCount}
                      shuffledOptions={quizShufflesRef.current[activeQuizIndex]}
                      onCorrect={handleQuizCorrect}
                      onAnswer={handleQuizAdvance}
                      onBack={activeQuizIndex > 0 ? handleQuizBack : undefined}
                    />
                  </div>
                )}
                {activeQuizIndex >= currentStep.quiz.length && exitingQuizIndex === null && (
                  <div className="quiz-slide-card quiz-slide-enter flex flex-col items-center gap-2 px-4 py-8 text-center">
                    <p className="text-lg font-semibold text-app-green m-0">All done!</p>
                    <p className="text-sm text-app-muted m-0 mb-3">All {currentStep.quiz.length} question{currentStep.quiz.length !== 1 ? 's' : ''} correct.</p>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-[0.4rem] py-[0.4rem] px-4 rounded-[7px] border border-app-border text-app-fg bg-app-surface text-[0.83rem] font-medium cursor-pointer transition-[border-color,background] duration-150 hover:border-app-muted hover:bg-app-bg" onClick={handleQuizReset}>Try Again</button>
                      <button className="inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.9rem] rounded-[6px] text-[0.8rem] font-semibold bg-[var(--accent-quiz)] text-white border-none cursor-pointer whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-85" onClick={() => goToSection(SECTION_CHALLENGE)}>
                        Continue <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2 (or 1): Challenge */}
          {currentSection === SECTION_CHALLENGE && (
            <div className="lesson-section--challenge lesson-section-pop">
              <p className="lesson-section-label flex items-center gap-[0.35rem] text-[0.68rem] font-bold uppercase tracking-[0.09em] text-app-muted mb-4"><Trophy size={12} />Challenge</p>
              <div className="text-[0.9rem] leading-[1.75] text-app-fg">
                <Markdown md={currentStep.task} monacoTheme={monacoTheme} />
              </div>
              <div className="border border-app-border rounded-[10px] overflow-hidden mt-4">
                <div className="flex items-center gap-2 px-3 py-[0.4rem] bg-app-surface border-b border-app-border">
                  <span className="text-xs text-app-muted">
                    {testResults ? `${passed} / ${total} tests passing` : `${total} test${total !== 1 ? 's' : ''}`}
                  </span>
                  <button
                    className="inline-flex items-center gap-[0.3rem] border-none bg-transparent text-[#16a34a] font-semibold cursor-pointer transition-[background-color,opacity] duration-150 py-[0.22rem] px-[0.65rem] rounded-[6px] text-[0.75rem] ml-auto disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[color-mix(in_srgb,#16a34a_12%,transparent)]"
                    disabled={!pyodideReady || isTestRunning}
                    onClick={handleRunChallenge}
                    title="Run Tests (Ctrl+Enter)"
                  >
                    <Play size={12} fill="currentColor" stroke="none" />
                    {isTestRunning ? 'Running…' : 'Run Tests'}
                  </button>
                </div>
                <div className="flex flex-row items-stretch">
                  <div ref={challengeContainerRef} className="lesson-editor-pane flex-1 min-w-0" />
                  <div className="w-[40%] border-l border-app-output-border bg-app-surface px-[0.9rem] py-[0.65rem] overflow-y-auto">
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
                <div className="flex flex-col gap-2 mt-4">
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
                <div className="flex items-center justify-between gap-4 mt-6 py-4 px-5 rounded-[10px] bg-[color-mix(in_srgb,var(--status-green)_10%,var(--header-bg))] border border-[color-mix(in_srgb,var(--status-green)_30%,transparent)]">
                  <span className="text-sm font-semibold" style={{ color: 'var(--status-green)' }}>
                    {isLastStep ? `${node.title} complete!` : 'All tests pass!'}
                  </span>
                  {isLastStep ? (
                    <button className="bg-app-btn text-app-fg transition-colors duration-150 hover:bg-app-btn-hover text-sm px-4 py-1.5 rounded-lg" onClick={() => navigate('/course')}>
                      Back to course
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-[4px] py-[0.35rem] px-[0.85rem] rounded-[8px] border-none bg-app-green text-black text-[0.82rem] font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-85" onClick={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}>
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
      <div className="shrink-0 border-t border-app-border bg-app-surface">
        <div className="flex items-center justify-between shrink-0 max-w-[740px] w-full mx-auto px-6 py-[0.85rem]">
          <div className="flex-1 flex items-center">
            {currentSection > 0 ? (
              <button className={NAV_BTN_CLS} style={{ '--nav-btn-accent': sectionAccent(currentSection - 1) }} onClick={() => goToSection(currentSection - 1)}>
                <ChevronLeft size={15} className="shrink-0" />
                <span>{sectionLabel(currentSection - 1)}</span>
              </button>
            ) : stepIdx > 0 && (
              <button
                className={NAV_BTN_CLS}
                style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                onClick={() => navigate(`/learn/${node.id}/${stepIdx}`, { state: { section: 'challenge' } })}
              >
                <ChevronLeft size={15} className="shrink-0" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[0.65rem] opacity-60">Prev lesson</span>
                  <span>{node.steps[stepIdx - 1].title}</span>
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-[0.45rem]">
            {Array.from({ length: maxSection + 1 }).map((_, i) => (
              <div key={i} className={`w-[7px] h-[7px] rounded-full [transition:background-color_0.15s,transform_0.1s] ${i === currentSection ? 'bg-app-fg scale-[1.3]' : 'bg-app-border'}`} />
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end">
            {currentSection < maxSection ? (
              <button
                className={NAV_BTN_CLS}
                style={{ '--nav-btn-accent': sectionAccent(currentSection + 1) }}
                onClick={() => goToSection(currentSection + 1)}
                disabled={nextDisabled}
              >
                <span>{sectionLabel(currentSection + 1)}</span>
                <ChevronRight size={15} className="shrink-0" />
              </button>
            ) : allPassed && (
              isLastStep ? (
                <button
                  className={NAV_BTN_CLS}
                  style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                  onClick={() => navigate('/course')}
                >
                  <span>Back to course</span>
                  <ChevronRight size={15} className="shrink-0" />
                </button>
              ) : (
                <button
                  className={NAV_BTN_CLS}
                  style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                  onClick={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}
                >
                  <span className="flex flex-col items-end leading-tight">
                    <span className="text-[0.65rem] opacity-60">Next lesson</span>
                    <span>{node.steps[stepIdx + 1].title}</span>
                  </span>
                  <ChevronRight size={15} className="shrink-0" />
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {showStepSheet && (
        <>
          <div className="fixed inset-0 z-[100] bg-transparent" onClick={() => setShowStepSheet(false)} />
          <div className="course-sheet">
            <div className="w-9 h-1 rounded-sm bg-app-border mx-auto mb-[14px]" />
            <p className="text-[0.85rem] font-semibold text-app-fg text-center mb-[14px]">{node.title} — Steps</p>
            <div className="flex flex-wrap gap-[10px] justify-center">
              {node.steps.map((s, i) => {
                const done = isStepComplete(node.id, i)
                const current = i === stepIdx
                const unlocked = done || isStepUnlocked(node.id, i)
                return (
                  <button
                    key={i}
                    className={`course-step-btn w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center text-[0.7rem] font-bold leading-none cursor-pointer bg-transparent shrink-0 [transition:transform_0.1s,box-shadow_0.15s,border-color_0.15s] ${done ? 'border-app-green bg-[color-mix(in_srgb,var(--status-green)_10%,var(--header-bg))] text-app-green hover:scale-[1.08] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--status-green)_25%,transparent)]' : unlocked ? 'border-app-muted bg-app-surface text-app-fg hover:border-app-fg hover:scale-[1.08] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--text-primary)_15%,transparent)]' : 'border-app-border bg-app-surface text-app-muted opacity-45 cursor-not-allowed'}`}
                    style={current ? { outline: '2px solid var(--text-primary)', outlineOffset: '2px' } : undefined}
                    title={s.title}
                    onClick={() => {
                      if (!unlocked) return
                      setShowStepSheet(false)
                      if (!current) navigate(`/learn/${node.id}/${i + 1}`)
                    }}
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

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
  inlineCode: 'font-mono text-[0.82em] py-[0.12em] px-[0.4em] rounded-[4px] bg-[color-mix(in_srgb,var(--text-muted)_15%,transparent)]',
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

function Markdown({ md, monacoTheme }) {
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
