# IdentiBoost

> Your identity. Boosted. The professional presence platform that answers back.

**Domain:** identiboost.com
**GitHub org:** builtwithrobots
**Stack:** Next.js, Clerk, Supabase, Claude API, Resend, Paddle, Vercel, Tailwind

---

## What This Is

IdentiBoost is a universal professional presence platform. Any professional who needs to be understood and evaluated by another professional gets a verified personal AI that represents them accurately, answers questions in their voice, and delivers a full transcript to both sides after every conversation.

The business card has not changed in 150 years. You hand someone a piece of paper with your name on it and hope they remember to call. IdentiBoost is the first profile that answers back.

A professional builds their verified AI brain through an intake process grounded in their actual documented experience. That brain powers a personal AI accessible via one shareable link -- in an email signature, on a business card QR code, embedded on their website, or shared directly. When someone interacts with the AI both parties receive a full transcript. The brain gets smarter with every interaction through six distinct learning loops.

Works for job candidates, sales professionals, consultants, freelancers, speakers, trade show exhibitors, coaches, advisors, and founders -- anyone who has ever handed someone a card and wondered what happened next.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router (TypeScript strict mode) |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| AI -- Live Chat | Anthropic Claude Haiku |
| AI -- Generation and Analysis | Anthropic Claude Sonnet |
| Email | Resend |
| Payments | Paddle |
| Hosting | Vercel |
| Validation | Zod |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Clerk account and application
- Supabase project
- Anthropic API key
- Resend account and domain
- Paddle account (sandbox for development)
- Vercel account under builtwithrobots

### Environment Variables

```bash
cp .env.example .env.local
```

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=

# Paddle
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
PADDLE_EMPLOYER_STARTER_PRICE_ID=
PADDLE_EMPLOYER_GROWTH_PRICE_ID=
PADDLE_EMPLOYER_SCALE_PRICE_ID=

# Admin bootstrap (comma-separated emails promoted to admin on first sign-in)
SUPERADMIN_EMAILS=

# App
NEXT_PUBLIC_APP_URL=https://identiboost.com
CRON_SECRET=
```

### Supabase Setup

1. Create a new Supabase project
2. Enable Row Level Security on all tables -- handled by migrations
3. Configure Clerk as third-party auth provider:
   - Supabase Dashboard > Authentication > Sign In / Providers > Third-party Auth > Clerk
   - Set Domain to your Clerk Frontend API URL
4. Configure Clerk session token:
   - Clerk Dashboard > Configure > Sessions > Customize session token
   - Add: { "role": "authenticated" }
5. Apply migrations manually -- see Database section in CLAUDE.md

### Storage Buckets

Create in Supabase Storage -- all private:
- candidate-audio
- candidate-video
- candidate-documents
- candidate-images

### Install and Run

```bash
npm install
npm run dev
```

---

## Architecture Overview

### The Personal RAG System

IdentiBoost is built on a personal Retrieval Augmented Generation system with five significant architectural additions beyond standard RAG:

1. Full context injection rather than similarity-based chunk retrieval
2. Post-generation claim validation against source documents -- the grounding layer
3. A compounding context loop fed by six distinct learning mechanisms
4. Deterministic structured retrieval through a layered XML prompt architecture
5. A complexity router that dynamically allocates model resources by question type
6. A two-sided transcript output loop that feeds gap analysis back into the context

### The Six Learning Loops

Every professional's AI brain gets smarter over time through six mechanisms:

1. AI intake interview -- structured multi-pass interview building verified context
2. Custom Q&A editing -- professional refines specific answers directly
3. Transcript gap analysis -- every conversation analyzed for gaps and weak answers
4. Sandbox self-testing -- professional stress-tests their own AI before sharing
5. External transcript hardening -- analyze real conversations from any source
6. Career context augment loop -- re-synthesizes the full context document with new material

### Platform Flow

```
Professional                Platform                    Contact
─────────────────────────────────────────────────────────────────
Upload documents        →   Build verified brain
Run intake interview    →   Assemble context package
Review sandbox tests    →   Verify grounding
Publish profile         →   Generate shareable link  →  Scan QR / click link
                            Load verified brain      ←  Ask question
                            Route by complexity
                            Generate grounded answer
                            Validate high-risk claims
                        →   Return answer            →  Receive answer
                            Log exchange
                        →   Deliver transcript       →  Receive transcript
