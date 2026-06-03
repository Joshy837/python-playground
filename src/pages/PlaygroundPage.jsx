import { useState, useEffect, useRef } from 'react'
import { Play, Square } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode, cancelRun } from '../runner.js'
import OutputPanel from '../components/OutputPanel.jsx'

const EXAMPLES = [
  { label: 'Hello World',         file: 'hello_world.py'         },
  { label: 'Fibonacci',           file: 'fibonacci.py'           },
  { label: 'FizzBuzz',            file: 'fizzbuzz.py'            },
  { label: 'List Comprehensions', file: 'list_comprehensions.py' },
  { label: 'Classes',             file: 'classes.py'             },
  { label: 'Matplotlib',          file: 'matplotlib_plot.py'     },
]

const DEFAULT_CODE = `# Write your Python code here and press Run (or Ctrl+Enter / Cmd+Enter)
print("Hello, World!")
`

export default function PlaygroundPage({ pyodideReady, pyodideError }) {
  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const mainRef = useRef(null)
  const outputPanelRef = useRef(null)
  const resizeHandleRef = useRef(null)

  const [isRunning, setIsRunning] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [selectedExample, setSelectedExample] = useState('')
  const [output, setOutput] = useState(null)

  // Monaco setup
  useEffect(() => {
    const editor = monaco.editor.create(editorContainerRef.current, {
      value: DEFAULT_CODE,
      language: 'python',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
    })
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunRef.current()
    })
    return () => {
      editor.dispose()
      editorRef.current = null
    }
  }, [])

  // Resizer
  useEffect(() => {
    const handle = resizeHandleRef.current
    const panel = outputPanelRef.current
    const main = mainRef.current
    if (!handle || !panel || !main) return

    const isDesktop = () => window.innerWidth >= 768
    const applyWidth = (px) => { panel.style.width = `${px}px`; panel.style.flex = 'none' }
    const resetWidth = () => { panel.style.width = ''; panel.style.flex = '' }
    const initWidth = () => isDesktop()
      ? applyWidth(main.getBoundingClientRect().width * 0.4)
      : resetWidth()

    let dragging = false
    const onMouseDown = (e) => {
      if (!isDesktop()) return
      dragging = true
      handle.classList.add('is-dragging')
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      e.preventDefault()
    }
    const onMouseMove = (e) => {
      if (!dragging) return
      const { right, width } = main.getBoundingClientRect()
      applyWidth(Math.max(150, Math.min(right - e.clientX, width - 150)))
    }
    const onMouseUp = () => {
      if (!dragging) return
      dragging = false
      handle.classList.remove('is-dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    handle.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    window.addEventListener('resize', initWidth)
    initWidth()

    return () => {
      handle.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', initWidth)
    }
  }, [])

  async function handleRun() {
    if (isRunning) {
      setIsRunning(false)
      setIsRestarting(true)
      await cancelRun()
      setIsRestarting(false)
      return
    }
    setIsRunning(true)
    try {
      const result = await runCode(editorRef.current.getValue())
      setOutput(result)
      if (result.restartPromise) {
        setIsRunning(false)
        setIsRestarting(true)
        await result.restartPromise
        setIsRestarting(false)
      }
    } finally {
      setIsRunning(false)
    }
  }

  // Keep ref current so Monaco's Ctrl+Enter always calls the latest handleRun
  const handleRunRef = useRef(handleRun)
  useEffect(() => { handleRunRef.current = handleRun })

  async function loadExample(file) {
    if (!file) return
    const res = await fetch(`/examples/${file}`)
    const code = await res.text()
    editorRef.current?.setValue(code)
    setSelectedExample('')
  }

  const running = isRunning || isRestarting
  const runBtnDisabled = !pyodideReady || isRestarting

  return (
    <main ref={mainRef} className="flex flex-col md:flex-row flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="examples-toolbar flex items-center gap-2 px-3 py-1.5 border-b shrink-0">
          <span className="text-muted text-xs shrink-0">Examples:</span>
          <select
            className="theme-select"
            value={selectedExample}
            onChange={e => loadExample(e.target.value)}
          >
            <option value="">— pick one —</option>
            {EXAMPLES.map(({ label, file }) => (
              <option key={file} value={file}>{label}</option>
            ))}
          </select>
          <button
            className="run-btn ml-auto"
            data-running={running ? 'true' : 'false'}
            disabled={runBtnDisabled}
            title={isRunning ? 'Stop' : isRestarting ? 'Restarting…' : 'Run (Ctrl+Enter)'}
            onClick={handleRun}
          >
            {running
              ? <Square size={18} fill="currentColor" stroke="none" />
              : <Play size={18} fill="currentColor" stroke="none" />}
          </button>
        </div>
        <div ref={editorContainerRef} className="flex-1 min-h-0 overflow-hidden" />
      </div>
      <div ref={resizeHandleRef} className="resize-handle shrink-0" />
      <OutputPanel ref={outputPanelRef} output={output} />
    </main>
  )
}
