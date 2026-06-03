import { NavLink } from 'react-router-dom'
import { Sun, Moon, Terminal, GraduationCap, BookOpen } from 'lucide-react'

const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`

export default function Header({ isDark, onToggleTheme, pyodideReady, pyodideError }) {
  const statusText = pyodideError ? 'Load failed' : pyodideReady ? 'Ready' : 'Loading...'
  const statusColor = pyodideError ? 'red' : pyodideReady ? 'green' : 'yellow'

  return (
    <header className="app-header flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b shrink-0">
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <img src="/favicon.svg" alt="" width="24" height="24" className="rounded-md shrink-0" />
        <span className="font-semibold hidden sm:inline truncate">Python Playground</span>
      </div>
      <nav className="flex items-center gap-1 ml-4">
        <NavLink to="/" end className={navClass}><Terminal size={15} />Playground</NavLink>
        <NavLink to="/course" className={navClass}><GraduationCap size={15} />Course</NavLink>
        <NavLink to="/docs" className={navClass}><BookOpen size={15} />Docs</NavLink>
      </nav>
      <div className="flex items-center gap-3 ml-auto">
        <span className="status-badge" data-status={statusColor}>
          <span className="status-dot" />
          <span className="status-text">{statusText}</span>
        </span>
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
