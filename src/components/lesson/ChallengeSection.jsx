import { Play, Trophy, ChevronRight } from 'lucide-react'
import Markdown from '../shared/Markdown.jsx'

export default function ChallengeSection({
  task,
  monacoTheme,
  tests,
  testResults,
  runtimeOutput,
  isTestRunning,
  pyodideReady,
  allPassed,
  isLastStep,
  nodeTitle,
  containerRef,
  onRun,
  onNextStep,
  onBackToCourse,
}) {
  const passed = testResults?.filter(t => t.passed).length ?? 0
  const total = tests.length

  return (
    <div className="lesson-section--challenge lesson-section-pop">
      <p className="lesson-section-label flex items-center gap-[0.35rem] text-[0.68rem] font-bold uppercase tracking-[0.09em] text-app-muted mb-4"><Trophy size={12} />Challenge</p>
      <div className="text-[0.9rem] leading-[1.75] text-app-fg">
        <Markdown md={task} monacoTheme={monacoTheme} />
      </div>
      <div className="border border-app-border rounded-[10px] overflow-hidden mt-4">
        <div className="flex items-center gap-2 px-3 py-[0.4rem] bg-app-surface border-b border-app-border">
          <span className="text-xs text-app-muted">
            {testResults ? `${passed} / ${total} tests passing` : `${total} test${total !== 1 ? 's' : ''}`}
          </span>
          <button
            className="inline-flex items-center gap-[0.3rem] border-none bg-transparent text-[#16a34a] font-semibold cursor-pointer transition-[background-color,opacity] duration-150 py-[0.22rem] px-[0.65rem] rounded-[6px] text-[0.75rem] ml-auto disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#16a34a]/12"
            disabled={!pyodideReady || isTestRunning}
            onClick={onRun}
            title="Run Tests (Ctrl+Enter)"
          >
            <Play size={12} fill="currentColor" stroke="none" />
            {isTestRunning ? 'Running…' : 'Run Tests'}
          </button>
        </div>
        <div className="flex flex-row items-stretch">
          <div ref={containerRef} className="lesson-editor-pane flex-1 min-w-0" />
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
        <div className="flex items-center justify-between gap-4 mt-6 py-4 px-5 rounded-[10px] bg-[color-mix(in_srgb,var(--status-green)_10%,var(--header-bg))] border border-app-green/30">
          <span className="text-sm font-semibold" style={{ color: 'var(--status-green)' }}>
            {isLastStep ? `${nodeTitle} complete!` : 'All tests pass!'}
          </span>
          {isLastStep ? (
            <button className="bg-app-btn text-app-fg transition-colors duration-150 hover:bg-app-btn-hover text-sm px-4 py-1.5 rounded-lg" onClick={onBackToCourse}>
              Back to course
            </button>
          ) : (
            <button className="inline-flex items-center gap-[4px] py-[0.35rem] px-[0.85rem] rounded-[8px] border-none bg-app-green text-black text-[0.82rem] font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-85" onClick={onNextStep}>
              Next step <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
