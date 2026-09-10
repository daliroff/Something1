import type { Metadata } from 'next'
import Link from 'next/link'
import LiveClockGrid from '@/components/timezone/LiveClockGrid'
import TimeZoneConverter from '@/components/timezone/TimeZoneConverter'

export const metadata: Metadata = {
  title: 'US ⇄ Uzbekistan Time Converter | DayDiary',
  description:
    'Live time tracker and converter between U.S. time zones (Pacific, Mountain, Central, Eastern) and Uzbekistan time (Tashkent).',
}

export default function TimeZonePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="text-xl font-bold text-amber-800">DayDiary</span>
        </Link>
        <Link href="/" className="btn-secondary text-sm">
          ← Back home
        </Link>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-6 pb-10 text-center">
        <div className="text-5xl mb-4">🌍🕒</div>
        <h1 className="text-4xl font-bold text-stone-800 mb-3">US ⇄ Uzbekistan Time Converter</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          A live world clock and converter for Pacific (PT), Mountain (MT), Central (CT) and Eastern (ET) time
          against Uzbekistan Time (Tashkent) — daylight saving is handled automatically, just like time.gov.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-10">
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">Live Time Tracker</h2>
          <LiveClockGrid />
        </section>

        <section>
          <TimeZoneConverter />
        </section>
      </main>

      <footer className="text-center py-8 text-stone-400 text-sm">
        © {new Date().getFullYear()} DayDiary — Times update automatically for daylight saving.
      </footer>
    </div>
  )
}
