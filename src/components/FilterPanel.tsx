'use client'

import { useState } from 'react'
import { Contact, SortField, DateFilter, DateFilterField } from '@/lib/types'
import { Tag } from './Tag'
import { MiniCalendar } from './MiniCalendar'
import { ChevronDown } from 'lucide-react'

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
}

const DATE_FIELDS: { field: DateFilterField; label: string }[] = [
  { field: 'date_added', label: 'Date Added' },
  { field: 'last_contacted', label: 'Last Contact' },
  { field: 'last_updated', label: 'Last Update' },
  { field: 'birthday', label: 'Birthday' },
]

export function FilterPanel({
  contacts,
  search,
  onSearch,
  activeTagFilters,
  onTagFilter,
  onAddContact,
  dateFilters = { date_added: { start: null, end: null }, last_contacted: { start: null, end: null }, last_updated: { start: null, end: null }, birthday: { start: null, end: null } },
  onDateFilter,
}: Props) {
  const [openCalendar, setOpenCalendar] = useState<DateFilterField | null>(null)
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags))).sort()

  const isActive = (field: DateFilterField) =>
    !!(dateFilters[field].start || dateFilters[field].end)

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

      {/* Date filter pills + tag filters */}
      <div>
        <p className="text-[9px] font-medium uppercase tracking-[0.1em] opacity-60 mb-2">Filter by</p>

        {/* Date filter pills */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {DATE_FIELDS.map(({ field, label }) => (
            <div key={field} className="relative">
              <button
                onClick={() => setOpenCalendar(openCalendar === field ? null : field)}
                className={`flex items-center gap-1 text-[10px] px-[10px] py-[3px] rounded-[130px] border border-[var(--ink)] uppercase tracking-[0.04em] font-medium whitespace-nowrap leading-none transition-colors ${
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
    </div>
  )
}
