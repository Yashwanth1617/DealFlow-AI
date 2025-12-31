'use client'

import { useState } from 'react'

export default function QueryBox({
  onQuery,
  loading
}: {
  onQuery: (query: string) => void
  loading: boolean
}) {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question in English, Hindi, or Tamil"
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={() => onQuery(query)}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Asking...' : 'Ask'}
      </button>
    </div>
  )
}
