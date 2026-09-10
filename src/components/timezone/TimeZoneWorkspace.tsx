'use client'

import { useEffect, useState } from 'react'
import { ZoneId } from '@/lib/timezones'
import ReferenceClocks from './ReferenceClocks'
import UsTimeZoneMap from './UsTimeZoneMap'
import TimeZoneConverter from './TimeZoneConverter'

export default function TimeZoneWorkspace() {
  const [fromZone, setFromZone] = useState<ZoneId>('America/Los_Angeles')
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-10">
      <ReferenceClocks now={now} />
      <UsTimeZoneMap now={now} selectedZone={fromZone} onSelectZone={setFromZone} />
      <TimeZoneConverter fromZone={fromZone} onFromZoneChange={setFromZone} />
    </div>
  )
}
