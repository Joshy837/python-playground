const PYODIDE_VERSION = '0.29.4'

let pyodide = null

const PLOT_CAPTURE = `
__cc_plots = []
try:
    import matplotlib.pyplot as __cc_plt
    import io as __cc_io
    import base64 as __cc_b64
    for __cc_fn in __cc_plt.get_fignums():
        __cc_buf = __cc_io.BytesIO()
        __cc_plt.figure(__cc_fn).savefig(__cc_buf, format='png', bbox_inches='tight', dpi=96)
        __cc_buf.seek(0)
        __cc_plots.append(__cc_b64.b64encode(__cc_buf.read()).decode())
    __cc_plt.close('all')
except Exception:
    pass
__cc_plots
`

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
  const plotsProxy = pyodide.runPython(PLOT_CAPTURE)
  const plots = plotsProxy.toJs ? plotsProxy.toJs() : Array.from(plotsProxy)
  self.postMessage({ type: 'result', stdout, stderr, error, plots })
}

;(async () => {
  importScripts(
    `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
  )
  pyodide = await loadPyodide()
  await pyodide.loadPackage(['matplotlib'])
  await pyodide.runPythonAsync('import matplotlib\nmatplotlib.use("Agg")')
  self.postMessage({ type: 'ready' })
})()
