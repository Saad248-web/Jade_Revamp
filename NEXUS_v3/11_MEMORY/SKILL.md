---
name: nexus-memory
description: "Persistent project memory — stores design decisions, stack choices, font selections, color palettes, component patterns, and project context as short concise sentences. Tracks decisions across sessions so Claude never asks the same question twice or forgets prior context. Use at the start of any project to store context, and before any task to load existing context. Activates when user says: remember this, save this, what did we decide, project context, load context, forget this, update context."
triggers: ["remember", "save this", "don't forget", "what did we decide", "project context", "load context", "our stack", "our colors", "our fonts", "update context", "memory", "track this", "note this", "project settings", "store decision", "recall", "what was our"]
---

# NEXUS MEMORY Engine v3.0
**Short sentences. Never paragraphs. Decisions only — not explanations.**

---

## Memory Format

Every memory item is ONE concise sentence. No elaboration. No explanations.
If it takes more than 15 words to capture, it's too long.

```
Format: [category] → [decision]

Examples:
stack    → Next.js 15 App Router, TypeScript strict, Tailwind CSS, Supabase
design   → Dark luxury aesthetic, near-black #0A0A0A background
fonts    → Display: Bricolage Grotesque · Subhead: DM Sans · Body: DM Sans
colors   → Accent: #3B82F6 blue · Success: #22C55E · Error: #EF4444
layout   → Max-width: 1280px, 4-tier responsive, mobile-first always
auth     → Supabase Auth, JWT, Row Level Security enabled
payments → Stripe Checkout, subscription model, $29/mo Pro tier
deploy   → Vercel, main branch auto-deploy, staging branch for review
pattern  → Card grid → 1 col mobile, 2 col tablet, 3 col desktop
decision → Use shadcn Button as base, custom variants on top
```

---

## Operations

### SAVE: Store a new memory
When user says "remember", "save this", "note this", "track this":
1. Extract the decision as one sentence
2. Assign a category (stack/design/fonts/colors/layout/auth/payments/deploy/pattern/decision/user)
3. Store it
4. Confirm: "Saved: [category] → [sentence]"

### LOAD: Read existing memories
When user says "what did we decide", "load context", "what's our stack":
1. Read all stored memories
2. Present as grouped list by category
3. Ask: "Anything outdated or missing?"

### UPDATE: Replace a memory
When a decision changes:
1. Remove the old memory for that category+key
2. Store the new one
3. Confirm the change

### CLEAR: Remove specific or all memories
"Forget [topic]" → remove matching memories
"Clear all memories" → full reset after confirmation

---

## Artifact Implementation

The memory tracker runs as a persistent artifact using the storage API.
Build it when user first asks to track anything.

```tsx
// Memory Tracker — persistent across sessions
import { useState, useEffect } from "react";

const STORAGE_KEY = "nexus-project-memories";

interface Memory {
  id: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "stack", "design", "fonts", "colors", "layout",
  "auth", "payments", "deploy", "pattern", "decision", "user"
];

export default function MemoryTracker() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newCategory, setNewCategory] = useState("design");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const result = await window.storage.get(STORAGE_KEY);
      if (result) {
        setMemories(JSON.parse(result.value));
      }
    } catch {
      setMemories([]);
    }
    setLoading(false);
  };

  const saveMemories = async (updated: Memory[]) => {
    await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
    setMemories(updated);
  };

  const addMemory = async () => {
    if (!newContent.trim()) return;
    const memory: Memory = {
      id: Date.now().toString(),
      category: newCategory,
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveMemories([...memories, memory]);
    setNewContent("");
  };

  const deleteMemory = async (id: string) => {
    await saveMemories(memories.filter(m => m.id !== id));
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = memories.filter(m => m.category === cat);
    if (items.length > 0 || filter === "all") acc[cat] = items;
    return acc;
  }, {} as Record<string, Memory[]>);

  if (loading) return <div style={{ padding: "2rem", color: "var(--color-text-secondary)" }}>Loading memories...</div>;

  return (
    <div style={{ fontFamily: "var(--font-body)", padding: "1.5rem", maxWidth: "800px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-text-primary)" }}>
          Project Memory
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          {memories.length} decisions tracked
        </p>
      </div>

      {/* Add memory */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <select
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-primary)", fontSize: "0.875rem" }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addMemory()}
          placeholder="One sentence decision..."
          style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text-primary)", fontSize: "0.875rem" }}
        />
        <button
          onClick={addMemory}
          style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
        >
          Save
        </button>
      </div>

      {/* Memory list grouped by category */}
      {Object.entries(grouped).map(([category, items]) => items.length > 0 && (
        <div key={category} style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-tertiary)", marginBottom: "0.375rem" }}>
            {category}
          </div>
          {items.map(memory => (
            <div key={memory.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", padding: "0.5rem 0.75rem", background: "var(--color-bg-secondary)", borderRadius: "6px", marginBottom: "0.25rem" }}>
              <span style={{ flex: 1, fontSize: "0.875rem", color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                {memory.content}
              </span>
              <button
                onClick={() => deleteMemory(memory.id)}
                style={{ padding: "0 0.25rem", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: "1rem", lineHeight: 1 }}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ))}

      {memories.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-tertiary)", fontSize: "0.875rem" }}>
          No memories yet. Type a decision and press Save.
        </div>
      )}
    </div>
  );
}
```

---

## Context Injection Protocol

When starting a new task in a project with existing memories:

```
1. Read all memories from storage
2. Prepend to your working context as:
   "EXISTING PROJECT DECISIONS:
   [category]: [content]
   [category]: [content]
   ..."
3. Never ask about things already in memory
4. If a new decision conflicts with an existing one, flag it:
   "This differs from your stored decision ([old]). Should I update?"
```

---

## Token Efficiency Rule

Memory entries must stay brief. The entire memory store should load in < 300 tokens.
If total memories exceed 400 tokens, prompt user to archive completed-project memories.

Good: `design → dark luxury, #0A0A0A background, blue #3B82F6 accent`
Bad: `We decided to use a dark luxury aesthetic for this project because the client wanted a premium feel, with a near-black background color of #0A0A0A and a blue accent color #3B82F6 for buttons and highlights`