Receive transcript      ←   Analyze gaps
Review gap prompts      →   Strengthen brain
                            Loop repeats -- brain compounds with every interaction
```

### Public Profile URL

```
identiboost.com/i/[slug]
```

No login required to view. The professional shares this link anywhere -- email signature, business card QR code, LinkedIn, trade show materials. The contact lands on a page with the professional's assets and their personal AI ready to answer questions.

Legacy `/c/[slug]` links permanently redirect to `/i/[slug]`.

### AI Architecture

**System prompt structure -- data near top, rules near bottom:**
1. Role -- personal AI identity, third person about the professional
2. Career context document -- professionally synthesized narrative
3. Career information -- full resume markdown
4. Context -- nine named career context fields
5. Custom answers -- professional-refined Q&A pairs, highest priority
6. Few-shot examples -- worked exemplars from custom Q&A
7. Knowledge boundary -- explicit known / not-known blocks
8. Principles -- honesty, calm confidence, human warmth
9. Adversarial posture -- handling skeptical or pressure-testing questions
10. Redirect topics -- topics routed to direct human conversation
11. Voice -- tone derived from the professional's own writing
12. Reasoning instruction -- synthesis and numeric grounding

**Complexity router:**
- Simple factual questions -- Claude Haiku, fast and cheap
- Complex, adversarial, or multi-part questions -- Claude Sonnet, better reasoning

**Post-generation validation:**
- Runs only when answer contains numbers, credentials, or specific claims
- Sonnet checks every claim traces to verified source documents
- Ungrounded claims replaced with honest deflection
- Fail-safe -- any error returns original answer

---

## Pricing

### Individual Professional

| Tier | Price | Included |
|---|---|---|
| Starter | Free | Profile, shareable link, QR code, basic AI, transcript delivery |
| Pro | $29/mo | Embed widget, conversation analytics, custom Q&A, fine-tuning |
| Business | $99/mo | CRM export, advanced analytics, priority support |

### Team -- Company Deployment

| Tier | Price | Included |
|---|---|---|
| Team | $299/mo | Up to 10 profiles, company AI layer, aggregate analytics |
| Growth | $699/mo | Up to 25 profiles, CRM integration |
| Scale | $1,499/mo | Unlimited profiles, white label, dedicated onboarding |

---

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check
```

---

## Deployment

Vercel auto-deploys:
- main branch → production (identiboost.com)
- All other branches → preview URLs

GitHub org: builtwithrobots
Vercel account: builtwithrobots

---

## Brand

**Colors:**
- Deep Navy: #1E3A5F
- Amber: #D97706
- Warm White: #FFFBF5
- Warm Gray: #F5F0E8

**Typography:**
- Plus Jakarta Sans (headings)
- Inter (body)

**Asset Suite:**
- Audio Boost -- two-minute professional narrative audio
- Visual Boost -- professional infographic with key proof points
- Podcast Boost -- extended deep-dive audio format

---

## Related Documents

- CLAUDE.md -- Claude Code rules, patterns, database schema, AI architecture
- TODOS.md -- The IdentiBoost pivot development plan and checklists
- IDENTIBOOST_PIVOT_README.md -- The original pivot brief
- docs/PRD.md -- Full product requirements and acceptance criteria
- docs/VISION.md -- Product vision, market positioning, go-to-market
- docs/CANDIDATE_ASSET_PRODUCTION_SKILL.md -- Asset production workflow and skill file
