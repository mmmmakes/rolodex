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
      className={`w-full text-left p-3 border border-[var(--ink)] rounded transition-colors relative cursor-pointer ${
        selected ? 'bg-[var(--card-dark)]' : 'bg-[var(--card)] hover:bg-[var(--card-dark)]'
      }`}
    >
      {hasNew && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--gold)]" />
      )}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="font-bold uppercase text-sm tracking-wide leading-tight">
          {contact.name}
        </span>
        <span className="text-[10px] text-[var(--muted)] whitespace-nowrap mt-0.5">
          LAST UPDATE: {formatDateShort(contact.last_updated)}
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
