import axios from 'axios'

const llamaparseApiKey = process.env.LLAMAPARSE_API_KEY || ''

export interface ParsedDocument {
  pages: {
    page: number
    text: string
  }[]
}

export async function parsePDF(file: File | Buffer, fileName?: string): Promise<ParsedDocument> {
  const FormData = (await import('form-data')).default
  const formData = new FormData()
  
  if (file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer())
    formData.append('file', buffer, { filename: file.name, contentType: 'application/pdf' })
  } else {
    formData.append('file', file, { filename: fileName || 'document.pdf', contentType: 'application/pdf' })
  }
  formData.append('language', 'en')

  const response = await axios.post(
    'https://api.cloud.llamaindex.ai/api/parsing/upload',
    formData,
    {
      headers: {
        Authorization: `Bearer ${llamaparseApiKey}`,
        ...formData.getHeaders(),
      },
    }
  )

  const jobId = response.data.id

  let status = 'PENDING'
  let result: any = null

  while (status === 'PENDING' || status === 'PROCESSING') {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const statusResponse = await axios.get(
      `https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${llamaparseApiKey}`,
        },
      }
    )

    status = statusResponse.data.status
    if (status === 'SUCCESS') {
      result = statusResponse.data
      break
    }
  }

  if (!result) {
    throw new Error('Failed to parse PDF')
  }

  const pages: { page: number; text: string }[] = []
  if (result.pages) {
    for (const page of result.pages) {
      pages.push({
        page: page.page || 0,
        text: page.text || '',
      })
    }
  }

  return { pages }
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
  }

  return chunks
}

