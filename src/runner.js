const TIMEOUT_MS = 10_000

let worker = null
let pendingReady = null
let pendingResult = null

function spawnWorker() {
  if (worker) worker.terminate()
  worker = new Worker('/pyodide-worker.js')
  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') {
      pendingReady?.()
      pendingReady = null
    } else if (data.type === 'result') {
      pendingResult?.(data)
      pendingResult = null
    }
  }
}

export function initPyodide() {
  spawnWorker()
  return new Promise((resolve, reject) => {
    pendingReady = resolve
    worker.onerror = reject
  })
}

export function runCode(code) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pendingResult = null
      spawnWorker()
      const restartPromise = new Promise((res) => { pendingReady = res })
      resolve({
        stdout: '',
        stderr: '',
        error: `Execution timed out after ${TIMEOUT_MS / 1000} s. Runtime is restarting…`,
        restartPromise,
      })
    }, TIMEOUT_MS)

    pendingResult = (data) => {
      clearTimeout(timer)
      resolve(data)
    }

    worker.postMessage({ type: 'run', code })
  })
}
