'use client'

import { useEffect, useState } from 'react'
import { ZONES, formatClock, formatOffset, getTimeZoneOffsetMinutes, getZoneAbbreviation } from '@/lib/timezones'

export default function LiveClockGrid() {
  const [now, setNow] = useState<Date | null>(null)
  const [localTimeZone, setLocalTimeZone] = useState<string | null>(null)

  useEffect(() => {
    setNow(new Date())
    setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const isLocalUzbekistan = localTimeZone === 'Asia/Tashkent'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ZONES.map((zone) => {
        const isUzbekistan = zone.id === 'Asia/Tashkent'
        const { time, date } = now ? formatClock(now, zone.id) : { time: '--:--:--', date: '' }
        const abbr = now ? getZoneAbbreviation(zone.id, now) : ''
        const offset = now ? formatOffset(getTimeZoneOffsetMinutes(zone.id, now)) : ''

        return (
          <div
            key={zone.id}
            className={`rounded-2xl p-5 shadow-sm border ${
              isUzbekistan
                ? 'bg-gradient-to-br from-sky-600 to-sky-800 border-sky-700 text-white'
                : 'bg-stone-900 border-stone-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold opacity-90">
                  {zone.flag} {zone.label}
                </div>
                <div className={`text-xs ${isUzbekistan ? 'text-sky-100' : 'text-stone-400'}`}>{zone.city}</div>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-1 rounded-md ${
                  isUzbekistan ? 'bg-sky-900/50' : 'bg-stone-800'
                }`}
              >
                {abbr}
              </span>
            </div>
            <div className="font-mono text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">{time}</div>
            <div className={`mt-2 flex items-center justify-between text-xs ${isUzbekistan ? 'text-sky-100' : 'text-stone-400'}`}>
              <span>{date}</span>
              <span>{offset}</span>
            </div>
          </div>
        )
      })}

      {/* Your local time, like time.gov's "Your time" reference. Only known client-side, so it
          renders nothing during SSR/initial hydration rather than guessing and mismatching. */}
      {localTimeZone && now && !isLocalUzbekistan && (
        <div className="rounded-2xl p-5 shadow-sm border border-amber-300 bg-amber-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-amber-800">📍 Your Local Time</div>
              <div className="text-xs text-amber-600">{localTimeZone.replace('_', ' ')}</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-amber-200 text-amber-800">
              {getZoneAbbreviation(localTimeZone, now)}
            </span>
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-amber-900">
            {formatClock(now, localTimeZone).time}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-700">
            <span>{formatClock(now, localTimeZone).date}</span>
            <span>{formatOffset(getTimeZoneOffsetMinutes(localTimeZone, now))}</span>
          </div>
        </div>
      )}
    </div>
  )
}
