---
name: nexus-content
description: "SEO, E-E-A-T, content strategy, brand voice, keyword strategy (primary/LSI/long-tail/PAA), meta optimization, structured data (JSON-LD), AI-SEO (LLM/SGE optimization), topical authority, reading level, Core Web Vitals. Use when writing content, optimizing for search, planning strategy, building topical authority, or auditing SEO."
triggers: ["seo", "content", "blog", "article", "meta tag", "title tag", "keyword", "e-e-a-t", "search ranking", "organic", "sitemap", "schema markup", "structured data", "brand voice", "copywriting", "content strategy", "topic cluster", "ai-seo", "llm search", "topical authority", "internal links", "core web vitals", "paa", "people also ask", "landing page copy"]
---

# NEXUS CONTENT Engine v3.0
**Rankings follow trust. Rank by being genuinely more useful.**

---

## Phase 1 — E-E-A-T Framework

| Dimension | Signals to build |
|-----------|-----------------|
| **Experience** | First-hand perspective, original data, "I tested this" |
| **Expertise** | Technical depth, correct terminology, primary sources |
| **Authoritativeness** | Backlinks from relevant domains, author credentials |
| **Trustworthiness** | HTTPS, transparent authorship, factual accuracy |

---

## Phase 2 — Keyword Strategy

| Type | Role |
|------|------|
| **Primary** | One per page. Matches page's singular intent. |
| **Secondary** | 3–5 semantically related. Natural in body copy. |
| **LSI** | Topic vocabulary — depth signals, not stuffing. |
| **Long-tail** | Lower volume, higher intent, use in H2/H3. |
| **PAA** | People Also Ask — build FAQ section from these. |

---

## Phase 3 — Technical SEO

| Element | Rule |
|---------|------|
| `<title>` | Primary keyword + intent. 50–60 chars. Unique per page. |
| Meta description | Compelling CTA. 150–160 chars. |
| `<h1>` | Exactly one per page. Matches search intent. |
| URL slug | `/short-descriptive-phrase`. Lowercase. Hyphens. |
| Canonical | Self-referencing every indexable page. |
| Core Web Vitals | LCP < 2.5s · CLS < 0.1 · INP < 200ms — ranking factor. |
| Internal links | Every new page gets ≥3 relevant internal links. |
| Images | `alt` = descriptive phrase. WebP. Lazy load. |

---

## Phase 4 — Content Structure

```
H1: [Primary keyword] — [Intent modifier]

Intro (first 100 words):
  - Answer directly — never bury the lead
  - Pain point → what reader gets → trust signal

H2: [Subtopic — keyword variant]
  H3: [Supporting detail]

H2: Frequently Asked Questions
  [5–8 PAA questions — use FAQ schema]

H2: Conclusion
  [Summary + one clear CTA]
```

**Metrics:** Match top-3 SERP word count ±10%. 1–2% keyword density. 3–5 internal links per article.

---

## Phase 5 — Schema Markup (JSON-LD)

```html
<!-- Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "Article",
  "headline": "...", "datePublished": "2024-01-15",
  "author": { "@type": "Person", "name": "..." }
}
</script>

<!-- FAQ (rich result eligible) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question", "name": "Question?",
    "acceptedAnswer": { "@type": "Answer", "text": "Direct answer." }
  }]
}
</script>
```

---

## Phase 6 — AI-SEO (LLM / SGE Era 2026)

Optimizing for ChatGPT, Perplexity, Claude, Google AI Overviews:

| Tactic | Why it works |
|--------|-------------|
| Answer first paragraph | LLMs extract clearest answer first |
| Structured Q&A headings | LLMs use heading structure to parse + cite |
| Specific data ("42% faster") | Verifiable, attributed claims get surfaced |
| Sentences under 25 words | Better AI parser extraction |
| FAQ format | LLMs pull these verbatim |
| Topical authority | Build clusters, not isolated pages |
| Consistent entity definition | Name brand clearly in first paragraph of key pages |

---

## Phase 7 — Topical Authority

```
Pillar:  /guide/topic              → 2,000+ words, links to all clusters
Cluster: /guide/topic/subtopic-1  → specific, links back to pillar
Cluster: /guide/topic/subtopic-2
```

One focused cluster per week beats 10 disconnected articles.

---

## Traps

- Thin content (< 300 words on indexed pages) drags entire domain down
- Keyword stuffing (> 2% density) triggers spam filters
- Duplicate `<title>` tags — every page must be unique
- Orphan pages (zero internal links) don't rank
- Ignoring Core Web Vitals — direct ranking signal
- `dateModified` should only change when content changes meaningfully

