const outputEl = () => document.getElementById('output')

export function renderOutput({ stdout, stderr, error }) {
  const el = outputEl()
  el.innerHTML = ''

  if (!stdout && !stderr && !error) {
    el.innerHTML = '<span class="text-gray-500">No output</span>'
    return
  }

  if (stdout) {
    const pre = document.createElement('pre')
    pre.className = 'text-gray-100 whitespace-pre-wrap break-words'
    pre.textContent = stdout
    el.appendChild(pre)
  }

  if (stderr) {
    const pre = document.createElement('pre')
    pre.className = 'text-yellow-400 whitespace-pre-wrap break-words mt-2'
    pre.textContent = stderr
    el.appendChild(pre)
  }

  if (error) {
    const pre = document.createElement('pre')
    pre.className = 'text-red-400 whitespace-pre-wrap break-words mt-2'
    pre.textContent = error
    el.appendChild(pre)
  }
}

export function clearOutput() {
  outputEl().innerHTML = ''
}
