'use client'

import Link from 'next/link'

interface Entry {
  id: string
  title: string
  content: string
  mood: string | null
  inputType: string
  createdAt: string
}

export default function EntryCard({ entry }: { entry: Entry }) {
  const date = new Date(entry.createdAt)
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const preview = entry.content.slice(0, 180).replace(/\n/g, ' ')

  return (
    <Link href={`/entry/${entry.id}`} className="block group">
      <div className="card hover:shadow-md transition-all duration-200 group-hover:border-amber-200 h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {entry.mood && <span className="text-xl">{entry.mood}</span>}
            {entry.inputType === 'voice' && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                🎙️ Voice
              </span>
            )}
          </div>
          <div className="text-xs text-stone-400 shrink-0 ml-2">{time}</div>
        </div>

        <h3 className="font-semibold text-stone-800 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {entry.title}
        </h3>

        <p className="text-stone-500 text-sm line-clamp-3 leading-relaxed">{preview}</p>

        <div className="mt-3 text-xs text-stone-400">{formatted}</div>
      </div>
    </Link>
  )
}
