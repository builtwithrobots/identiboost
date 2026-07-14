# PRD.md -- IdentiBoost Product Requirements Document

**Version:** 3.0
**Last updated:** June 2026
**Author:** Rob Ramos
**Domain:** identiboost.com

---

## 1. Overview

IdentiBoost is the universal professional presence platform. Your identity. Boosted. Professionals upload their resume and professional context, receive a full suite of AI-produced professional assets, and get a personal Identity AI chatbot that represents them to their contacts 24/7 -- the profile that answers back. Resume Intelligence analyzes their documents and coaches them on exactly what context to add so their AI is armed before the first hard question. Every AI conversation generates a transcript delivered by email to both sides. Professionals fine-tune their AI over time. Businesses that evaluate professionals get a management dashboard with pipeline tracking, postings, stage assignment, team collaboration, and AI chat access.

The platform serves job candidates, sales professionals, consultants, freelancers, speakers, trade show exhibitors, coaches, advisors, and founders -- anyone who has ever handed someone a card and wondered what happened next.

**Core user types:**
- **Professional** -- the primary user uploading assets, managing their Identity AI, and sharing their profile link (stored as role `candidate`)
- **Business** -- the evaluating side: a contact or team saving professionals, managing pipeline, and chatting with their AIs (stored as role `employer`)

---

## 2. Authentication and Onboarding

### 2.1 Sign Up and Sign In

- Clerk handles all authentication
- Email/password and Google OAuth supported
- Single sign-up flow -- role declared in onboarding, not on sign-up page

**Acceptance criteria:**
- [ ] User can sign up with email and password
- [ ] User can sign up with Google
- [ ] User can sign in with email and password
- [ ] User can sign in with Google
- [ ] Successful sign-up redirects to onboarding
- [ ] Successful sign-in redirects to correct dashboard based on role

### 2.2 Onboarding -- Role Selection

After first sign-up, every user lands on the onboarding screen before any dashboard.

**Screen:** "How are you using IdentiBoost?"

Two large tappable cards:
- "I want to represent myself" -- sets role to `candidate`
- "I want to find and evaluate professionals" -- sets role to `employer`

On selection:
- Insert row into `users` with `clerk_user_id`, `email`, `role`
- Professional (`candidate` role): redirect to professional onboarding (2.3)
- Business (`employer` role): redirect to business onboarding (2.4)

**Acceptance criteria:**
- [ ] Shown on first login only
- [ ] Both options keyboard accessible, minimum 44px touch target
- [ ] Role stored in `users.role` in Supabase
- [ ] Correct redirect after selection

### 2.3 Professional Onboarding

Three-step flow before reaching the dashboard.

**Step 1 -- Basic info:**
- Full name (required)
- Location (city, state) (required)
- Target role (required)
- LinkedIn URL (optional)

**Step 2 -- Career headline:**
- Headline text field (max 200 chars)
- Helper text: "Example: Director of Operations | 20+ years warehouse leadership"

**Step 3 -- Profile slug:**
- Auto-generated from full name (e.g. `robert-ramos`)
- Editable -- unique, lowercase, alphanumeric and hyphens only
- Live preview: `identiboost.com/i/[slug]`

On completion:
- Insert row into `candidate_profiles`
- Redirect to `/dashboard/profile`

**Acceptance criteria:**
- [ ] Three-step flow with progress indicator
- [ ] All required fields validated
- [ ] Slug auto-generated and editable
- [ ] Slug uniqueness checked in real time
- [ ] Public URL preview shown before confirmation
- [ ] Profile row created in Supabase on completion
- [ ] Redirect to `/dashboard/profile`

### 2.4 Business Onboarding

Two-step flow before reaching the dashboard.

**Step 1 -- Company info:**
- Company name (required)
- Industry (optional, dropdown)
- Approximate team size (optional, dropdown: 1-10, 11-50, 51-200, 200+)

**Step 2 -- Your role:**
- Your job title (required)
- How did you hear about us (optional)

On completion:
- Insert row into `employer_accounts`
- Insert row into `employer_members` with role `owner`
- Redirect to `/dashboard/candidates`

**Acceptance criteria:**
- [ ] Two-step flow with progress indicator
- [ ] Company name required
- [ ] `employer_accounts` and `employer_members` rows created
- [ ] User set as account owner
- [ ] Redirect to `/dashboard/candidates`

---

## 3. Professional Features

### 3.1 Profile Tab

The main hub for managing profile content and sharing.

**Profile editor sections:**
- Basic info (name, location, target role, LinkedIn)
- Headline
- AI bullet summary (5-7 bullets -- manually entered or pasted from NotebookLM output)
- Profile visibility toggle (Published / Draft)

**Shareable assets section:**
- Full public URL: `identiboost.com/i/[slug]`
- Copy link button with confirmation toast
- QR code download button
- IdentiBoost badge download button

**Acceptance criteria:**
- [ ] All fields editable and auto-saved on blur
- [ ] AI bullet summary supports up to 7 bullets, add/edit/reorder/delete
- [ ] Published/Draft toggle updates `candidate_profiles.is_published`
- [ ] Unpublished profiles return 404 on public URL
- [ ] Copy link copies URL to clipboard with confirmation toast
- [ ] QR code generates correctly and links to profile
- [ ] Badge downloads as PNG

### 3.2 Assets Tab

Where professionals upload assets produced in NotebookLM.

**Asset types:**

