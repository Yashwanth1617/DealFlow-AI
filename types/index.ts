export interface User {
  id: string;
  email: string;
  role?: 'founder' | 'vc';
}

export interface PitchDeck {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
  weaviateId?: string;
}

export interface Query {
  id: string;
  userId: string;
  query: string;
  language: string;
  response: string;
  citations: Citation[];
  createdAt: string;
}

export interface Citation {
  source: string;
  page?: number;
  excerpt: string;
}

export interface VCThesis {
  id: string;
  userId: string;
  sector: string[];
  stage: string[];
  ticketSize: {
    min: number;
    max: number;
  };
  createdAt: string;
}

export interface StartupMatch {
  id: string;
  name: string;
  sector: string;
  stage: string;
  score: number;
  description: string;
  citations: Citation[];
}

export interface DealFlowReport {
  id: string;
  userId: string;
  matches: StartupMatch[];
  generatedAt: string;
}

export interface Chunk {
  id: string
  content: string
  metadata: {
    page?: number
    fileName?: string
    userId?: string

    // ✅ ADD THESE (match Weaviate schema)
    sector?: string[]
    stage?: string
    ticketSize?: number
  }
}


export interface EmbeddingResponse {
  embedding: number[];
}

export interface TranslationResponse {
  text: string;
  detectedLanguage: string;
}

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface RerankResult {
  index: number;
  relevance_score: number;
}

