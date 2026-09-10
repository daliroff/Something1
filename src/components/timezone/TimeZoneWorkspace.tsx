'use client'

import { useState } from 'react'
import { ZoneId } from '@/lib/timezones'
import UsTimeZoneMap from './UsTimeZoneMap'
import TimeZoneConverter from './TimeZoneConverter'

export default function TimeZoneWorkspace() {
  const [fromZone, setFromZone] = useState<ZoneId>('America/Los_Angeles')

  return (
    <div className="space-y-10">
      <UsTimeZoneMap selectedZone={fromZone} onSelectZone={setFromZone} />
      <TimeZoneConverter fromZone={fromZone} onFromZoneChange={setFromZone} />
    </div>
  )
}
