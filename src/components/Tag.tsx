'use client'

interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function Tag({ label, active, onClick, size = 'sm' }: TagProps) {
  const base = size === 'sm'
    ? 'text-[10px] px-[10px] py-[3px] rounded-[130px] border border-[var(--ink)] uppercase tracking-[0.04em] font-medium whitespace-nowrap leading-none'
    : 'text-[11px] px-[13px] py-[4px] rounded-[130px] border border-[var(--ink)] uppercase tracking-[0.04em] font-medium whitespace-nowrap leading-none'

  return (
    <button
      onClick={onClick}
      className={`${base} transition-colors ${
        active
          ? 'bg-[var(--ink)] text-[var(--card)]'
          : 'bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--card)]'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {label}
    </button>
  )
}
