'use client'

import { useState } from 'react'
import { Contact, SortField, DateFilter, DateFilterField } from '@/lib/types'
import { Tag } from './Tag'
import { MiniCalendar } from './MiniCalendar'
import { ChevronDown, Search } from 'lucide-react'

interface Props {
  contacts: Contact[]
  search: string
  onSearch: (v: string) => void
  sortBy: SortField
  onSort: (f: SortField) => void
  activeTagFilters: string[]
  onTagFilter: (tag: string) => void
  onAddContact: () => void
  dateFilters: Record<DateFilterField, DateFilter>
  onDateFilter: (field: DateFilterField, start: string | null, end: string | null) => void
  onClearAll: () => void
}

const DATE_FIELDS: { field: DateFilterField; label: string }[] = [
  { field: 'date_added', label: 'Date Added' },
  { field: 'last_contacted', label: 'Last Contact' },
  { field: 'last_updated', label: 'Last Update' },
  { field: 'birthday', label: 'Birthday' },
]

const emptyDf = { date_added: { start: null, end: null }, last_contacted: { start: null, end: null }, last_updated: { start: null, end: null }, birthday: { start: null, end: null } }

export function FilterPanel({
  contacts,
  search,
  onSearch,
  activeTagFilters,
  onTagFilter,
  onAddContact,
  dateFilters = emptyDf,
  onDateFilter,
  onClearAll,
}: Props) {
  const [openCalendar, setOpenCalendar] = useState<DateFilterField | null>(null)
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags))).sort()

  const isActive = (field: DateFilterField) =>
    !!(dateFilters[field]?.start || dateFilters[field]?.end)

  const hasAnyFilter = search || activeTagFilters.length > 0 ||
    DATE_FIELDS.some(({ field }) => isActive(field))

  return (
    <div className="space-y-3">
      {/* Add Contact button */}
      <div className="flex justify-end">
        <button
          onClick={onAddContact}
          className="bg-[var(--gold)] text-[var(--ink)] font-semibold uppercase text-[11px] tracking-[0.05em] px-5 py-2 rounded-full border border-[var(--ink)] transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          Add Contact +
        </button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Type to Search..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full border border-[var(--ink)] bg-[var(--card)] rounded-lg px-3 py-2 pr-9 text-[13px] placeholder:text-[var(--muted)] focus:outline-none"
        />
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
      </div>

      {/* Filter by heading + Clear */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">Filter by</p>
        {hasAnyFilter && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-medium uppercase tracking-[0.06em] underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Clear
          </button>
        )}
      </div>

      {/* Date filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {DATE_FIELDS.map(({ field, label }) => (
          <div key={field} className="relative">
            <button
              onClick={() => setOpenCalendar(openCalendar === field ? null : field)}
              className={`flex items-center gap-1 text-[10px] px-[10px] py-[4px] rounded-full border border-[var(--ink)] uppercase tracking-[0.04em] font-medium whitespace-nowrap leading-none transition-colors ${
                isActive(field)
                  ? 'bg-[var(--ink)] text-[var(--card)]'
                  : 'bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--card)]'
              }`}
            >
              {label}
              <ChevronDown
                size={9}
                strokeWidth={2.5}
                className={`transition-transform ${openCalendar === field ? 'rotate-180' : ''}`}
              />
            </button>

            {openCalendar === field && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <MiniCalendar
                  startDate={dateFilters[field].start}
                  endDate={dateFilters[field].end}
                  onChange={(start, end) => {
                    onDateFilter(field, start, end)
                    if (start && end) setOpenCalendar(null)
                  }}
                  onClose={() => setOpenCalendar(null)}
                />
              </div>
            )}
          </div>
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
  )
}
