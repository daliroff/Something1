'use client'

import { STATE_SHAPES, US_MAP_VIEWBOX, UsZone } from '@/lib/usStates'
import { ZoneId, formatClock, formatOffset, getTimeZoneOffsetMinutes, getZoneAbbreviation } from '@/lib/timezones'

const ZONE_TO_IANA: Record<UsZone, ZoneId> = {
  pacific: 'America/Los_Angeles',
  mountain: 'America/Denver',
  central: 'America/Chicago',
  eastern: 'America/New_York',
}

const ZONE_ORDER: UsZone[] = ['pacific', 'mountain', 'central', 'eastern']

const ZONE_LABELS: Record<UsZone, string> = {
  pacific: 'Pacific Time',
  mountain: 'Mountain Time',
  central: 'Central Time',
  eastern: 'Eastern Time',
}

// Bold, time.gov-inspired palette — orange / green / gold / red — rather than the app's usual pastel accents.
const ZONE_COLORS: Record<UsZone, { fill: string; fillSelected: string; text: string; badgeBg: string }> = {
  pacific: { fill: '#f97316', fillSelected: '#c2410c', text: '#c2410c', badgeBg: '#ffedd5' },
  mountain: { fill: '#22c55e', fillSelected: '#15803d', text: '#15803d', badgeBg: '#dcfce7' },
  central: { fill: '#f59e0b', fillSelected: '#b45309', text: '#b45309', badgeBg: '#fef3c7' },
  eastern: { fill: '#ef4444', fillSelected: '#b91c1c', text: '#b91c1c', badgeBg: '#fee2e2' },
}

const CITY_MARKERS: { zone: UsZone; label: string; x: number; y: number; labelDx: number; labelDy: number }[] = [
  { zone: 'pacific', label: 'Los Angeles', x: 210, y: 481, labelDx: 10, labelDy: -8 },
  { zone: 'mountain', label: 'Denver', x: 480, y: 416, labelDx: 10, labelDy: -8 },
  { zone: 'central', label: 'Chicago', x: 794, y: 300, labelDx: 10, labelDy: -8 },
  { zone: 'eastern', label: 'New York', x: 1008, y: 305, labelDx: -100, labelDy: -8 },
]

const ARIZONA = STATE_SHAPES.find((s) => s.id === 'AZ')!

interface UsTimeZoneMapProps {
  now: Date | null
  selectedZone: ZoneId
  onSelectZone: (zone: ZoneId) => void
}

export default function UsTimeZoneMap({ now, selectedZone, onSelectZone }: UsTimeZoneMapProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold text-stone-800 mb-1">Live US Time Zones</h2>
      <p className="text-sm text-stone-500 mb-4">
        Click a zone header, a region on the map, or a city to set it as the converter&apos;s source zone.
      </p>

      {/* Bold per-zone status bars, time.gov-style, fused with the map below rather than a separate clock list */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {ZONE_ORDER.map((zone) => {
          const iana = ZONE_TO_IANA[zone]
          const isSelected = iana === selectedZone
          const colors = ZONE_COLORS[zone]
          const abbr = now ? getZoneAbbreviation(iana, now) : ''
          const offset = now ? formatOffset(getTimeZoneOffsetMinutes(iana, now)) : ''
          const time = now ? formatClock(now, iana).time : '--:--:--'

          return (
            <button
              key={zone}
              type="button"
              onClick={() => onSelectZone(iana)}
              className="text-left rounded-xl border-2 p-3 transition-all"
              style={{
                background: colors.badgeBg,
                borderColor: isSelected ? colors.fillSelected : 'transparent',
              }}
            >
              <div className="flex items-center justify-between mb-1 gap-1">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide" style={{ color: colors.text }}>
                  {ZONE_LABELS[zone]}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold shrink-0" style={{ color: colors.text }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.text }} />
                  LIVE
                </span>
              </div>
              <div className="text-[10px] font-mono text-stone-500 mb-1">
                {abbr} ({offset})
              </div>
              <div className="font-mono text-lg sm:text-xl font-bold text-stone-900 tabular-nums">{time}</div>
              <div className="h-1 rounded-full mt-2" style={{ background: colors.fillSelected }} />
            </button>
          )
        })}
      </div>

      <svg viewBox={US_MAP_VIEWBOX} className="w-full h-auto" role="img" aria-label="Map of US time zones">
        <defs>
          <pattern id="az-dst-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeWidth="2.5" opacity="0.65" />
          </pattern>
        </defs>

        {STATE_SHAPES.map((state) => {
          const iana = ZONE_TO_IANA[state.zone]
          const isSelected = iana === selectedZone
          const colors = ZONE_COLORS[state.zone]
          return (
            <path
              key={state.id}
              d={state.d}
              fill={isSelected ? colors.fillSelected : colors.fill}
              stroke="#ffffff"
              strokeWidth={1}
              className="cursor-pointer transition-colors duration-150 hover:brightness-95"
              onClick={() => onSelectZone(iana)}
            >
              <title>{`${state.name} — ${state.zone[0].toUpperCase()}${state.zone.slice(1)} Time`}</title>
            </path>
          )
        })}

        {/* Arizona observes Mountain Standard Time year-round — hatch it like time.gov flags no-DST zones */}
        <path d={ARIZONA.d} fill="url(#az-dst-hatch)" pointerEvents="none">
          <title>Arizona — Mountain Standard Time year-round (no Daylight Saving)</title>
        </path>

        {CITY_MARKERS.map((c) => {
          const iana = ZONE_TO_IANA[c.zone]
          const isSelected = iana === selectedZone
          return (
            <g key={c.label} className="cursor-pointer" onClick={() => onSelectZone(iana)}>
              <circle cx={c.x} cy={c.y} r={isSelected ? 9 : 7} fill="#1c1917" stroke="#fff" strokeWidth={2} />
              <text
                x={c.x + c.labelDx}
                y={c.y + c.labelDy}
                fontSize={22}
                fontWeight={700}
                fill="#1c1917"
                stroke="#fff"
                strokeWidth={4}
                paintOrder="stroke"
              >
                {c.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-stone-600">
        {ZONE_ORDER.map((zone) => (
          <div key={zone} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: ZONE_COLORS[zone].fill }} />
            <span>{ZONE_LABELS[zone]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{
              background: ZONE_COLORS.mountain.fill,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.75) 0 1.5px, transparent 1.5px 4px)',
            }}
          />
          <span>Arizona (no DST)</span>
        </div>
      </div>
    </div>
  )
}
