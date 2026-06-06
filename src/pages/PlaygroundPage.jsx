import { useState, useEffect, useRef } from 'react'
import { Play, Square } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { runCode, cancelRun } from '../runner.js'
import { BASE_EDITOR_CONFIG } from '../editor.js'
import OutputPanel from '../components/OutputPanel.jsx'
import SnippetDrawer from '../components/SnippetDrawer.jsx'
import SnippetModal from '../components/SnippetModal.jsx'
import ExamplesDropdown from '../components/ExamplesDropdown.jsx'

const EXAMPLES = [
  { label: 'Hello World',         file: 'hello_world.py',         description: 'Your first Python program'         },
  { label: 'Fibonacci',           file: 'fibonacci.py',           description: 'Classic number sequence'           },
  { label: 'FizzBuzz',            file: 'fizzbuzz.py',            description: 'Divisibility with conditionals'    },
  { label: 'List Comprehensions', file: 'list_comprehensions.py', description: 'Concise list transformations'      },
  { label: 'Classes',             file: 'classes.py',             description: 'OOP with classes & inheritance'    },
  { label: 'Matplotlib',          file: 'matplotlib_plot.py',     description: 'Plot charts in the browser'        },
]

const DEFAULT_CODE = `# Write your Python code here and press Run (or Ctrl+Enter / Cmd+Enter)
print("Hello, World!")
`

export default function PlaygroundPage({ pyodideReady, pyodideError, monacoTheme }) {
  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const initialThemeRef = useRef(monacoTheme)
  const mainRef = useRef(null)
  const outputPanelRef = useRef(null)
  const resizeHandleRef = useRef(null)

  const [isRunning, setIsRunning] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [output, setOutput] = useState(null)
  const [modalSnippet, setModalSnippet] = useState(null)

  // Monaco setup
  useEffect(() => {
    const editor = monaco.editor.create(editorContainerRef.current, {
      ...BASE_EDITOR_CONFIG,
      value: DEFAULT_CODE,
      theme: initialThemeRef.current,
      fontSize: 14,
      padding: { top: 16, bottom: 16 },
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
  }

  async function handleSnippetSelect({ label, file }) {
    setModalSnippet('loading')
    const res = await fetch(`/examples/${file}`)
    const code = await res.text()
    setModalSnippet({ label, code })
  }

  const running = isRunning || isRestarting
  const runBtnDisabled = !pyodideReady || isRestarting


  return (
    <main ref={mainRef} className="flex flex-col md:flex-row flex-1 overflow-hidden page-enter">
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden border-t-2 border-t-green-500/30">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b shrink-0 bg-app-surface border-app-border">
          <ExamplesDropdown examples={EXAMPLES} onSelect={loadExample} />
          <button
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold cursor-pointer transition-all duration-150 shrink-0 ml-auto disabled:opacity-40 disabled:cursor-not-allowed ${
              running
                ? 'text-red-500 border-red-500/30 bg-red-500/10 hover:bg-red-500/20'
                : 'text-green-500 border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
            }`}
            disabled={runBtnDisabled}
            title={isRunning ? 'Stop' : isRestarting ? 'Restarting…' : 'Run (Ctrl+Enter)'}
            onClick={handleRun}
          >
            {running
              ? <Square size={13} fill="currentColor" stroke="none" />
              : <Play size={13} fill="currentColor" stroke="none" />}
            <span>{isRestarting ? 'Restarting…' : running ? 'Stop' : 'Run'}</span>
          </button>
        </div>
        <div className="relative flex-1 min-h-0">
          <div ref={editorContainerRef} className="absolute inset-0" />
          <SnippetDrawer examples={EXAMPLES.slice(0, 1)} onSelect={handleSnippetSelect} />
        </div>
      </div>
      <div ref={resizeHandleRef} className="resize-handle shrink-0" />
      <OutputPanel ref={outputPanelRef} output={output} />
      <SnippetModal
        snippet={modalSnippet}
        onClose={() => setModalSnippet(null)}
        onLoad={code => editorRef.current?.setValue(code)}
      />
    </main>
  )
}
