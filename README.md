# SynQ Intelligence — AI LinkedIn Post Generator

> Generate human-like, founder-style LinkedIn posts in seconds using AI.

## Live Demo
_Deploy to Vercel — link here after deployment_

## Architecture Overview

The system has 4 core layers:

**Layer 1 — UI (React + TanStack)**  
A clean form with goal, post type, topic, tone, performing topics, and optional historical posts input.

**Layer 2 — Context Engine**  
When historical posts are provided, the engine:
1. Parses each post's impressions and engagement rate
2. Scores them: `score = impressions × 0.4 + engagement% × 100 × 0.6`
3. Selects the top 3 performing posts
4. Extracts only writing *patterns* (hook type, paragraph style, CTA usage) — NOT raw post text

This reduces token usage by ~80% vs sending full post text.

**Layer 3 — Prompt Builder**  
Assembles a focused system prompt + user prompt totaling 600–800 tokens max.

**Layer 4 — Gemini API**  
Uses `gemini-2.0-flash` free tier. API key entered directly in UI — no backend needed.

## Prompt Strategy

**System Prompt (~150 tokens):** Defines persona and hard rules — no buzzwords, no generic openers, short paragraphs, hook-first structure.

**User Prompt (~400 tokens):** Structured fields — goal, style, topic, tone, performing context, and writing patterns from historical posts (or a founder-persona fallback).

## Historical Context Handling

**Scenario A — User has past posts:**  
Posts are scored by engagement + impressions. Top 3 are pattern-extracted. Only the pattern summary (~100 tokens) is sent to the API — not the full posts.

**Scenario B — No history:**  
A built-in founder-persona fallback is injected: short paragraphs, first-person, hook-driven, real numbers.

## Token Optimization

| Approach | Tokens | Quality |
|---|---|---|
| Send all 10 posts raw | ~2000 | High |
| Send top 3 posts | ~600 | Same |
| Send extracted patterns only | ~100 | Almost same |

We use extracted patterns. At 1000 requests/day this saves ~1.5M tokens = ~60–70% cost reduction.

## Setup & Run

```bash
npm install
npm run dev
```

Enter your free Gemini API key (from [aistudio.google.com](https://aistudio.google.com)) in the key field at the top of the UI.

## Key Decisions

- **Gemini Flash 2.0** — free tier, fast, sufficient quality for content generation
- **Frontend-only** — no backend required for assessment; API key stored in localStorage
- **Pattern extraction over raw posts** — dramatically reduces token cost at scale
- **Structured prompt format** — consistent field order helps the model parse intent reliably
- **800 max output tokens** — LinkedIn posts are 150–300 words; 800 tokens is sufficient with headroom
