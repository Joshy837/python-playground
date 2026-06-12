import { ChevronRight, HelpCircle } from 'lucide-react'
import ProgressBar from '../shared/ProgressBar.jsx'
import QuizQuestion from './QuizQuestion.jsx'

export default function QuizSection({
  quiz,
  nodeId,
  stepIdx,
  quizAnsweredCount,
  activeQuizIndex,
  exitingQuizIndex,
  navDirection,
  quizContainerRef,
  quizShufflesRef,
  onCorrect,
  onAdvance,
  onBack,
  onReset,
  onContinue,
}) {
  return (
    <div className="lesson-section--quiz lesson-section-pop">
      <p className="lesson-section-label flex items-center gap-[0.35rem] text-[0.68rem] font-bold uppercase tracking-[0.09em] text-app-muted mb-4"><HelpCircle size={12} />Check your understanding</p>
      <ProgressBar
        percent={(quizAnsweredCount / quiz.length) * 100}
        color="var(--accent-quiz)"
        height="6px"
        className="mb-[0.4rem]"
      />
      <p className="text-[0.72rem] text-app-muted mb-6">{quizAnsweredCount} / {quiz.length} answered</p>
      <div className="overflow-hidden relative" ref={quizContainerRef}>
        {exitingQuizIndex !== null && (
          <div className={`quiz-slide-card ${navDirection === 'back' ? 'quiz-slide-exit-back' : 'quiz-slide-exit'}`}>
            <QuizQuestion
              question={quiz[exitingQuizIndex]}
              number={exitingQuizIndex + 1}
              isLast={exitingQuizIndex === quiz.length - 1}
              isCompleted={exitingQuizIndex < quizAnsweredCount}
              shuffledOptions={quizShufflesRef.current[exitingQuizIndex]}
              onAnswer={() => {}}
            />
          </div>
        )}
        {activeQuizIndex < quiz.length && (
          <div key={`${nodeId}-${stepIdx}-${activeQuizIndex}`} className={`quiz-slide-card ${navDirection === 'back' ? 'quiz-slide-enter-back' : 'quiz-slide-enter'}`}>
            <QuizQuestion
              question={quiz[activeQuizIndex]}
              number={activeQuizIndex + 1}
              isLast={activeQuizIndex === quiz.length - 1}
              isCompleted={activeQuizIndex < quizAnsweredCount}
              shuffledOptions={quizShufflesRef.current[activeQuizIndex]}
              onCorrect={onCorrect}
              onAnswer={onAdvance}
              onBack={activeQuizIndex > 0 ? onBack : undefined}
            />
          </div>
        )}
        {activeQuizIndex >= quiz.length && exitingQuizIndex === null && (
          <div className="quiz-slide-card quiz-slide-enter flex flex-col items-center gap-2 px-4 py-8 text-center">
            <p className="text-lg font-semibold text-app-green m-0">All done!</p>
            <p className="text-sm text-app-muted m-0 mb-3">All {quiz.length} question{quiz.length !== 1 ? 's' : ''} correct.</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-[0.4rem] py-[0.4rem] px-4 rounded-[7px] border border-app-border text-app-fg bg-app-surface text-[0.83rem] font-medium cursor-pointer transition-[border-color,background] duration-150 hover:border-app-muted hover:bg-app-bg" onClick={onReset}>Try Again</button>
              <button className="inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.9rem] rounded-[6px] text-[0.8rem] font-semibold bg-[var(--accent-quiz)] text-white border-none cursor-pointer whitespace-nowrap shrink-0 transition-opacity duration-150 hover:opacity-85" onClick={onContinue}>
                Continue <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
