import { Check } from 'lucide-react'

export default function StepButton({ done, unlocked, current = false, number, title, onClick, style }) {
  const stateClass = done
    ? 'border-app-green bg-[color-mix(in_srgb,var(--status-green)_10%,var(--header-bg))] text-app-green hover:scale-[1.08] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--status-green)_25%,transparent)]'
    : unlocked
      ? 'border-app-muted bg-app-surface text-app-fg hover:border-app-fg hover:scale-[1.08] hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--text-primary)_15%,transparent)]'
      : 'border-app-border bg-app-surface text-app-muted opacity-45 cursor-not-allowed'

  return (
    <button
      className={`course-step-btn w-[28px] h-[28px] rounded-full border-2 flex items-center justify-center text-[0.7rem] font-bold leading-none cursor-pointer bg-transparent shrink-0 [transition:transform_0.1s,box-shadow_0.15s,border-color_0.15s] ${stateClass}`}
      style={current ? { outline: '2px solid var(--text-primary)', outlineOffset: '2px', ...style } : style}
      disabled={!unlocked && !done}
      title={title}
      onClick={onClick}
    >
      {done ? <Check size={11} /> : number}
    </button>
  )
}
