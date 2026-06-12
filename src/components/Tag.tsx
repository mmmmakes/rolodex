'use client'

interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function Tag({ label, active, onClick, size = 'sm' }: TagProps) {
  const base = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 rounded-full border border-[var(--ink)] uppercase tracking-wide font-medium whitespace-nowrap'
    : 'text-xs px-3 py-1 rounded-full border border-[var(--ink)] uppercase tracking-wide font-medium whitespace-nowrap'

  return (
    <button
      onClick={onClick}
      className={`${base} transition-colors ${
        active
          ? 'bg-[var(--ink)] text-[var(--card)]'
          : 'bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--card)]'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {label}
    </button>
  )
}
