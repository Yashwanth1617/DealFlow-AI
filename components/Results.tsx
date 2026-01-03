'use client'

import ReactMarkdown from 'react-markdown'
import { Citation } from '@/types'

interface ResultsProps {
  response: string
  citations: Citation[]
  loading?: boolean
}

export default function Results({ response, citations, loading }: ResultsProps) {
  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (!response) {
    return null
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Response</h3>
        <div className="prose max-w-none">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      </div>

      {citations && citations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Citations</h3>
          <div className="space-y-3">
            {citations.map((citation, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <p className="text-sm font-medium text-gray-700">
                  [{index + 1}] {citation.source}
                  {citation.page && ` - Page ${citation.page}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">{citation.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

