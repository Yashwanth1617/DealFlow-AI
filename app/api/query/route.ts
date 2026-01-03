import { NextRequest, NextResponse } from 'next/server'
import { runFounderRAG } from '@/pipelines/founderRAG'

export async function POST(request: NextRequest) {
  try {
    const { query, userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const result = await runFounderRAG({
      query,
      userId
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Query error:', error)
    return NextResponse.json(
      { error: error.message || 'Query failed' },
      { status: 500 }
    )
  }
}
