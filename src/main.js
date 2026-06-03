import './ui/styles.css'
import { setupEditor, getValue, setValue, setTheme } from './editor.js'
import { initPyodide, runCode, cancelRun } from './runner.js'
import { renderOutput } from './ui/output.js'
import { setupResizer } from './ui/resizer.js'
import { Play, Square, Sun, Moon } from 'lucide'

function lucideIcon(iconData, { size = 18, filled = false } = {}) {
  const children = iconData.map(([tag, attrs]) => {
    const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')
    return `<${tag} ${a}/>`
  }).join('')
  const svgAttrs = filled
    ? `fill="currentColor" stroke="none"`
    : `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ${svgAttrs}>${children}</svg>`
}

const EXAMPLES = [
  { label: 'Hello World',        file: 'hello_world.py'        },
  { label: 'Fibonacci',          file: 'fibonacci.py'          },
  { label: 'FizzBuzz',           file: 'fizzbuzz.py'           },
  { label: 'List Comprehensions',file: 'list_comprehensions.py'},
  { label: 'Classes',            file: 'classes.py'            },
  { label: 'Matplotlib',         file: 'matplotlib_plot.py'    },
]

const PLAY_ICON = lucideIcon(Play, { filled: true })
const STOP_ICON = lucideIcon(Square, { filled: true })
const SUN_ICON = lucideIcon(Sun)
const MOON_ICON = lucideIcon(Moon)

const statusEl = document.getElementById('pyodide-status')
const runBtn = document.getElementById('run-btn')
const themeToggle = document.getElementById('theme-toggle')

let isRunning = false
let isDark = true

function setRunBtnState(state) {
  const running = state === 'running' || state === 'restarting'
  runBtn.dataset.running = running ? 'true' : 'false'
  runBtn.innerHTML = running ? STOP_ICON : PLAY_ICON
  runBtn.disabled = state === 'loading' || state === 'restarting'
  runBtn.title = state === 'running' ? 'Stop' : state === 'restarting' ? 'Restarting…' : 'Run (Shift+Enter)'
}

let editor = null

function setStatus(text, color) {
  statusEl.dataset.status = color
  statusEl.querySelector('.status-text').textContent = text
}

function applyTheme(dark) {
  const monacoTheme = dark ? 'vs-dark' : 'vs'
  setTheme(monacoTheme)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  themeToggle.innerHTML = dark ? SUN_ICON : MOON_ICON
  themeToggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode'
}

async function handleRun() {
  if (isRunning) {
    isRunning = false
    setRunBtnState('restarting')
    setStatus('Restarting…', 'yellow')
    await cancelRun()
    setStatus('Ready', 'green')
    setRunBtnState('idle')
    return
  }
  isRunning = true
  setRunBtnState('running')
  try {
    const result = await runCode(getValue(editor))
    renderOutput(result)
    if (result.restartPromise) {
      setRunBtnState('restarting')
      setStatus('Restarting…', 'yellow')
      await result.restartPromise
      setStatus('Ready', 'green')
    }
  } finally {
    isRunning = false
    setRunBtnState('idle')
  }
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
  applyTheme(isDark)

  try {
    await initPyodide()
    setStatus('Ready', 'green')
    setRunBtnState('idle')
  } catch (err) {
    setStatus('Load failed', 'red')
    console.error(err)
  }
}

runBtn.addEventListener('click', handleRun)
themeToggle.addEventListener('click', () => {
  isDark = !isDark
  applyTheme(isDark)
})

init()
