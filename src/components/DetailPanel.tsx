'use client'

import { useState } from 'react'
import { Contact, Update } from '@/lib/types'
import { formatDate, formatDateShort } from '@/lib/utils'
import { Tag } from './Tag'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface Props {
  contact: Contact | null
  onUpdateContact: (id: string) => Promise<void>
  onMarkRead: (contactId: string, updateId: string) => void
}

function UpdateEntry({ update }: { update: Update }) {
  const [expanded, setExpanded] = useState(update.new)

  return (
    <div className="border-b border-[var(--card-dark)] pb-3 last:border-0">
      <button
        className="w-full text-left flex items-start justify-between gap-2"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {update.new && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--gold)]" />
          )}
          <span className="font-bold text-sm uppercase tracking-wide leading-snug">
            {update.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[var(--muted)]">{formatDateShort(update.date)}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-[var(--muted)] leading-relaxed">{update.summary}</p>
          {update.notes && (
            <div className="bg-[var(--card-dark)] rounded p-2 text-xs text-[var(--ink)] italic">
              {update.notes_date && (
                <span className="not-italic font-bold text-[var(--muted)] block mb-0.5">
                  Note · {formatDateShort(update.notes_date)}
                </span>
              )}
              {update.notes}
            </div>
          )}
          {update.sent_message && update.sent_message_date && (
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wide">
              ✓ Message sent {formatDateShort(update.sent_message_date)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function DetailPanel({ contact, onUpdateContact, onMarkRead }: Props) {
  const [updating, setUpdating] = useState(false)

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
        Select a contact
      </div>
    )
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await onUpdateContact(contact.id)
    } finally {
      setUpdating(false)
    }
  }

  const sortedUpdates = [...contact.updates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--card-dark)] mb-4 shrink-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="font-bold uppercase text-xl tracking-wide leading-tight">
            {contact.name}
          </h1>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="shrink-0 bg-[var(--gold)] hover:bg-[var(--gold-dark)] disabled:opacity-50 text-white font-bold uppercase text-[10px] tracking-widest px-3 py-1.5 rounded-full transition-colors"
          >
            {updating ? 'Updating...' : 'AI Update'}
          </button>
        </div>

        {/* Dates row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--muted)] uppercase tracking-wide mb-3">
          <span>Date met: {formatDateShort(contact.date_added)}</span>
          <span>Last update: {formatDateShort(contact.last_updated)}</span>
          <span>Last contact: {formatDateShort(contact.last_contacted)}</span>
          {contact.birthday && <span>Birthday: {formatDateShort(contact.birthday)}</span>}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {contact.tags.map(tag => (
            <Tag key={tag} label={tag} size="md" />
          ))}
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1">
          {contact.linkedin && (
            <a
              href={`https://${contact.linkedin.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline hover:text-[var(--gold)]"
            >
              LinkedIn <ExternalLink size={10} />
            </a>
          )}
          {contact.website && (
            <a
              href={`https://${contact.website.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline hover:text-[var(--gold)]"
            >
              Website <ExternalLink size={10} />
            </a>
          )}
          {contact.instagram && (
            <a
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline hover:text-[var(--gold)]"
            >
              {contact.instagram} <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {/* Dates summary */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold uppercase text-sm tracking-widest">Update Log</h2>
          {contact.updates.some(u => u.new) && (
            <button
              onClick={() => contact.updates.filter(u => u.new).forEach(u => onMarkRead(contact.id, u.id))}
              className="text-[10px] text-[var(--muted)] uppercase tracking-wide underline hover:text-[var(--ink)]"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Update log */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {sortedUpdates.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No updates yet. Click AI Update to fetch.</p>
        ) : (
          sortedUpdates.map(update => (
            <UpdateEntry key={update.id} update={update} />
          ))
        )}
      </div>
    </div>
  )
}
