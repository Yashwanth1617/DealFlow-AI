import { NextRequest, NextResponse } from 'next/server'
import { runVCDealFlow } from '@/pipelines/vcDealFlow'

export async function POST(request: NextRequest) {
  try {
    const { sector, stage, ticketSize, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await runVCDealFlow({
      sector,
      stage,
      ticketSize
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Voice error:', error)
    return NextResponse.json(
      { error: error.message || 'Voice failed' },
      { status: 500 }
    )
  }
}
