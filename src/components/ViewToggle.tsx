'use client'

import { ViewMode } from '@/lib/types'

interface Props {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <span
        className={`text-[10px] uppercase tracking-widest cursor-pointer ${
          mode === 'rolodex' ? 'font-bold' : 'opacity-50'
        }`}
        onClick={() => onChange('rolodex')}
      >
        Rolodex
      </span>

      {/* Toggle pill */}
      <button
        onClick={() => onChange(mode === 'rolodex' ? 'list' : 'rolodex')}
        className="w-9 h-16 rounded-full border-2 border-[var(--ink)] bg-[var(--card)] relative flex items-center justify-center"
        aria-label="Toggle view"
      >
        <div
          className={`w-6 h-6 rounded-full bg-[var(--ink)] absolute transition-transform duration-200 ${
            mode === 'list' ? 'translate-y-4' : '-translate-y-4'
          }`}
        />
      </button>

      <span
        className={`text-[10px] uppercase tracking-widest cursor-pointer ${
          mode === 'list' ? 'font-bold' : 'opacity-50'
        }`}
        onClick={() => onChange('list')}
      >
        List
      </span>
    </div>
  )
}
