'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  startDate: string | null   // YYYY-MM-DD
  endDate: string | null
  onChange: (start: string | null, end: string | null) => void
  onClose: () => void
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function pad(n: number) { return n < 10 ? `0${n}` : `${n}` }
function toISO(y: number, m: number, d: number) { return `${y}-${pad(m+1)}-${pad(d)}` }
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay() }

export function MiniCalendar({ startDate, endDate, onChange, onClose }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(
    startDate ? parseInt(startDate.slice(0, 4)) : today.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    startDate ? parseInt(startDate.slice(5, 7)) - 1 : today.getMonth()
  )
  const [hovered, setHovered] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (iso: string) => {
    if (!startDate || (startDate && endDate)) {
      // No selection or reset: start fresh
      onChange(iso, null)
    } else {
      // Have start, no end
      if (iso < startDate) {
        onChange(iso, startDate)
      } else if (iso === startDate) {
        onChange(null, null) // deselect
      } else {
        onChange(startDate, iso)
      }
    }
  }

  const isSelected = (iso: string) => iso === startDate || iso === endDate
  const isInRange = (iso: string) => {
    if (!startDate || !endDate) return false
    return iso > startDate && iso < endDate
  }
  const isRangeEdge = (iso: string) => iso === startDate || iso === endDate
  const isHoverRange = (iso: string) => {
    if (!startDate || endDate || !hovered) return false
    const lo = startDate < hovered ? startDate : hovered
    const hi = startDate < hovered ? hovered : startDate
    return iso > lo && iso < hi
  }

  const numDays = daysInMonth(viewYear, viewMonth)
  const firstDay = firstDayOfMonth(viewYear, viewMonth)

  // Status text
  const statusText = !startDate
    ? 'Select start'
    : !endDate
      ? 'Select end or apply'
      : `${startDate} → ${endDate}`

  const canApply = !!startDate

  return (
    <div
      ref={ref}
      className="bg-[var(--card)] border-2 border-[var(--ink)] rounded-[10px] p-[14px] w-[220px]"
      style={{ boxShadow: '4px 4px 0px var(--ink)' }}
    >
      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="w-4 h-4 flex items-center justify-center hover:scale-[0.96] active:scale-[0.93] transition-transform">
          <ChevronLeft size={11} strokeWidth={2.5} />
        </button>
        <span className="text-[10px] font-medium uppercase tracking-[-0.25px]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-4 h-4 flex items-center justify-center hover:scale-[0.96] active:scale-[0.93] transition-transform">
          <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-5">
            <span className="text-[8px] font-medium uppercase opacity-50">{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-6" />
        ))}
        {/* Day cells */}
        {Array.from({ length: numDays }).map((_, i) => {
          const day = i + 1
          const iso = toISO(viewYear, viewMonth, day)
          const sel = isSelected(iso)
          const inRange = isInRange(iso)
          const hoverRange = isHoverRange(iso)
          const edge = isRangeEdge(iso)
          return (
            <button
              key={day}
              onClick={() => handleDayClick(iso)}
              onMouseEnter={() => setHovered(iso)}
              onMouseLeave={() => setHovered(null)}
              className={`h-6 w-full flex items-center justify-center rounded-full text-[9px] transition-colors ${
                sel
                  ? 'bg-[var(--ink)] text-[var(--card)] font-medium'
                  : inRange || hoverRange
                    ? 'bg-[var(--card-dark)]'
                    : 'hover:bg-[var(--card-dark)]'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-black/20 flex items-center justify-between">
        <span className="text-[8px] font-medium uppercase opacity-50 tracking-[0.02em]">
          {statusText}
        </span>
        {(startDate || endDate) && (
          <button
            onClick={() => onChange(null, null)}
            className="text-[8px] uppercase opacity-50 underline underline-offset-1 hover:scale-[0.96] transition-transform"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
