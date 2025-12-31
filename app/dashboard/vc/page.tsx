'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { StartupMatch, Citation } from '@/types'
import ReactMarkdown from 'react-markdown'

export default function VCPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sector, setSector] = useState<string[]>([])
  const [stage, setStage] = useState('')
  const [ticketMin, setTicketMin] = useState('')
  const [ticketMax, setTicketMax] = useState('')
  const [matches, setMatches] = useState<StartupMatch[]>([])
  const [report, setReport] = useState('')
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    })
  }, [router])

  const sectors = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'SaaS',
    'E-commerce',
    'AI/ML',
    'Blockchain',
    'Biotech',
    'CleanTech',
    'Other',
  ]

  const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+']

  const handleSectorToggle = (selectedSector: string) => {
    setSector((prev) =>
      prev.includes(selectedSector)
        ? prev.filter((s) => s !== selectedSector)
        : [...prev, selectedSector]
    )
  }

  const handleSearch = async () => {
    if (sector.length === 0 || !stage || !ticketMin || !ticketMax) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    setMatches([])
    setReport('')
    setCitations([])

    try {
      const response = await fetch('/api/vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector,
          stage,
          ticketSize: {
            min: parseInt(ticketMin) * 1000,
            max: parseInt(ticketMax) * 1000,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setMatches(data.matches || [])
      setReport(data.report || '')
      setCitations(data.citations || [])
    } catch (error: any) {
      console.error('VC search error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">VC Dashboard</h1>
        <p className="text-gray-600">
          Define your investment thesis and discover matching startups
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Investment Criteria</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector (Select one or more)
            </label>
            <div className="flex flex-wrap gap-2">
              {sectors.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSectorToggle(s)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    sector.includes(s)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select stage</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Size Min (in K)
              </label>
              <input
                type="number"
                value={ticketMin}
                onChange={(e) => setTicketMin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Size Max (in K)
              </label>
              <input
                type="number"
                value={ticketMax}
                onChange={(e) => setTicketMax(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 5000"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Find Matching Startups'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="animate-pulse">Searching for matching startups...</div>
        </div>
      )}

      {report && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Deal Flow Report</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Matched Startups</h2>
          {matches.map((match, index) => (
            <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{match.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Sector: {match.sector}</span>
                    <span>Stage: {match.stage}</span>
                    <span>Score: {(match.score * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  #{index + 1}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{match.description}</p>
              {match.citations && match.citations.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Sources:</p>
                  {match.citations.map((citation, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      [{i + 1}] {citation.source}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {citations.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">All Citations</h3>
          <div className="space-y-3">
            {citations.map((citation, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <p className="text-sm font-medium text-gray-700">
                  [{index + 1}] {citation.source}
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

