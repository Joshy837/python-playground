import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

export default function QuizQuestion({ question, number, onCorrect, onAnswer, onBack, isLast, isCompleted, shuffledOptions }) {
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
              <button key={i} className={`quiz-option flex items-center gap-3 py-[0.55rem] px-[0.85rem] rounded-[8px] border border-app-border bg-transparent text-app-fg text-[0.86rem] text-left cursor-pointer transition-[border-color,background-color] duration-[120ms] w-full hover:border-app-muted hover:bg-app-surface${i === shuffledAnswer ? ' quiz-option-correct !border-app-green !bg-app-green/10 !text-app-green cursor-default' : ''}`} disabled style={{ opacity: i === shuffledAnswer ? 1 : 0.38 }}>
                <span className="quiz-marker text-[0.75rem] font-bold w-[18px] h-[18px] rounded-full bg-app-muted/20 inline-flex items-center justify-center shrink-0">{i === shuffledAnswer ? '✓' : String.fromCharCode(65 + i)}</span>
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
            className="inline-flex items-center gap-[0.3rem] border-none bg-transparent text-[#16a34a] font-semibold cursor-pointer transition-[background-color,opacity] duration-150 py-[0.22rem] px-[0.65rem] rounded-[6px] text-[0.75rem] ml-auto disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#16a34a]/12"
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
            if (answered && mcqCorrect && optCorrect) cls += ' quiz-option-correct !border-app-green !bg-app-green/10 !text-app-green cursor-default'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => { setSelected(i); if (i === shuffledAnswer) onCorrect?.() }}>
                <span className="quiz-marker text-[0.75rem] font-bold w-[18px] h-[18px] rounded-full bg-app-muted/20 inline-flex items-center justify-center shrink-0">
                  {answered && mcqCorrect && optCorrect ? '✓' : String.fromCharCode(65 + i)}
                </span>
                {text}
              </button>
            )
          })}
        </div>
        {answered && !mcqCorrect && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.9rem] rounded-[10px] bg-app-bg/75 backdrop-blur-sm">
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
