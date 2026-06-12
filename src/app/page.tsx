'use client'

import { useState, useMemo } from 'react'
import { Contact, ViewMode, SortField, DateFilter, DateFilterField } from '@/lib/types'
import mockData from '@/lib/mock-data.json'
import { ViewToggle } from '@/components/ViewToggle'
import { RolodexCard } from '@/components/RolodexCard'
import { ContactListItem } from '@/components/ContactListItem'
import { FilterPanel } from '@/components/FilterPanel'
import { DetailPanel } from '@/components/DetailPanel'
import { AddContactModal } from '@/components/AddContactModal'

const emptyDateFilter: DateFilter = { start: null, end: null }
const emptyDateFilters = {
  date_added: emptyDateFilter,
  last_contacted: emptyDateFilter,
  last_updated: emptyDateFilter,
  birthday: emptyDateFilter,
}

function matchesDateFilter(value: string | null, filter: DateFilter): boolean {
  if (!filter.start && !filter.end) return true
  if (!value) return false
  if (filter.start && !filter.end) return value === filter.start
  if (filter.start && filter.end) return value >= filter.start && value <= filter.end
  return true
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>(mockData.contacts as Contact[])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedId, setSelectedId] = useState<string>(mockData.contacts[0].id)
  const [rolodexIndex, setRolodexIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('last_updated')
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [dateFilters, setDateFilters] = useState<Record<DateFilterField, DateFilter>>(emptyDateFilters)

  const handleDateFilter = (field: DateFilterField, start: string | null, end: string | null) => {
    setDateFilters(f => ({ ...f, [field]: { start, end } }))
  }

  const handleClearAll = () => {
    setSearch('')
    setActiveTagFilters([])
    setDateFilters(emptyDateFilters)
  }

  const filtered = useMemo(() => {
    let list = contacts.filter(c => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchTags = activeTagFilters.length === 0 ||
        activeTagFilters.some(t => c.tags.includes(t))
      const matchDates =
        matchesDateFilter(c.date_added, dateFilters.date_added) &&
        matchesDateFilter(c.last_contacted, dateFilters.last_contacted) &&
        matchesDateFilter(c.last_updated, dateFilters.last_updated) &&
        matchesDateFilter(c.birthday, dateFilters.birthday)
      return matchSearch && matchTags && matchDates
    })
    list = [...list].sort((a, b) => {
      const lastName = (name: string) => name.trim().split(' ').pop()?.toLowerCase() ?? ''
      return lastName(a.name) < lastName(b.name) ? -1 : lastName(a.name) > lastName(b.name) ? 1 : 0
    })
    return list
  }, [contacts, search, sortBy, activeTagFilters, dateFilters])

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
            <span className="font-semibold uppercase tracking-widest text-[var(--ink)] text-sm">Filter</span>
          </div>
        </div>

        {/* Card area + toggle */}
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
                  <p className="text-[11px] text-center text-[var(--muted)] py-8 uppercase tracking-[0.07em]">No contacts match</p>
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
            dateFilters={dateFilters}
            onDateFilter={handleDateFilter}
            onClearAll={handleClearAll}
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