| Asset | Accepted Formats | Max Size |
|---|---|---|
| Audio Overview | MP3, M4A, WAV | 50MB |
| Debate Audio | MP3, M4A, WAV | 50MB |
| Video Overview | MP4, MOV, WEBM | 500MB |
| Slide Deck | PDF | 25MB |
| Career Infographic | PNG, JPG, WEBP | 10MB |
| ATS Resume | PDF | 5MB |

Per asset: upload, preview, replace, delete. All professionals can upload all asset types.

**Acceptance criteria:**
- [ ] All six asset types uploadable
- [ ] File type and size validation before upload
- [ ] Upload progress indicator shown
- [ ] Asset stored in correct Supabase Storage bucket
- [ ] Asset record created in `candidate_assets` table
- [ ] Replace updates file and storage path
- [ ] Delete removes from storage and database
- [ ] All asset previews functional

### 3.3 AI Tab -- Identity AI

The core Identity AI management interface. This is where professionals arm their chatbot.

**Resume Intelligence Panel (top of AI tab):**

Shown after resume upload. Analyzes the resume for what recruiters and ATS systems will flag and returns targeted context recommendations. See Section 8A for full spec.

- Displays flagged items ordered by severity (high / medium / low)
- Each flag shows: what a recruiter will notice, what to add, and a direct link to the relevant context field
- Completion bar tracks how many flags have been addressed
- Re-analyze available when target role changes or resume is updated

**Context form -- Career Intelligence:**

Guided by Resume Intelligence recommendations. Fields listed below. All optional except resume text and key wins.

- Resume text (required -- paste or upload)
- Top 5 career wins with specific numbers (required)
- Target role and target company type
- Leadership philosophy
- How you handle an underperforming team member
- Ideal team and work environment
- What you need from a manager to do your best work
- Why you left each of your last 3 roles
- Biggest professional challenge and what you did about it
- What you are not good at -- honest answer
- Questions you wish contacts would ask you
- What defines your career in one sentence

**Custom answers:**
- List of question-answer pairs the professional has refined based on contact transcript patterns
- Add, edit, and delete custom answers
- Custom answers are injected into the system prompt with highest priority

**Privacy controls:**
- Toggle: AI chat enabled / disabled for this profile
- Topics to redirect to direct conversation (add/remove list)
- Example redirects: salary expectations, references, availability date

**Testing interface:**
- "Test your AI" sandbox
- The professional asks their own AI questions
- Sees exactly how it responds before going live
- Preview mode label: "This is how your AI responds to contacts"

**Pattern insights (shown after first contact conversations):**
- Most asked questions this week
- Questions your AI redirected
- Suggestions for new custom answers based on patterns

**Acceptance criteria:**
- [ ] Resume Intelligence panel visible after resume upload
- [ ] Flags displayed ordered by severity
- [ ] Each flag CTA links directly to the relevant context field
- [ ] Completion bar updates as context fields are filled in
- [ ] All context fields saved to `candidate_profiles`
- [ ] Custom QA pairs stored as JSONB in `custom_qa_pairs`
- [ ] Privacy toggle updates `ai_enabled`
- [ ] Redirect topics stored in `redirect_topics` array
- [ ] Testing interface calls the same chat endpoint as contact chat
- [ ] Pattern insights shown after minimum 1 completed session
- [ ] All changes reflected immediately in AI responses

### 3.4 Transcripts Tab

Full history of all contact AI conversations.

**List view:**
- Company name (if a business user was logged in) or "Anonymous contact"
- Date and time
- Number of questions asked
- Duration
- Link to full transcript

**Full transcript view:**
- Every question asked and every AI answer
- Timestamp per message
- Link to fine-tune a specific answer

**Acceptance criteria:**
- [ ] All chat sessions shown reverse chronological
- [ ] Company name shown when a business user was logged in
- [ ] Anonymous shown for unauthenticated viewers
- [ ] Full transcript readable inline
- [ ] Direct link from each question to AI fine-tuning interface

### 3.5 Analytics Tab

**Metrics:**
- Total profile views all time
- Views in last 7 days / 30 days
- Total AI chat sessions
- Average questions per session
- Asset play counts by type
- Most viewed time of day

**Acceptance criteria:**
- [ ] All metrics pulled from `profile_views` and `chat_sessions` tables
- [ ] Asset play counts tracked per asset type
- [ ] Anonymous views shown separately from business-user views

### 3.6 Preview Tab

Shows the professional exactly what contacts see.

- Full modal rendered in preview frame
- "This is how contacts see your profile" label
- Draft banner if profile is unpublished
- Chat tab functional in preview using the professional's own AI

**Acceptance criteria:**
- [ ] Modal renders identically to public `/i/[slug]`
- [ ] Chat interface functional in preview mode
- [ ] Draft banner shown for unpublished profiles

---

## 4. Public Professional Profile -- The Modal

Core contact-facing experience at `/i/[slug]`.

### 4.1 Modal Behavior

- Full page with dark overlay background
- Modal centered -- 640px wide desktop, full screen mobile
- No login required to view
- Returns 404 for unpublished profiles

### 4.2 Modal Header

- Professional's initials avatar (colored circle, generated from name)
- Full name
- Headline
- Location and target role

### 4.3 AI Bullet Summary Panel

- Always visible below header, no tab click required
- 5-7 career snapshot bullets
- Labeled "Career snapshot"

