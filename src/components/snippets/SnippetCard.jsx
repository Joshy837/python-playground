import { X } from 'lucide-react'

const BASE = 'w-full h-[100px] rounded-[10px] border transition-[border-color,background-color] duration-150'
const ACTIVE = 'border-[color-mix(in_srgb,var(--accent-try)_60%,var(--header-border))] bg-[color-mix(in_srgb,var(--accent-try)_8%,var(--app-bg))]'
const INACTIVE = 'border-app-border bg-app-surface'

export default function SnippetCard({ label, description, active, onClick, onDelete }) {
  const labelCls = `text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${active ? 'text-[var(--accent-try)]' : 'text-app-fg'}`
  const descCls = 'text-[0.78rem] text-app-muted leading-[1.4] line-clamp-2'
  const stateCls = active ? ACTIVE : INACTIVE

  if (onDelete) {
    return (
      <div className={`relative flex flex-row items-stretch overflow-hidden ${BASE} ${active ? ACTIVE : `${INACTIVE} hover:border-app-muted hover:bg-app-btn-hover`}`}>
        <button className="flex flex-col gap-[0.3rem] flex-1 py-[0.85rem] px-4 text-left cursor-pointer bg-transparent border-none min-w-0" onClick={onClick}>
          <span className={labelCls}>{label}</span>
          <span className={descCls}>{description || 'Saved snippet'}</span>
        </button>
        <button
          className="flex items-center justify-center px-[0.45rem] bg-transparent border-none border-l border-app-border text-app-muted cursor-pointer transition-[color,background-color] duration-150 rounded-[0_10px_10px_0] hover:text-[#f87171] hover:bg-[#f87171]/12"
          title="Delete"
          onClick={e => { e.stopPropagation(); onDelete() }}
        >
          <X size={11} />
        </button>
      </div>
    )
  }

  return (
    <button
      className={`flex flex-col gap-[0.3rem] py-[0.85rem] px-4 text-left cursor-pointer ${BASE} ${active ? stateCls : `${stateCls} hover:border-app-muted hover:bg-app-btn`}`}
      onClick={onClick}
    >
      <span className={labelCls}>{label}</span>
      {description && <span className={descCls}>{description}</span>}
    </button>
  )
}
