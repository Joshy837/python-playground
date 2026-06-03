import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import * as monaco from 'monaco-editor'
import Header from './components/Header.jsx'
import PlaygroundPage from './pages/PlaygroundPage.jsx'
import CoursePage from './pages/CoursePage.jsx'
import { initPyodide } from './runner.js'

const PAGE_THEME = {
  'vs-dark':  'dark',
  'vs':       'light',
  'hc-black': 'hc-dark',
  'hc-light': 'hc-light',
}

export default function App() {
  const [monacoTheme, setMonacoTheme] = useState('vs-dark')
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideError, setPyodideError] = useState(false)

  useEffect(() => {
    initPyodide()
      .then(() => setPyodideReady(true))
      .catch(() => setPyodideError(true))
  }, [])

  function toggleTheme() {
    const next = monacoTheme === 'vs-dark' ? 'vs' : 'vs-dark'
    setMonacoTheme(next)
    monaco.editor.setTheme(next)
    document.documentElement.dataset.theme = PAGE_THEME[next]
  }

  return (
    <HashRouter>
      <Header isDark={monacoTheme === 'vs-dark'} onToggleTheme={toggleTheme} pyodideReady={pyodideReady} pyodideError={pyodideError} />
      <Routes>
        <Route path="/" element={<PlaygroundPage pyodideReady={pyodideReady} pyodideError={pyodideError} />} />
        <Route path="/course" element={<CoursePage />} />
      </Routes>
    </HashRouter>
  )
}
