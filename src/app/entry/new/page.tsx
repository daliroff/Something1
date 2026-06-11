'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewEntryPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleTranscript = useCallback((text: string) => {
    setContent((prev) => (prev ? prev + ' ' + text : text))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Please add a title.'); return }
    if (!content.trim()) { setError('Please add some content.'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, mood, inputType: mode }),
      })
      if (!res.ok) throw new Error()
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Failed to save entry. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9ef 0%, #fef3c7 100%)' }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-800">New Entry</h1>
          <p className="text-stone-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="card">
            <label className="block text-sm font-medium text-stone-700 mb-2">Entry title</label>
            <input
              type="text"
              placeholder="What's today about?"
              className="input-field text-lg font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Mood */}
          <div className="card">
            <label className="block text-sm font-medium text-stone-700 mb-3">How are you feeling?</label>
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

          {/* Input mode selector */}
          <div className="card">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode('text')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'text' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                }`}
              >
                ✍️ Write
              </button>
              <button
                type="button"
                onClick={() => setMode('voice')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'voice' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-stone-600 hover:bg-amber-100'
                }`}
              >
                🎙️ Speak
              </button>
            </div>

            {mode === 'voice' && (
              <div className="mb-4">
                <VoiceInput onTranscript={handleTranscript} />
                <p className="text-xs text-stone-400 mt-2">
                  Transcribed speech will appear in the text area below. You can edit it freely.
                </p>
              </div>
            )}

            <label className="block text-sm font-medium text-stone-700 mb-2">
              {mode === 'voice' ? 'Transcribed content (editable)' : 'Your entry'}
            </label>
            <textarea
              placeholder={
                mode === 'voice'
                  ? 'Start speaking above — your words will appear here…'
                  : 'Write about your day, your thoughts, your feelings…'
              }
              rows={10}
              className="input-field resize-y font-serif leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-stone-400 mt-1 text-right">{content.length} chars</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-60">
              {saving ? 'Saving…' : '💾 Save Entry'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
