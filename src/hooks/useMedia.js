import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

export function usePageTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme ?? ''
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.dataset.theme ?? '')
    )
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => obs.disconnect()
  }, [])
  return theme
}
