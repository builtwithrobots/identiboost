# IdentiBoost -- Pivot Brief for Claude Code
**Version:** 1.0
**Date:** July 2026
**Author:** Rob Ramos, Founder
**Purpose:** Complete rebrand of RoleBoost to IdentiBoost. Copy the existing RoleBoost codebase, apply the rebrand, and update all positioning to reflect the universal professional presence platform.

---

## The Pivot in One Paragraph

RoleBoost was built as a candidate and recruiter platform. The architecture -- a personal verified RAG system with a compounding brain, grounding validation, and a two-sided transcript loop -- is significantly more valuable and universally applicable than a single recruiting use case. IdentiBoost is the same architecture repositioned as a universal professional presence platform. Any professional in any context who needs to be understood and evaluated by another professional is the target user. Job candidates, sales reps, consultants, speakers, trade show exhibitors, freelancers, coaches, and founders. One platform. One link. Your identity, boosted.

---

## What Changes

### Brand

| Was | Now |
|---|---|
| RoleBoost | IdentiBoost |
| getroleboost.com | identiboost.com |
| roleboost.app | identiboost.com |
| /c/[slug] public URL | /i/[slug] public URL |
| "candidate" primary user | "professional" primary user |
| "recruiter" evaluator | "contact" evaluator |
| "employer" buyer | "business" buyer |

### Tagline

**Was:** "Finally, a résumé that talks back."

**Now:** "Your identity. Boosted."

Secondary tagline: "The profile that answers back."

### Core Value Proposition

**Was:** AI-powered candidate intelligence platform for job seekers and recruiters.

**Now:** The universal professional presence layer. Your verified personal AI, always on, always representing you, always gathering intelligence on who engages with you and what they care about. Works for anyone who has ever handed someone a card and wondered what happened next.

---

## What Does NOT Change

- The entire technical architecture
- The RAG system and grounding validation layer
- The two-sided transcript loop
- The compounding brain and all six learning loops
- The intake pipeline
- The asset suite (Audio Boost, Visual Boost, Podcast Boost)
- The Supabase schema -- column names stay the same
- The Claude API integration
- The Clerk auth system
- The Paddle payment system
- The Resend email system
- The Vercel deployment
- All existing migrations
- The CLAUDE.md architecture rules
- The skill file and asset production workflow

---

## What the Rebrand Touches

### 1. Text and Copy -- Every Instance

Search and replace across the entire codebase:

| Find | Replace |
|---|---|
| RoleBoost | IdentiBoost |
| Roleboost | Identiboost |
| ROLEBOOST | IDENTIBOOST |
| roleboost | identiboost |
| getroleboost.com | identiboost.com |
| roleboost.app | identiboost.com |
| transcripts@roleboost.app | transcripts@identiboost.com |
| privacy@roleboost.app | privacy@identiboost.com |
| legal@roleboost.app | legal@identiboost.com |
| "candidate" (where it means the primary user) | "professional" |
| "recruiter" (where it means the evaluator) | "contact" |
| "Career AI" | "Identity AI" |
| "candidate profile" | "professional profile" |
| "career data" | "professional data" |
| "career context" | "professional context" |

**IMPORTANT EXCEPTION:** Do not replace "candidate" in database column names, table names, Supabase queries, or migration files. The schema stays exactly as-is. Only replace in user-facing copy, UI labels, page titles, metadata, email templates, and marketing content.

### 2. Public Profile URL

**Was:** /c/[slug]

**Now:** /i/[slug]

Update:
- app/c/[slug]/page.tsx -- rename directory to app/i/[slug]/
- All internal links pointing to /c/[slug]
- All references to the public profile URL in copy and documentation
- Middleware public route list -- add /i/(.*) and keep /c/(.*) as a redirect to /i/(.*) for backward compatibility

### 3. Domain References

Replace all hardcoded domain references:
- getroleboost.com → identiboost.com
- roleboost.app → identiboost.com
- Any Vercel project URLs referencing the old domain

