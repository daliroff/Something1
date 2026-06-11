import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import EntryCard from '@/components/EntryCard'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const entries = await prisma.entry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEntries = entries.filter((e) => new Date(e.createdAt) >= today)
  const olderEntries = entries.filter((e) => new Date(e.createdAt) < today)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              Hello, {session.user.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-stone-500 mt-0.5">
              {entries.length === 0
                ? 'Start your journey — write your first entry!'
                : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} in your diary`}
            </p>
          </div>
          <Link href="/entry/new" className="btn-primary">
            + New Entry
          </Link>
        </div>

        {entries.length === 0 ? (
          /* Empty state */
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📖</div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Your diary is empty</h2>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto">
              Every great story starts with a single line. Write or speak your first entry today.
            </p>
            <Link href="/entry/new" className="btn-primary inline-block">
              Write my first entry
            </Link>
          </div>
        ) : (
          <>
            {todayEntries.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">Today</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={{ ...entry, createdAt: entry.createdAt.toISOString() }} />
                  ))}
                </div>
              </section>
            )}

            {olderEntries.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">
                  {todayEntries.length > 0 ? 'Earlier' : 'All Entries'}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {olderEntries.map((entry) => (
                    <EntryCard key={entry.id} entry={{ ...entry, createdAt: entry.createdAt.toISOString() }} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
