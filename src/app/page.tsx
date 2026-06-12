'use client'

import { useState, useMemo } from 'react'
import { Contact, ViewMode, SortField } from '@/lib/types'
import mockData from '@/lib/mock-data.json'
import { ViewToggle } from '@/components/ViewToggle'
import { RolodexCard } from '@/components/RolodexCard'
import { ContactListItem } from '@/components/ContactListItem'
import { FilterPanel } from '@/components/FilterPanel'
import { DetailPanel } from '@/components/DetailPanel'
import { AddContactModal } from '@/components/AddContactModal'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>(mockData.contacts as Contact[])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedId, setSelectedId] = useState<string>(mockData.contacts[0].id)
  const [rolodexIndex, setRolodexIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('last_updated')
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    let list = contacts.filter(c => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchTags = activeTagFilters.length === 0 ||
        activeTagFilters.some(t => c.tags.includes(t))
      return matchSearch && matchTags
    })
    list = [...list].sort((a, b) => {
      const av = (a[sortBy] ?? '1900-01-01') as string
      const bv = (b[sortBy] ?? '1900-01-01') as string
      return bv > av ? 1 : -1
    })
    return list
  }, [contacts, search, sortBy, activeTagFilters])

  const selectedContact = contacts.find(c => c.id === selectedId) ?? filtered[0] ?? null

  const handleTagFilter = (tag: string) =>
    setActiveTagFilters(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag])

  const handleSelectContact = (id: string) => {
    setSelectedId(id)
    const idx = filtered.findIndex(c => c.id === id)
    if (idx >= 0) setRolodexIndex(idx)
  }

  const handleRolodexNav = (dir: 1 | -1) => {
    const next = (rolodexIndex + dir + filtered.length) % filtered.length
    setRolodexIndex(next)
    setSelectedId(filtered[next].id)
  }

  const handleAddContact = (contact: Contact) =>
    setContacts(cs => [contact, ...cs])

  const handleMarkRead = (contactId: string, updateId: string) =>
    setContacts(cs =>
      cs.map(c =>
        c.id === contactId
          ? { ...c, updates: c.updates.map(u => u.id === updateId ? { ...u, new: false } : u) }
          : c
      )
    )

  const handleUpdateContact = async (id: string) => {
    const contact = contacts.find(c => c.id === id)
    if (!contact) return
    const res = await fetch('/api/update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    })
    if (!res.ok) return
    const { updates } = await res.json()
    if (updates?.length) {
      setContacts(cs =>
        cs.map(c =>
          c.id === id
            ? { ...c, last_updated: new Date().toISOString().split('T')[0], updates: [...updates, ...c.updates] }
            : c
        )
      )
    }
  }

  const rolodexContact = filtered[rolodexIndex] ?? filtered[0]

  return (
    <div className="min-h-screen p-3 md:p-4 flex flex-col lg:flex-row gap-3" style={{ height: '100dvh' }}>
      {/* Left panel */}
      <div className="lg:w-[460px] shrink-0 flex flex-col gap-2 lg:h-full min-h-0">

        {/* Filter tab */}
        <div>
          <div
            className="inline-block px-8 py-2"
            style={{
              background: 'var(--gold)',
              clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0% 100%)',
            }}
          >
            <span className="font-black uppercase tracking-widest text-white text-sm">Filter</span>
          </div>
        </div>

        {/* Card area + toggle side by side */}
        <div className="flex gap-3 flex-1 min-h-0">
          <div className="flex-1 bg-[var(--card)] border border-[var(--ink)] rounded p-3 flex flex-col min-h-0 overflow-hidden">
            {viewMode === 'rolodex' ? (
              <div className="flex-1 min-h-0">
                {rolodexContact && (
                  <RolodexCard
                    contact={rolodexContact}
                    total={filtered.length}
                    index={rolodexIndex}
                    onPrev={() => handleRolodexNav(-1)}
                    onNext={() => handleRolodexNav(1)}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {filtered.map(c => (
                  <ContactListItem
                    key={c.id}
                    contact={c}
                    selected={c.id === selectedId}
                    onClick={() => handleSelectContact(c.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-center text-[var(--muted)] py-8">No contacts match</p>
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 flex items-center">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* Filter panel */}
        <div className="bg-[var(--card)] border border-[var(--ink)] rounded p-3 shrink-0">
          <FilterPanel
            contacts={contacts}
            search={search}
            onSearch={setSearch}
            sortBy={sortBy}
            onSort={setSortBy}
            activeTagFilters={activeTagFilters}
            onTagFilter={handleTagFilter}
            onAddContact={() => setShowAddModal(true)}
          />
        </div>
      </div>

      {/* Right detail panel */}
      <div className="flex-1 bg-[var(--card)] border border-[var(--ink)] rounded p-4 min-h-0 overflow-hidden">
        <DetailPanel
          contact={selectedContact}
          onUpdateContact={handleUpdateContact}
          onMarkRead={handleMarkRead}
        />
      </div>

      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  )
}
