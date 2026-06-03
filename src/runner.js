const PYODIDE_VERSION = '0.29.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`

let pyodide = null

function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
    document.head.appendChild(script)
  })
}

export async function initPyodide() {
  await injectScript(PYODIDE_CDN)
  pyodide = await window.loadPyodide()
  await pyodide.runPythonAsync('import sys, io')
}

export async function runCode(code) {
  await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`)

  let error = null
  try {
    await pyodide.runPythonAsync(code)
  } catch (err) {
    error = err.message
  }

  const stdout = pyodide.runPython('sys.stdout.getvalue()')
  const stderr = pyodide.runPython('sys.stderr.getvalue()')

  return { stdout, stderr, error }
}
