'use client'

import { STATE_SHAPES, US_MAP_VIEWBOX, UsZone } from '@/lib/usStates'
import { ZoneId } from '@/lib/timezones'

const ZONE_TO_IANA: Record<UsZone, ZoneId> = {
  pacific: 'America/Los_Angeles',
  mountain: 'America/Denver',
  central: 'America/Chicago',
  eastern: 'America/New_York',
}

const ZONE_COLORS: Record<UsZone, { fill: string; fillSelected: string }> = {
  pacific: { fill: '#7dd3fc', fillSelected: '#38bdf8' },
  mountain: { fill: '#fda4af', fillSelected: '#fb7185' },
  central: { fill: '#fcd34d', fillSelected: '#f59e0b' },
  eastern: { fill: '#86efac', fillSelected: '#4ade80' },
}

const CITY_MARKERS: { zone: UsZone; label: string; x: number; y: number; labelDx: number; labelDy: number }[] = [
  { zone: 'pacific', label: 'Los Angeles', x: 210, y: 481, labelDx: 10, labelDy: -8 },
  { zone: 'mountain', label: 'Denver', x: 480, y: 416, labelDx: 10, labelDy: -8 },
  { zone: 'central', label: 'Chicago', x: 794, y: 300, labelDx: 10, labelDy: -8 },
  { zone: 'eastern', label: 'New York', x: 1008, y: 305, labelDx: -100, labelDy: -8 },
]

interface UsTimeZoneMapProps {
  selectedZone: ZoneId
  onSelectZone: (zone: ZoneId) => void
}

export default function UsTimeZoneMap({ selectedZone, onSelectZone }: UsTimeZoneMapProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold text-stone-800 mb-1">US Time Zone Map</h2>
      <p className="text-sm text-stone-500 mb-4">
        Click a region (or a city) to set it as the converter&apos;s source zone. Boundaries are simplified to the
        state level for clarity.
      </p>

      <svg viewBox={US_MAP_VIEWBOX} className="w-full h-auto" role="img" aria-label="Map of US time zones">
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

        {CITY_MARKERS.map((c) => {
          const iana = ZONE_TO_IANA[c.zone]
          const isSelected = iana === selectedZone
          return (
            <g
              key={c.label}
              className="cursor-pointer"
              onClick={() => onSelectZone(iana)}
            >
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

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-stone-600">
        {(Object.keys(ZONE_COLORS) as UsZone[]).map((zone) => (
          <div key={zone} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: ZONE_COLORS[zone].fill }} />
            <span className="capitalize">{zone} Time</span>
          </div>
        ))}
      </div>
    </div>
  )
}
