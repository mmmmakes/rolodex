'use client'

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
      {/* Search + Add Contact row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="TYPE TO SEARCH..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="flex-1 border-b border-[var(--ink)] bg-transparent px-0 py-1 text-[11px] uppercase tracking-[0.08em] placeholder:text-[var(--muted)] focus:outline-none font-medium"
        />
        <button
          onClick={onAddContact}
          className="shrink-0 bg-[var(--gold)] text-[var(--ink)] font-medium uppercase text-[10px] tracking-[0.06em] px-3 py-1.5 rounded-[49px] border border-[var(--ink)] transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          Add Contact +
        </button>
      </div>

      {/* Sort */}
      <div>
        <div className="flex gap-3 flex-wrap mb-2">
          {SORT_OPTIONS.map(({ field, label }) => (
            <button
              key={field}
              onClick={() => onSort(field)}
              className={`text-[9px] uppercase tracking-[0.06em] transition-opacity ${
                sortBy === field
                  ? 'font-semibold opacity-100 underline underline-offset-2'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
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
