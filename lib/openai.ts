import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function translateText(
  text: string,
  targetLanguage: 'en' | 'hi' | 'ta'
): Promise<string> {
  if (targetLanguage === 'en') return text

  const languageMap: Record<string, string> = {
    hi: 'Hindi',
    ta: 'Tamil',
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Translate the following text to ${languageMap[targetLanguage]}. Only return the translated text.`,
      },
      { role: 'user', content: text },
    ],
    temperature: 0.3,
  })

  return response.choices[0].message.content ?? text
}

export async function detectLanguage(text: string): Promise<'en' | 'hi' | 'ta'> {
  if (/[\u0900-\u097F]/.test(text)) return 'hi' // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta' // Tamil
  return 'en'
}

export async function generateReasoning(
  query: string,
  context: string,
  citations: Array<{ source: string; excerpt: string }>
): Promise<string> {
  const citationsText = citations
    .map((c, i) => `[${i + 1}] ${c.source}: ${c.excerpt}`)
    .join('\n')

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert startup analyst. Answer strictly using the provided context. Cite sources using [1], [2], etc.',
      },
      {
        role: 'user',
        content: `
Question:
${query}

Context:
${context}

Citations:
${citationsText}

Answer clearly with citations.
        `,
      },
    ],
    temperature: 0.5,
  })

  return response.choices[0].message.content ?? ''
}
