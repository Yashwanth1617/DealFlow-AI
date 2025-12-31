import { NextRequest, NextResponse } from 'next/server'
import { runVCDealFlow } from '@/pipelines/vcDealFlow'

export async function POST(request: NextRequest) {
  try {
    const { sector, stage, ticketSize, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sector || !Array.isArray(sector) || sector.length === 0) {
      return NextResponse.json({ error: 'Sector is required' }, { status: 400 })
    }

    if (!stage) {
      return NextResponse.json({ error: 'Stage is required' }, { status: 400 })
    }

    if (!ticketSize?.min || !ticketSize?.max) {
      return NextResponse.json(
        { error: 'Ticket size range required' },
        { status: 400 }
      )
    }

    const result = await runVCDealFlow({
      sector,
      stage,
      ticketSize
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('VC error:', error)
    return NextResponse.json(
      { error: error.message || 'VC flow failed' },
      { status: 500 }
    )
  }
}
