import { createFounderRAGGraph } from '@/lib/langgraph'
import { Chunk, Citation } from '@/types'

export interface FounderRAGInput {
  query: string
  userId?: string
}

export interface FounderRAGOutput {
  response: string
  citations: Citation[]
  originalLanguage: string
}

export async function runFounderRAG(input: FounderRAGInput): Promise<FounderRAGOutput> {
  const graph = createFounderRAGGraph()

  const initialState = {
    query: input.query,
    originalLanguage: 'en',
    translatedQuery: '',
    queryVector: [],
    retrievedChunks: [],
    validatedChunks: [],
    rerankedChunks: [],
    citations: [],
    response: '',
    finalResponse: '',
  }

  const result = await graph.invoke(initialState)

  return {
    response: result.finalResponse || result.response,
    citations: result.citations || [],
    originalLanguage: result.originalLanguage || 'en',
  }
}

