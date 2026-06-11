import { useState, useEffect } from 'react'
import * as monaco from 'monaco-editor'

export function useMonacoColorize(code, monacoTheme) {
  const [colorizedHtml, setColorizedHtml] = useState('')

  useEffect(() => {
    if (!code) { setColorizedHtml(''); return }
    setColorizedHtml('')
    let cancelled = false
    monaco.editor.colorize(code, 'python', {}).then(html => {
      if (!cancelled) setColorizedHtml(html)
    })
    return () => { cancelled = true }
  }, [code, monacoTheme])

  return colorizedHtml
}
