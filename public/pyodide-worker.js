const PYODIDE_VERSION = '0.29.4'

let pyodide = null

self.onmessage = async function (e) {
  if (e.data.type !== 'run' || !pyodide) return
  await pyodide.runPythonAsync(
    'import sys, io\nsys.stdout = io.StringIO()\nsys.stderr = io.StringIO()'
  )
  let error = null
  try {
    await pyodide.runPythonAsync(e.data.code)
  } catch (err) {
    error = err.message
  }
  const stdout = pyodide.runPython('sys.stdout.getvalue()')
  const stderr = pyodide.runPython('sys.stderr.getvalue()')
  self.postMessage({ type: 'result', stdout, stderr, error })
}

;(async () => {
  importScripts(
    `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
  )
  pyodide = await loadPyodide()
  self.postMessage({ type: 'ready' })
})()