### 4.4 Media Tabs

Tabs: Audio | Debate | Video | Deck | Infographic | Resume

Only tabs with uploaded assets are shown.

**Audio tab:** Custom player, play/pause, progress bar, seek, current time / total duration
**Debate tab:** Same custom player -- labeled "Hiring committee debate"
**Video tab:** Embedded player, play/pause, progress, fullscreen
**Deck tab:** PDF embed, scrollable, download button
**Infographic tab:** Full-width image, download button
**Resume tab:** "ATS-Ready Resume" label, download PDF button

All assets stream from signed Supabase Storage URLs (1-hour TTL, generated server-side).

### 4.5 Chat Tab -- Identity AI

The AI chat interface embedded in the modal.

**Interface:**
- "Ask [Name]'s AI anything" header
- Message input field
- Send button
- Conversation history in chat bubbles
- "Powered by IdentiBoost AI" footer label
- Disclaimer: "This AI represents [Name]'s verified professional identity and may not reflect every detail"

**Behavior:**
- Chat session created on first message
- All messages logged to `chat_messages`
- System prompt built from the professional's data and custom QA pairs
- Claude Haiku generates all responses (fast, cheap, conversational)
- Session ends on modal close or 30 minutes of inactivity
- Transcript delivered by email to both sides on session end

**If AI disabled by the professional:**
- Chat tab hidden entirely

**Acceptance criteria:**
- [ ] Chat interface loads when Chat tab clicked
- [ ] Messages send and receive correctly
- [ ] Conversation history persists within session
- [ ] Session logged to `chat_sessions`
- [ ] All messages logged to `chat_messages`
- [ ] Transcript email sent to the professional after session ends
- [ ] Transcript email sent to logged-in business user after session ends
- [ ] Tab hidden if the professional has disabled AI
- [ ] Fully keyboard navigable
- [ ] Screen reader accessible

### 4.6 Business User Actions

Shown when a business user is logged in:
- Save button -- saves to pool, changes to Saved with filled icon
- Connect button -- opens feedback compose
- Status dropdown -- assign stage (shown if already saved)
- Share button -- copies public URL

Unauthenticated viewers see Save and Connect -- clicking prompts sign up first.

### 4.7 View and Chat Tracking

Every modal open logs a view in `profile_views`.
Every chat session logs to `chat_sessions` with `employer_account_id` if a business user is logged in.
Duration tracked on modal close.

**Acceptance criteria:**
- [ ] View logged on every modal open
- [ ] Duration tracked on close
- [ ] Chat session created on first message
- [ ] Session closed and transcript triggered on modal close
- [ ] Fully keyboard navigable
- [ ] Focus trapped while open
- [ ] ESC closes modal
- [ ] WCAG 2.1 AA compliant

---

## 5. Business Features

### 5.1 Saved Professionals Tab

Saved professional pool. Grid of profile cards.

**Card shows:** Avatar, name, headline, stage badge, posting, asset indicators, date saved

**Filters:** By posting, by stage, by date saved
**Search:** By name or headline

Clicking card opens the profile modal inline.

**Acceptance criteria:**
- [ ] All saved professionals shown
- [ ] Filter and search functional
- [ ] Modal opens inline on card click
- [ ] Free tier limited to 5 saved professionals

### 5.2 Jobs Tab

**Job postings list:** Title, department, location, saved-professional count, active status

**Create/Edit form:** Title (required), department, location, description, active toggle

**Acceptance criteria:**
- [ ] All postings shown for the business account
- [ ] Create and edit functional
- [ ] Free tier limited to 1 posting

### 5.3 Board Tab

Saved professionals filtered by posting, grouped by stage.

**Per row:** Name, headline, asset indicators, date added, stage dropdown, notes field

Stage dropdown: Saved / Screening / Interview / Offer / Passed -- updates `saved_candidates.stage`

Notes auto-save on blur. Visible to all team members.

**Acceptance criteria:**
- [ ] Board shows saved professionals for selected posting only
- [ ] Stage dropdown updates database
- [ ] Notes auto-save
- [ ] Clicking name opens modal inline

### 5.4 Transcripts Tab

History of all AI chat conversations by business team members.

**List view:** Professional's name, team member who chatted, date, question count
**Full transcript:** All questions and answers, link to save the professional, link to send feedback

**Acceptance criteria:**
- [ ] All chat sessions shown for the business account
- [ ] Full transcript readable
- [ ] Save-professional and send-feedback CTAs functional

### 5.5 Team Tab

Available on the paid team tiers (Team, Growth, Scale).

**Team list:** Name, email, role, date added
**Invite flow:** Email input, Clerk invite email, auto-add on sign-up

**Acceptance criteria:**
- [ ] All `employer_members` shown
- [ ] Invite sends via Clerk
- [ ] Owner can remove members but not self
- [ ] Free accounts see locked state with upgrade CTA

### 5.6 Sending Feedback

From the profile modal (Connect button) or the saved-profile card action menu.

**Compose:** Text area (max 1000 chars) with character counter, send button

**Acceptance criteria:**
- [ ] Compose accessible from modal and card
- [ ] Send creates feedback row
- [ ] The professional receives email notification
- [ ] The professional sees feedback in their dashboard
- [ ] Business user sees confirmation toast

---

## 6. Email Delivery -- Transcript System

### 6.1 Chat Session Lifecycle

