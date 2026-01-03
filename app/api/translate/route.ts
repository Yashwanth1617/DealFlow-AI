import { NextRequest, NextResponse } from 'next/server'
import { translateText, detectLanguage } from '@/lib/deepseek'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const detected = await detectLanguage(text)
    const translated = targetLanguage 
      ? await translateText(text, targetLanguage)
      : text

    return NextResponse.json({
      originalText: text,
      detectedLanguage: detected,
      translatedText: translated,
      targetLanguage: targetLanguage || detected,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}

