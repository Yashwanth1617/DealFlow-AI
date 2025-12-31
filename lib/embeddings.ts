import axios from 'axios'
import { EmbeddingResponse } from '@/types'

const googleApiKey = process.env.GOOGLE_EMBEDDING_API_KEY || ''

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${googleApiKey}`,
      {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const embedding = response.data?.embedding?.values || response.data?.embedding || []
    if (!Array.isArray(embedding) || embedding.length === 0) {
      throw new Error('Invalid embedding response')
    }
    return embedding
  } catch (error: any) {
    console.error('Embedding generation error:', error.response?.data || error.message)
    throw new Error('Failed to generate embedding')
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []
  
  for (const text of texts) {
    const embedding = await generateEmbedding(text)
    embeddings.push(embedding)
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return embeddings
}

