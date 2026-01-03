import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { error } = await signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}