1. Contact opens modal and sends first message -- `chat_sessions` row created
2. Messages logged in real time to `chat_messages`
3. Session ends when modal closes OR 30 minutes of inactivity
4. `POST /api/transcripts/deliver` called
5. Transcript built from all `chat_messages` in session
6. Email sent to the professional via Resend
7. Email sent to the business user if logged in via Resend
8. `chat_sessions.transcript_sent` set to true

### 6.2 Professional Transcript Email

**Subject:** Someone just chatted with your IdentiBoost AI

**Body:**
- Company name (or "An anonymous contact") viewed your profile
- Date and time, number of questions asked
- Full conversation transcript
- Pattern insight if same question asked 3+ times this week
- CTA: Fine-tune your AI
- CTA: View full analytics

### 6.3 Contact Transcript Email

**Subject:** Your IdentiBoost conversation with [Name]

**Body:**
- Summary -- N questions asked, duration
- Full conversation transcript
- CTA: View full profile
- CTA: Save this professional
- CTA: Send feedback

### 6.4 Feedback Notification Email

**Subject:** You have new feedback from [Company Name] on IdentiBoost

**Body:**
- Company name and message preview
- CTA: Read full feedback

**Acceptance criteria:**
- [ ] Transcript email sent to the professional after every session
- [ ] Transcript email sent to the logged-in business user after every session
- [ ] Feedback email sent to the professional on every feedback submission
- [ ] All emails from `transcripts@identiboost.com`
- [ ] Email templates mobile responsive
- [ ] Unsubscribe link included per CAN-SPAM

---

## 7. AI Chatbot System

### 7.1 System Prompt Construction

Built from `candidate_profiles` fields:

```
You are the career AI for [full_name]. You represent them professionally to recruiters
and hiring managers. Answer only from the career information provided below. If asked
something outside this data, redirect to direct conversation.

Never invent, embellish, or extrapolate beyond what is provided. If you do not know
the answer from the provided data, say so honestly and suggest the recruiter connect
directly.

CAREER INFORMATION:
[resume_text]

CAREER CONTEXT:
Target Role: [target_role]
Leadership Philosophy: [leadership_philosophy]
Key Wins: [key_wins]
Departure Reasons: [departure_reasons]
Biggest Challenge: [biggest_challenge]
Ideal Environment: [ideal_environment]
Manager Needs: [manager_needs]
Honest Weaknesses: [honest_weaknesses]
Wish Questions: [wish_questions]

CUSTOM ANSWERS (candidate-refined, highest priority):
[custom_qa_pairs formatted as Q: / A: pairs]

TOPICS TO REDIRECT:
[redirect_topics -- respond: "I would recommend connecting directly with [name]
to discuss this. You can reach them via the Connect button on their profile."]

Keep responses concise, warm, and grounded. No corporate speak.
Let the career data speak for itself.
```

### 7.2 Chat API

`POST /api/chat`

Request: `{ candidateSlug, message, sessionId, conversationHistory }`
Response: `{ answer, sessionId }`

Model: `claude-haiku-4-5-20251001` -- fast, cheap, conversational. Max tokens 500.

### 7.3 Fine-Tuning Data Model

`custom_qa_pairs` stored as JSONB array in `candidate_profiles`:

```json
[
  {
    "question": "Why did you leave Bedgear?",
    "answer": "The role was a startup build that I completed successfully. I established
    the systems, hired and trained the team, and handed off a running operation. I am most
    energized by building from zero and that chapter was complete."
  }
]
```

Custom answers injected into system prompt above base career data -- they take priority.

### 7.4 Privacy Controls

`redirect_topics` stored as `TEXT[]` in `candidate_profiles`.

`ai_enabled` BOOLEAN -- when false, Chat tab hidden entirely from modal.

---

## 8. Professional Context Form -- Deep Career Questions

The intake form that trains the AI. Shown after initial onboarding. Guided by Resume Intelligence recommendations so professionals know which fields matter most for their specific resume.

**Section 1 -- Career highlights:**
- Paste your full resume or upload it (required)
- Top 5 career wins with specific numbers (required)
- Target role and target company type (required)

**Section 2 -- Leadership and work style:**
- Describe your leadership philosophy in your own words
- How do you handle an underperforming team member?
- What does your ideal team look like?
- What do you need from a manager to do your best work?

**Section 3 -- Honest answers contacts appreciate:**
- Why did you leave each of your last 3 roles?
- What is your biggest professional failure and what did you learn?
- What are you not good at -- be honest?
- What question do you wish contacts would ask you?

**Section 4 -- Your story:**
- What defines your career in one sentence?
- What gets you out of bed in the morning professionally?
- Where do you want to be in 5 years?

**Acceptance criteria:**
- [ ] All fields optional except resume text and key wins
- [ ] Auto-saves on blur
- [ ] Preview AI responses immediately after saving each section
- [ ] Progress indicator showing completion percentage
- [ ] Completion nudges shown -- "Your AI gives better answers with leadership context"
- [ ] Resume Intelligence panel visible above form after resume upload

---

## 8A. Resume Intelligence -- AI-Powered Context Recommendations

### 8A.1 Overview

Resume Intelligence is the layer between resume upload and the context form. It serves every vertical whose evaluators read resumes, sharpest in the job-search vertical. When a professional uploads or pastes their resume, Claude Sonnet analyzes it through the lens of what recruiters and ATS systems flag -- gaps, short tenures, career pivots, layoffs, missing degrees, title mismatches, skills without evidence, missing metrics -- and returns a targeted set of context-building recommendations.

