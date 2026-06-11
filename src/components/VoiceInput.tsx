'use client'

import { useState, useRef, useEffect } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [supported, setSupported] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimText = ''
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      if (finalText) {
        onTranscript(finalText)
        setInterim('')
      } else {
        setInterim(interimText)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      setInterim('')
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterim('')
    }

    recognitionRef.current = recognition
  }, [onTranscript])

  function toggle() {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  if (!supported) {
    return (
      <div className="text-sm text-stone-400 bg-stone-50 rounded-lg px-3 py-2 border border-stone-200">
        Voice input is not supported in this browser. Try Chrome or Edge.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={toggle}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
            : 'bg-amber-500 hover:bg-amber-600 text-white'
        }`}
      >
        <span className={isListening ? 'animate-pulse-mic text-xl' : 'text-xl'}>
          {isListening ? '🔴' : '🎙️'}
        </span>
        {isListening ? 'Stop recording' : 'Start speaking'}
      </button>

      {isListening && (
        <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-amber-600 font-medium mb-1">
            <span className="animate-pulse-mic">●</span> Listening…
          </div>
          {interim && <p className="text-stone-500 italic">{interim}</p>}
        </div>
      )}
    </div>
  )
}
