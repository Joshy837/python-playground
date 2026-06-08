import { Link } from 'react-router-dom'
import { Terminal, GraduationCap, BookOpen, Zap, Globe, Lock } from 'lucide-react'

const features = [
  {
    icon: Terminal,
    title: 'Playground',
    description: 'Write and run Python instantly in the browser. No installs, no setup — just code.',
    href: '/playground',
    accent: 'var(--accent-try)',
  },
  {
    icon: GraduationCap,
    title: 'Course',
    description: 'Work through Python fundamentals step by step with interactive exercises and a visual skill tree.',
    href: '/course',
    accent: 'var(--accent-quiz)',
  },
  {
    icon: BookOpen,
    title: 'Docs',
    description: 'Browse reference material with live, runnable code examples you can tweak and execute right on the page.',
    href: '/docs',
    accent: 'var(--accent-challenge)',
  },
]

const perks = [
  { icon: Globe, label: 'Runs entirely in your browser' },
  { icon: Zap,   label: 'Zero setup required' },
  { icon: Lock,  label: 'No account needed' },
]

export default function LandingPage() {
  return (
    <div className="page-enter flex-1 overflow-y-auto" style={{ background: 'var(--app-bg)', color: 'var(--text-primary)' }}>
      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-2xl mx-auto">
        <img src="/favicon.svg" alt="" width="56" height="56" className="rounded-2xl mb-6 shadow-lg" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Just Python It
        </h1>
        <p className="text-lg sm:text-xl max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Learn and experiment with Python — straight in your browser, powered by WebAssembly.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-opacity duration-150 hover:opacity-80"
            style={{ background: 'var(--accent-try)', color: '#0c1a26' }}
          >
            <Terminal size={16} />
            Open Playground
          </Link>
          <Link
            to="/course"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-colors duration-150"
            style={{ background: 'var(--btn-secondary-bg)', color: 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--btn-secondary-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--btn-secondary-bg)'}
          >
            <GraduationCap size={16} />
            Start the Course
          </Link>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-8 list-none p-0 m-0">
          {perks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Icon size={13} />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description, href, accent }) => (
            <Link
              key={title}
              to={href}
              className="group flex flex-col gap-3 p-5 rounded-xl border no-underline transition-colors duration-150"
              style={{
                background: 'var(--header-bg)',
                borderColor: 'var(--header-border)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--header-border)'}
            >
              <div
                className="flex items-center justify-center size-9 rounded-lg shrink-0"
                style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
