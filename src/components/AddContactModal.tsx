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
  'Art Direction', 'Branding', 'Strategy', 'Agency', 'Freelance',
]

const MAX_TAGS = 10

export function AddContactModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', birthday: '',
    linkedin: '', website: '', instagram: '', summary: '',
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTags, setCustomTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [urlPull, setUrlPull] = useState('')
  const [pulling, setPulling] = useState(false)

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const toggleTag = (tag: string) =>
    setSelectedTags(t =>
      t.includes(tag)
        ? t.filter(x => x !== tag)
        : t.length < MAX_TAGS ? [...t, tag] : t
    )

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
        const { name, ...rest } = data.contact
        const parts = (name || '').split(' ')
        const firstName = parts[0] || ''
        const lastName = parts.slice(1).join(' ')
        setForm(f => ({ ...f, ...rest, firstName, lastName }))
        if (data.contact.tags) setSelectedTags(data.contact.tags.slice(0, MAX_TAGS))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPulling(false)
    }
  }

  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ')
  const canAdd = fullName.trim().length > 0

  const handleSubmit = () => {
    if (!canAdd) return
    const contact: Contact = {
      id: `c${Date.now()}`,
      name: fullName,
      phone: form.phone || null,
      email: form.email || '',
      birthday: form.birthday || null,
      linkedin: form.linkedin || null,
      website: form.website || null,
      instagram: form.instagram || null,
      tags: selectedTags.slice(0, MAX_TAGS),
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
      <div className="bg-[var(--card)] border-2 border-[var(--ink)] rounded-[14px] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col-reverse">
          <div className="px-6 pt-5 pb-4 space-y-5">

            {/* AI Pull from URL */}
            <div>
              <ModalLabel>Pull from URL</ModalLabel>
              <div className="flex items-end gap-2">
                <input
                  type="url"
                  placeholder="linkedin.com/in/..."
                  value={urlPull}
                  onChange={e => setUrlPull(e.target.value)}
                  className={underlineInput + ' flex-1'}
                />
                <button
                  onClick={handleAIPull}
                  disabled={pulling || !urlPull}
                  className={`shrink-0 bg-[var(--gold)] text-[var(--ink)] text-[10px] font-medium uppercase tracking-[0.05em] px-3 py-1 rounded-full border border-[var(--ink)] transition-opacity whitespace-nowrap ${
                    urlPull && !pulling ? 'opacity-100 hover:opacity-80' : 'opacity-40'
                  }`}
                >
                  {pulling ? '...' : 'AI Pull +'}
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--card-dark)]" />

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ModalLabel>First Name</ModalLabel>
                <input
                  className={underlineInput}
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                />
              </div>
              <div>
                <ModalLabel>Last Name</ModalLabel>
                <input
                  className={underlineInput}
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                />
              </div>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ModalLabel>Phone</ModalLabel>
                <input className={underlineInput} value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <ModalLabel>Email</ModalLabel>
                <input type="email" className={underlineInput} value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            {/* Birthday */}
            <div>
              <ModalLabel>Birthday</ModalLabel>
              <input type="date" className={underlineInput} value={form.birthday} onChange={e => set('birthday', e.target.value)} />
            </div>

            {/* LinkedIn */}
            <div>
              <ModalLabel>LinkedIn</ModalLabel>
              <input className={underlineInput} placeholder="linkedin.com/in/..." value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
            </div>

            {/* Website */}
            <div>
              <ModalLabel>Website</ModalLabel>
              <input className={underlineInput} value={form.website} onChange={e => set('website', e.target.value)} />
            </div>

            {/* Instagram */}
            <div>
              <ModalLabel>Instagram</ModalLabel>
              <input className={underlineInput} placeholder="@handle" value={form.instagram} onChange={e => set('instagram', e.target.value)} />
            </div>

            {/* Summary */}
            <div>
              <ModalLabel>Summary</ModalLabel>
              <textarea
                className="w-full border border-[var(--ink)] bg-transparent rounded-[8px] px-3 py-2 text-[13px] resize-none h-20 focus:outline-none font-light leading-snug"
                value={form.summary}
                onChange={e => set('summary', e.target.value)}
              />
            </div>

            {/* Tags */}
            <div>
              <ModalLabel>
                Tags {selectedTags.length > 0 && <span className="opacity-50">({selectedTags.length}/{MAX_TAGS})</span>}
              </ModalLabel>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[...TAG_OPTIONS, ...customTags].map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={!selectedTags.includes(tag) && selectedTags.length >= MAX_TAGS}
                    className={`text-[9px] px-2.5 py-1 rounded-full border border-[var(--ink)] uppercase tracking-[0.05em] font-medium transition-colors disabled:opacity-25 ${
                      selectedTags.includes(tag)
                        ? 'bg-[var(--ink)] text-[var(--card)]'
                        : 'bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--card)]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}

                {/* Create tag */}
                {showTagInput ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      const val = newTagInput.trim()
                      if (val && !TAG_OPTIONS.includes(val) && !customTags.includes(val)) {
                        setCustomTags(t => [...t, val])
                        if (selectedTags.length < MAX_TAGS) setSelectedTags(t => [...t, val])
                      }
                      setNewTagInput('')
                      setShowTagInput(false)
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      autoFocus
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      onBlur={() => { if (!newTagInput.trim()) setShowTagInput(false) }}
                      placeholder="Tag name..."
                      className="text-[9px] px-2.5 py-1 rounded-full border border-[var(--ink)] uppercase tracking-[0.05em] font-medium bg-transparent focus:outline-none w-24 placeholder:opacity-40"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => setShowTagInput(true)}
                    className="text-[9px] px-2.5 py-1 rounded-full border border-dashed border-[var(--ink)] uppercase tracking-[0.05em] font-medium text-[var(--ink)] opacity-50 hover:opacity-100 transition-opacity"
                  >
                    Create tag +
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Modal footer — header at bottom per Figma */}
        <div className="shrink-0 border-t-2 border-[var(--ink)] px-6 py-4 flex items-center justify-end gap-3 bg-[var(--card)]">
          <button
            onClick={handleSubmit}
            disabled={!canAdd}
            className={`bg-[var(--gold)] text-[var(--ink)] text-[10px] font-medium uppercase tracking-[0.06em] px-4 py-1.5 rounded-full border border-[var(--ink)] transition-opacity ${
              canAdd ? 'opacity-100 hover:opacity-80' : 'opacity-40 cursor-default'
            }`}
          >
            Add Contact +
          </button>
          <button onClick={onClose} className="text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity">
            <X size={18} strokeWidth={2} />
          </button>
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
