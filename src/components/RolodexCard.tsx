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
    <div className="flex gap-2 h-full">
      {/* Left nav arrow */}
      <div className="flex flex-col justify-center">
        <button
          onClick={onPrev}
          className="w-5 flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity py-8"
          aria-label="Previous contact"
        >
          <div className="w-px bg-[var(--ink)] flex-1" />
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M5 0L10 7H0L5 0Z" fill="var(--ink)" />
          </svg>
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative flex flex-col">
        {/* Counter */}
        <div className="text-right text-xs text-[var(--muted)] mb-1 pr-1">
          {index + 1}/{total}
        </div>

        {/* Top card */}
        <div className="flex-1 bg-[var(--card)] border border-[var(--ink)] rounded p-4 relative z-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-bold uppercase text-base tracking-wide leading-tight">
              {contact.name}
            </span>
            <span className="text-[10px] text-[var(--muted)] whitespace-nowrap mt-1">
              LAST UPDATE: {formatDateShort(contact.last_updated)}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {contact.tags.map(tag => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Contact info */}
          <div className="flex gap-6 text-xs text-[var(--muted)]">
            {contact.phone && <span>{contact.phone}</span>}
            {contact.email && <span>{contact.email}</span>}
          </div>
        </div>

        {/* Rolodex prongs + second card peek */}
        <div className="relative h-20 flex items-start justify-center pt-0">
          {/* Peeking card behind */}
          <div className="absolute inset-x-2 top-0 h-16 bg-[var(--card-dark)] border border-[var(--ink)] rounded z-0" />
          {/* Prongs */}
          <div className="relative z-10 flex gap-12 -mt-1">
            <div className="w-6 h-16 bg-[var(--ink)] rounded-sm" />
            <div className="w-6 h-16 bg-[var(--ink)] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Right nav arrow */}
      <div className="flex flex-col justify-center">
        <button
          onClick={onNext}
          className="w-5 flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity py-8"
          aria-label="Next contact"
        >
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M5 7L0 0H10L5 7Z" fill="var(--ink)" />
          </svg>
          <div className="w-px bg-[var(--ink)] flex-1" />
        </button>
      </div>
    </div>
  )
}
