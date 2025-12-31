import { createVCDealFlowGraph } from '@/lib/langgraph'
import { Chunk, StartupMatch, Citation } from '@/types'

export interface VCDealFlowInput {
  sector: string[]
  stage: string
  ticketSize: {
    min: number
    max: number
  }
}

export interface VCDealFlowOutput {
  matches: StartupMatch[]
  report: string
  citations: Citation[]
}

export async function runVCDealFlow(input: VCDealFlowInput): Promise<VCDealFlowOutput> {
  const graph = createVCDealFlowGraph()

  const initialState = {
    sector: input.sector,
    stage: input.stage,
    ticketSize: input.ticketSize,
    matchedChunks: [],
    validatedMatches: [],
    rerankedMatches: [],
    report: '',
  }

  const result = await graph.invoke(initialState)

  const matches: StartupMatch[] = result.rerankedMatches.map((chunk: Chunk, index: number) => ({
    id: chunk.id,
    name: chunk.metadata.fileName?.replace('.pdf', '') || `Startup ${index + 1}`,
    sector: Array.isArray(chunk.metadata.sector) 
      ? chunk.metadata.sector.join(', ') 
      : chunk.metadata.sector || 'Unknown',
    stage: chunk.metadata.stage || 'Unknown',
    score: 0.8 - (index * 0.05),
    description: chunk.content.slice(0, 500),
    citations: [{
      source: chunk.metadata.fileName || 'Document',
      excerpt: chunk.content.slice(0, 200),
    }],
  }))

  const citations: Citation[] = result.rerankedMatches.map((chunk: Chunk) => ({
    source: chunk.metadata.fileName || 'Document',
    excerpt: chunk.content.slice(0, 200),
  }))

  return {
    matches,
    report: result.report,
    citations,
  }
}

