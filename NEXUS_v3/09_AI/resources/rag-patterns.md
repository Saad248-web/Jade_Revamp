# RAG Pipeline — Advanced Patterns
## Production-grade retrieval augmented generation

---

## Hybrid Search (BM25 + Vector — best results)

```sql
-- Combine keyword search (BM25) with semantic search (vector)
-- in a single query for best retrieval accuracy

WITH keyword_search AS (
  SELECT id, content,
    ts_rank(to_tsvector('english', content), query) AS bm25_score
  FROM documents, to_tsquery('english', $1) query
  WHERE to_tsvector('english', content) @@ query
  LIMIT 20
),
vector_search AS (
  SELECT id, content,
    1 - (embedding <=> $2::vector) AS cosine_score
  FROM documents
  ORDER BY embedding <=> $2::vector
  LIMIT 20
),
combined AS (
  SELECT
    COALESCE(k.id, v.id) AS id,
    COALESCE(k.content, v.content) AS content,
    COALESCE(k.bm25_score, 0) * 0.3 +
    COALESCE(v.cosine_score, 0) * 0.7 AS hybrid_score  -- 70% semantic, 30% keyword
  FROM keyword_search k
  FULL OUTER JOIN vector_search v ON k.id = v.id
)
SELECT * FROM combined ORDER BY hybrid_score DESC LIMIT 5;
```

---

## Reranking (Cross-Encoder — most accurate)

After initial retrieval, rerank with a cross-encoder model:

```ts
// Use Cohere Rerank or Jina Reranker
import { CohereClient } from 'cohere-ai';
const cohere = new CohereClient({ token: env.COHERE_API_KEY });

const rerank = async (query: string, docs: string[]) => {
  const response = await cohere.rerank({
    model: 'rerank-english-v3.0',
    query,
    documents: docs,
    topN: 3,  // Return only top 3 after reranking
  });
  return response.results.map(r => ({ doc: docs[r.index], score: r.relevanceScore }));
};
```

---

## Document Ingestion Pipeline

```ts
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const ingestDocument = async (filePath: string) => {
  // 1. Load
  const text = await fs.readFile(filePath, 'utf-8');

  // 2. Chunk (recursive for best semantic preservation)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });
  const chunks = await splitter.createDocuments([text]);

  // 3. Batch embed (cheaper than individual calls)
  const texts = chunks.map(c => c.pageContent);
  const embeddings = await embedBatch(texts);

  // 4. Store with metadata
  await db.transaction(async (tx) => {
    for (let i = 0; i < chunks.length; i++) {
      await tx.insert(documents).values({
        content: chunks[i].pageContent,
        embedding: embeddings[i],
        metadata: {
          source: filePath,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });
    }
  });
};
```

---

## Contextual Compression

Reduce noise by extracting only relevant parts from retrieved chunks:

```ts
const compressContext = async (query: string, chunks: string[]): Promise<string> => {
  const { text } = await generateText({
    model: anthropic('claude-haiku-4-5'),  // Use cheap model for this step
    prompt: `Given this query: "${query}"

Extract ONLY the sentences from the following documents that are directly relevant.
If nothing is relevant, return "NO_RELEVANT_CONTENT".
Do not add commentary.

Documents:
${chunks.map((c, i) => `[${i+1}] ${c}`).join('\n\n')}`,
    maxTokens: 500,
  });
  return text;
};
```

---

## Conversation Memory (sliding window)

```ts
// Keep last N turns + always include system context
const buildMessages = (history: Message[], maxTurns = 5): Message[] => {
  const systemMessage = {
    role: 'system' as const,
    content: 'You are a helpful assistant...',
  };

  // Keep only last maxTurns pairs (each turn = user + assistant)
  const recentHistory = history.slice(-(maxTurns * 2));

  return [systemMessage, ...recentHistory];
};
```

---

## Streaming with Citations

```ts
// Stream response and extract citations simultaneously
export async function POST(req: Request) {
  const { messages } = await req.json();
  const query = messages[messages.length - 1].content;

  const chunks = await searchDocuments(await embed(query), 5);

  const system = `Answer the question using the provided sources.
After your answer, list the source numbers you used as [Sources: 1, 3].

Sources:
${chunks.map((c, i) => `[${i+1}] ${c.content}`).join('\n\n')}`;

  const result = streamText({
    model: anthropic('claude-sonnet-4-5'),
    system,
    messages,
    onFinish: async ({ text }) => {
      // Extract citations from response
      const citationMatch = text.match(/\[Sources: ([\d,\s]+)\]/);
      if (citationMatch) {
        const indices = citationMatch[1].split(',').map(n => parseInt(n.trim()) - 1);
        const usedSources = indices.map(i => chunks[i]?.metadata?.source).filter(Boolean);
        // Log or store which sources were used
      }
    },
  });

  return result.toDataStreamResponse();
}
```