The output is not a resume score. It is a prioritized list of questions the professional's AI chatbot needs to be able to answer, derived directly from what is in the resume.

The framing to the professional:

**"Based on your resume, here are the questions recruiters are likely to ask. Let's make sure your AI has the answers before they do."**

This is what empowers the professional's voice to be heard before anyone decides they are not worth a conversation. Every context field filled in based on a Resume Intelligence recommendation is one fewer time a professional has to answer that question defensively on a first call.

### 8A.2 How It Works

**Trigger:** The professional uploads or pastes resume text for the first time, or re-uploads an updated resume.

**Process:**
1. Resume text extracted from uploaded PDF or taken from paste field
2. `POST /api/resume-intelligence` with resume text and target role
3. Claude Sonnet analyzes resume against the recruiter and ATS flag rubric (see 8A.4)
4. Returns structured JSON containing flagged items and recommended context fields
5. Recommendations displayed in AI tab as prioritized list
6. Each recommendation links directly to the relevant context field
7. Completed recommendations marked with checkmark as the professional fills in context
8. Recommendations persist and update when the professional uploads a new resume

**API endpoint:** `POST /api/resume-intelligence`

**Request:**
```typescript
{
  resumeText: string,
  targetRole: string,
  candidateProfileId: string
}
```

**Response:**
```typescript
{
  flags: ResumeFlag[],
  completionScore: number,
  generatedAt: string
}

type ResumeFlag = {
  id: string,
  category: FlagCategory,
  severity: 'high' | 'medium' | 'low',
  title: string,
  explanation: string,
  recommendation: string,
  contextField: string,
  isAddressed: boolean
}

type FlagCategory =
  | 'employment_gap'
  | 'career_pivot'
  | 'layoff_or_rif'
  | 'no_degree'
  | 'short_tenure'
  | 'title_mismatch'
  | 'skills_without_evidence'
  | 'missing_metrics'
  | 'departure_reason'
  | 'overqualification'
  | 'underqualification'
  | 'returning_to_workforce'
```

### 8A.3 The Analysis Prompt

Claude Sonnet receives the following system prompt:

```
You are a senior recruiter and ATS specialist reviewing a candidate's resume. Your job
is to identify the specific things that will get flagged by ATS systems and human
recruiters during the screening process -- not to critique the candidate, but to help
them prepare their AI chatbot to answer these questions confidently before a recruiter
ever asks.

Analyze the resume against the following categories. For each flag identified, return
a structured object with: the category, severity, a plain-language title, an explanation
of what a recruiter or ATS will notice, a specific recommendation for what context to
add, and which context field that recommendation belongs in.

FLAG CATEGORIES:

employment_gap -- Any gap of 3+ months between roles. Severity: high if 12+ months,
medium if 6-12 months, low if 3-6 months. Context field: departure_reasons.

career_pivot -- Significant change in industry, function, or level unexplained by the
resume. Severity: high if unexplained and recent. Context fields: leadership_philosophy,
biggest_challenge.

layoff_or_rif -- Indication of reduction in force, company closure, or involuntary
separation. Severity: high (asked in first 60 seconds of every screening call).
Context field: departure_reasons.

no_degree -- Absence of degree where target role typically requires one.
Severity: high if degree commonly required, medium otherwise. Context field: key_wins.

short_tenure -- Any role under 18 months, especially if pattern of multiple.
Severity: medium to high. Context field: departure_reasons.

title_mismatch -- Gap between most recent title and target role -- significant step up
or step down. Severity: medium. Context fields: key_wins, leadership_philosophy.

skills_without_evidence -- Skills listed not supported by specific examples or outcomes.
Severity: medium. Context fields: key_wins, biggest_challenge.

missing_metrics -- Work experience describes responsibilities without quantified outcomes
in roles where numbers are expected. Severity: medium. Context field: key_wins.

departure_reason -- Role where departure reason is not obvious and likely to be asked.
Severity: medium. Context field: departure_reasons.

overqualification -- Candidate appears significantly more experienced than target role
requires. Severity: low to medium. Context fields: ideal_environment, manager_needs.

returning_to_workforce -- Out of workforce 12+ months, re-entering.
Severity: high. Context field: departure_reasons.

RULES:
- Return only flags genuinely present. Do not invent flags.
- Maximum 6 flags. Prioritize by severity and recruiter impact.
- High severity: recruiter asks in first 60 seconds of screening call.
- Medium severity: recruiter likely asks at some point.
- Low severity: ATS may flag but recruiter may not always ask.
- Keep explanations plain and direct. No hedging.
- Return valid JSON only. No preamble, no markdown fences.
```

### 8A.4 UI -- Resume Intelligence Panel

**Location:** AI tab, above the context form.

**States:**
- Not analyzed (no resume): muted panel with CTA to upload resume
- Analyzing: skeleton loader, "Analyzing your resume..."
- Results: prioritized flag cards with completion bar
- All addressed: green completion state

**Each flag card:**
- Severity dot (red = high, amber = medium, gray = low)
- Title
- Explanation (what a recruiter will notice)
- Recommendation (what to add)
- "Add context" CTA linking directly to the relevant context field
- Checkmark when context field is filled in (50+ characters)

**Completion bar:** "X of Y recruiter questions covered" -- fills as the professional addresses flags.

