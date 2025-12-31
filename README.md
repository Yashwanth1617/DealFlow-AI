# Startup Funding AI - Multilingual RAG Platform

A production-ready multilingual RAG-based Startup Funding Intelligence Platform built for hackathons. This platform enables founders to upload pitch decks and get AI-powered funding intelligence, while VCs can discover matching startups based on their investment thesis.

## 🚀 Features

### For Founders
- **PDF Upload & Parsing**: Upload pitch decks using LlamaParse
- **Multilingual Q&A**: Ask questions in English, Hindi, or Tamil
- **Voice & Text Input**: Support for both voice and text queries
- **Investment Memos**: Generate AI-powered funding memos with citations
- **Citation-Backed Responses**: All answers include source citations

### For VCs
- **Investment Thesis Upload**: Define sector, stage, and ticket size criteria
- **Smart Startup Matching**: AI-powered matching using vector search
- **Background Checks**: Validate startups via Tavily API
- **Deal Flow Reports**: Generate ranked deal flow reports
- **Sector & Stage Filtering**: Advanced filtering capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (Auth + PostgreSQL)
- **Vector DB**: Weaviate Cloud
- **PDF Parsing**: LlamaParse
- **Translation & Reasoning**: DeepSeek-V3
- **Reranking**: Jina Reranker V2
- **Market Intelligence**: Tavily API
- **Embeddings**: Google Embedding API
- **Orchestration**: LangGraph (custom implementation)

## 📁 Project Structure

```
startup-funding-ai/
│
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── register/
│   │   └── page.tsx               # Registration page
│   ├── dashboard/
│   │   ├── page.tsx               # Role selection
│   │   ├── founder/
│   │   │   └── page.tsx           # Founder dashboard
│   │   └── vc/
│   │       └── page.tsx           # VC dashboard
│   └── api/
│       ├── auth/                  # Authentication routes
│       ├── upload/                # PDF upload route
│       ├── query/                 # Query processing route
│       ├── translate/             # Translation route
│       ├── rag/                   # RAG pipeline route
│       ├── vc/                    # VC deal flow route
│       └── voice/                 # Voice input route
│
├── components/
│   ├── Navbar.tsx                 # Navigation bar
│   ├── RoleSelector.tsx           # Role selection component
│   ├── UploadPDF.tsx              # PDF upload component
│   ├── VoiceInput.tsx             # Voice input component
│   ├── QueryBox.tsx               # Query input component
│   └── Results.tsx                # Results display component
│
├── lib/
│   ├── supabase.ts                # Supabase client & auth
│   ├── weaviate.ts                # Weaviate vector DB client
│   ├── llamaparse.ts              # LlamaParse PDF parsing
│   ├── embeddings.ts              # Embedding generation
│   ├── deepseek.ts                # DeepSeek translation & reasoning
│   ├── tavily.ts                  # Tavily API integration
│   ├── jina.ts                    # Jina reranker integration
│   └── langgraph.ts               # LangGraph orchestration
│
├── pipelines/
│   ├── founderRAG.ts              # Founder RAG pipeline
│   └── vcDealFlow.ts              # VC deal flow pipeline
│
├── types/
│   └── index.ts                   # TypeScript type definitions
│
└── styles/
    └── globals.css                # Global styles
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd startup-funding-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

WEAVIATE_URL=your_weaviate_url
WEAVIATE_API_KEY=your_weaviate_api_key

LLAMAPARSE_API_KEY=your_llamaparse_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
JINA_API_KEY=your_jina_api_key
TAVILY_API_KEY=your_tavily_api_key

GOOGLE_EMBEDDING_API_KEY=your_google_embedding_api_key
```

### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env`
3. The authentication tables will be created automatically by Supabase

### 5. Set Up Weaviate

1. Create a Weaviate Cloud instance
2. Copy your Weaviate URL and API key to `.env`
3. The schema will be created automatically on first upload

### 6. Get API Keys

- **LlamaParse**: Sign up at [llamaindex.ai](https://www.llamaindex.ai)
- **DeepSeek**: Get API key from [deepseek.com](https://www.deepseek.com)
- **Jina**: Get API key from [jina.ai](https://jina.ai)
- **Tavily**: Get API key from [tavily.com](https://tavily.com)
- **Google Embeddings**: Enable the API in Google Cloud Console

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Founder Flow

1. **Upload Pitch Deck**
   - User uploads PDF via `UploadPDF` component
   - PDF is sent to `/api/upload`
   - LlamaParse extracts text from PDF
   - Text is chunked (1000 chars, 200 overlap)
   - Embeddings generated using Google Embedding API
   - Chunks stored in Weaviate with metadata

2. **Query Processing**
   - User submits query (text or voice)
   - Query sent to `/api/rag`
   - LangGraph pipeline executes:
     - **Detect & Translate**: Detect language, translate to English if needed
     - **Embed Query**: Generate query embedding
     - **Retrieve**: Hybrid search in Weaviate (vector + keyword)
     - **Validate**: Validate context using Tavily API
     - **Rerank**: Rerank results using Jina Reranker V2
     - **Generate**: Generate response using DeepSeek-V3
     - **Translate Back**: Translate response to original language if needed
   - Response returned with citations

### VC Flow

1. **Define Investment Thesis**
   - User selects sector(s), stage, and ticket size
   - Criteria sent to `/api/vc`

2. **Startup Matching**
   - LangGraph pipeline executes:
     - **Match Startups**: Search Weaviate by criteria
     - **Validate Matches**: Background checks via Tavily
     - **Rerank Matches**: Rank using Jina Reranker
     - **Generate Report**: Create deal flow report using DeepSeek-V3
   - Ranked startups returned with report

### Hybrid Search

The platform uses hybrid search combining:
- **Vector Search**: Semantic similarity using embeddings
- **Keyword Search**: BM25-based keyword matching
- **Alpha Parameter**: 0.7 (70% vector, 30% keyword)

### Multilingual Support

- **Detection**: Automatic language detection for Hindi, Tamil, English
- **Translation**: DeepSeek-V3 handles translation
- **Pipeline**: Query translated → processed → response translated back

## 🔐 Authentication

- Supabase handles user authentication
- Protected routes check for authenticated user
- Session persistence across page refreshes
- Automatic redirect to login if not authenticated

## 📊 Data Flow

```
User Input → API Route → Pipeline → LangGraph → Services → Response
```

1. User interacts with UI component
2. Component calls API route
3. API route invokes pipeline
4. Pipeline uses LangGraph orchestration
5. LangGraph calls various services (Weaviate, DeepSeek, Tavily, Jina)
6. Results aggregated and returned
7. UI displays results with citations

## 🧪 Testing

To test the platform:

1. **Register/Login**: Create an account
2. **Founder Flow**:
   - Upload a PDF pitch deck
   - Ask questions in English, Hindi, or Tamil
   - Try voice input
   - Verify citations in responses
3. **VC Flow**:
   - Select investment criteria
   - Generate deal flow report
   - Review matched startups

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Notes

- All API keys should be kept secure
- Weaviate schema is created automatically on first upload
- PDF parsing may take time for large documents
- Voice input requires browser microphone permissions
- Citations are extracted from document metadata

## 🤝 Contributing

This is a hackathon project. For production use, consider:
- Adding error handling and retries
- Implementing rate limiting
- Adding caching for frequently asked questions
- Optimizing embedding generation
- Adding more language support

## 📄 License

This project is built for hackathon purposes.

---

Built with ❤️ for hackathons

