import { useState, useEffect, useRef } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import * as monaco from 'monaco-editor'
import Header from './components/Header.jsx'
import PlaygroundPage from './pages/PlaygroundPage.jsx'
import CoursePage from './pages/CoursePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import DocumentationPage from './pages/DocumentationPage.jsx'
import { initPyodide } from './runner.js'

const PAGE_THEME = {
  'vs-dark':  'dark',
  'vs':       'light',
  'hc-black': 'hc-dark',
  'hc-light': 'hc-light',
}

const THEME_BG = {
  'vs-dark':  '#111827',
  'vs':       '#ffffff',
  'hc-black': '#000000',
  'hc-light': '#ffffff',
}

export default function App() {
  const [monacoTheme, setMonacoTheme] = useState('vs-dark')
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideError, setPyodideError] = useState(false)
  const themeSwitchTimer = useRef(null)

  useEffect(() => {
    initPyodide()
      .then(() => setPyodideReady(true))
      .catch(() => setPyodideError(true))
  }, [])

  function toggleTheme() {
    const next = monacoTheme === 'vs-dark' ? 'vs' : 'vs-dark'
    setMonacoTheme(next)
    clearTimeout(themeSwitchTimer.current)
    document.documentElement.style.backgroundColor = THEME_BG[next]
    document.documentElement.dataset.themeSwitching = ''
    themeSwitchTimer.current = setTimeout(() => {
      monaco.editor.setTheme(next)
      document.documentElement.dataset.theme = PAGE_THEME[next]
      document.documentElement.style.backgroundColor = ''
      delete document.documentElement.dataset.themeSwitching
    }, 200)
  }

  return (
    <HashRouter>
      <Header isDark={monacoTheme === 'vs-dark'} onToggleTheme={toggleTheme} pyodideReady={pyodideReady} pyodideError={pyodideError} />
      <Routes>
        <Route path="/" element={<PlaygroundPage pyodideReady={pyodideReady} pyodideError={pyodideError} monacoTheme={monacoTheme} />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/learn/:id" element={<LessonPage pyodideReady={pyodideReady} monacoTheme={monacoTheme} />} />
        <Route path="/docs" element={<DocumentationPage />} />
      </Routes>
    </HashRouter>
  )
}
