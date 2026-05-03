---
name: nexus-ai
description: "AI feature engineering — RAG pipelines, vector databases (pgvector, Pinecone, Weaviate), embeddings, chunking strategies, streaming completions, tool calling, agent loops, Vercel AI SDK, LangChain, LlamaIndex, prompt engineering, hallucination mitigation, token cost management. Use when building any AI-powered feature: chatbots, document Q&A, semantic search, AI assistants, content generation, classification, recommendation systems."
triggers: ["rag", "vector", "embeddings", "ai sdk", "langchain", "llamaindex", "openai", "anthropic api", "claude api", "streaming", "tool calling", "function calling", "agent", "chatbot", "ai chat", "semantic search", "document qa", "ai assistant", "pgvector", "pinecone", "weaviate", "chunking", "context window", "prompt engineering", "hallucination", "token cost", "llm", "language model", "ai feature", "generative ai", "claude", "gpt"]
---

# NEXUS AI Engine v3.0
**Context-first AI. Measure token cost. Fail gracefully.**

---

## PHASE 0 — AI Feature Scope Gate

Before any implementation, answer these:

```
1. Does this need real-time data, or is training data sufficient?
   → Real-time: RAG pipeline required
   → Static knowledge: fine-tuning or system prompt only

2. What's the acceptable latency?
   → < 200ms: embeddings / vector search only (no LLM)
   → < 2s: LLM with streaming
   → Batch: async jobs

3. What's the token budget?
   → Calculate: (system prompt + context + history) × expected calls × cost/1M tokens
   → If > $100/month at expected scale: optimization required before build

4. What happens when the AI fails or hallucinates?
   → Define fallback behavior before writing any prompt
```

---

## PHASE 1 — Stack Selection

| Need | Tool | When |
|------|------|------|
| **React/Next.js AI** | Vercel AI SDK | Best for streaming, RSC, multi-model |
| **Python AI** | LangChain / LlamaIndex | Complex pipelines, Python backend |
| **Vector DB (scale)** | Pinecone / Weaviate | Millions of vectors |
| **Vector DB (Postgres)** | pgvector | < 1M vectors, existing Postgres |
| **Vector DB (edge)** | Turso + libSQL vectors | Edge-compatible |
| **LLM provider** | Anthropic Claude / OpenAI | Task-dependent (see below) |
| **Embeddings** | OpenAI text-embedding-3-small | Cheap, fast, good |
| **Orchestration** | Vercel AI SDK / LangGraph | Agents, multi-step workflows |

**Model selection guide:**
```
claude-sonnet-4-5    → Complex reasoning, nuanced writing, code
claude-haiku-4-5     → Classification, extraction, simple QA (10x cheaper)
gpt-4o               → Multimodal tasks (vision + text)
gpt-4o-mini          → High-volume simple tasks
text-embedding-3-small → Embeddings (1536d, cheapest)
text-embedding-3-large → Embeddings when quality matters (3072d)
```

---

## PHASE 2 — RAG Pipeline (Complete)

### Architecture
```
User query
    ↓
Embed query → vector
    ↓
Search vector DB → top-k chunks
    ↓
Build context from chunks
    ↓
LLM call (system + context + query)
    ↓
Stream response
    ↓
Citation extraction (optional)
```

### pgvector Setup (recommended for < 500k vectors)
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id   UUID NOT NULL,
  content     TEXT NOT NULL,
  metadata    JSONB,
  embedding   vector(1536),  -- Match your embedding model dimensions
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index (fast approximate search — recommended for production)
CREATE INDEX ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Cosine similarity search
SELECT content, metadata,
  1 - (embedding <=> $1) AS similarity
FROM documents
WHERE 1 - (embedding <=> $1) > 0.75  -- Threshold
ORDER BY embedding <=> $1
LIMIT 5;
```

### Embedding Function
```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

export async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.replace(/\n/g, ' '),  // Normalize whitespace
  });
  return response.data[0].embedding;
}

// Batch embeddings (cheaper per token)
export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts.map(t => t.replace(/\n/g, ' ')),
  });
  return response.data.map(d => d.embedding);
}
```

### Chunking Strategies
```typescript
// Strategy 1: Fixed-size with overlap (simple, works for most docs)
function chunkFixed(text: string, size = 512, overlap = 50): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}

