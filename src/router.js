const PAGES = {
  '/':       'page-playground',
  '/course': 'page-course',
}

function navigate() {
  const path = location.hash.slice(1) || '/'
  const activeId = PAGES[path] ?? PAGES['/']

  for (const id of Object.values(PAGES)) {
    const el = document.getElementById(id)
    if (el) el.hidden = (id !== activeId)
  }

  document.querySelectorAll('[data-route]').forEach(a => {
    a.classList.toggle('nav-link-active', a.dataset.route === path)
  })
}

export function startRouter() {
  window.addEventListener('hashchange', navigate)
  navigate()
}