### 4. Email Templates

Files in lib/email/:
- Update FROM address: from transcripts@roleboost.app to transcripts@identiboost.com
- Update all email copy that references RoleBoost by name
- Update all links pointing to roleboost.app
- Update the "Powered by RoleBoost AI" footer line to "Powered by IdentiBoost AI"
- Update the candidate transcript email subject line
- Update the employer/contact transcript email subject line

### 5. Metadata and SEO

Update in app/layout.tsx and all page-level metadata:
- Site title: IdentiBoost
- Site description: Your identity, boosted. The professional presence platform that answers back.
- OG tags
- Twitter card tags
- Canonical URLs

### 6. UI Copy -- Specific Screens

**Onboarding screen:**
- Was: "I am looking for my next role" / "I am hiring"
- Now: "I want to represent myself" / "I want to find and evaluate professionals"

**Dashboard header:**
- Was: "Your Career AI"
- Now: "Your Identity AI"

**Public profile page:**
- Was: "Ask [Name]'s career AI anything"
- Now: "Ask [Name]'s AI anything"

**Chat interface header:**
- Was: "[Name]'s Personal Assistant"
- Now: "[Name]'s AI"

**Chat disclaimer:**
- Was: "Powered by RoleBoost. [Name]'s Personal Assistant represents [Name]'s career history and may not reflect every detail."
- Now: "Powered by IdentiBoost. [Name]'s AI represents their verified professional identity and may not reflect every detail."

**Transcript email -- candidate:**
- Was: "A recruiter just chatted with your RoleBoost AI"
- Now: "Someone just chatted with your IdentiBoost AI"

**Transcript email -- contact:**
- Was: "Your RoleBoost conversation with [Name]"
- Now: "Your IdentiBoost conversation with [Name]"

**AI Studio tab:**
- Was: "Career AI Management"
- Now: "Identity AI"

**Context document:**
- Was: "Career Context Document"
- Now: "Professional Context Document"

**Boost assets -- names stay the same:**
- Audio Boost -- keep
- Visual Boost -- keep
- Podcast Boost -- keep

### 7. README.md -- Full Replacement

Replace the current README.md with the content at the bottom of this file.

### 8. Vision and Positioning Documents

Update vision.md opening section to reflect the universal professional presence platform positioning. The core architecture sections stay. Update:
- The product description from recruiting-specific to universal professional
- The target user from job seeker to any professional
- The evaluator from recruiter to contact
- The market positioning section
- The competitive positioning table

---

## New User Verticals to Reference in Copy

Where the old copy said "job seekers and recruiters" the new copy should reference the full range of use cases:

- Job candidates representing themselves to recruiters
- Sales professionals representing themselves and their company to prospects
- Consultants and freelancers representing themselves to potential clients
- Speakers representing themselves to event organizers and conference producers
- Trade show exhibitors representing themselves and their company to booth visitors
- Coaches and advisors representing themselves to potential clients
- Founders representing themselves to investors and partners

---

## The Business Card Framing -- Use This in Copy

The business card has not changed in 150 years. You hand someone a piece of paper with your name on it and hope they remember to call. IdentiBoost is the first business card that answers back.

When someone scans the QR code or clicks the link in your email signature they do not land on a static page. They land on a living, intelligent, verified representation of you that can answer any question they have -- at any hour, in any context, with a full transcript delivered to both sides afterward.

---

## The Embed and Export Features -- Reference in Copy

While not yet built, the roadmap includes:
- Embed widget -- deploy your Identity AI on your existing website via a JavaScript snippet
- CRM export -- every conversation exports to Salesforce, HubSpot, or CSV automatically
- These should be referenced as "coming soon" in appropriate places

---

## Pricing -- Updated Model

### Professional -- Individual

