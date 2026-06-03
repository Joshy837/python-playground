import './ui/styles.css'
import { setupEditor, getValue, setValue, setTheme } from './editor.js'
import { initPyodide, runCode } from './runner.js'
import { renderOutput } from './ui/output.js'
import { setupResizer } from './ui/resizer.js'

const EXAMPLES = [
  { label: 'Hello World',        file: 'hello_world.py'        },
  { label: 'Fibonacci',          file: 'fibonacci.py'          },
  { label: 'FizzBuzz',           file: 'fizzbuzz.py'           },
  { label: 'List Comprehensions',file: 'list_comprehensions.py'},
  { label: 'Classes',            file: 'classes.py'            },
  { label: 'Matplotlib',         file: 'matplotlib_plot.py'    },
]

const statusEl = document.getElementById('pyodide-status')
const runBtn = document.getElementById('run-btn')
const themeSelect = document.getElementById('theme-select')

const PAGE_THEME = {
  'vs-dark':  'dark',
  'vs':       'light',
  'hc-black': 'hc-dark',
  'hc-light': 'hc-light',
}

let editor = null

function setStatus(text, color) {
  const colors = { yellow: 'text-yellow-400', green: 'text-green-400', red: 'text-red-400' }
  statusEl.textContent = text
  statusEl.className = `text-xs ${colors[color]}`
}

async function handleRun() {
  if (runBtn.disabled) return
  runBtn.disabled = true
  runBtn.textContent = 'Running...'
  try {
    const result = await runCode(getValue(editor))
    renderOutput(result)
    if (result.restartPromise) {
      runBtn.textContent = 'Restarting…'
      setStatus('Restarting…', 'yellow')
      await result.restartPromise
      setStatus('Ready', 'green')
    }
  } finally {
    runBtn.disabled = false
    runBtn.textContent = 'Run'
  }
}

function handleThemeChange(monacoTheme) {
  setTheme(monacoTheme)
  document.documentElement.dataset.theme = PAGE_THEME[monacoTheme]
}

async function init() {
  setupResizer()
  editor = setupEditor('editor-container', handleRun)

  const examplesSelect = document.getElementById('examples-select')
  for (const { label, file } of EXAMPLES) {
    const opt = document.createElement('option')
    opt.value = file
    opt.textContent = label
    examplesSelect.appendChild(opt)
  }
  examplesSelect.addEventListener('change', async () => {
    if (!examplesSelect.value) return
    const res = await fetch(`/examples/${examplesSelect.value}`)
    const code = await res.text()
    setValue(editor, code)
  })
  try {
    await initPyodide()
    setStatus('Ready', 'green')
    runBtn.disabled = false
  } catch (err) {
    setStatus('Load failed', 'red')
    console.error(err)
  }
}

runBtn.addEventListener('click', handleRun)
themeSelect.addEventListener('change', (e) => handleThemeChange(e.target.value))

init()
