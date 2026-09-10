'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-amber-800">
          <span>📖</span> DayDiary
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/timezone" className="btn-secondary text-sm hidden sm:inline-flex">
            🌍 Time Converter
          </Link>
          <Link href="/entry/new" className="btn-primary text-sm hidden sm:inline-flex">
            + New Entry
          </Link>

          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-sm">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium">{session.user.name}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-amber-100 py-2 w-48 z-50">
                  <Link
                    href="/entry/new"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 sm:hidden"
                    onClick={() => setMenuOpen(false)}
                  >
                    + New Entry
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Diary
                  </Link>
                  <hr className="my-1 border-amber-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
