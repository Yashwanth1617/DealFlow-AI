'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    pitchDecks: 0,
    queries: 0,
    startups: 0,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        router.push('/dashboard')
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        router.push('/dashboard')
      }
    })

    // Mock stats for demo
    setStats({
      pitchDecks: 1247,
      queries: 8934,
      startups: 342,
    })
  }, [router])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Startup Funding AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Multilingual RAG-based Intelligence Platform for Founders and VCs
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {stats.pitchDecks.toLocaleString()}
          </div>
          <div className="text-gray-600">Pitch Decks Processed</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {stats.queries.toLocaleString()}
          </div>
          <div className="text-gray-600">Queries Answered</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {stats.startups.toLocaleString()}
          </div>
          <div className="text-gray-600">Startups Matched</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">For Founders</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Upload your pitch deck and get AI-powered insights</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Ask questions in English, Hindi, or Tamil</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Voice and text input support</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Generate investment memos with citations</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">For VCs</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Define your investment thesis and criteria</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>AI-powered startup matching</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Background checks via Tavily API</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              <span>Ranked deal flow reports</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Powered by Advanced AI</h2>
        <p className="text-gray-700 mb-6">
          Built with Next.js, Supabase, Weaviate, DeepSeek-V3, Jina Reranker, Tavily, and LangGraph
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="bg-white px-4 py-2 rounded">Hybrid Search</span>
          <span className="bg-white px-4 py-2 rounded">Multilingual Support</span>
          <span className="bg-white px-4 py-2 rounded">Citation-Backed</span>
          <span className="bg-white px-4 py-2 rounded">Voice Input</span>
        </div>
      </div>
    </div>
  )
}

