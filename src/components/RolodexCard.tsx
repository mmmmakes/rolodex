'use client'

import { Contact } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'
import { Tag } from './Tag'

interface Props {
  contact: Contact
  total: number
  index: number
  onPrev: () => void
  onNext: () => void
}

export function RolodexCard({ contact, total, index, onPrev, onNext }: Props) {
  return (
    <div className="flex h-full">
      {/* Left nav */}
      <div className="flex flex-col justify-center pr-2">
        <button
          onClick={onPrev}
          className="flex flex-col items-center gap-1 hover:scale-[0.96] active:scale-[0.93] transition-transform py-6"
          aria-label="Previous contact"
        >
          <div className="w-px bg-[var(--ink)] h-12" />
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
            <path d="M4.5 0L9 6H0L4.5 0Z" fill="var(--ink)" />
          </svg>
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative flex flex-col min-w-0">
        {/* Counter */}
        <div className="text-right text-[9px] text-[var(--muted)] mb-1 uppercase tracking-[0.06em]">
          {index + 1} / {total}
        </div>

        {/* Top card */}
        <div className="flex-1 bg-[var(--card)] border border-[var(--ink)] rounded px-4 pt-4 pb-3 relative z-10 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-semibold uppercase text-[19px] tracking-[0.02em] leading-tight">
              {contact.name}
            </span>
            <span className="text-[9px] text-[var(--muted)] whitespace-nowrap uppercase tracking-[0.05em] mt-1 shrink-0">
              {formatDateShort(contact.last_updated)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {contact.tags.map(tag => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-[var(--muted)]">
            {contact.phone && <span>{contact.phone}</span>}
            {contact.email && <span>{contact.email}</span>}
          </div>
        </div>

        {/* Prongs + peeking second card */}
        <div className="relative h-[88px] flex justify-center items-start">
          <div className="absolute inset-x-3 top-0 h-20 bg-[var(--card-dark)] border border-[var(--ink)] rounded z-0" />
          <div className="relative z-10 flex gap-16 mt-0">
            <div className="w-[30px] h-[92px] bg-[var(--ink)] rounded-[3px]" />
            <div className="w-[30px] h-[92px] bg-[var(--ink)] rounded-[3px]" />
          </div>
        </div>
      </div>

      {/* Right nav */}
      <div className="flex flex-col justify-center pl-2">
        <button
          onClick={onNext}
          className="flex flex-col items-center gap-1 hover:scale-[0.96] active:scale-[0.93] transition-transform py-6"
          aria-label="Next contact"
        >
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
            <path d="M4.5 6L0 0H9L4.5 6Z" fill="var(--ink)" />
          </svg>
          <div className="w-px bg-[var(--ink)] h-12" />
        </button>
      </div>
    </div>
  )
}
