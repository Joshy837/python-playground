import { NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`

export default function Header({ isDark, onToggleTheme }) {
  return (
    <header className="app-header flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b shrink-0">
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <img src="/favicon.svg" alt="" width="24" height="24" className="rounded-md shrink-0" />
        <span className="font-semibold hidden sm:inline truncate">Python Playground</span>
      </div>
      <nav className="flex items-center gap-1 ml-4">
        <NavLink to="/" end className={navClass}>Playground</NavLink>
        <NavLink to="/course" className={navClass}>Course</NavLink>
      </nav>
      <div className="flex items-center ml-auto">
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