// Strategy 2: Sentence-aware (better for Q&A)
function chunkBySentence(text: string, maxChars = 1000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChars && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += ' ' + sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

// Strategy 3: Markdown-aware (for documentation)
function chunkByHeading(markdown: string): { heading: string; content: string }[] {
  const sections = markdown.split(/^#+\s/m);
  return sections.map(s => {
    const lines = s.split('\n');
    return { heading: lines[0], content: lines.slice(1).join('\n').trim() };
  }).filter(s => s.content.length > 50);
}
```

---

## PHASE 3 — Vercel AI SDK (Streaming)

### Basic Streaming Chat
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system: 'You are a helpful assistant.',
    messages,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
```

### RAG Chat with Citations
```typescript
// app/api/rag/route.ts
import { streamText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Embed the query
  const queryEmbedding = await embed(lastMessage);

  // 2. Search vector DB
  const chunks = await searchDocuments(queryEmbedding, 5);

  // 3. Build context
  const context = chunks.map((c, i) => `[${i + 1}] ${c.content}`).join('\n\n');

  const result = streamText({
    model: anthropic('claude-haiku-4-5'),  // Cheaper for RAG
    system: `You are a helpful assistant. Answer based ONLY on the context provided.
If the answer isn't in the context, say so. Don't make up information.

CONTEXT:
${context}`,
    messages,
    maxTokens: 512,
  });

  return result.toDataStreamResponse();
}
```

### Tool Calling (Function Calling)
```typescript
import { streamText, tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: anthropic('claude-sonnet-4-5'),
  tools: {
    searchWeb: tool({
      description: 'Search for current information',
      parameters: z.object({
        query: z.string().describe('Search query'),
      }),
      execute: async ({ query }) => {
        const results = await webSearch(query);
        return { results };
      },
    }),
    getWeather: tool({
      description: 'Get current weather for a location',
      parameters: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => fetchWeather(location),
    }),
  },
  messages,
  maxSteps: 5,  // Allow multiple tool calls per message
});
```

---

## PHASE 4 — Prompt Engineering

### System Prompt Template
```typescript
const systemPrompt = `
# Role
You are [specific role]. You help users [specific task].

# Behavior
- Always [specific behavior]
- Never [specific prohibition]
- When [condition]: [action]

# Response Format
Respond in [format]. Keep responses [length guideline].

# Constraints
- Only use information from [source]
- If unsure, say "I don't know" rather than guessing
- Do not [specific prohibition]
`.trim();
```

### Anti-Hallucination Patterns
```typescript
// 1. Grounded response — cite sources
"Answer based ONLY on the provided context. If the context doesn't contain the answer, say: 'I don't have enough information to answer this.'"

// 2. Confidence levels
"Rate your confidence: HIGH (certain), MEDIUM (likely), LOW (uncertain). Only answer at HIGH confidence."

// 3. Structured output with Zod
import { generateObject } from 'ai';
import { z } from 'zod';

const schema = z.object({
  answer: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  sources: z.array(z.string()),
  reasoning: z.string(),
});

const { object } = await generateObject({ model, prompt, schema });
// object.confidence gates downstream behavior
```

---

## PHASE 5 — Token Cost Management

```typescript
// Estimate cost before sending
const estimateCost = (messages: Message[], model: string) => {
  const inputTokens = messages.reduce((sum, m) => sum + m.content.length / 4, 0);
  const costs = {
    'claude-sonnet-4-5': { input: 3, output: 15 },    // per 1M tokens
    'claude-haiku-4-5':  { input: 0.25, output: 1.25 },
    'gpt-4o':            { input: 5, output: 15 },
    'gpt-4o-mini':       { input: 0.15, output: 0.6 },
  };
  const c = costs[model];
  return (inputTokens * c.input + 500 * c.output) / 1_000_000;
};

// Context window management — trim old messages
const trimMessages = (messages: Message[], maxTokens = 4000): Message[] => {
  let total = 0;
  const trimmed: Message[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = messages[i].content.length / 4;
    if (total + tokens > maxTokens) break;
    trimmed.unshift(messages[i]);
    total += tokens;
  }
  return trimmed;
};
```

---

## PHASE 6 — Agent Loop Pattern

```typescript
import { generateText, tool } from 'ai';

async function runAgent(userInput: string, maxIterations = 5) {
  const messages: Message[] = [{ role: 'user', content: userInput }];
  let iteration = 0;

  while (iteration < maxIterations) {
    const result = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      messages,
      tools: { /* tool definitions */ },
      toolChoice: 'auto',
    });

    // If no tool calls, agent is done
    if (result.toolCalls.length === 0) {
      return result.text;
    }

    // Execute tools and add results to messages
    const toolResults = await Promise.all(
      result.toolCalls.map(async call => ({
        toolCallId: call.toolCallId,
        result: await executeTool(call.toolName, call.args),
      }))
    );

    messages.push(
      { role: 'assistant', content: result.text, toolCalls: result.toolCalls },
      { role: 'tool', content: toolResults }
    );

    iteration++;
  }

  throw new Error(`Agent exceeded ${maxIterations} iterations`);
}
```

---

## Delivery Checklist

```
□ Token cost estimated and acceptable
□ Fallback behavior defined (what if AI call fails)
□ Streaming used (never await full response for chat)
□ Anti-hallucination measures in system prompt
□ Rate limiting on AI endpoints (separate from API rate limiting)
□ Error handling: API errors, context length exceeded, content filters
□ Context window management (trim old messages)
□ Zod validation on structured outputs
□ No PII logged to AI providers
□ Model selection matches task (don't use Sonnet for Haiku tasks)
□ pgvector or Pinecone indexes created (not scanning full table)
□ Chunk size validated against embedding model max tokens
□ User feedback mechanism (thumbs up/down for RLHF)
```