### 8A.5 Data Model Additions

```sql
ALTER TABLE candidate_profiles
  ADD COLUMN IF NOT EXISTS resume_intelligence_flags JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS resume_intelligence_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS resume_intelligence_run_at TIMESTAMPTZ;
```

A flag is considered addressed when its linked `contextField` in `candidate_profiles` is non-null and contains more than 50 characters. Score recalculates on every context field save.

### 8A.6 Trigger Points

- First resume upload: runs automatically
- Resume replacement: runs automatically, replaces prior flags
- Manual re-run: available from AI tab when target role changes

### 8A.7 Model and Cost

Model: `claude-sonnet-4-6` -- one-time generation per resume, not real-time chat.
Estimated cost: ~$0.02 per analysis (1,500 tokens input + 800 tokens output at Sonnet pricing).

### 8A.8 Acceptance Criteria

- [ ] Resume Intelligence panel visible in AI tab after resume upload
- [ ] Panel shows loading state during Claude API call
- [ ] Flags displayed ordered by severity
- [ ] Each flag card shows title, explanation, recommendation, and CTA
- [ ] CTA links to relevant context field and scrolls to it
- [ ] Completion bar updates as context fields are filled in
- [ ] Flags marked addressed when linked field has 50+ characters
- [ ] Panel shows completion state when all flags addressed
- [ ] Re-analysis available when target role changes
- [ ] New resume upload triggers automatic re-analysis
- [ ] Results stored in `candidate_profiles.resume_intelligence_flags`
- [ ] Score stored in `candidate_profiles.resume_intelligence_score`
- [ ] All UI meets WCAG 2.1 AA

### 8A.9 Phase and Priority

**Phase 3** -- builds on top of the context form and Claude API integration.
Build after the base context form is live and chat endpoint is working.
This is an enhancement layer, not a prerequisite.

---

## 9. Pricing and Feature Gates

### Professional Tiers -- Individual

Professionals generate real API costs at two points:
- Resume Intelligence (Claude Sonnet): approximately $0.02 per resume upload/re-analysis
- AI chatbot (Claude Haiku): approximately $0.0008 per contact chat session

The free Starter tier maximizes profile volume; Pro and Business monetize professionals who use their Identity AI as a working tool. The embed widget and CRM export are roadmap features and must be labeled "coming soon" wherever they appear.

| Feature | Starter (Free) | Pro $29 | Business $99 |
|---|---|---|---|
| Full profile and all media assets | Yes | Yes | Yes |
| Shareable link, QR code, badge | Yes | Yes | Yes |
| Resume Intelligence | Yes | Yes | Yes |
| Basic AI chatbot | Yes | Yes | Yes |
| Transcript delivery by email | Yes | Yes | Yes |
| Custom Q&A and fine-tuning | No | Yes | Yes |
| Conversation analytics | No | Yes | Yes |
| Embed widget (coming soon) | No | Yes | Yes |
| CRM export (coming soon) | No | No | Yes |
| Advanced analytics | No | No | Yes |
| Priority support | No | No | Yes |

### Team Tiers -- Company Deployment

For companies deploying IdentiBoost across their people: sales teams, consulting benches, exhibitor rosters, and hiring pipelines.

| Feature | Team $299 | Growth $699 | Scale $1,499 |
|---|---|---|---|
| Profiles included | Up to 10 | Up to 25 | Unlimited |
| Company-level AI layer | Yes | Yes | Yes |
| Aggregate analytics | Yes | Yes | Yes |
| CRM integration | No | Yes | Yes |
| White label option | No | No | Yes |
| Dedicated onboarding | No | No | Yes |

The free business-side account keeps its existing limits: 5 saved professionals, 1 posting, AI chat, and transcript delivery.

---

## 10. Paddle Integration

Individual professional billing (Pro $29 / Business $99) and team billing (Team $299 / Growth $699 / Scale $1,499) run through Paddle. New Paddle price IDs for the individual professional tiers are pending setup; team billing is active from launch.

| Variable | Tier |
|---|---|
| `PADDLE_EMPLOYER_STARTER_PRICE_ID` | Team $299/mo |
| `PADDLE_EMPLOYER_GROWTH_PRICE_ID` | Growth $699/mo |
| `PADDLE_EMPLOYER_SCALE_PRICE_ID` | Scale $1,499/mo |

The environment variable names keep the legacy `EMPLOYER` prefix; renaming them requires a code change and is out of scope for the rebrand.

Webhook handler at `/api/webhooks/paddle`.

Events: `subscription.created`, `subscription.updated`, `subscription.cancelled`, `subscription.payment.failed`

Always verify Paddle webhook signature before processing. Free tier limits enforced server-side on every relevant Server Action.

---

## 11. Storage

All buckets private. Signed URLs with 1-hour TTL generated server-side.

| Bucket | Max Size | Types |
|---|---|---|
| `candidate-audio` | 50MB | audio/mpeg, audio/mp4, audio/wav |
| `candidate-video` | 500MB | video/mp4, video/quicktime, video/webm |
| `candidate-documents` | 25MB | application/pdf |
| `candidate-images` | 10MB | image/png, image/jpeg, image/webp |

File path: `{clerk_user_id}/{timestamp}-{sanitized-filename}`

Signed URLs generated in Server Component on every modal load. Modal client receives pre-signed URLs -- never calls Supabase Storage directly.

---

