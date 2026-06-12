'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Update } from '@/lib/types'

interface Props {
  contactName: string
  onClose: () => void
  onAdd: (update: Update) => void
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export function AddUpdateModal({ contactName, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [date, setDate] = useState(today())

  const canAdd = title.trim().length > 0

  const handleSubmit = () => {
    if (!canAdd) return
    onAdd({
      id: `u${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      date,
      notes: null,
      notes_date: null,
      sent_message: false,
      sent_message_date: null,
      new: false,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-[var(--card)] border-2 border-[var(--ink)] rounded-[14px] w-full max-w-md flex flex-col overflow-hidden">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col-reverse">
          <div className="px-6 pt-5 pb-4 space-y-5">

            <div>
              <ModalLabel>Heading</ModalLabel>
              <input
                autoFocus
                className={underlineInput}
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div>
              <ModalLabel>Summary</ModalLabel>
              <textarea
                className="w-full border border-[var(--ink)] bg-transparent rounded-[8px] px-3 py-2 text-[13px] resize-none h-28 focus:outline-none font-light leading-snug"
                value={summary}
                onChange={e => setSummary(e.target.value)}
              />
            </div>

            <div>
              <ModalLabel>Date</ModalLabel>
              <input
                type="date"
                className={underlineInput}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t-2 border-[var(--ink)] px-6 py-4 flex items-center justify-between bg-[var(--card)]">
          <span className="font-semibold uppercase text-[13.6px] tracking-[0.04em] truncate pr-4 text-[var(--muted)] text-[11px]">
            {contactName}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!canAdd}
              className={`bg-[var(--gold)] text-[var(--ink)] text-[10px] font-medium uppercase tracking-[0.06em] px-4 py-1.5 rounded-full border border-[var(--ink)] transition-transform ${
                canAdd ? 'hover:scale-[0.96] active:scale-[0.93]' : 'opacity-40 pointer-events-none'
              }`}
            >
              Add Update +
            </button>
            <button onClick={onClose} className="text-[var(--ink)] hover:scale-[0.96] active:scale-[0.93] transition-transform">
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const underlineInput = 'w-full border-b border-[var(--ink)] bg-transparent py-1 text-[13px] focus:outline-none font-light leading-snug placeholder:text-[var(--muted)] placeholder:opacity-60'

function ModalLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-medium uppercase tracking-[-0.25px] opacity-60 mb-1">
      {children}
    </label>
  )
}
