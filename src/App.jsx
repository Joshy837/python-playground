import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import * as monaco from 'monaco-editor'
import './monacoSetup.js'
import Header from './components/Header.jsx'
import LandingPage from './pages/LandingPage.jsx'
import PlaygroundPage from './pages/PlaygroundPage.jsx'
import CoursePage from './pages/CoursePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import DocumentationPage from './pages/DocumentationPage.jsx'
import { initPyodide } from './runner.js'

const PAGE_THEME = {
  'monokai':  'dark',
  'vs':       'light',
  'hc-black': 'hc-dark',
  'hc-light': 'hc-light',
}

export default function App() {
  const [monacoTheme, setMonacoTheme] = useState('monokai')
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideError, setPyodideError] = useState(false)

  useEffect(() => {
    initPyodide()
      .then(() => setPyodideReady(true))
      .catch(() => setPyodideError(true))
  }, [])

  function toggleTheme() {
    const next = monacoTheme === 'monokai' ? 'vs' : 'monokai'
    const root = document.documentElement
    root.classList.add('theme-switching')
    root.dataset.theme = PAGE_THEME[next]
    setMonacoTheme(next)
    monaco.editor.setTheme(next)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
  }

  return (
    <BrowserRouter>
      <Header isDark={monacoTheme === 'monokai'} onToggleTheme={toggleTheme} pyodideReady={pyodideReady} pyodideError={pyodideError} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<PlaygroundPage pyodideReady={pyodideReady} pyodideError={pyodideError} monacoTheme={monacoTheme} />} />
        <Route path="/course" element={<CoursePage />} />
        <Route path="/learn/:id" element={<LessonPage pyodideReady={pyodideReady} monacoTheme={monacoTheme} />} />
        <Route path="/learn/:id/:step" element={<LessonPage pyodideReady={pyodideReady} monacoTheme={monacoTheme} />} />
        <Route path="/docs" element={<DocumentationPage pyodideReady={pyodideReady} monacoTheme={monacoTheme} />} />
      </Routes>
    </BrowserRouter>
  )
}