## 12. Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
  email TEXT NOT NULL,
  paddle_subscription_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due')),
  subscription_tier TEXT
    CHECK (subscription_tier IN ('pro', 'starter', 'growth', 'scale')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_self ON users
  FOR ALL TO authenticated
  USING (clerk_user_id = requesting_user_id())
  WITH CHECK (clerk_user_id = requesting_user_id());

-- Candidate profiles
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  full_name TEXT NOT NULL,
  headline TEXT CHECK (char_length(headline) <= 200),
  target_role TEXT,
  location TEXT,
  linkedin_url TEXT,
  resume_text TEXT,
  summary_bullets TEXT[] DEFAULT '{}',
  -- AI context fields
  leadership_philosophy TEXT,
  key_wins TEXT,
  departure_reasons TEXT,
  biggest_challenge TEXT,
  ideal_environment TEXT,
  manager_needs TEXT,
  honest_weaknesses TEXT,
  wish_questions TEXT,
  custom_qa_pairs JSONB DEFAULT '[]',
  redirect_topics TEXT[] DEFAULT '{}',
  ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  -- Resume Intelligence fields
  resume_intelligence_flags JSONB DEFAULT '[]',
  resume_intelligence_score INTEGER DEFAULT 0,
  resume_intelligence_run_at TIMESTAMPTZ,
  -- Profile settings
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY candidate_profiles_owner ON candidate_profiles
  FOR ALL TO authenticated
  USING (clerk_user_id = requesting_user_id())
  WITH CHECK (clerk_user_id = requesting_user_id());
CREATE POLICY candidate_profiles_public_read ON candidate_profiles
  FOR SELECT TO anon
  USING (is_published = TRUE);

-- Candidate assets
CREATE TABLE candidate_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL
    CHECK (asset_type IN ('audio', 'debate_audio', 'video', 'deck', 'infographic', 'resume')),
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes INTEGER,
  duration_seconds INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE candidate_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY candidate_assets_owner ON candidate_assets
  FOR ALL TO authenticated
  USING (clerk_user_id = requesting_user_id())
  WITH CHECK (clerk_user_id = requesting_user_id());

-- AI chat sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  viewer_clerk_user_id TEXT REFERENCES users(clerk_user_id) ON DELETE SET NULL,
  employer_account_id UUID REFERENCES employer_accounts(id) ON DELETE SET NULL,
  employer_company_name TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  transcript_sent BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY chat_sessions_candidate_read ON chat_sessions
  FOR SELECT TO authenticated
  USING (
    candidate_profile_id IN (
      SELECT id FROM candidate_profiles WHERE clerk_user_id = requesting_user_id()
    )
  );
CREATE POLICY chat_sessions_employer_read ON chat_sessions
  FOR SELECT TO authenticated
  USING (
    employer_account_id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );
CREATE POLICY chat_sessions_insert ON chat_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);

-- AI chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY chat_messages_session_access ON chat_messages
  FOR ALL TO anon, authenticated
  USING (
    chat_session_id IN (
      SELECT id FROM chat_sessions
      WHERE
        candidate_profile_id IN (
          SELECT id FROM candidate_profiles WHERE clerk_user_id = requesting_user_id()
        )
        OR employer_account_id IN (
          SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
        )
    )
  );

