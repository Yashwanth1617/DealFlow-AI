import { translateText, detectLanguage, generateReasoning } from './openai'
import { hybridSearch, searchByCriteria } from './weaviate'
import { generateEmbedding } from './embeddings'
import { validateContext } from './tavily'
import { rerankDocuments } from './jina'
import { Chunk, Citation } from '@/types'

/* ===================== Founder RAG ===================== */

interface FounderRAGState {
  query: string
  originalLanguage: 'en' | 'hi' | 'ta'
  translatedQuery: string
  queryVector: number[]
  retrievedChunks: Chunk[]
  validatedChunks: Chunk[]
  rerankedChunks: Chunk[]
  citations: Citation[]
  response: string
  finalResponse: string
}

export async function runFounderRAGPipeline(
  state: FounderRAGState
): Promise<FounderRAGState> {
  const currentState: FounderRAGState = {
    ...state,
    translatedQuery: '',
    queryVector: [],
    retrievedChunks: [],
    validatedChunks: [],
    rerankedChunks: [],
    citations: [],
    response: '',
    finalResponse: '',
  }

  /* 1️⃣ Detect language */
  const detected = (await detectLanguage(currentState.query)) as
    | 'en'
    | 'hi'
    | 'ta'
  currentState.originalLanguage = detected

  /* 2️⃣ Translate to English if needed */
  currentState.translatedQuery =
    detected === 'en'
      ? currentState.query
      : await translateText(currentState.query, 'en')

  /* 3️⃣ Embed query */
  currentState.queryVector = await generateEmbedding(
    currentState.translatedQuery
  )

  /* 4️⃣ Retrieve from Weaviate */
  currentState.retrievedChunks = await hybridSearch(
    currentState.translatedQuery,
    currentState.queryVector,
    20
  )

  /* 5️⃣ Validate context */
  for (const chunk of currentState.retrievedChunks) {
    const ok = await validateContext(
      chunk.content,
      currentState.translatedQuery
    )
    if (ok) currentState.validatedChunks.push(chunk)
  }

  if (currentState.validatedChunks.length === 0) {
    currentState.validatedChunks = currentState.retrievedChunks
  }

  /* 6️⃣ Rerank (ONLY if docs exist) */
  if (currentState.validatedChunks.length > 0) {
    try {
      const rerank = await rerankDocuments({
        query: currentState.translatedQuery,
        documents: currentState.validatedChunks.map(c => ({
          text: c.content,
        })),
        top_n: 10,
      })

      currentState.rerankedChunks = (rerank ?? [])
        .map(r => currentState.validatedChunks[r.index])
        .filter(Boolean)
    } catch {
      // fallback if Jina fails
      currentState.rerankedChunks = currentState.validatedChunks.slice(0, 5)
    }
  }

  /* 7️⃣ Build context & citations */
  const context = currentState.rerankedChunks
    .map(c => c.content)
    .join('\n\n')

  currentState.citations = currentState.rerankedChunks.map(c => ({
    source: c.metadata.fileName || 'Document',
    page: c.metadata.page,
    excerpt: c.content.slice(0, 200),
  }))

  /* 8️⃣ Generate answer (SAFE MODE) */
  if (!context.trim()) {
    currentState.response =
      'No relevant information found in the uploaded documents.'
  } else {
    try {
      currentState.response = await generateReasoning(
        currentState.translatedQuery,
        context,
        currentState.citations
      )
    } catch {
      // 🚑 OpenAI quota / billing fallback
      currentState.response =
        'AI reasoning is temporarily unavailable.\n\nRelevant extracted information:\n\n' +
        context.slice(0, 1200)
    }
  }

  /* 9️⃣ Translate back */
  currentState.finalResponse =
    currentState.originalLanguage === 'en'
      ? currentState.response
      : await translateText(
          currentState.response,
          currentState.originalLanguage
        )

  return currentState
}

/* Factory for API / UI */
export const createFounderRAGGraph = () => ({
  invoke: async (state: FounderRAGState) => runFounderRAGPipeline(state),
})

/* ===================== VC DEAL FLOW ===================== */

interface VCDealFlowState {
  sector: string[]
  stage: string
  ticketSize: { min: number; max: number }
  matchedChunks: Chunk[]
  validatedMatches: Chunk[]
  rerankedMatches: Chunk[]
  report: string
}

export async function runVCDealFlowPipeline(
  state: VCDealFlowState
): Promise<VCDealFlowState> {
  const currentState: VCDealFlowState = {
    ...state,
    matchedChunks: [],
    validatedMatches: [],
    rerankedMatches: [],
    report: '',
  }

  /* 1️⃣ Search by criteria */
  currentState.matchedChunks = await searchByCriteria(
    currentState.sector,
    currentState.stage,
    currentState.ticketSize,
    30
  )

  if (currentState.matchedChunks.length === 0) {
    currentState.report = 'No startups matched the given criteria.'
    return currentState
  }

  /* 2️⃣ Rerank */
  try {
    const rerank = await rerankDocuments({
      query: `${currentState.sector.join(' ')} ${currentState.stage} startup`,
      documents: currentState.matchedChunks.map(c => ({
        text: c.content,
      })),
      top_n: 10,
    })

    currentState.rerankedMatches = (rerank ?? [])
      .map(r => currentState.matchedChunks[r.index])
      .filter(Boolean)
  } catch {
    currentState.rerankedMatches = currentState.matchedChunks.slice(0, 5)
  }

  /* 3️⃣ Generate report (SAFE) */
  const context = currentState.rerankedMatches
    .map((c, i) => `Startup ${i + 1}:\n${c.content}`)
    .join('\n\n')

  try {
    currentState.report = await generateReasoning(
      'Generate a deal flow report',
      context,
      currentState.rerankedMatches.map(c => ({
        source: c.metadata.fileName || 'Document',
        excerpt: c.content.slice(0, 200),
      }))
    )
  } catch {
    currentState.report =
      'AI report generation unavailable.\n\nRelevant extracted information:\n\n' +
      context.slice(0, 1200)
  }

  return currentState
}