| Tier | Price | Included |
|---|---|---|
| Starter | Free | Profile, shareable link, QR code, basic chatbot, transcript delivery |
| Pro | $29/mo | Everything in Starter plus embed widget, conversation analytics, custom Q&A, fine-tuning |
| Business | $99/mo | Everything in Pro plus CRM export, advanced analytics, priority support |

### Team -- Company Deployment

| Tier | Price | Included |
|---|---|---|
| Team | $299/mo | Up to 10 profiles, company-level AI layer, aggregate analytics |
| Growth | $699/mo | Up to 25 profiles, everything in Team plus CRM integration |
| Scale | $1,499/mo | Unlimited profiles, white label option, dedicated onboarding |

---

## Color Palette -- No Change

Keep the existing RoleBoost color system:
- Deep Navy: #1E3A5F
- Amber: #D97706
- Warm White: #FFFBF5
- Warm Gray: #F5F0E8

---

## Execution Order for Claude Code

Execute the rebrand in this exact order to avoid breaking anything:

**Step 1 -- Create new branch**
Create a new branch: identiboost-rebrand

**Step 2 -- Copy route directory**
Copy app/c/[slug]/ to app/i/[slug]/
Keep app/c/[slug]/ in place temporarily for redirect

**Step 3 -- Add redirect**
In app/c/[slug]/page.tsx add a redirect to /i/[slug] so existing links do not break

**Step 4 -- Global text replacement**
Run the find and replace list above across all .tsx, .ts, .md files
Skip: supabase/migrations/, lib/types/ column references, database query column names

**Step 5 -- Update metadata**
Update app/layout.tsx site metadata
Update all page-level metadata exports

**Step 6 -- Update email templates**
Update all files in lib/email/
Update FROM addresses
Update subject lines and body copy

**Step 7 -- Update README.md**
Replace with new README content below

**Step 8 -- Verify**
Run grep -r "RoleBoost" . --include="*.tsx" --include="*.ts" --include="*.md" to find any missed instances
Run grep -r "roleboost" . --include="*.tsx" --include="*.ts" to find any missed lowercase instances
Run grep -r "getroleboost" . to find any missed domain references
Run npx tsc --noEmit to verify no TypeScript errors
Run npm run lint to verify no lint errors
Run npm run build to verify production build succeeds

**Step 9 -- Update environment variable documentation**
Update .env.example with new domain references
Update CLAUDE.md domain references

**Step 10 -- Commit and push**
Commit with message: "rebrand: RoleBoost to IdentiBoost -- universal professional presence platform"
Push to identiboost-rebrand branch
Create PR into main

---

## What to Leave Alone -- Explicit Do Not Touch List

- supabase/migrations/ -- every file, every line
- lib/ai/ -- all AI logic, prompts, and architecture
- lib/auth/ -- all auth logic
- lib/supabase/ -- all database clients
- lib/types/ -- all TypeScript type definitions
- Database column names anywhere in queries
- Table names anywhere in queries
- Clerk configuration
- Paddle price IDs and webhook logic
- Any file that would require a database migration to support a change
- The CANDIDATE_ASSET_PRODUCTION_SKILL.md structure -- only update brand name references
- All six learning loops in the brain architecture
- The grounding validation layer
- The complexity router
- The two-sided transcript delivery mechanism

---

## New README.md Content -- Replace Existing README

```markdown
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

### AI Architecture

**System prompt structure -- data near top, rules near bottom:**
1. Role -- Personal Assistant identity, third person about the professional
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
- PRD.md -- Full product requirements and acceptance criteria
- vision.md -- Product vision, market positioning, go-to-market
- CANDIDATE_ASSET_PRODUCTION_SKILL.md -- Asset production workflow and skill file
```

---

## No Em Dashes

Per standing project rule -- no em dashes anywhere in any output. Use commas, semicolons, or periods instead. This applies to all copy, documentation, email templates, and UI text produced during the rebrand.

---

*IdentiBoost -- identiboost.com -- Built by Rob Ramos -- July 2026*
