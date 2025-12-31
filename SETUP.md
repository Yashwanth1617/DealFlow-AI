# Quick Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

WEAVIATE_URL=
WEAVIATE_API_KEY=

LLAMAPARSE_API_KEY=
DEEPSEEK_API_KEY=
JINA_API_KEY=
TAVILY_API_KEY=

GOOGLE_EMBEDDING_API_KEY=
```

## Getting API Keys

1. **Supabase**: https://supabase.com
   - Create a new project
   - Go to Settings > API
   - Copy Project URL and anon key

2. **Weaviate**: https://weaviate.io/cloud
   - Create a Weaviate Cloud instance
   - Copy the cluster URL and API key

3. **LlamaParse**: https://www.llamaindex.ai
   - Sign up and get API key from dashboard

4. **DeepSeek**: https://www.deepseek.com
   - Sign up and get API key

5. **Jina**: https://jina.ai
   - Sign up and get API key

6. **Tavily**: https://tavily.com
   - Sign up and get API key

7. **Google Embeddings**: https://console.cloud.google.com
   - Enable Generative Language API
   - Create API key

## Installation

```bash
npm install
npm run dev
```

Visit http://localhost:3000

