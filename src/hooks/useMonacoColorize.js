import { useState, useEffect } from 'react'
import * as monaco from 'monaco-editor'

export function useMonacoColorize(code, monacoTheme) {
  const [colorizedHtml, setColorizedHtml] = useState('')
  const [prevCode, setPrevCode] = useState(code)
  const [prevTheme, setPrevTheme] = useState(monacoTheme)

  if (prevCode !== code || prevTheme !== monacoTheme) {
    setPrevCode(code)
    setPrevTheme(monacoTheme)
    setColorizedHtml('')
  }

  useEffect(() => {
    if (!code) return
    let cancelled = false
    monaco.editor.colorize(code, 'python', {}).then((html) => {
      if (!cancelled) setColorizedHtml(html)
    })
    return () => {
      cancelled = true
    }
  }, [code, monacoTheme])

  return colorizedHtml
}
