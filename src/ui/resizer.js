const DEFAULT_OUTPUT_FRACTION = 0.4

export function setupResizer() {
  const handle = document.getElementById('resize-handle')
  const outputPanel = document.getElementById('output-panel')
  const main = document.querySelector('main')
  if (!handle || !outputPanel || !main) return

  const isDesktop = () => window.innerWidth >= 768

  function applyWidth(px) {
    outputPanel.style.width = `${px}px`
    outputPanel.style.flex = 'none'
  }

  function resetWidth() {
    outputPanel.style.width = ''
    outputPanel.style.flex = ''
  }

  function initWidth() {
    if (isDesktop()) {
      applyWidth(main.getBoundingClientRect().width * DEFAULT_OUTPUT_FRACTION)
    } else {
      resetWidth()
    }
  }

  let dragging = false

  handle.addEventListener('mousedown', (e) => {
    if (!isDesktop()) return
    dragging = true
    handle.classList.add('is-dragging')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    e.preventDefault()
  })

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return
    const { right, width } = main.getBoundingClientRect()
    const newWidth = right - e.clientX
    applyWidth(Math.max(150, Math.min(newWidth, width - 150)))
  })

  document.addEventListener('mouseup', () => {
    if (!dragging) return
    dragging = false
    handle.classList.remove('is-dragging')
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  })

  window.addEventListener('resize', initWidth)
  initWidth()
}
