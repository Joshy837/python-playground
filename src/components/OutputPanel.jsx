import { forwardRef } from 'react'

const OutputPanel = forwardRef(function OutputPanel({ output }, ref) {
  return (
    <div ref={ref} className="output-panel flex flex-col flex-1 md:flex-none overflow-hidden">
      <div className="output-label px-3 py-2 text-xs font-medium uppercase tracking-wider border-b shrink-0 flex items-center justify-between">
        <span>Output</span>
        {output?.elapsed != null && (
          <span className="text-muted font-normal normal-case tracking-normal">
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
  if (!output) return null

  const { stdout, stderr, error, plots } = output
  const hasPlots = plots && plots.length > 0

  if (!stdout && !stderr && !error && !hasPlots) {
    return <span className="output-empty">No output</span>
  }

  return (
    <>
      {stdout && <pre className="output-stdout whitespace-pre-wrap break-words">{stdout}</pre>}
      {hasPlots && plots.map((b64, i) => (
        <img key={i} src={`data:image/png;base64,${b64}`} className="output-plot" alt="" />
      ))}
      {stderr && <pre className="output-stderr whitespace-pre-wrap break-words mt-2">{stderr}</pre>}
      {error && <pre className="output-error whitespace-pre-wrap break-words mt-2">{error}</pre>}
    </>
  )
}

export default OutputPanel
