const outputEl = () => document.getElementById('output')

export function renderOutput({ stdout, stderr, error, plots }) {
  const el = outputEl()
  el.innerHTML = ''

  const hasPlots = plots && plots.length > 0
  if (!stdout && !stderr && !error && !hasPlots) {
    el.innerHTML = '<span class="output-empty">No output</span>'
    return
  }

  if (stdout) {
    const pre = document.createElement('pre')
    pre.className = 'output-stdout whitespace-pre-wrap break-words'
    pre.textContent = stdout
    el.appendChild(pre)
  }

  if (hasPlots) {
    for (const b64 of plots) {
      const img = document.createElement('img')
      img.src = `data:image/png;base64,${b64}`
      img.className = 'output-plot'
      el.appendChild(img)
    }
  }

  if (stderr) {
    const pre = document.createElement('pre')
    pre.className = 'output-stderr whitespace-pre-wrap break-words mt-2'
    pre.textContent = stderr
    el.appendChild(pre)
  }

  if (error) {
    const pre = document.createElement('pre')
    pre.className = 'output-error whitespace-pre-wrap break-words mt-2'
    pre.textContent = error
    el.appendChild(pre)
  }
}

export function clearOutput() {
  outputEl().innerHTML = ''
}
