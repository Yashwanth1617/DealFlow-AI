import weaviate, { WeaviateClient } from 'weaviate-ts-client'
import { Chunk } from '../types/index'

const weaviateUrl = process.env.WEAVIATE_URL || ''
const weaviateApiKey = process.env.WEAVIATE_API_KEY || ''

const CLASS_NAME = 'VentureGraphDocuments'

let client: WeaviateClient | null = null

export function getWeaviateClient(): WeaviateClient {
  if (!client) {
    client = weaviate.client({
      scheme: 'https',
      host: weaviateUrl.replace('https://', '').replace('http://', ''),
      apiKey: new weaviate.ApiKey(weaviateApiKey),
    })
  }
  return client
}

/**
 * Schema already exists — DO NOTHING
 */
export async function createSchema() {
  console.log('Using existing Weaviate schema:', CLASS_NAME)
}

/**
 * Store PDF chunks
 */
export async function storeChunks(
  chunks: Chunk[],
  embeddings: number[][],
  fileName: string
) {
  const weaviateClient = getWeaviateClient()
  const batcher = weaviateClient.batch.objectsBatcher()

  for (let i = 0; i < chunks.length; i++) {
    batcher.withObject({
      class: CLASS_NAME,
      properties: {
        text: chunks[i].content,
        page: chunks[i].metadata.page ?? 0,
        source: fileName,
      },
      vector: embeddings[i],
    })
  }

  await batcher.do()
}

/**
 * Hybrid search
 */
export async function hybridSearch(
  query: string,
  queryVector: number[],
  limit = 10
): Promise<Chunk[]> {
  const weaviateClient = getWeaviateClient()

  const result = await weaviateClient.graphql
    .get()
    .withClassName(CLASS_NAME)
    .withFields(`
      text
      page
      source
      _additional { id }
    `)
    .withHybrid({
      query,
      vector: queryVector,
      alpha: 0.7,
    })
    .withLimit(limit)
    .do()

  const docs = result.data?.Get?.[CLASS_NAME] || []

  return docs.map((doc: any) => ({
    id: doc._additional.id,
    content: doc.text,
    metadata: {
      page: doc.page,
      fileName: doc.source,
    },
  }))
}

export async function searchByCriteria(
  sector?: string[],
  stage?: string,
  ticketSize?: { min: number; max: number },
  limit = 20
) {
  const client = getWeaviateClient()

  const result = await client.graphql
    .get()
    .withClassName(CLASS_NAME)
    .withFields(`
      content
      userId
      fileName
      page
      sector
      stage
      ticketSize
      _additional { id }
    `)
    .withLimit(limit)
    .do()

  const docs = result.data?.Get?.[CLASS_NAME] ?? []

  return docs.filter((doc: any) => {
    if (sector && sector.length && !sector.some(s => doc.sector?.includes(s))) {
      return false
    }
    if (stage && doc.stage !== stage) return false
    if (ticketSize) {
      const size = doc.ticketSize ?? 0
      return size >= ticketSize.min && size <= ticketSize.max
    }
    return true
  })
}
