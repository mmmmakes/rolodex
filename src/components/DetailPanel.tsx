'use client'

import { useState, useEffect } from 'react'
import { Contact, Update } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'
import { Tag } from './Tag'
import { ExternalLink } from 'lucide-react'
import { AddUpdateModal } from './AddUpdateModal'

interface Props {
  contact: Contact | null
  onUpdateContact: (id: string) => Promise<void>
  onMarkAllRead: (contactId: string) => void
  onAddUpdate: (contactId: string, update: Update) => void
}

function UpdateCard({ update }: { update: Update }) {
  return (
    <div className={`bg-[var(--card)] border-[1.5px] rounded-[17px] px-[13px] pt-[9px] pb-[20px] ${update.new ? 'border-[var(--gold)]' : 'border-[var(--ink)]'}`}>

      {/* Title + dot + date */}
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
          <span className="font-semibold uppercase text-[13.6px] tracking-[0.03em] leading-tight truncate">
            {update.title}
          </span>
          {update.new && (
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--gold)] translate-y-[-1px]" />
          )}
        </div>
        <span className="text-[9px] text-[var(--muted)] uppercase tracking-[0.05em] shrink-0 whitespace-nowrap">
          {formatDateShort(update.date)}
        </span>
      </div>

      {/* Summary */}
      <p className="text-[13.6px] font-light leading-[1.35] text-[var(--ink)] mb-3">
        {update.summary}
      </p>

      {/* Notes section */}
      <div className="border-t border-[var(--card-dark)] pt-2 mt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] uppercase tracking-[0.08em] text-[var(--muted)] font-medium">Notes</span>
          <button className="text-[9px] uppercase tracking-[0.06em] bg-[var(--gold)] text-[var(--ink)] px-2 py-0.5 rounded-full border border-[var(--ink)] font-medium hover:scale-[0.96] active:scale-[0.93] transition-transform">
            Add a note +
          </button>
          {!update.sent_message && (
            <button className="text-[9px] uppercase tracking-[0.06em] bg-[var(--gold)] text-[var(--ink)] px-2 py-0.5 rounded-full border border-[var(--ink)] font-medium hover:scale-[0.96] active:scale-[0.93] transition-transform">
              Sent a message
            </button>
          )}
        </div>

        {update.notes && (
          <div className="flex gap-2">
            <div className="w-px bg-[var(--ink)] opacity-20 shrink-0 ml-1" />
            <div className="text-[11px] text-[var(--ink)] italic leading-snug pl-1">
              {update.notes_date && (
                <span className="not-italic text-[9px] uppercase tracking-[0.05em] text-[var(--muted)] block mb-0.5">
                  {formatDateShort(update.notes_date)}
                </span>
              )}
              {update.notes}
            </div>
          </div>
        )}

        {update.sent_message && update.sent_message_date && (
          <p className="text-[9px] text-[var(--muted)] uppercase tracking-[0.06em] mt-1 flex items-center gap-1">
            <span className="text-[var(--gold)]">✓</span> Message sent {formatDateShort(update.sent_message_date)}
          </p>
        )}
      </div>
    </div>
  )
}

export function DetailPanel({ contact, onUpdateContact, onMarkAllRead, onAddUpdate }: Props) {
  const [updating, setUpdating] = useState(false)
  const [showAddUpdate, setShowAddUpdate] = useState(false)

  // Auto-mark all updates as read when contact is viewed
  useEffect(() => {
    if (contact && contact.updates.some(u => u.new)) {
      onMarkAllRead(contact.id)
    }
  }, [contact?.id])

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm uppercase tracking-[0.08em]">
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
      {/* Contact header */}
      <div className="shrink-0 pb-4 mb-4 border-b border-[var(--card-dark)]">
        {/* Name + tags row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-semibold uppercase text-[37px] tracking-[0.01em] leading-[0.95]">
            {contact.name}
          </h1>
          <div className="flex flex-wrap gap-1 justify-end pt-1 max-w-[40%]">
            {contact.tags.map(tag => (
              <Tag key={tag} label={tag} size="md" />
            ))}
          </div>
        </div>

        {/* Dates row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-[var(--muted)] uppercase tracking-[0.07em] mb-3 font-medium">
          <span>Date Met: {formatDateShort(contact.date_added)}</span>
          <span>Last Update: {formatDateShort(contact.last_updated)}</span>
          <span>Last Contact: {formatDateShort(contact.last_contacted)}</span>
          {contact.birthday && <span>Birthday: {formatDateShort(contact.birthday)}</span>}
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-[11px] text-[var(--muted)] mb-1.5 font-medium">
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {contact.linkedin && (
            <a href={`https://${contact.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline underline-offset-2 hover:text-[var(--gold)] transition-colors font-medium">
              LinkedIn <ExternalLink size={9} />
            </a>
          )}
          {contact.website && (
            <a href={`https://${contact.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline underline-offset-2 hover:text-[var(--gold)] transition-colors font-medium">
              Website <ExternalLink size={9} />
            </a>
          )}
          {contact.instagram && (
            <a href={`https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[var(--ink)] underline underline-offset-2 hover:text-[var(--gold)] transition-colors font-medium">
              {contact.instagram} <ExternalLink size={9} />
            </a>
          )}
        </div>

        {/* Summary */}
        {contact.summary && (
          <div className="mt-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--muted)] font-medium mb-1">Summary</p>
            <p className="text-[13px] font-light leading-[1.4] text-[var(--ink)]">{contact.summary}</p>
          </div>
        )}
      </div>

      {/* Update Log header */}
      <div className="shrink-0 flex items-center gap-3 mb-3">
        <h2 className="font-semibold uppercase text-[19px] tracking-[0.02em]">Update Log</h2>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="text-[9px] uppercase tracking-[0.07em] bg-[var(--gold)] text-[var(--ink)] px-3 py-1 rounded-full border border-[var(--ink)] font-medium hover:scale-[0.96] active:scale-[0.93] disabled:opacity-40 disabled:pointer-events-none transition-transform whitespace-nowrap"
        >
          {updating ? 'Updating...' : 'AI Update +'}
        </button>
        <button
          onClick={() => setShowAddUpdate(true)}
          className="text-[9px] uppercase tracking-[0.07em] bg-[var(--gold)] text-[var(--ink)] px-3 py-1 rounded-full border border-[var(--ink)] font-medium hover:scale-[0.96] active:scale-[0.93] transition-transform whitespace-nowrap"
        >
          Add an Update +
        </button>
      </div>

      {showAddUpdate && (
        <AddUpdateModal
          contactName={contact.name}
          onClose={() => setShowAddUpdate(false)}
          onAdd={update => {
            onAddUpdate(contact.id, update)
            setShowAddUpdate(false)
          }}
        />
      )}

      {/* Update cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {sortedUpdates.length === 0 ? (
          <p className="text-[11px] text-[var(--muted)] uppercase tracking-[0.07em]">No updates yet. Click AI Update + to fetch.</p>
        ) : (
          sortedUpdates.map(update => (
            <UpdateCard key={update.id} update={update} />
          ))
        )}
      </div>
    </div>
  )
}
