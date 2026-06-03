import './ui/styles.css'
import { setupEditor, getValue } from './editor.js'
import { initPyodide, runCode } from './runner.js'
import { renderOutput, clearOutput } from './ui/output.js'

const statusEl = document.getElementById('pyodide-status')
const runBtn = document.getElementById('run-btn')
const clearBtn = document.getElementById('clear-btn')

let editor = null

async function handleRun() {
  if (runBtn.disabled) return
  runBtn.disabled = true
  runBtn.textContent = 'Running...'
  try {
    const result = await runCode(getValue(editor))
    renderOutput(result)
  } finally {
    runBtn.disabled = false
    runBtn.textContent = 'Run'
  }
}

async function init() {
  editor = setupEditor('editor-container', handleRun)
  try {
    await initPyodide()
    statusEl.textContent = 'Python ready'
    statusEl.className = 'text-xs text-green-400'
    runBtn.disabled = false
  } catch (err) {
    statusEl.textContent = 'Failed to load Python runtime'
    statusEl.className = 'text-xs text-red-400'
    console.error(err)
  }
}

runBtn.addEventListener('click', handleRun)
clearBtn.addEventListener('click', clearOutput)

init()
