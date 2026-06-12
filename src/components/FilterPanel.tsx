'use client'

import { Search } from 'lucide-react'
import { Contact, SortField } from '@/lib/types'
import { Tag } from './Tag'

interface Props {
  contacts: Contact[]
  search: string
  onSearch: (v: string) => void
  sortBy: SortField
  onSort: (f: SortField) => void
  activeTagFilters: string[]
  onTagFilter: (tag: string) => void
  onAddContact: () => void
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'date_added', label: 'Date Added' },
  { field: 'last_contacted', label: 'Last Contact' },
  { field: 'last_updated', label: 'Last Update' },
  { field: 'birthday', label: 'Birthday' },
]

export function FilterPanel({
  contacts,
  search,
  onSearch,
  sortBy,
  onSort,
  activeTagFilters,
  onTagFilter,
  onAddContact,
}: Props) {
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags))).sort()

  return (
    <div className="space-y-3">
      {/* Add Contact */}
      <div className="flex justify-end">
        <button
          onClick={onAddContact}
          className="bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white font-bold uppercase text-xs tracking-widest px-4 py-2 rounded-full transition-colors"
        >
          Add Contact +
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Type to Search..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full border border-[var(--ink)] bg-[var(--card)] rounded px-3 py-2 pr-9 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]"
        />
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-2">Filter by</p>
        <div className="flex gap-3 flex-wrap mb-2">
          {SORT_OPTIONS.map(({ field, label }) => (
            <button
              key={field}
              onClick={() => onSort(field)}
              className={`text-xs uppercase tracking-wide underline-offset-2 ${
                sortBy === field ? 'font-bold underline' : 'text-[var(--muted)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          {allTags.map(tag => (
            <Tag
              key={tag}
              label={tag}
              active={activeTagFilters.includes(tag)}
              onClick={() => onTagFilter(tag)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
