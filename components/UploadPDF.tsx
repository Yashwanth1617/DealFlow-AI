'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type UploadPDFProps = {
  onUploadSuccess: (fileName: string) => void
}

export default function UploadPDF({ onUploadSuccess }: UploadPDFProps) {
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null)
    })
  }, [])

  const handleUpload = async () => {
    if (!file || !userId) {
      setError('User not authenticated or no file selected')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // 🔑 THIS IS WHY THE PROP EXISTS
      onUploadSuccess(data.filename)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Uploading...' : 'Upload Pitch Deck'}
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
