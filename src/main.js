import './ui/styles.css'
import { setupEditor, getValue, setValue, setTheme } from './editor.js'
import { initPyodide, runCode } from './runner.js'
import { renderOutput } from './ui/output.js'

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
  editor = setupEditor('editor-container', handleRun)

  const toolbar = document.getElementById('examples-toolbar')
  for (const { label, file } of EXAMPLES) {
    const btn = document.createElement('button')
    btn.className = 'example-btn'
    btn.textContent = label
    btn.addEventListener('click', async () => {
      const res = await fetch(`/examples/${file}`)
      const code = await res.text()
      setValue(editor, code)
    })
    toolbar.appendChild(btn)
  }
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
