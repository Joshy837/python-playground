import { forwardRef } from 'react'
import { Terminal } from 'lucide-react'

const OutputPanel = forwardRef(function OutputPanel({ output }, ref) {
  return (
    <div
      ref={ref}
      className="flex flex-col h-44 shrink-0 md:h-auto md:flex-none overflow-hidden bg-app-output border-t-2 border-t-sky-500/30"
    >
      <div className="px-3 py-2 text-xs font-medium border-b shrink-0 flex items-center justify-between border-app-output-border text-app-muted bg-app-surface">
        <span className="uppercase tracking-wider">Output</span>
        {output?.elapsed != null && (
          <span className="text-app-muted font-normal normal-case tracking-normal">
            {output.elapsed < 1000
              ? `${Math.round(output.elapsed)} ms`
              : `${(output.elapsed / 1000).toFixed(2)} s`}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        <OutputContent output={output} />
      </div>
    </div>
  )
})

function OutputContent({ output }) {
  if (!output)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 select-none pointer-events-none">
        <Terminal
          size={28}
          strokeWidth={1.5}
          className="text-app-muted opacity-30"
        />
        <span className="text-app-muted text-xs opacity-40">
          Ctrl / ⌘ + Enter to run
        </span>
      </div>
    )

  const { stdout, stderr, error, plots } = output
  const hasPlots = plots && plots.length > 0

  if (!stdout && !stderr && !error && !hasPlots) {
    return <span className="text-app-muted">No output</span>
  }

  return (
    <>
      {stdout && (
        <pre className="text-app-stdout whitespace-pre-wrap break-words">
          {stdout}
        </pre>
      )}
      {hasPlots &&
        plots.map((b64, i) => (
          <img
            key={i}
            src={`data:image/png;base64,${b64}`}
            className="block max-w-full h-auto mt-2 rounded"
            alt=""
          />
        ))}
      {stderr && (
        <pre className="text-app-stderr whitespace-pre-wrap break-words mt-2">
          {stderr}
        </pre>
      )}
      {error && (
        <pre className="text-app-error whitespace-pre-wrap break-words mt-2">
          {error}
        </pre>
      )}
    </>
  )
}

export default OutputPanel
