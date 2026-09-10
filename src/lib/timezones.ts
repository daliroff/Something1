export type ZoneId =
  | 'America/Los_Angeles'
  | 'America/Denver'
  | 'America/Chicago'
  | 'America/New_York'
  | 'Asia/Tashkent'

export interface ZoneDef {
  id: ZoneId
  label: string
  city: string
  region: string
  flag: string
}

export const ZONES: ZoneDef[] = [
  { id: 'America/Los_Angeles', label: 'Pacific Time', city: 'Los Angeles', region: 'PT · PST/PDT', flag: '🇺🇸' },
  { id: 'America/Denver', label: 'Mountain Time', city: 'Denver', region: 'MT · MST/MDT', flag: '🇺🇸' },
  { id: 'America/Chicago', label: 'Central Time', city: 'Chicago', region: 'CT · CST/CDT', flag: '🇺🇸' },
  { id: 'America/New_York', label: 'Eastern Time', city: 'New York', region: 'ET · EST/EDT', flag: '🇺🇸' },
  { id: 'Asia/Tashkent', label: 'Uzbekistan Time', city: 'Tashkent', region: 'UZT · UTC+5', flag: '🇺🇿' },
]

/** Offset in minutes of `timeZone` from UTC at the instant `date`, i.e. (zone wall time) - (UTC). */
export function getTimeZoneOffsetMinutes(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = dtf.formatToParts(date)
  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  )
  return Math.round((asUTC - date.getTime()) / 60000)
}

/**
 * Interpret (year, month, day, hour, minute) as a wall-clock time inside `timeZone`
 * and return the corresponding absolute instant (UTC Date).
 */
export function zonedWallTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  const offset1 = getTimeZoneOffsetMinutes(timeZone, new Date(guess))
  let utc = guess - offset1 * 60000
  const offset2 = getTimeZoneOffsetMinutes(timeZone, new Date(utc))
  if (offset2 !== offset1) {
    utc = guess - offset2 * 60000
  }
  return new Date(utc)
}

export function getZoneAbbreviation(timeZone: string, date: Date): string {
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
  const part = dtf.formatToParts(date).find((p) => p.type === 'timeZoneName')
  return part?.value ?? timeZone
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`
}

export function formatClock(date: Date, timeZone: string): { time: string; date: string } {
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
  return { time, date: dateStr }
}

/** Parts of `date` as displayed in `timeZone`, useful for pre-filling a datetime-local input. */
export function zonedParts(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = dtf.formatToParts(date)
  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  }
}
