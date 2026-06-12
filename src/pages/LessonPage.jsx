import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import * as monaco from 'monaco-editor'
import { runCode } from '../runner.js'
import { buildTestCode, parseTestResults, stripTestLine } from '../utils/lessonTest.js'
import { NODES } from '../data/courseTree.js'
import { loadStep } from '../data/loadStep.js'
import { useProgress } from '../hooks/useProgress.js'
import { useMonacoEditor } from '../hooks/useMonacoEditor.js'
import Markdown from '../components/shared/Markdown.jsx'
import ConfettiBurst from '../components/lesson/ConfettiBurst.jsx'
import LessonHeader from '../components/lesson/LessonHeader.jsx'
import QuizSection from '../components/lesson/QuizSection.jsx'
import ChallengeSection from '../components/lesson/ChallengeSection.jsx'
import LessonNav from '../components/lesson/LessonNav.jsx'

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

  const totalSteps = node.steps.length
  const maxSection = hasQuiz ? 2 : 1
  const progressPct = allPassed ? 100 : currentSection === 0 ? 5 : Math.round(5 + (currentSection / maxSection) * 80)
  const nextDisabled = hasQuiz && currentSection === SECTION_QUIZ && !quizAllAnswered && !allPassed

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-transparent overflow-hidden page-enter">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}

      <LessonHeader
        node={node}
        stepIdx={stepIdx}
        totalSteps={totalSteps}
        stepTitle={currentStep.title}
        isStepComplete={isStepComplete}
        isStepUnlocked={isStepUnlocked}
        onBack={() => navigate('/course')}
        onNavigateToStep={i => navigate(`/learn/${node.id}/${i + 1}`)}
      />

      <div className="h-[3px] bg-app-border shrink-0 relative">
        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--accent-try)] to-[var(--accent-challenge)] [transition:width_0.55s_cubic-bezier(0.4,0,0.2,1)] rounded-[0_2px_2px_0] shadow-[0_0_8px_color-mix(in_srgb,var(--accent-try)_50%,transparent)]" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-[radial-gradient(circle,color-mix(in_srgb,var(--text-muted)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px]" ref={scrollContainerRef}>
        <div className="max-w-[740px] w-full mx-auto px-6 pt-9 pb-12">

          {currentSection === 0 && (
            <div className="text-[0.9rem] leading-[1.75] text-app-fg lesson-section-pop">
              <Markdown md={currentStep.description} monacoTheme={monacoTheme} />
            </div>
          )}

          {hasQuiz && currentSection === SECTION_QUIZ && (
            <QuizSection
              quiz={currentStep.quiz}
              nodeId={node.id}
              stepIdx={stepIdx}
              quizAnsweredCount={quizAnsweredCount}
              activeQuizIndex={activeQuizIndex}
              exitingQuizIndex={exitingQuizIndex}
              navDirection={navDirection}
              quizContainerRef={quizContainerRef}
              quizShufflesRef={quizShufflesRef}
              onCorrect={handleQuizCorrect}
              onAdvance={handleQuizAdvance}
              onBack={handleQuizBack}
              onReset={handleQuizReset}
              onContinue={() => goToSection(SECTION_CHALLENGE)}
            />
          )}

          {currentSection === SECTION_CHALLENGE && (
            <ChallengeSection
              task={currentStep.task}
              monacoTheme={monacoTheme}
              tests={currentStep.tests}
              testResults={testResults}
              runtimeOutput={runtimeOutput}
              isTestRunning={isTestRunning}
              pyodideReady={pyodideReady}
              allPassed={allPassed}
              isLastStep={isLastStep}
              nodeTitle={node.title}
              containerRef={challengeContainerRef}
              onRun={handleRunChallenge}
              onNextStep={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}
              onBackToCourse={() => navigate('/course')}
            />
          )}

        </div>
      </div>

      <LessonNav
        currentSection={currentSection}
        maxSection={maxSection}
        nextDisabled={nextDisabled}
        allPassed={allPassed}
        isLastStep={isLastStep}
        stepIdx={stepIdx}
        node={node}
        hasQuiz={hasQuiz}
        onGoToSection={goToSection}
        onNavigatePrevLesson={() => navigate(`/learn/${node.id}/${stepIdx}`, { state: { section: 'challenge' } })}
        onNavigateCourse={() => navigate('/course')}
        onNavigateNextStep={() => navigate(`/learn/${node.id}/${stepIdx + 2}`)}
      />
    </div>
  )
}