---

## Phase 8 — GEO/AEO (2026's Biggest Career Differentiator)

**GEO = Generative Engine Optimization** — getting cited in ChatGPT, Perplexity, Claude, Gemini
**AEO = Answer Engine Optimization** — structuring content for direct answer extraction

These replace the old "rank #1 on Google" goal. The new goal: **be the source AI engines cite**.

### Why This Matters Now
Traditional SEO optimizes for clicks. GEO/AEO optimizes for citations. As AI search grows, pages that don't appear in AI answers become invisible — regardless of their Google ranking.

### Entity Optimization (Foundation of GEO)

```
Entity = any specific named thing (person, company, product, concept)

Your goal: Be the definitive source for your entity in AI training data.

Steps:
1. Define your entity clearly in the first paragraph of key pages:
   "NEXUS v3.0 is a skill set system for Claude Code, designed to
   eliminate AI-generated generic UI output."
   (Never assume the AI knows who you are)

2. Use consistent entity naming across all content
   (Same name format every time — never vary it)

3. Reference your entity in anchor text from other pages
   (Internal links with entity name as anchor text)

4. Get referenced from authoritative external sources
   (These become training data citations)
```

### Citation Architecture (What AI Engines Extract)

```
Structure for AI citation:
→ Answer directly in the first 40 words of any section
→ Use "X is Y" and "X does Z" sentence patterns (parser-friendly)
→ Numbered lists for processes (AI engines extract these verbatim)
→ Definition sentences: "GEO (Generative Engine Optimization) is..."
→ Specific data points: "42% of users" not "many users"
→ Short paragraphs: ≤ 3 sentences (easier extraction)

What AI engines cite:
✅ Direct answers to specific questions
✅ Specific statistics with attribution
✅ Numbered step-by-step processes
✅ Clear definitions of concepts
✅ Comparison tables with specific data

What gets ignored:
❌ Vague generalizations ("it's important to...")
❌ Walls of text with no structure
❌ Information buried in paragraphs 5–8
❌ Hedged language ("could potentially help...")
```

### AI Crawler Guidance

```html
<!-- Allow AI crawlers to index your content for citation -->
<meta name="robots" content="index, follow">

<!-- robots.txt — don't block AI crawlers unless intentional -->
# robots.txt
User-agent: GPTBot         # OpenAI
Allow: /

User-agent: Google-Extended # Google AI
Allow: /

User-agent: PerplexityBot   # Perplexity
Allow: /

User-agent: anthropic-ai    # Anthropic/Claude
Allow: /
```

### AEO: Featured Snippet Capture

```
The featured snippet formula:
H2: [Question exactly as users search it]
First sentence: Direct answer in 40–60 words
Expanded detail: 150–300 words with examples
→ Captures both featured snippet AND AI extraction

Examples:
H2: What is GEO in SEO?
Answer: GEO (Generative Engine Optimization) is the practice of structuring
content so it gets cited by AI language models like ChatGPT, Perplexity,
and Google AI Overviews. Unlike traditional SEO which targets search engine
rankings, GEO targets direct citation in AI-generated answers.
```

### GEO Content Strategy

```
Month 1–3: Entity establishment
  - Define and consistently use your entity name
  - Create the definitive guide for 1 core topic in your niche
  - Structure every section with direct-answer openings

Month 3–6: Citation building
  - Guest posts on authoritative domains in your space
  - Get quoted in industry publications
  - Create original data/research (most-cited content type)

Month 6+: Authority compound
  - Topical cluster around your entity
  - Update content with fresher data quarterly
  - Monitor: search for your entity in ChatGPT/Perplexity — are you cited?

Monitoring:
- Ask ChatGPT: "What is [your entity/topic]?" — are you mentioned?
- Ask Perplexity: "Best [your category]" — do you appear?
- Track: which pages get cited in AI overviews in Google Search Console
```

### GEO Page Template

```
[Entity Name] — [Clear Definition]

[Entity] is [direct definition in 1 sentence]. [Why it matters in 1 sentence].

## What [Entity] Does
[Direct answer — 2–3 sentences max]
[Specific data point or metric]

## How [Entity] Works
1. [Step one — verb-first]
2. [Step two]
3. [Step three]
[Each step: 1–2 sentences only]

## [Entity] vs. [Alternative]
[Comparison table with specific differentiators]

## Who Uses [Entity]
[Specific persona + specific use case]

## Frequently Asked Questions
Q: [Exact question users ask]
A: [Direct answer in 40–60 words]
[5–8 Q&As — each structured for AI extraction]
```
