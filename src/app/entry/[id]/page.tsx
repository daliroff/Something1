'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VoiceInput from '@/components/VoiceInput'

const MOODS = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🥰', label: 'Grateful' },
  { emoji: '😴', label: 'Tired' },
]

interface Entry {
  id: string
  title: string
  content: string
  mood: string | null
  inputType: string
  createdAt: string
  updatedAt: string
}

export default function EntryPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [voiceMode, setVoiceMode] = useState(false)

  useEffect(() => {
    fetch(`/api/entries/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEntry(data)
        setTitle(data.title)
        setContent(data.content)
        setMood(data.mood || '')
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError('Entry not found.')
      })
  }, [id])

  const handleTranscript = useCallback((text: string) => {
    setContent((prev) => (prev ? prev + ' ' + text : text))
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, mood }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setEntry(updated)
      setEditing(false)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this entry? This cannot be undone.')) return
    setDeleting(true)
    try {
      await fetch(`/api/entries/${id}`, { method: 'DELETE' })
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Failed to delete entry.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <div className="text-stone-400">Loading…</div>
        </div>
      </div>
    )
  }

  if (error && !entry) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold text-stone-700 mb-2">Entry not found</h1>
          <p className="text-stone-500 mb-6">This entry may have been deleted or doesn't exist.</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            Back to diary
          </button>
        </div>
      </div>
    )
  }

  const createdAt = new Date(entry!.createdAt)
  const updatedAt = new Date(entry!.updatedAt)
  const wasEdited = Math.abs(updatedAt.getTime() - createdAt.getTime()) > 5000

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1 mb-6"
        >
          ← Back to diary
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="card">
          {/* Meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-stone-400">
              {createdAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              {wasEdited && ' · edited'}
            </div>
            <div className="flex items-center gap-2">
              {entry!.inputType === 'voice' && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  🎙️ Voice
                </span>
              )}
            </div>
          </div>

          {editing ? (
            /* Edit mode */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  className="input-field text-lg font-medium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.emoji}
                      type="button"
                      onClick={() => setMood(mood === m.emoji ? '' : m.emoji)}
                      title={m.label}
                      className={`text-2xl p-2 rounded-lg transition-all duration-150 hover:scale-110 ${
                        mood === m.emoji ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:bg-amber-50'
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-stone-700">Content</label>
                  <button
                    type="button"
                    onClick={() => setVoiceMode(!voiceMode)}
                    className="text-xs text-amber-600 hover:text-amber-700"
                  >
                    {voiceMode ? '✍️ Text mode' : '🎙️ Add by voice'}
                  </button>
                </div>
                {voiceMode && (
                  <div className="mb-3">
                    <VoiceInput onTranscript={handleTranscript} />
                  </div>
                )}
                <textarea
                  rows={12}
                  className="input-field resize-y font-serif leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5 disabled:opacity-60">
                  {saving ? 'Saving…' : '💾 Save changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setTitle(entry!.title)
                    setContent(entry!.content)
                    setMood(entry!.mood || '')
                    setVoiceMode(false)
                    setError('')
                  }}
                  className="btn-secondary px-6 py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div>
              <div className="flex items-start gap-3 mb-4">
                {entry!.mood && <span className="text-3xl shrink-0">{entry!.mood}</span>}
                <h1 className="text-2xl font-bold text-stone-800">{entry!.title}</h1>
              </div>

              <div className="prose prose-stone max-w-none">
                {entry!.content.split('\n').map((line, i) => (
                  <p key={i} className={`font-serif leading-relaxed text-stone-700 ${line === '' ? 'mt-3' : ''}`}>
                    {line || ' '}
                  </p>
                ))}
              </div>

              <div className="flex gap-3 mt-8 pt-5 border-t border-amber-100">
                <button onClick={() => setEditing(true)} className="btn-secondary flex-1 py-2.5">
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger px-5 py-2.5 disabled:opacity-60"
                >
                  {deleting ? 'Deleting…' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
