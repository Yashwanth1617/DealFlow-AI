'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RoleSelector() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'founder' | 'vc' | null>(null)

  const handleSelect = (role: 'founder' | 'vc') => {
    setSelectedRole(role)
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-center mb-8">Select Your Role</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div
          onClick={() => handleSelect('founder')}
          className="border-2 border-gray-300 rounded-lg p-8 cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Founder</h3>
            <p className="text-gray-600 mb-6">
              Upload your pitch deck and get AI-powered funding intelligence, investment memos, and answers to your questions.
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>✓ Upload & parse pitch decks</li>
              <li>✓ Multilingual Q&A (Hindi/Tamil/English)</li>
              <li>✓ Voice & text input</li>
              <li>✓ Investment memo generation</li>
              <li>✓ Citation-backed responses</li>
            </ul>
          </div>
        </div>

        <div
          onClick={() => handleSelect('vc')}
          className="border-2 border-gray-300 rounded-lg p-8 cursor-pointer hover:border-primary-500 hover:shadow-lg transition-all"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-2xl font-bold mb-4">VC / Investor</h3>
            <p className="text-gray-600 mb-6">
              Define your investment thesis and discover matching startups with AI-powered deal flow analysis.
            </p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>✓ Upload investment thesis</li>
              <li>✓ Smart startup matching</li>
              <li>✓ Background checks via Tavily</li>
              <li>✓ Ranked deal flow reports</li>
              <li>✓ Sector & stage filtering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

