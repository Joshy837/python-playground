import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  Sun,
  Moon,
  Terminal,
  GraduationCap,
  BookOpen,
  Library,
} from 'lucide-react'

const BASE_NAV =
  'inline-flex items-center gap-[0.35rem] px-[0.625rem] py-1 rounded-md text-[0.8125rem] font-medium no-underline transition-colors duration-150'
const navClass = ({ isActive }) =>
  `${BASE_NAV} ${isActive ? 'text-app-fg bg-app-btn' : 'text-app-muted hover:text-app-fg hover:bg-app-btn'}`

export default function Header({
  isDark,
  onToggleTheme,
  pyodideReady,
  pyodideError,
}) {
  const statusText = pyodideError
    ? 'Connection failed'
    : pyodideReady
      ? 'Connected'
      : 'Connecting...'
  const statusColor = pyodideError ? 'red' : pyodideReady ? 'green' : 'yellow'
  const { pathname } = useLocation()
  const onLesson = pathname.startsWith('/learn/')
  const courseClass = `${BASE_NAV} ${onLesson ? 'text-app-fg bg-app-btn' : ''}`

  return (
    <header className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b shrink-0 bg-app-surface border-app-border">
      <Link
        to="/"
        className="flex items-center gap-2 min-w-0 shrink-0 no-underline"
        style={{ color: 'inherit' }}
      >
        <img
          src="/favicon.svg"
          alt=""
          width="24"
          height="24"
          className="rounded-md shrink-0"
        />
        <span className="font-semibold hidden sm:inline truncate">
          Just Python It
        </span>
      </Link>
      <nav className="flex items-center gap-0.5 sm:gap-1 ml-2 sm:ml-4">
        <NavLink to="/playground" className={navClass}>
          <Terminal size={15} />
          <span className="hidden sm:inline">Playground</span>
        </NavLink>
        <NavLink
          to="/course"
          className={onLesson ? () => courseClass : navClass}
        >
          <GraduationCap size={15} />
          <span className="hidden sm:inline">Course</span>
        </NavLink>
        <NavLink to="/docs" className={navClass}>
          <BookOpen size={15} />
          <span className="hidden sm:inline">Docs</span>
        </NavLink>
        <NavLink to="/snippets" className={navClass}>
          <Library size={15} />
          <span className="hidden sm:inline">Snippets</span>
        </NavLink>
      </nav>
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <span className="status-badge" data-status={statusColor}>
          <span className="status-dot w-[7px] h-[7px] rounded-full shrink-0" />
          <span className="status-text hidden sm:inline">{statusText}</span>
        </span>
        <button
          onClick={onToggleTheme}
          className="flex items-center justify-center size-7 rounded-[6px] border-0 bg-transparent text-app-fg cursor-pointer transition-opacity duration-150 shrink-0 hover:opacity-65"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
