'use client'

import { Contact } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'
import { Tag } from './Tag'

interface Props {
  contact: Contact
  selected: boolean
  onClick: () => void
}

export function ContactListItem({ contact, selected, onClick }: Props) {
  const hasNew = contact.updates.some(u => u.new)

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className={`w-full text-left px-3 py-2.5 border border-[var(--ink)] rounded transition-colors relative cursor-pointer ${
        selected ? 'bg-[var(--card-dark)]' : 'bg-[var(--card)] hover:bg-[var(--card-dark)]'
      }`}
    >
      {hasNew && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
      )}
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="font-semibold uppercase text-[13.6px] tracking-[0.03em] leading-tight">
          {contact.name}
        </span>
        <span className="text-[9px] text-[var(--muted)] whitespace-nowrap uppercase tracking-[0.04em] shrink-0">
          {formatDateShort(contact.last_updated)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {contact.tags.slice(0, 3).map(tag => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </div>
  )
}
