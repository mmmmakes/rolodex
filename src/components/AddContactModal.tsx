'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Contact } from '@/lib/types'

interface Props {
  onClose: () => void
  onAdd: (contact: Contact) => void
}

const TAG_OPTIONS = [
  'Work', 'Friend', 'Mentor', 'Investor', 'College', 'Design', 'Tech',
  'SF', 'NYC', 'LA', 'Chicago', 'London', 'Miami', 'VC', 'UX', 'Film', 'Art',
]

export function AddContactModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', birthday: '',
    linkedin: '', website: '', instagram: '', summary: '',
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [urlPull, setUrlPull] = useState('')
  const [pulling, setPulling] = useState(false)

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const toggleTag = (tag: string) =>
    setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])

  const handleAIPull = async () => {
    if (!urlPull) return
    setPulling(true)
    try {
      const res = await fetch('/api/pull-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlPull }),
      })
      const data = await res.json()
      if (data.contact) {
        setForm(f => ({ ...f, ...data.contact }))
        if (data.contact.tags) setSelectedTags(data.contact.tags)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPulling(false)
    }
  }

  const handleSubmit = () => {
    if (!form.name || !form.email) return
    const contact: Contact = {
      id: `c${Date.now()}`,
      name: form.name,
      phone: form.phone || null,
      email: form.email,
      birthday: form.birthday || null,
      linkedin: form.linkedin || null,
      website: form.website || null,
      instagram: form.instagram || null,
      tags: selectedTags,
      date_added: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      last_contacted: new Date().toISOString().split('T')[0],
      updates: form.summary
        ? [{
            id: `u${Date.now()}`,
            title: 'Initial summary',
            summary: form.summary,
            date: new Date().toISOString().split('T')[0],
            notes: null,
            notes_date: null,
            sent_message: false,
            sent_message_date: null,
            new: false,
          }]
        : [],
    }
    onAdd(contact)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-[var(--card)] border border-[var(--ink)] rounded w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--card-dark)]">
          <h2 className="font-bold uppercase tracking-widest text-sm">Add Contact</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* AI Pull */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wide block mb-1">
              Pull from URL (LinkedIn, website)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={urlPull}
                onChange={e => setUrlPull(e.target.value)}
                className="flex-1 border border-[var(--ink)] bg-white rounded px-2 py-1.5 text-sm focus:outline-none"
              />
              <button
                onClick={handleAIPull}
                disabled={pulling}
                className="bg-[var(--ink)] text-[var(--card)] text-xs font-bold uppercase px-3 py-1.5 rounded disabled:opacity-50"
              >
                {pulling ? '...' : 'AI Pull'}
              </button>
            </div>
          </div>

          <hr className="border-[var(--card-dark)]" />

          {/* Name */}
          <Field label="Full Name *">
            <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>

          {/* Phone / Email */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} />
            </Field>
            <Field label="Email *">
              <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} />
            </Field>
          </div>

          {/* Birthday */}
          <Field label="Birthday">
            <input type="date" className={inputCls} value={form.birthday} onChange={e => set('birthday', e.target.value)} />
          </Field>

          {/* Social */}
          <Field label="LinkedIn">
            <input className={inputCls} placeholder="linkedin.com/in/..." value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
          </Field>
          <Field label="Website">
            <input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} />
          </Field>
          <Field label="Instagram">
            <input className={inputCls} placeholder="@handle" value={form.instagram} onChange={e => set('instagram', e.target.value)} />
          </Field>

          {/* Summary */}
          <Field label="Summary">
            <textarea
              className={`${inputCls} resize-none h-20`}
              value={form.summary}
              onChange={e => set('summary', e.target.value)}
            />
          </Field>

          {/* Tags */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wide block mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border border-[var(--ink)] uppercase tracking-wide transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[var(--ink)] text-[var(--card)]'
                      : 'bg-transparent text-[var(--ink)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-[var(--card-dark)]">
          <button onClick={onClose} className="text-sm text-[var(--muted)] underline">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || !form.email}
            className="bg-[var(--ink)] text-[var(--card)] font-bold uppercase text-xs tracking-widest px-4 py-2 rounded-full disabled:opacity-40"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-[var(--card-dark)] bg-white rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[var(--ink)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[var(--muted)] uppercase tracking-wide block mb-1">{label}</label>
      {children}
    </div>
  )
}
