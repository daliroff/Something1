'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ZONES,
  ZoneId,
  formatOffset,
  getTimeZoneOffsetMinutes,
  getZoneAbbreviation,
  zonedParts,
  zonedWallTimeToUtc,
} from '@/lib/timezones'

function toDatetimeLocalValue(parts: { year: number; month: number; day: number; hour: number; minute: number }) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`
}

interface TimeZoneConverterProps {
  fromZone: ZoneId
  onFromZoneChange: (zone: ZoneId) => void
}

export default function TimeZoneConverter({ fromZone, onFromZoneChange }: TimeZoneConverterProps) {
  // Starts empty so server and client render identically; filled in on mount to avoid
  // a hydration mismatch from computing `new Date()` during render.
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    setInputValue((current) => current || toDatetimeLocalValue(zonedParts(new Date(), fromZone)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setToNow = (zone: ZoneId) => {
    setInputValue(toDatetimeLocalValue(zonedParts(new Date(), zone)))
  }

  const handleZoneChange = (zone: ZoneId) => {
    // Re-interpret the currently displayed wall-clock numbers in the new zone,
    // rather than converting the instant, so the fields the user typed stay put.
    onFromZoneChange(zone)
  }

  const instant = useMemo(() => {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(inputValue)
    if (!match) return null
    const [, y, mo, d, h, mi] = match.map(Number) as unknown as number[]
    return zonedWallTimeToUtc(y, mo, d, h, mi, fromZone)
  }, [inputValue, fromZone])

  const fromZoneDef = ZONES.find((z) => z.id === fromZone)!
  const uzbekistanOffset = instant ? getTimeZoneOffsetMinutes('Asia/Tashkent', instant) : 0
  const fromOffset = instant ? getTimeZoneOffsetMinutes(fromZone, instant) : 0
  const diffHours = (uzbekistanOffset - fromOffset) / 60

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-stone-800 mb-1">Time Converter</h2>
      <p className="text-sm text-stone-500 mb-6">
        Pick a date &amp; time in any U.S. time zone and instantly see the equivalent time everywhere else, including
        Tashkent, Uzbekistan.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">From time zone</label>
          <select
            className="input-field"
            value={fromZone}
            onChange={(e) => handleZoneChange(e.target.value as ZoneId)}
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.flag} {z.label} ({z.city})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Date &amp; time</label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="input-field"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setToNow(fromZone)}
              className="btn-secondary text-sm whitespace-nowrap"
            >
              Now
            </button>
          </div>
        </div>
      </div>

      {instant && (
        <>
          <div className="mt-2 mb-4 text-sm text-stone-500">
            {fromZoneDef.label} is{' '}
            <span className="font-semibold text-sky-700">
              {diffHours === 0 ? 'the same time as' : `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? '' : 's'} ${diffHours > 0 ? 'behind' : 'ahead of'}`}
            </span>{' '}
            Uzbekistan right now for this date.
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ZONES.map((zone) => {
              const isSource = zone.id === fromZone
              const isUzbekistan = zone.id === 'Asia/Tashkent'
              const time = new Intl.DateTimeFormat('en-US', {
                timeZone: zone.id,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }).format(instant)
              const dateStr = new Intl.DateTimeFormat('en-US', {
                timeZone: zone.id,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }).format(instant)
              const abbr = getZoneAbbreviation(zone.id, instant)
              const offset = formatOffset(getTimeZoneOffsetMinutes(zone.id, instant))

              return (
                <div
                  key={zone.id}
                  className={`rounded-xl p-4 border ${
                    isUzbekistan
                      ? 'bg-sky-50 border-sky-200'
                      : isSource
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-600">
                      {zone.flag} {zone.label}
                    </span>
                    {isSource && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded">
                        SOURCE
                      </span>
                    )}
                  </div>
                  <div className={`font-mono text-2xl font-bold ${isUzbekistan ? 'text-sky-800' : 'text-stone-800'}`}>
                    {time}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {dateStr} · {abbr} ({offset})
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
