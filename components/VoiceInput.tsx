'use client'

import { useState, useEffect } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
}

export default function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
  }, [])

  const startListening = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognition.onresult = (event: any) => {
      const transcriptText = event.results[0][0].transcript
      setTranscript(transcriptText)
      onTranscript(transcriptText)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const stopListening = () => {
    setIsListening(false)
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Voice input is not supported in your browser
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-md font-medium ${
          isListening
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {isListening ? '🛑 Stop Recording' : '🎤 Start Voice Input'}
      </button>
      {transcript && (
        <div className="flex-1 p-2 bg-gray-100 rounded-md text-sm">
          {transcript}
        </div>
      )}
    </div>
  )
}

