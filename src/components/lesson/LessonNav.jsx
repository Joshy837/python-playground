import { ChevronLeft, ChevronRight } from 'lucide-react'

const NAV_BTN_CLS =
  'inline-flex items-center gap-[0.3rem] py-[0.35rem] px-[0.8rem] rounded-[8px] relative border border-[color-mix(in_srgb,var(--nav-btn-accent,var(--header-border))_45%,var(--header-border))] bg-[color-mix(in_srgb,var(--nav-btn-accent,transparent)_8%,var(--btn-secondary-bg))] text-[var(--text-primary)] text-[0.82rem] font-medium cursor-pointer transition-[background-color,border-color] duration-[150ms] enabled:hover:bg-[color-mix(in_srgb,var(--nav-btn-accent,transparent)_14%,var(--btn-secondary-hover))] enabled:hover:border-[color-mix(in_srgb,var(--nav-btn-accent,var(--header-border))_70%,var(--header-border))] disabled:opacity-[0.35] disabled:cursor-not-allowed'

export default function LessonNav({
  currentSection,
  maxSection,
  nextDisabled,
  allPassed,
  isLastStep,
  stepIdx,
  node,
  hasQuiz,
  onGoToSection,
  onNavigatePrevLesson,
  onNavigateCourse,
  onNavigateNextStep,
}) {
  const SECTION_QUIZ = hasQuiz ? 1 : null

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
    <div className="shrink-0 border-t border-app-border bg-app-surface">
      <div className="flex items-center justify-between shrink-0 max-w-[740px] w-full mx-auto px-6 py-[0.85rem]">
        <div className="flex-1 flex items-center">
          {currentSection > 0 ? (
            <button
              className={NAV_BTN_CLS}
              style={{ '--nav-btn-accent': sectionAccent(currentSection - 1) }}
              onClick={() => onGoToSection(currentSection - 1)}
            >
              <ChevronLeft size={15} className="shrink-0" />
              <span>{sectionLabel(currentSection - 1)}</span>
            </button>
          ) : (
            stepIdx > 0 && (
              <button
                className={NAV_BTN_CLS}
                style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                onClick={onNavigatePrevLesson}
              >
                <ChevronLeft size={15} className="shrink-0" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[0.65rem] opacity-60">Prev lesson</span>
                  <span>{node.steps[stepIdx - 1].title}</span>
                </span>
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-[0.45rem]">
          {Array.from({ length: maxSection + 1 }).map((_, i) => (
            <div
              key={i}
              className={`w-[7px] h-[7px] rounded-full [transition:background-color_0.15s,transform_0.1s] ${i === currentSection ? 'bg-app-fg scale-[1.3]' : 'bg-app-border'}`}
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-end">
          {currentSection < maxSection ? (
            <button
              className={NAV_BTN_CLS}
              style={{ '--nav-btn-accent': sectionAccent(currentSection + 1) }}
              onClick={() => onGoToSection(currentSection + 1)}
              disabled={nextDisabled}
            >
              <span>{sectionLabel(currentSection + 1)}</span>
              <ChevronRight size={15} className="shrink-0" />
            </button>
          ) : (
            allPassed &&
            (isLastStep ? (
              <button
                className={NAV_BTN_CLS}
                style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                onClick={onNavigateCourse}
              >
                <span>Back to course</span>
                <ChevronRight size={15} className="shrink-0" />
              </button>
            ) : (
              <button
                className={NAV_BTN_CLS}
                style={{ '--nav-btn-accent': 'var(--accent-challenge)' }}
                onClick={onNavigateNextStep}
              >
                <span className="flex flex-col items-end leading-tight">
                  <span className="text-[0.65rem] opacity-60">Next lesson</span>
                  <span>{node.steps[stepIdx + 1].title}</span>
                </span>
                <ChevronRight size={15} className="shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
