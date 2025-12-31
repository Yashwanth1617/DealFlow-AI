import axios from 'axios'
import { RerankResult } from '@/types'

const jinaApiKey = process.env.JINA_API_KEY || ''

export interface RerankInput {
  query: string
  documents: Array<{
    text: string
    [key: string]: any
  }>
  top_n?: number
}

export async function rerankDocuments(input: RerankInput): Promise<RerankResult[]> {
  try {
    const response = await axios.post(
      'https://api.jina.ai/v1/rerank',
      {
        model: 'jina-reranker-v2-base-multilingual',
        query: input.query,
        documents: input.documents.map(doc => doc.text),
        top_n: input.top_n || 10,
      },
      {
        headers: {
          Authorization: `Bearer ${jinaApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const results: RerankResult[] = []
    if (response.data.results) {
      for (const result of response.data.results) {
        results.push({
          index: result.index,
          relevance_score: result.relevance_score,
        })
      }
    }

    return results.sort((a, b) => b.relevance_score - a.relevance_score)
  } catch (error: any) {
    console.error('Jina rerank error:', error.response?.data || error.message)
    return input.documents.map((_, i) => ({
      index: i,
      relevance_score: 0.5,
    }))
  }
}

