export default function ProgressBar({ percent, color = 'var(--status-green)', height = '5px', className = '' }) {
  return (
    <div className={`rounded-full bg-app-border overflow-hidden ${className}`} style={{ height }}>
      <div
        className="h-full rounded-full transition-[width] duration-[400ms] ease"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  )
}
