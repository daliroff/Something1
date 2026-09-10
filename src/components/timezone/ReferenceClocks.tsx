'use client'

import { useEffect, useState } from 'react'
import { formatClock, formatOffset, getTimeZoneOffsetMinutes, getZoneAbbreviation } from '@/lib/timezones'

interface ReferenceClocksProps {
  now: Date | null
}

export default function ReferenceClocks({ now }: ReferenceClocksProps) {
  const [localTimeZone, setLocalTimeZone] = useState<string | null>(null)

  useEffect(() => {
    setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  const isLocalUzbekistan = localTimeZone === 'Asia/Tashkent'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-2xl p-5 shadow-sm border border-sky-700 bg-gradient-to-br from-sky-600 to-sky-800 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold opacity-90">🇺🇿 Uzbekistan Time</div>
            <div className="text-xs text-sky-100">Tashkent</div>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-sky-900/50">
            {now ? getZoneAbbreviation('Asia/Tashkent', now) : ''}
          </span>
        </div>
        <div className="font-mono text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
          {now ? formatClock(now, 'Asia/Tashkent').time : '--:--:--'}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-sky-100">
          <span>{now ? formatClock(now, 'Asia/Tashkent').date : ''}</span>
          <span>{now ? formatOffset(getTimeZoneOffsetMinutes('Asia/Tashkent', now)) : ''}</span>
        </div>
      </div>

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
