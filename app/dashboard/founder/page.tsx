'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import UploadPDF from '@/components/UploadPDF'
import QueryBox from '@/components/QueryBox'
import Results from '@/components/Results'
import { Citation } from '@/types'

export default function FounderPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUserId(data.session.user.id)
      }
    })
  }, [router])

  const handleQuery = async (query: string) => {
    if (!query.trim() || !userId) return

    setLoading(true)
    setResponse('')
    setCitations([])

    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Query failed')
      }

      setResponse(data.response || '')
      setCitations(data.citations || [])
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFile(fileName)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Founder Dashboard</h1>
        <p className="text-gray-600">
          Upload your pitch deck and ask questions in English, Hindi, or Tamil
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <UploadPDF onUploadSuccess={handleUploadSuccess} />
          {uploadedFile && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ Ready to query: {uploadedFile}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Ask Questions</h2>
          <QueryBox onQuery={handleQuery} loading={loading} />
        </div>
      </div>

      <Results response={response} citations={citations} loading={loading} />
    </div>
  )
}