-- Employer accounts
CREATE TABLE employer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT,
  team_size TEXT,
  created_by TEXT NOT NULL REFERENCES users(clerk_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE employer_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY employer_accounts_members ON employer_accounts
  FOR ALL TO authenticated
  USING (
    id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );

-- Employer team members
CREATE TABLE employer_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_account_id UUID NOT NULL REFERENCES employer_accounts(id) ON DELETE CASCADE,
  clerk_user_id TEXT NOT NULL REFERENCES users(clerk_user_id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  invited_by TEXT REFERENCES users(clerk_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employer_account_id, clerk_user_id)
);

ALTER TABLE employer_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY employer_members_same_account ON employer_members
  FOR ALL TO authenticated
  USING (
    employer_account_id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );

-- Job postings
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_account_id UUID NOT NULL REFERENCES employer_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NOT NULL REFERENCES users(clerk_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_postings_employer_account ON job_postings
  FOR ALL TO authenticated
  USING (
    employer_account_id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );

-- Saved candidates
CREATE TABLE saved_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_account_id UUID NOT NULL REFERENCES employer_accounts(id) ON DELETE CASCADE,
  candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_posting_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
  stage TEXT NOT NULL DEFAULT 'saved'
    CHECK (stage IN ('saved', 'screening', 'interview', 'offer', 'passed')),
  notes TEXT,
  saved_by TEXT NOT NULL REFERENCES users(clerk_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employer_account_id, candidate_profile_id)
);

ALTER TABLE saved_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY saved_candidates_employer_account ON saved_candidates
  FOR ALL TO authenticated
  USING (
    employer_account_id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_account_id UUID NOT NULL REFERENCES employer_accounts(id) ON DELETE CASCADE,
  candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  sent_by TEXT NOT NULL REFERENCES users(clerk_user_id),
  message TEXT NOT NULL CHECK (char_length(message) <= 1000),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY feedback_employer ON feedback
  FOR ALL TO authenticated
  USING (
    employer_account_id IN (
      SELECT employer_account_id FROM employer_members WHERE clerk_user_id = requesting_user_id()
    )
  );
CREATE POLICY feedback_candidate_read ON feedback
  FOR SELECT TO authenticated
  USING (
    candidate_profile_id IN (
      SELECT id FROM candidate_profiles WHERE clerk_user_id = requesting_user_id()
    )
  );
CREATE POLICY feedback_candidate_update ON feedback
  FOR UPDATE TO authenticated
  USING (
    candidate_profile_id IN (
      SELECT id FROM candidate_profiles WHERE clerk_user_id = requesting_user_id()
    )
  )
  WITH CHECK (TRUE);

-- Profile views
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  viewer_clerk_user_id TEXT REFERENCES users(clerk_user_id) ON DELETE SET NULL,
  employer_account_id UUID REFERENCES employer_accounts(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER
);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY profile_views_candidate_read ON profile_views
  FOR SELECT TO authenticated
  USING (
    candidate_profile_id IN (
      SELECT id FROM candidate_profiles WHERE clerk_user_id = requesting_user_id()
    )
  );
CREATE POLICY profile_views_insert ON profile_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);
```

---

## 13. Accessibility Requirements

All UI must meet WCAG 2.1 AA. Non-negotiable.

- Minimum 44px touch targets on mobile
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 for large text and UI components
- All interactive elements keyboard accessible
- All images have meaningful alt text or `aria-hidden="true"` for decorative
- Focus indicators visible on all focusable elements
- Focus trapped inside modal while open
- ESC closes modal and returns focus to trigger
- All form inputs have associated `<label>` elements
- Error messages associated with inputs via `aria-describedby`
- No information conveyed by color alone

---

## 14. Build Phases

### Phase 0 -- Foundation (Week 1-2)
- [ ] Initialize Next.js with TypeScript and Tailwind
- [ ] Configure Clerk
- [ ] Configure Supabase with Clerk third-party auth
- [ ] Run all database migrations (all tables from Section 12)
- [ ] Create Supabase Storage buckets
- [ ] Configure Resend domain and sending address
- [ ] Set up Vercel under `builtwithrobots`
- [ ] Configure all environment variables

### Phase 1 -- Professional Profiles and Modal (Week 2-4)
- [ ] Onboarding -- role selection
- [ ] Professional onboarding -- 3 steps
- [ ] Professional dashboard layout and navigation
- [ ] Profile editor (Section 3.1)
- [ ] Asset upload (Section 3.2)
- [ ] Public modal at `/i/[slug]` (Section 4, without chat tab)
- [ ] View tracking
- [ ] QR code generation
- [ ] Badge download

### Phase 2 -- Business Dashboard (Week 4-7)
- [ ] Business onboarding -- 2 steps
- [ ] Business dashboard layout
- [ ] Saved professionals tab (Section 5.1)
- [ ] Save professional from modal
- [ ] Jobs tab (Section 5.2)
- [ ] Board tab (Section 5.3)
- [ ] Stage assignment
- [ ] Notes
- [ ] Feedback compose and send (Section 5.6)
- [ ] Feedback notification email via Resend

### Phase 3 -- AI Chatbot, Transcripts, Resume Intelligence (Week 7-10)
- [ ] Professional context form (Section 8)
- [ ] Resume Intelligence -- Claude Sonnet analysis (Section 8A)
- [ ] Resume Intelligence panel UI in AI tab
- [ ] System prompt builder -- `lib/ai/build-system-prompt.ts`
- [ ] Claude Haiku chat endpoint -- `/api/chat`
- [ ] Chat UI in modal -- Chat tab (Section 4.5)
- [ ] Chat session and message logging
- [ ] Identity AI tab -- full management interface (Section 3.3)
- [ ] Fine-tuning interface -- custom QA pairs
- [ ] Privacy controls -- redirect topics and `ai_enabled` toggle
- [ ] Testing sandbox -- the professional tests their own AI
- [ ] Transcript delivery endpoint -- `/api/transcripts/deliver`
- [ ] Professional transcript email template
- [ ] Contact transcript email template
- [ ] Transcripts tab for professionals (Section 3.4)
- [ ] Transcripts tab for businesses (Section 5.4)
- [ ] Pattern recognition -- most asked questions
- [ ] Mobile responsive audit
- [ ] WCAG 2.1 AA audit

### Phase 4 -- Payments and Polish (Week 10-12)
- [ ] Paddle JS integration for team tiers
- [ ] Business-side upgrade prompts at free tier limits
- [ ] Checkout flow
- [ ] Paddle webhook handler (Section 10)
- [ ] Subscription status gates on features
- [ ] Billing management via Paddle customer portal
- [ ] Error states and empty states for all screens
- [ ] Loading and skeleton screens
- [ ] Analytics tab (Section 3.5)
- [ ] Individual professional tier implementation (Pro $29 / Business $99)

---

## 15. Out of Scope for MVP

Do not build. Push back if asked.

- AI asset generation on platform -- NotebookLM is the production engine
- Drag and drop Kanban -- dropdown stage assignment only
- Business-side browse directory -- professionals are saved via shared links only
- Resume parsing or ATS keyword optimization (distinct from Resume Intelligence)
- Video or audio recording in browser
- Real-time chat notifications -- email transcripts are the delivery mechanism
- Voice cloning for AI chatbot
- Multi-language support
- Native mobile app
- Social features or endorsements
- External ATS integrations (Workday, Greenhouse, Lever)
- Job description gap analysis feature -- post-MVP, pending Claude API candidate-paste flow
