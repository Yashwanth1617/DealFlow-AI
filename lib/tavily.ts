import axios from 'axios'
import { TavilyResult } from '@/types'

const tavilyApiKey = process.env.TAVILY_API_KEY || ''

export async function searchTavily(query: string, maxResults: number = 5): Promise<TavilyResult[]> {
  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: tavilyApiKey,
        query,
        search_depth: 'basic',
        max_results: maxResults,
        include_answer: false,
        include_raw_content: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const results: TavilyResult[] = []
    if (response.data.results) {
      for (const result of response.data.results) {
        results.push({
          title: result.title || '',
          url: result.url || '',
          content: result.content || result.raw_content || '',
          score: result.score,
        })
      }
    }

    return results
  } catch (error: any) {
    console.error('Tavily search error:', error.response?.data || error.message)
    return []
  }
}

export async function validateContext(context: string, query: string): Promise<boolean> {
  const tavilyResults = await searchTavily(query, 3)
  
  if (tavilyResults.length === 0) return true

  const contextLower = context.toLowerCase()
  let matchCount = 0

  for (const result of tavilyResults) {
    const resultLower = result.content.toLowerCase()
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3)
    
    for (const keyword of keywords) {
      if (contextLower.includes(keyword) && resultLower.includes(keyword)) {
        matchCount++
        break
      }
    }
  }

  return matchCount >= 1
}

export async function backgroundCheck(companyName: string): Promise<TavilyResult[]> {
  const query = `${companyName} startup funding news`
  return await searchTavily(query, 5)
}

