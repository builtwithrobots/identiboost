# IdentiBoost Pivot: Complete Development Plan

Generated from a full audit of the RoleBoost codebase (builtwithrobots/roleboost), its 28 Supabase migrations, its `.env.example`, and the live Vercel environment variables (screenshot provided 2026-07-14). Every checkbox starts unchecked. No task is assumed complete.

Source of truth for the rebrand rules: the IdentiBoost Pivot Brief (this repo's current README.md).

## Decisions log (founder, 2026-07-14)

1. Clerk: NEW application for IdentiBoost (not reusing the RoleBoost app).
2. Data: IdentiBoost starts empty; the rob-ramos profile is rebuilt fresh in Phase 10 (no migration from the old Supabase project).
3. Evaluator side: light rename for v1 (Candidates→Professionals, Hiring→Evaluating, etc.); structural rethink of the evaluator workspace deferred to the roadmap.
4. ai-brain-architecture-snapshot.md: rebrand it (find and replace brand/domain strings), do not delete or freeze.
5. Public-card chat openers: context-neutral copy now. Roadmap feature: owner-created conversation starters managed in the dashboard and shown as chips in their chat (needs a schema addition; post-launch).

Audit numbers, for reference:
- 96 files contain "roleboost" in some casing (468 occurrences); roughly 55 are product code, the rest are docs and sample assets.
- 10 environment variables exist in the live roleboost Vercel project; `RESEND_API_KEY` and all `PADDLE_*` vars are absent from the Project tab.
- 28 migration files exist; all 28 (plus 1 new hardening migration) must be applied to the fresh IdentiBoost Supabase project.

---

## Phase 0: Prerequisites (do before any code changes)

External service setup and verification. Nothing in later phases works until these are done.

### Repo

- [x] Copy the RoleBoost codebase into the builtwithrobots/identiboost repo. The identiboost repo currently contains only README.md (the pivot brief) and .gitignore. Copy every tracked file from builtwithrobots/roleboost at its current main HEAD, excluding `.git/`. Preserve the pivot brief by moving it to `IDENTIBOOST_PIVOT_README.md` before the copy so the incoming RoleBoost README.md does not collide with it. Verify: `git status` shows the full app tree; `npm install && npm run build` succeeds with placeholder env values. (Done 2026-07-14; copied from roleboost main HEAD, pivot brief preserved as IDENTIBOOST_PIVOT_README.md, build verified.)
- [x] Delete `templates/catalyst-ui-kit.zip` and `templates/opsfluency-main.zip` (~7 MB of unreferenced UI-kit archives, already flagged in roleboost todo.md P3). Verify: `grep -r "templates/" app components lib` returns nothing that references them. (Done 2026-07-14.)

### Domain

- [ ] Confirm ownership of identiboost.com and that DNS is manageable (registrar access). Verify: `whois identiboost.com` shows your registration; you can add DNS records.
- [ ] Decide and document email addresses: transcripts@identiboost.com (sending), privacy@identiboost.com and legal@identiboost.com (receiving). Set up mailbox or forwarding for the two receiving addresses so mail to them reaches a real inbox. Verify: send a test email to each and confirm receipt.

### Clerk

- [x] Decide: new Clerk application for IdentiBoost, or reuse the RoleBoost Clerk app. A new production Clerk instance requires DNS records on identiboost.com (Clerk Dashboard > Domains). DECIDED 2026-07-14: new Clerk application.
- [ ] Create/configure the Clerk application, and add identiboost.com as the production domain. Verify: Clerk Frontend API URL resolves and the hosted sign-in page loads.
- [ ] Customize the Clerk session token: Clerk Dashboard > Configure > Sessions > Customize session token, add `{ "role": "authenticated" }`. Required for Supabase third-party auth RLS. Verify: decode a session JWT and confirm the `role` claim is present.
- [ ] Create the Clerk webhook endpoint pointing at `https://identiboost.com/api/webhooks/clerk` subscribed to `user.created` (and `user.deleted` if used). Record the signing secret for `CLERK_WEBHOOK_SECRET`. Verify after deploy: sign up a test user and confirm a row appears in the Supabase `users` table with NULL role.

### Supabase

- [ ] Create the new IdentiBoost Supabase project (region of your choice). Record project URL, anon key, service-role key. Verify: project dashboard reachable, keys copied into a password manager.
- [ ] Configure Clerk as third-party auth provider: Supabase Dashboard > Authentication > Sign In / Providers > Third-party Auth > Clerk, set Domain to the Clerk Frontend API URL. Verify: the provider shows as enabled.
- [ ] Apply all migrations (see Phase 2 for the exact ordered list and per-migration verification).
- [ ] Confirm the four storage buckets exist after migrations run: candidate-audio, candidate-video, candidate-documents, candidate-images (the 20260704 migration creates them; bucket names are schema, do NOT rename them). Verify: Supabase Dashboard > Storage lists all four, all private.
- [x] Decide: does any data migrate from the RoleBoost Supabase project (e.g. the existing rob-ramos profile), or does IdentiBoost start empty? DECIDED 2026-07-14: starts empty; rob-ramos is rebuilt fresh in Phase 10. No pg_dump/restore needed.

### Resend

- [ ] Add and verify the identiboost.com domain in Resend (SPF, DKIM, and Return-Path DNS records). Verify: domain status "Verified" in the Resend dashboard.
- [ ] Create a Resend API key for IdentiBoost production. Record it for `RESEND_API_KEY`. Note: the live roleboost Vercel project shows NO `RESEND_API_KEY` in its Project env tab; if it is not in the Shared tab either, RoleBoost has been silently skipping all email sends (`lib/email/client.ts` no-ops when unset). Treat email as unproven in production until verified end to end.
- [ ] Send a test email from transcripts@identiboost.com via the Resend dashboard or API. Verify: it lands in a normal inbox (not spam) with DKIM pass.

### Paddle

- [ ] Decide: defer Paddle entirely for launch (recommended; the current webhook at `app/api/webhooks/paddle/route.ts` is a stub that never verifies signatures and never writes subscription status, no code reads the PADDLE_* env vars, and none are set in the live Vercel project), or wire it now. Document the decision. If deferring, remove/ignore the PADDLE_* placeholders and revisit when billing is enforced.
- [ ] If wiring Paddle now: create IdentiBoost products matching the pivot pricing (Individual: Starter free, Pro $29/mo, Business $99/mo; Team: Team $299/mo, Growth $699/mo, Scale $1,499/mo), record price IDs, and note that the `users.subscription_tier` CHECK constraint currently allows only ('basic','pro','starter','growth','scale'); the new "business" and "team" tier names would need a migration, which conflicts with the "schema stays as-is" rule. Resolve this naming before selling anything.

### Vercel

- [ ] Create the IdentiBoost Vercel project (new project under the builtwithrobots/BVC account, connected to builtwithrobots/identiboost), or decide to rename/repoint the existing roleboost project. Document the decision. Verify: pushing to a branch produces a preview deployment.
- [ ] Add identiboost.com (and www.identiboost.com redirect) as the production domain. Verify: domain shows "Valid Configuration" in Vercel.
- [ ] Confirm the 5 cron jobs from vercel.json are registered after first deploy: deliver-transcripts (*/15), process-audio (*/5), prune-rate-limits (daily 03:00), meeting-request-reminders (daily 15:00), weekly-digest (Mon 15:00). Verify: Vercel Dashboard > Cron Jobs lists all five.
- [ ] Create the Vercel WAF rules named exactly "chat", "schedule", and "deliver" (Firewall > Rules); the code no-ops until they exist. Verify: rules listed in Firewall settings.
- [ ] Enable BotID Deep Analysis (Firewall > Rules) for stronger bot detection on the public chat. Verify: setting shows enabled.
- [x] Update the GitHub CI placeholder env: `.github/workflows/ci.yml` line 53 sets `NEXT_PUBLIC_APP_URL: https://roleboost.app`; change to `https://identiboost.com`. Verify: CI build passes on the rebrand PR. (Done 2026-07-14 in the Phase 0 copy commit.)

---

## Phase 1: Environment Verification (verify before any code changes)

Every variable, individually. "Live" refers to the roleboost Vercel project screenshot (2026-07-14). For IdentiBoost, set each in the IdentiBoost Vercel project (Production + Preview) and in a local `.env.local`. Do not assume any value carries over correctly.

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: set in live roleboost (Jun 19). Correct IdentiBoost value: the publishable key (pk_live_...) from the IdentiBoost Clerk instance decided in Phase 0. Check: sign-in page renders without a Clerk key error in the browser console.
- [ ] `CLERK_SECRET_KEY`: set in live roleboost (Jun 19). Correct value: sk_live_... from the same Clerk instance as the publishable key (mismatched instances fail silently). Check: server-side `auth()` resolves a user after sign-in.
- [ ] `CLERK_WEBHOOK_SECRET`: set in live roleboost (Jun 20) but MISSING from `.env.example`. Correct value: the signing secret from the Phase 0 Clerk webhook endpoint (whsec_...). Check: sign up a test user; the Clerk webhook delivery log shows 2xx and a `users` row appears in Supabase. Also: add this var to `.env.example` (Phase 3 file edits).
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: set in live roleboost (Jun 22) pointing at the OLD project. Correct value: `https://<new-identiboost-ref>.supabase.co`. Check: value matches the new project ref exactly; the app loads a published profile page without Supabase fetch errors.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: set in live roleboost (Jun 22), OLD project. Correct value: anon key of the new IdentiBoost project. Check: anonymous visit to a published profile works (anon reads candidate_profiles safe columns).
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: set in live roleboost (Jun 22), OLD project. Correct value: service-role key of the new project. Keep Sensitive in Vercel. Check: the public chat endpoint can create a chat session (service-role write path).
- [ ] `ANTHROPIC_API_KEY`: set in live roleboost (Jun 27). Correct value: an Anthropic API key with billing enabled; can be the same key or a new one scoped to IdentiBoost. Check: send one chat message on a profile; a response streams back and no 401 appears in function logs.
- [ ] `RESEND_API_KEY`: NOT visible in the live roleboost Project env (check the Shared tab before concluding). For IdentiBoost this is REQUIRED for the transcript loop. Correct value: the Phase 0 Resend key tied to the verified identiboost.com domain. Check: complete a chat and confirm both transcript emails actually arrive; also check Vercel function logs for "email skipped" style no-ops.
- [ ] `NEXT_PUBLIC_APP_URL`: set in live roleboost (Jul 9) to `https://roleboost.app`, WRONG for IdentiBoost. Correct value: `https://identiboost.com` (no trailing slash). This drives canonical URLs, OG URLs, sitemap, share links, QR codes, and email links. Check: view page source on the deployed home page; canonical and og:url show identiboost.com; the Share Hub shows identiboost.com/i/your-slug.
- [ ] `CRON_SECRET`: set in live roleboost (Jul 6). Correct value: a fresh random 32+ char secret for IdentiBoost (do not reuse the old one). Must match what Vercel Cron sends as the Bearer token. Check: trigger `/api/cron/deliver-transcripts` manually with the header and get a 200; without the header it must NOT run the sweep. Note: `lib/cron/guard.ts` fails OPEN (200-skip) when unset, so an unset value silently disables all 5 cron sweeps.
- [ ] `SUPERADMIN_EMAILS`: set in live roleboost (Jul 7) but MISSING from `.env.example`. Correct value: comma-separated bootstrap admin list, at minimum Rob's admin email. Check: sign in with that email; you are routed to /admin. Also: add this var to `.env.example` (Phase 3).
- [ ] `FFMPEG_PATH`: not set anywhere (optional). Correct value: leave unset; `ffmpeg-static` is bundled and used as fallback for audio transcode. Check: upload a non-MP3 audio Boost; it flips from "processing" to "ready".
- [ ] `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `PADDLE_CANDIDATE_BASIC_PRICE_ID`, `PADDLE_CANDIDATE_PRO_PRICE_ID`, `PADDLE_EMPLOYER_STARTER_PRICE_ID`, `PADDLE_EMPLOYER_GROWTH_PRICE_ID`, `PADDLE_EMPLOYER_SCALE_PRICE_ID`: none set in live roleboost, none read by any code today. Per the Phase 0 Paddle decision, either leave all unset (deferred billing) or set all from the new IdentiBoost Paddle products. Check: `grep -rn "process.env.PADDLE" app lib components` still returns nothing (confirms deferral is safe).
- [ ] Update `.env.example` in the codebase to the IdentiBoost reality: add `CLERK_WEBHOOK_SECRET` and `SUPERADMIN_EMAILS`, change the comment `# App — local dev uses localhost; production is https://roleboost.app` to reference `https://identiboost.com`, and update the Paddle block per the Phase 0 decision. Check: `grep -i roleboost .env.example` returns nothing.

---

## Phase 2: Database Setup (migrations)

Apply to the NEW IdentiBoost Supabase project via the SQL Editor, strictly in this order. The exact SQL for each step is the full, verbatim contents of the named file in `supabase/migrations/`; do not retype or edit it (the schema must stay byte-identical to RoleBoost per the pivot brief). "Safe to re-run" below means running the file twice causes no error; files marked NOT re-runnable will error on second run (duplicate table/policy), which is harmless to a correct one-time apply but means you cannot blindly re-apply.

Since these are applied manually (not `supabase db push`), there is no `schema_migrations` bookkeeping; keep a checklist here as you go.

- [ ] 1. `20260620000000_initial_schema.sql`: creates `requesting_user_id()`, tables users, candidate_profiles, candidate_assets, employer_accounts, employer_members, job_postings, saved_candidates, feedback, profile_views, all with RLS and policies. NOT safe to re-run (bare CREATE TABLE / CREATE POLICY). Verify: `SELECT count(*) FROM information_schema.tables WHERE table_schema='public';` returns 9, and `SELECT proname FROM pg_proc WHERE proname='requesting_user_id';` returns 1 row.
- [ ] 2. `20260620000001_add_admin_and_role_switch.sql`: adds users.is_admin, relaxes role CHECK to include 'admin', adds admin read policy, creates admin_role_sessions. NOT safe to re-run (unguarded CREATE POLICY users_admin_read). Verify: `SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='is_admin';` returns 1 row.
- [ ] 3. `20260622000000_make_user_role_nullable.sql`: drops NOT NULL on users.role so the Clerk webhook can insert pre-onboarding rows. Safe to re-run. Verify: `SELECT is_nullable FROM information_schema.columns WHERE table_name='users' AND column_name='role';` returns YES.
- [ ] 4. `20260622100000_resume_pipeline.sql`: creates resume_documents (+ unique index, RLS, owner policy) and extends candidate_assets.asset_type CHECK with 'debate_audio' and 'resume_docx'. Safe to re-run (guards present). Verify: `SELECT count(*) FROM information_schema.tables WHERE table_name='resume_documents';` returns 1.
- [ ] 5. `20260622200000_additional_context.sql`: adds candidate_profiles.additional_context with length check. Safe to re-run. Verify: column exists on candidate_profiles.
- [ ] 6. `20260626000000_ai_brain.sql`: adds 11 brain columns to candidate_profiles, narrows the anon role to an explicit safe-column GRANT, creates chat_sessions and chat_messages with RLS. NOT safe to re-run (unguarded CREATE POLICY on both new tables). Verify: `SELECT count(*) FROM information_schema.columns WHERE table_name='candidate_profiles' AND column_name IN ('custom_qa_pairs','ai_enabled');` returns 2, and as anon `SELECT honest_weaknesses FROM candidate_profiles LIMIT 1;` is DENIED (column not granted).
- [ ] 7. `20260627000000_chat_message_model_tracking.sql`: adds model_used, was_complex, was_validated to chat_messages. Safe to re-run. Verify: 3 columns exist on chat_messages.
- [ ] 8. `20260628000000_sandbox_sessions.sql`: creates sandbox_sessions (owner-scoped). NOT safe to re-run (unguarded policy). Verify: table exists.
- [ ] 9. `20260629000000_intake.sql`: creates intake_answers, adds 7 intake/brain-readiness columns to candidate_profiles. NOT safe to re-run (unguarded policy). Verify: `intake_completed` column exists on candidate_profiles.
- [ ] 10. `20260630000000_transcript_gaps.sql`: creates transcript_gaps (gap loop). NOT safe to re-run (unguarded policy). Verify: table exists.
- [ ] 11. `20260701000000_brain_hardening.sql`: creates brain_hardening_sessions. NOT safe to re-run (unguarded policy). Verify: table exists.
- [ ] 12. `20260702000000_career_sources.sql`: creates career_sources. Safe to re-run (DROP POLICY IF EXISTS guard). Verify: table exists.
- [ ] 13. `20260703000000_avatar_asset_type.sql`: extends asset_type CHECK with 'avatar'. Safe to re-run. Verify: `INSERT` with asset_type='avatar' passes the constraint (roll back the test row).
- [ ] 14. `20260704000000_storage_buckets.sql`: inserts the 4 private storage buckets (ON CONFLICT DO NOTHING) and the owner-prefix storage.objects policy. Safe to re-run. Verify: `SELECT id, public FROM storage.buckets;` shows all 4 with public=false.
- [ ] 15. `20260705000000_context_package.sql`: adds context_package_md and context_package_updated_at to candidate_profiles. Safe to re-run. Verify: columns exist.
- [ ] 16. `20260706000000_career_context_drafts.sql`: adds career_context_drafts JSONB (retired staging column, kept for compatibility). Safe to re-run. Verify: column exists.
- [ ] 17. `20260707000000_admin_audit_log.sql`: creates admin_audit_log with admin-only read. NOT safe to re-run (unguarded policy). NOTE: shares its timestamp with the next file; when applying manually, run admin_audit_log first (alphabetical order), and consider renaming one file's timestamp in the repo to remove the collision for any future tooling. Verify: table exists.
- [ ] 18. `20260707000000_meeting_requests.sql`: creates meeting_requests. Mostly safe to re-run (DROP POLICY IF EXISTS guard; CREATE TABLE IF NOT EXISTS). Verify: table exists.
- [ ] 19. `20260707100000_user_suspension.sql`: adds users.suspended_at. Safe to re-run. Verify: column exists.
- [ ] 20. `20260708000000_meeting_request_statuses.sql`: expands meeting_requests.status to new/contacted/scheduled/closed and maps 'responded' to 'closed'. Safe to re-run. Verify: `INSERT` with status='scheduled' passes the constraint (roll back).
- [ ] 21. `20260708170000_asset_processing_status.sql`: adds processing_status and processing_error to candidate_assets plus a partial index. Safe to re-run. Verify: columns exist.
- [ ] 22. `20260709000000_rate_limits.sql`: creates rate_limits and the `check_rate_limit()` SECURITY DEFINER function; revokes from anon and authenticated. Safe to re-run (CREATE OR REPLACE). Verify: `SELECT check_rate_limit('todos-test', 5, 60);` as service role returns true; `DELETE FROM rate_limits WHERE bucket_key='todos-test';`
- [ ] 23. `20260710000000_recruiter_identity.sql`: adds recruiter_name and recruiter_email to chat_sessions (column names are schema, keep them). Safe to re-run. Verify: columns exist.
- [ ] 24. `20260711000000_secondary_target_roles.sql`: adds candidate_profiles.secondary_target_roles TEXT[]. Safe to re-run. Verify: column exists. (roleboost todo.md flags this as possibly never applied to the OLD live DB; on the fresh project it simply must run.)
- [ ] 25. `20260712000000_gap_suggested_answer.sql`: adds transcript_gaps.suggested_answer. Safe to re-run. Verify: column exists.
- [ ] 26. `20260713000000_transcript_archive.sql`: adds chat_sessions.archived_at plus owner UPDATE and DELETE policies and an index. NOT safe to re-run (unguarded policies). Verify: `SELECT polname FROM pg_policies WHERE tablename='chat_sessions';` includes chat_sessions_candidate_update and chat_sessions_candidate_delete.
- [ ] 27. `20260714000000_asset_package.sql`: adds candidate_profiles.asset_package JSONB. Safe to re-run. Verify: column exists.
- [ ] 28. `20260715000000_candidate_search_discoverable.sql`: adds candidate_profiles.search_discoverable BOOLEAN DEFAULT false. Safe to re-run. Verify: column exists. (Also flagged in roleboost todo.md as possibly not applied to the old DB.)
- [ ] 29. NEW hardening migration (from roleboost todo.md P0, not yet a file): create `supabase/migrations/20260716000000_rate_limit_revoke_public.sql` containing exactly:
      `REVOKE ALL ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;`
      and run it. Postgres grants EXECUTE to PUBLIC by default, so without this the limiter is callable with the anon key. Safe to re-run. Verify: `SELECT proacl FROM pg_proc WHERE proname='check_rate_limit';` shows no PUBLIC execute grant.
- [ ] Post-apply sweep: run `SELECT tablename, count(*) FROM pg_policies GROUP BY tablename ORDER BY 1;` and spot-check against the migration files; then create a test user via the app and walk one full write path (profile save) to confirm RLS works end to end.

---

## Phase 3: Rebrand, Text and Copy

Global rule set (from the pivot brief): RoleBoost→IdentiBoost, Roleboost→Identiboost, ROLEBOOST→IDENTIBOOST, roleboost→identiboost, getroleboost.com→identiboost.com, roleboost.app→identiboost.com, "candidate"→"professional" and "recruiter"→"contact" in user-facing copy only, "Career AI"→"Identity AI". DO NOT touch: `supabase/migrations/` contents, DB column/table names in queries (`candidate_profiles`, `recruiter_email`, `.from('...')` strings), TypeScript type/prop/variable names (`CandidateProfile`, `candidateSlug`), route-group directory names (`(candidate)`, `(employer)`), storage bucket names (`candidate-audio` etc.), and the `--rb-*` CSS variable names / `rb-` class prefixes / `rb-getting-started-dismissed` localStorage key (internal identifiers, invisible to users). Em dashes are banned in all new copy.

Files listed with the specific strings found in the audit. Line numbers are current roleboost main.

### Brand component (do first; everything imports it)

- [ ] `components/layout/RoleBoostLogo.tsx`: rename file to `IdentiBoostLogo.tsx`; rename the exported component `RoleBoostLogo`→`IdentiBoostLogo`; change monogram `R` (line 7)→`I`; wordmark text `RoleBoost` (line 11)→`IdentiBoost`. Update the import + usages in: `app/(candidate)/layout.tsx` (lines 5, 51, 77), `app/(employer)/layout.tsx` (5, 33, 58), `app/(admin)/layout.tsx` (5, 33), `components/landing/LandingPage.tsx` (2, 9, 356).

### app/ root and metadata

- [ ] `app/layout.tsx`: APP_URL fallback `'https://roleboost.app'`→`'https://identiboost.com'` (line 27); SITE_DESCRIPTION (29-30)→"Your identity, boosted. The professional presence platform that answers back." plus supporting copy per the pivot brief; title default (36) "RoleBoost: Your career. Your AI. Finally heard."→"IdentiBoost: Your identity. Boosted."; title template (38) `%s | RoleBoost`→`%s | IdentiBoost`; applicationName (41), authors (51), openGraph.siteName/title/description (55-57), twitter title/description (62-63), appleWebApp.title (76) all RoleBoost→IdentiBoost with the new tagline; keywords (42-50): replace "AI candidate profile", "career AI", "candidate intelligence", "recruiter tools", "job search", "hiring" with professional-presence keywords ("professional presence platform", "identity AI", "AI profile", "digital business card", "professional profile").
- [ ] `app/manifest.ts`: name and short_name (8-9) `RoleBoost`→`IdentiBoost`; description (10) "Your career. Your AI. Finally heard."→"Your identity. Boosted."
- [ ] `app/opengraph-image.tsx`: alt (6) and tagline text (40)→"Your identity. Boosted."; wordmark JSX `RoleBoost` (29)→`IdentiBoost`; supporting line (43-44) "A shareable AI candidate profile recruiters can interrogate 24/7..."→professional framing ("A verified personal AI anyone can ask questions, 24/7...").
- [ ] `app/icons/[size]/route.tsx`: monogram glyph `R` (line 37)→`I`; comment "the RoleBoost" (3)→"the IdentiBoost".
- [ ] `app/globals.css`: header comment `ROLEBOOST DESIGN SYSTEM` (line 4)→`IDENTIBOOST DESIGN SYSTEM`; tagline usage example comment near line 323. Keep all `--rb-*` variable NAMES unchanged.
- [ ] `app/robots.ts`: BASE_URL fallback (3) `'https://roleboost.app'`→`'https://identiboost.com'`; comment (7) `/c/[slug]`→`/i/[slug]` (route change is Phase 4).
- [ ] `app/sitemap.ts`: BASE_URL fallback (5)→identiboost.com; comment (11) `(/c/[slug])`→`(/i/[slug])`; URL builder (24) `/c/`→`/i/` (Phase 4).
- [ ] `app/suspended/page.tsx`: "Access to RoleBoost has been paused..." (16-18)→IdentiBoost.
- [ ] `package.json`: `"name": "roleboost"`→`"identiboost"`.
- [ ] `.github/workflows/ci.yml`: build env `NEXT_PUBLIC_APP_URL: https://roleboost.app` (53)→`https://identiboost.com`.

### app/(marketing)

- [ ] `app/(marketing)/page.tsx`: APP_URL fallback (18)→identiboost.com; title.absolute (22) "RoleBoost: AI candidate profiles recruiters can interrogate 24/7"→"IdentiBoost: The professional profile that answers back"; description (24-25) rewrite to universal-professional framing; openGraph title/description (29-31); JSON-LD Organization.name (41) and description (44-45), WebSite.name (49) all→IdentiBoost + new value prop.
- [ ] `app/(marketing)/recruiters/page.tsx`: metadata title "For Recruiters" (5), description (6-7) "Every RoleBoost candidate comes with a personal career AI you can interrogate...", openGraph title (11) "RoleBoost for Recruiters: talk to the candidate's AI before the first call" and description (12-13). Decision needed: keep a hiring-vertical page (rebrand copy in place) or retarget to "For evaluators/contacts". At minimum RoleBoost→IdentiBoost, candidate→professional, recruiter→contact.
- [ ] `app/(auth)/onboarding/page.tsx`: card 1 title (23) "I'm looking for my next role"→"I want to represent myself" with blurb (24) rewritten ("Build your verified Identity AI and share one link that tells your whole story."); card 2 title (29) "I'm hiring for my team"→"I want to find and evaluate professionals" with blurb (30) rewritten (candidates→professionals, career AI→Identity AI); "Welcome to RoleBoost" (105)→"Welcome to IdentiBoost"; badge monogram `R` (101)→`I`; "Tell us how you'll use RoleBoost..." (107-108)→IdentiBoost.

### app/(candidate) dashboard pages

- [ ] `app/(candidate)/dashboard/assets/page.tsx`: PageHeader description (154) "...the materials that power your RoleBoost profile."→"...your IdentiBoost profile."; tip body (185-188) "...your career documents..."/"...done-for-you package from RoleBoost..."→IdentiBoost + professional framing.
- [ ] `app/(candidate)/dashboard/feedback/page.tsx`: description (12) "...that employers send you..."→"...that businesses send you..."; EmptyState description (18) "When an employer sends feedback through RoleBoost..."→"When a business sends feedback through IdentiBoost...".
- [ ] `app/(candidate)/dashboard/meeting-requests/page.tsx`: description (69) "Recruiters who asked to meet through your Personal Assistant..."→"Contacts who asked to meet through your AI..."; EmptyState description (76-77) "When your Personal Assistant cannot answer a recruiter's question..."→"When your AI cannot answer a contact's question...".
- [ ] `app/(candidate)/dashboard/transcripts/page.tsx`: description (110) "Every conversation with your Personal Assistant..."→"Every conversation with your AI..."; counterpart labels (82-83) 'Signed-in recruiter'/'Recruiter'→'Signed-in contact'/'Contact'; EmptyState description (116-117) "When a recruiter chats with your Personal Assistant..."→"When a contact chats with your AI...".
- [ ] `app/(candidate)/dashboard/analytics/page.tsx`: description (287) "How recruiters are finding..."→"How contacts are finding..."; activity labels (224, 231) "A recruiter opened your profile" / "A signed-in recruiter" / "A recruiter ... chatted with your AI"→contact.
- [ ] `app/(candidate)/dashboard/preview/page.tsx`: APP_URL fallback (26)→identiboost.com; description (32) "...exactly as employers experience it..."→"...exactly as your contacts experience it...".
- [ ] `app/(candidate)/dashboard/share/page.tsx`: APP_URL fallback (25)→identiboost.com.
- [ ] `app/(candidate)/dashboard/ai/page.tsx`: error copy (90-91) mentions "AI studio", fine; no brand token. Confirm with grep only.

### app/(employer) dashboard pages

- [ ] `app/(employer)/dashboard/conversations/page.tsx`: description (81) "Every conversation your team has had with a candidate's Personal Assistant..."→"...with a professional's AI..."; EmptyState (88) "...chats with a candidate's Personal Assistant..."→"...a professional's AI...".
- [ ] `app/(employer)/dashboard/candidates/page.tsx`: "This employer has not set up their workspace yet." (60-61)→"This workspace has not been set up yet." (or business framing). Decision needed: how far the employer-side vertical copy (Jobs/Board/Candidates navigation) gets rebranded in v1; see open questions.
- [ ] `app/(employer)/dashboard/team/page.tsx`: "Build your hiring team" (22) and description (23) "...collaborate on candidates together."→evaluate per the employer-side decision; minimum: candidates→professionals.

### app/(admin)

- [ ] `app/(admin)/admin/page.tsx`: stat labels (35-38) "Candidates"/"Employers"→"Professionals"/"Businesses" (admin-facing; low priority, keep consistent); "View as Candidate"/"View as Employer" buttons (108, 116)→"View as Professional"/"View as Business"; preview paragraph (86-89).
- [ ] `app/(admin)/admin/asset-packages/page.tsx`: description (69) "...for a candidate..."→"...for a professional...".

### app/ public pages

- [ ] `app/c/[slug]/page.tsx` (becomes `app/i/[slug]/page.tsx` in Phase 4): title (29) `${data.full_name} on RoleBoost`→`on IdentiBoost`; description fallback (31-32) `${data.target_role} on RoleBoost` / 'Career profile on RoleBoost'→'Professional profile on IdentiBoost'; comment (104-105) "Powered by RoleBoost AI"→IdentiBoost.
- [ ] `app/privacy/page.tsx`: CONTACT_EMAIL (14) 'privacy@roleboost.app'→'privacy@identiboost.com'; metadata description (8-9) and openGraph.title (10) "| RoleBoost"→"| IdentiBoost"; all 12 body occurrences of RoleBoost→IdentiBoost (lines 63-66, 98-104, 109-110, 146, 189, 265, 273-275, 282-283); recruiter/candidate/employer body language→contact/professional/business per the taxonomy ("It covers professionals who build a profile, businesses and contacts who use the platform, and visitors who chat with a professional's AI."); "career profile and AI" (70)/"Career materials" (77-79)/"career materials" (102-110)→professional; "Recruiters and visitors" section title (128)→"Contacts and visitors"; update the "Last updated" date.
- [ ] `app/terms/page.tsx`: CONTACT_EMAIL (15) 'legal@roleboost.app'→'legal@identiboost.com'; metadata (8-11); all 18 body occurrences of RoleBoost→IdentiBoost (54, 64-67, 74-76, 106-112, 132-135, 164-165, 172, 189-190, 200, 208, 225-226); "For employers and recruiters" section (138)→"For businesses and contacts"; "If you use RoleBoost to evaluate candidates..." (140)→"...to evaluate professionals..."; "resume, career context" (91-94)→professional framing; fill in governing-law state and legal entity name (carried over from roleboost todo.md); update "Last updated".
- [ ] `app/boosts/page.tsx`: description (14-15) "See the three Boosts RoleBoost makes...real candidates across every kind of career."→IdentiBoost + "real professionals"; openGraph title (18) "Boosts | RoleBoost" and description (19-20).
- [ ] `app/boosts/[slug]/page.tsx`: openGraph.title (33) `${persona.name} on RoleBoost`→IdentiBoost; description (27) keep (no brand token) but review "careerStage" wording.
- [ ] `app/boosts/[slug]/opengraph-image.tsx`: alt (7) "A RoleBoost candidate example..."→"An IdentiBoost professional example..."; name fallback (19) 'RoleBoost'→'IdentiBoost'; role fallback (20) 'AI candidate profiles, finally heard'→professional framing; initials fallback (22) 'RB'→'IB'; wordmark (42-43) RoleBoost→IdentiBoost; closing line (89) "built from a real career"→review.
- [ ] `app/api/candidate/data-export/route.ts`: export note (126) "Complete export of your RoleBoost data..."→IdentiBoost; filenames (150, 182) `roleboost-export-...`→`identiboost-export-...`; zip inner file (158) `roleboost-data.json`→`identiboost-data.json`; comment (24).
- [ ] `app/api/cron/weekly-digest/route.ts`: APP_URL fallback (38)→identiboost.com.
- [ ] `app/api/cron/meeting-request-reminders/route.ts`: APP_URL fallback (41)→identiboost.com.

### components/candidate

- [ ] `components/candidate/AIStudio.tsx`: subtitle (226) "Arm the career AI that answers recruiters on your behalf..."→"Arm the Identity AI that answers contacts on your behalf..."; tab label (116) "Career Story"→"Professional Story" (decision: pivot brief renames "Career Context Document"→"Professional Context Document"; keep tab naming consistent); TabIntro (290-293) "Teach your AI about your career"→professional framing; "Career context" section (339); field labels (58-107): "Top career wins..."→"Top professional wins...", "Questions you wish recruiters would ask"→"...contacts would ask"; placeholders mentioning recruiters (63-105)→contacts; custom answers placeholder (400) "Recruiter question, e.g. ..."→"Contact question, e.g. ..."; Test tab (497) "Try your AI before recruiters do"→"...before your contacts do"; (510) "...the chat tab is hidden from recruiters."→contacts; Harden intro (524-528) recruiter calls→real conversations.
- [ ] `components/candidate/ContextDocumentPanel.tsx`: header (126) "Your career story"→"Your professional story"; body (128-132) "...when recruiters ask about your background."→contacts; story-type label (32) "The Career Arc"→"The Professional Arc" (review all six labels); errors (85, 89, 95) "Generating your career story..."→professional story; ResumeFallback (199-220) "Your career story is written from your résumé and career sources..."→professional sources framing; EmptyState (223-252) "Generate your career story" etc.
- [ ] `components/candidate/GettingStarted.tsx`: step titles/blurbs (33-74) "Build your career AI"→"Build your Identity AI", "Create your career story"→"Create your professional story", "Ask it the tough questions a recruiter would"→"...a contact would"; header (152-159) "Five steps to a live career AI that answers recruiters for you, 24/7."→"...Identity AI that answers contacts...".
- [ ] `components/candidate/HowItWorks.tsx`: h1 (78) "How RoleBoost works"→"How IdentiBoost works"; subtitle (80-83) "You build a personal career AI once. It answers recruiters..."→Identity AI / contacts; loop labels (21-27) "Recruiters chat with it"→"Contacts chat with it"; steps (30-71) career AI/career story/recruiter→Identity AI/professional story/contact; aria (87) "The RoleBoost loop"→"The IdentiBoost loop"; closing copy (103, 135-139) recruiter→contact.
- [ ] `components/candidate/ShareHub.tsx`: description (122); intro (131) "Share this link with recruiters and hiring managers."→"Share this link with anyone who should know you."; draft warning (138) "...so employers can view this link."→"...so your contacts can view this link."; visible URL (145) `roleboost.app/c/{slug}`→`identiboost.com/i/{slug}`; ShareButton title (156) "on RoleBoost"→"on IdentiBoost" and text (157) "Chat with ${fullName}'s career AI"→"Ask ${fullName}'s AI anything"; badge aria (75) "RoleBoost profile badge", wordmark (86) `ROLEBOOST`→`IDENTIBOOST`, badge role fallback (66) "Career Professional"→review; embed code (107) `https://roleboost.app/api/badge/`→identiboost.com and alt "on RoleBoost"→IdentiBoost; QR filename (113) `roleboost-qr-`→`identiboost-qr-`; digital badge copy (219) "...your RoleBoost profile."; LinkedIn steps (237) "Set the link to your RoleBoost profile URL"; QR description (180) "Add to your resume or email signature"→"business card or email signature".
- [ ] `components/candidate/SettingsPanel.tsx`: APP_URL fallback (47)→identiboost.com; account description (348) "Your identity and plan on RoleBoost."→IdentiBoost; AI toggle desc (404) "When on, recruiters can chat..."→contacts; discoverable desc (422-424) "...so recruiters can find you..."→contacts; data section (453) "Export everything RoleBoost holds for you..."→IdentiBoost; body (456-459) "recruiter conversations, career sources"→contact conversations, professional sources; reset dialog (541-557) "Your career brain fields", "Recruiter chat history", "Your generated career story"→professional equivalents; delete dialog (567-577) "your entire RoleBoost profile", "All recruiter conversations", "any employer's saved pool"→IdentiBoost/contact/business; export filename fallback (309) `roleboost-export.`→`identiboost-export.`.
- [ ] `components/candidate/ProfileEditor.tsx`: subtitle (208) "Your public career page · roleboost.app/c/{slug}"→"Your public professional page · identiboost.com/i/{slug}"; secondary roles body (390-392) "...a recruiter's opportunity..."→contact; headline helper (439) "One punchy sentence a recruiter reads in 5 seconds"→contact; "Career Snapshot" (477)→"Professional Snapshot" and helper (484) "Your top 3-7 career highlights"→professional highlights; additional context placeholder (540) "...recruiters should know..."→contacts; link section (562-577) visible URL (566)→identiboost.com/i/, clipboard write (569) `https://roleboost.app/c/`→`https://identiboost.com/i/`, "Publish your profile so employers can view it..." (577)→contacts; preview labels (599, 675) "...appears to employers." / "Draft, not visible to employers"→contacts.
- [ ] `components/candidate/TranscriptsList.tsx`: assistantName (62) `${firstName}'s Personal Assistant`→`${firstName}'s AI` (pivot brief chat-header rule); tab label (92) "Recruiters"→"Contacts"; download filename (187) `roleboost-transcript-`→`identiboost-transcript-`; TeachComposer placeholder (438) "The answer you'd want a recruiter to hear"→contact; InfoModal copy (485-556) "with recruiters or in your own tests"→contacts.
- [ ] `components/candidate/AssetPackageCard.tsx`: body (111-114) "...produced by RoleBoost..."→IdentiBoost; help body (150-153) "Asset Packages are produced for you by RoleBoost from your résumé and career details..."→IdentiBoost, professional details; download filename (80) `roleboost-context-`→`identiboost-context-`.
- [ ] `components/candidate/CareerSourcesCard.tsx`: heading (162) "Career sources"→"Professional sources"; body (167-171) "...never shown raw to recruiters."→contacts. Keep `CareerSourceType` and `/api/sources` identifiers unchanged.
- [ ] `components/candidate/AnalyticsDashboard.tsx`: "What recruiters want to know" (119)→"What contacts want to know"; body (120-122); empty (125) "As recruiters chat..."→contacts; EmptyState (191-203) "Once recruiters open your profile..."→contacts.
- [ ] `components/candidate/HardenPanel.tsx`: heading body (150-153) "Paste a transcript from a real recruiter call..."→"a real contact call, a sales call, a client screen"; privacy note (158-163) "Your live recruiter conversations..."→contact conversations; field label (31-41) "questions you wish recruiters asked"→contacts; placeholder (189) review.
- [ ] `components/candidate/PromptBot.tsx`: heading (67) "What recruiters asked"→"What contacts asked"; body (69-72); FIELD_LABELS (14-24) recruiters→contacts.
- [ ] `components/candidate/SandboxPanel.tsx`: body (153-155, 191) review recruiter framing; category labels (27-34) fine; keep verdict labels.
- [ ] `components/candidate/PreviewFrame.tsx`: iframe title (137) "Your profile as employers see it"→"...as your contacts see it"; mock browser URL (233) `roleboost.app/c/{slug}`→`identiboost.com/i/{slug}`.
- [ ] `components/candidate/IntakeInterview.tsx`: sources body (217-243) "...the questions a recruiter actually would..."→a contact; inconsistencies body (260-266) "Recruiters and background checks catch these..."→"Contacts and background checks..."; keep "brain" vocabulary.
- [ ] `components/candidate/AssetUploadCard.tsx`: Podcast Style Boost description (~63) "...what you would bring to a hiring team."→"...what you would bring to the table." (universal framing); review remaining ASSET_META descriptions for career/hiring wording.
- [ ] `components/candidate/RoleSuggestions.tsx` and `components/candidate/HeadlineAssist.tsx`: "résumé or career source(s)" phrasing→"résumé or professional source(s)"; RoleSuggestions body (58-61) keep "roles" (feature is role-targeting; universal users may skip it).
- [ ] `components/candidate/HelpButton.tsx`: no brand token; verify by grep only.

### components/chat and components/modal (public profile surface)

- [ ] `components/chat/ChatPanel.tsx`: assistantName (83) `${firstName}'s Personal Assistant`→`${firstName}'s AI`; header (356) live variant `Ask ${assistantName} anything` then reads "Ask [Name]'s AI anything" (pivot spec) and preview variant "How ${assistantName} responds to recruiters"→"...responds to contacts"; empty-state preview (396) "Try a hard recruiter question..."→"Try a hard question..."; disclaimer (752-754) "Powered by RoleBoost. {assistantName} represents {firstName}'s career history and may not reflect every detail."→"Powered by IdentiBoost. {firstName}'s AI represents their verified professional identity and may not reflect every detail."; input placeholder (740) "Ask ${firstName} anything about their career"→"Ask ${firstName}'s AI anything"; download filename (323) `roleboost-conversation-`→`identiboost-conversation-`; transcript download header (314) follows assistantName change automatically.
- [ ] `components/modal/CallingCard.tsx`: ShareButton title (88) "on RoleBoost"→"on IdentiBoost"; ShareButton text (89) "Ask ${firstName}'s Personal Assistant anything about their career"→"Ask ${firstName}'s AI anything"; offline copy (164) "{firstName}'s Personal Assistant is offline right now."→"{firstName}'s AI is offline right now."; "Career snapshot" (188)→"Professional snapshot"; OPENERS (36-41): DECIDED 2026-07-14: rewrite context-neutral (e.g. "Walk me through your most recent work.", "What's a win you're proud of?", "What do you do best?", "What are you focused on right now?"). Roadmap (post-launch): owner-created conversation starters managed in the dashboard, shown as chips in their chat.
- [ ] `components/modal/AssetGallery.tsx`: aria/alt (118, 131) `${firstName}'s career video` / `career infographic`→professional video/infographic.

### components/employer

- [ ] `components/employer/CandidateGrid.tsx`: empty state (215) "Ask candidates to share their RoleBoost profile link..."→"Ask professionals to share their IdentiBoost profile link..."; how-it-works (219-223) "Candidates share a link like roleboost.app/c/jane-smith. You open it, listen to their career story..."→identiboost.com/i/jane-smith, professional story; h1 "Candidates" (166) and body (168-169) "saved candidate pool"→per employer-side decision (minimum: professionals).
- [ ] `components/employer/CandidateBoard.tsx`: board copy (115-143) "candidate pipeline"/"Save candidates..."→professionals per employer-side decision.
- [ ] `components/employer/EmployerTranscriptsList.tsx`: download filename (41) `roleboost-transcript-`→`identiboost-transcript-`; profile link href (64) `/c/`→`/i/` (Phase 4).
- [ ] `components/employer/JobsTable.tsx`: table header "Candidates" (214) and empty-state copy (hiring vertical; per employer-side decision).

### components/landing and components/marketing

- [ ] `components/landing/LandingPage.tsx`: hero (58-105) badge "AI-powered candidate intelligence"→"The universal professional presence platform"; h1 "Your career. / Your AI. / Finally heard."→"Your identity. / Boosted."; subtext rewrite (universal: any professional, one link, verified AI, transcript both ways); "Free for candidates"→"Free to start"; social proof "2,400+ candidates already hired"→rewrite or remove; features (112-150) "Your personal career AI"→"Your Identity AI", "...answers recruiter questions..."→"...answers questions from anyone...", "When everyone sounds the same on paper, RoleBoost makes sure you're heard." (149)→IdentiBoost with business-card framing; how-it-works (175-195) "Recruiters chat with your personal AI..."→"Anyone can chat with your AI..."; pricing section (226-311) update to the new pivot pricing (Starter free / Pro $29 / Business $99 and Team tiers) and replace Candidate/Employer card labels with Professional/Team; CTA (330-344) "Join candidates who are giving hiring managers everything they need"→universal; footer (357-380) tagline and copyright RoleBoost→IdentiBoost.
- [ ] `components/marketing/LandingHero.tsx`: all three CANDIDATE_VARIANTS (7-47). V0 headline "Finally, a resume / that talks back."→"Your identity. / Boosted." (primary tagline) with secondary "The profile that answers back."; all three subheads rewrite (RoleBoost→IdentiBoost, resume/career AI/recruiter→profile/Identity AI/contact, add the new-verticals framing); kickers "Stop losing to less qualified candidates." and "Built for candidates who are done being overlooked."→universal professional framing; proof lines review.
- [ ] `components/marketing/HeroSection.tsx`: h1 (22-24) "Your career, finally heard. / Your next hire, finally found."→identity framing; subhead (33-34) "RoleBoost replaces the resume with a rich AI-powered candidate profile..."→"IdentiBoost is the first business card that answers back..."; onboarding cards (66, 104) "I'm looking for my next role"→"I want to represent myself" and "I'm hiring for my team"→"I want to find and evaluate professionals", with blurbs and CTAs ("Build My Profile Free" stays, "Start Hiring Free"→"Start Evaluating Free" or similar).
- [ ] `components/marketing/RecruiterHero.tsx`: all three RECRUITER_VARIANTS (7-47): RoleBoost→IdentiBoost, candidate→professional; decision needed on how far to retarget this evaluator page (see open questions); demo Q/A pairs (50-56) fine to keep persona content.
- [ ] `components/marketing/AIChatbotSpotlight.tsx`: h2 (58) "A personal career AI, available to recruiters 24/7."→"A personal Identity AI, available to anyone 24/7."; body (62-65) "Every RoleBoost candidate gets a career AI...Recruiters chat..."→IdentiBoost professionals/contacts; bullets (69-71) candidate/recruiters→professional/contacts; chat header (125) "Marcus Wheeler's Career AI"→"Marcus Wheeler's AI"; footer (164) "Powered by RoleBoost AI"→"Powered by IdentiBoost AI"; aria (113).
- [ ] `components/marketing/HeroDemoCard.tsx`: aria (342) "Preview of a RoleBoost candidate profile..."→IdentiBoost professional profile; chat header (239) "Jordan's Career AI"→"Jordan's AI"; tile (408-413) "Career AI"→"Identity AI"; composer placeholder (320) "Ask anything about Jordan's career..."→"Ask Jordan's AI anything...".
- [ ] `components/marketing/AssetSuite.tsx`: asset name (96) "Personal Career AI"→"Identity AI" and its description "...trained on your career data. Recruiters ask it anything."→professional data / anyone; h2 (132) "One link. Every version of you." keep; body (135-136) "Upload your resume and career context. RoleBoost produces..."→"...your professional context. IdentiBoost produces..."; "Career Infographic" label→review (Visual Boost naming stays).
- [ ] `components/marketing/HowItWorksCandidate.tsx`: h2 (55) "For job seekers: your story, told the way it deserves to be."→"For professionals: ..."; steps (8-24) "RoleBoost produces your audio overview..." and "Paste your RoleBoost link anywhere. Employers click it...chat with your career AI"→IdentiBoost/contacts/your AI; "Free forever for candidates."→"Free to start."
- [ ] `components/marketing/HowItWorksEmployer.tsx`: h2 (55) "For hiring teams: know your candidates before the first call."→"For teams: know who you're meeting before the first call."; steps (8-24) "Receive a candidate's RoleBoost link"→"Receive a professional's IdentiBoost link", "Chat with their career AI"→"Chat with their AI"; CTA "Start Hiring Free"→per employer-side decision.
- [ ] `components/marketing/Footer.tsx`: brand (17) RoleBoost→IdentiBoost; tagline (18-20) "The world's first AI-powered candidate intelligence platform."→"The universal professional presence platform."; link label "For Employers" (3-8)→per decision; copyright (56).
- [ ] `components/marketing/Nav.tsx` and `components/marketing/LandingNav.tsx`: wordmark text and aria-label "RoleBoost home" (Nav 48-50; LandingNav 59-61)→IdentiBoost; nav labels "For Employers"/"For Recruiters"/"For Candidates" (Nav 7-11; LandingNav 7-23)→per decision (suggest "For Professionals" / "For Teams").
- [ ] `components/marketing/PricingSection.tsx`: full rewrite to pivot pricing: h2 (108) "Simple pricing. Candidates are always free."→new model ("Start free. Upgrade when you're ready."); "For Job Seekers" (129 area)→"For Professionals" with Starter/Pro($29)/Business($99) tiers; "For Hiring Teams" (151)→"For Teams" with Team($299)/Growth($699)/Scale($1,499); feature bullets "Personal career AI chatbot" (31)→"Identity AI", "Transcript delivery after every recruiter conversation"→every conversation; remove the "$249/mo Scale" line (256-261) in favor of the new tiers; reference embed widget + CRM export as "coming soon" per the pivot brief.
- [ ] `components/marketing/ProblemSection.tsx`: h2 (32) "AI broke hiring. For everyone."→business-card framing ("The business card has not changed in 150 years."); "For candidates"/"For employers" blocks (46-62)→universal problem framing; closing (75) "The resume is dead. We built what comes next."→"The static profile is dead. We built the one that answers back." (or per brief).
- [ ] `components/marketing/SocialProofBar.tsx`: stats copy (7-20) "...the standard we hold our candidates to" and "...both sides of the hiring table"→universal framing or remove.
- [ ] `components/marketing/FinalCTA.tsx`: body (34-35) "Join RoleBoost free...gives hiring managers everything they need."→IdentiBoost universal; CTA (55) "I'm Hiring"→per decision ("I'm evaluating").
- [ ] `components/marketing/TranscriptLoop.tsx`: h2 (64) "The first feedback loop in hiring history."→"The first two-sided conversation loop."; body (66-70) "Every recruiter conversation...Candidates learn...Recruiters get..."→contacts/professionals; item lists (7-19) "candidate pipeline"/"candidate's full profile"→professional.
- [ ] `components/marketing/boosts/BoostShowcaseSection.tsx`: save-button title (129) "Saving candidates is available inside RoleBoost"→"Saving professionals is available inside IdentiBoost"; comment (35).
- [ ] `components/marketing/boosts/BoostsHero.tsx`: h1 (30) "Three Boosts. One unforgettable candidate."→"...One unforgettable professional."; body (39-42) "career asset"→professional asset.
- [ ] `components/marketing/boosts/BoostsFinalCTA.tsx`: (32-36) "If you are job hunting..."/"If you are hiring..."→broaden to the pivot's vertical list (keep job hunting as one example among several).
- [ ] `components/marketing/boosts/BoostsExamplesBanner.tsx`: h2 (100) "A Boost for every kind of career"→"...every kind of professional"; body (104-107) "the story a resume flattens"→review.
- [ ] `lib/boosts/personas.ts`: format copy (82-102) "why this candidate is worth a conversation", "discuss the candidate and what they would bring to a hiring team", kickers "A colleague briefs the hiring manager" etc.→universal framing; persona blurbs (118-243) "exactly the kind of candidate a resume flattens"→professional framing; generated alt/labels (273-274) "career infographic"→professional infographic. NOTE: the underlying demo mp3/png assets in public/boosts/ SAY and SHOW RoleBoost branding (see open risks); copy changes here do not fix the media.

### components/onboarding and components/layout

- [ ] `components/onboarding/OnboardingSourcesStep.tsx`: h1 (135) "Bring your other career sources"→"Bring your other professional sources"; body (137-141) keep mechanics.
- [ ] `components/layout/CandidateNav.tsx`: nav label "AI Studio" (39) stays; consider section heading review only. No brand token; verify by grep.
- [ ] `components/layout/EmployerNav.tsx`: headings "Hiring" (36) and label "Candidates" (20)→per employer-side decision (suggest "Evaluating"/"Professionals").
- [ ] `components/layout/AdminViewLaunchers.tsx`: "Candidate view"/"Employer view" (30, 36)→"Professional view"/"Business view" (admin-facing, keep consistent with admin pages).
- [ ] `components/admin/AdminAssetPackageTool.tsx`: (310) "For orders from candidates who are not on RoleBoost yet..."→"...professionals who are not on IdentiBoost yet..."; mode labels (208-209) "Platform candidate"→"Platform professional".

### lib (non-email; email is Phase 5)

- [ ] `lib/ai/asset-package.ts`: system prompts (173, 195, 235) "RoleBoost Candidate Asset Production Skill"/"RoleBoost palette"→IdentiBoost; generated-audio closing pitch (243) `"Learn more about [candidate first name] at roleboost.app."`→`at identiboost.com.`; short-video closing frame (253) same replacement; markdown header (372) "# RoleBoost -- Candidate Asset Package"→IdentiBoost; public URL line (390) `roleboost.app/c/${id.slug}`→`identiboost.com/i/${id.slug}`; footer (441) `*RoleBoost Candidate Asset Package -- ... -- roleboost.app*`→IdentiBoost/identiboost.com; document title (313) "Career Context Document"→"Professional Context Document"; schema description (155-156) and comments (15, 30). This file is in lib/ai/ which the pivot brief marks do-not-touch for LOGIC; these are brand strings inside prompts and rendered output, which the brief explicitly requires changing (transcript email/copy rules). Change strings only, no logic.
- [ ] `lib/ai/career-context.ts`: system prompt (134) "RoleBoost Candidate Asset Production Skill"→IdentiBoost; rendered title (204) "Career Context Document"→"Professional Context Document"; comment (14). Strings only.
- [ ] `lib/ai/build-system-prompt.ts`: (101) "You are the Personal Assistant for ${name}. You represent ${name} to recruiters and hiring managers..."→"You are the AI for ${name}. You represent ${name} to the professionals they meet..." per the [Name]'s AI rebrand. Model-facing but shapes user-visible voice. Strings only; keep the XML architecture and section order untouched.
- [ ] `lib/candidate/calling-card.ts`: comment (30) `/c/[slug]`→`/i/[slug]` (comment only).
- [ ] `lib/career-sources/github-import.ts`: User-Agent header (43) 'RoleBoost'→'IdentiBoost'.
- [ ] `lib/types/index.ts`: comments only (82, 139, 183) RoleBoost→IdentiBoost. Do NOT rename any types or fields.
- [ ] `lib/motion-dashboard.ts`: comment (3) RoleBoost→IdentiBoost.
- [ ] Supabase migration comments referencing RoleBoost (20260705, 20260706, 20260714): LEAVE UNTOUCHED per the do-not-touch rule.

---

## Phase 4: Rebrand, Routes and URLs

- [ ] Copy `app/c/[slug]/` to `app/i/[slug]/` (full directory). Apply the Phase 3 metadata copy changes in the new `app/i/[slug]/page.tsx`. Verify: `/i/<slug>` renders a published profile locally.
- [ ] Replace `app/c/[slug]/page.tsx` with a thin permanent redirect: a server component whose default export calls `permanentRedirect(`/i/${slug}`)` from `next/navigation` (await params per Next 16). Keep `generateMetadata` out of it (the redirect fires first). Verify: `curl -I localhost:3000/c/test-slug` returns 308 with Location `/i/test-slug`.
- [ ] `middleware.ts`: add `'/i/(.*)'` to the public route matcher (line 15 area) and KEEP `'/c/(.*)'` public so the redirect is reachable signed-out. Verify: signed-out fetch of both `/i/<slug>` and `/c/<slug>` never bounces to sign-in.
- [ ] Update every internal link and URL builder from `/c/` to `/i/`:
  - `components/employer/EmployerTranscriptsList.tsx:64` href
  - `components/employer/CandidateGrid.tsx:130` href, and the example URL at 221
  - `components/employer/CandidateBoard.tsx:61` href
  - `components/candidate/SettingsPanel.tsx:268` publicUrl builder, `:357` href
  - `components/candidate/ShareHub.tsx:145` visible URL (with the embed code at 107)
  - `components/candidate/ProfileEditor.tsx:196` profileUrl builder, `:208` and `:566` visible URLs, `:569` clipboard write
  - `components/candidate/PreviewFrame.tsx:233` mock chrome URL
  - `app/(candidate)/dashboard/share/page.tsx:26` profileUrl
  - `app/(candidate)/dashboard/preview/page.tsx:38` liveUrl
  - `app/sitemap.ts:24` sitemap entry
  - `lib/email/transcript.ts:69` employer-email profile link
  - `lib/ai/asset-package.ts:389` generated public URL line
  - comments: `app/robots.ts:7`, `app/sitemap.ts:11`, `lib/candidate/calling-card.ts:30`
  Verify: `grep -rn "'/c/\|\"/c/\|\`/c/\|/c/\${\|/c/{" app components lib --include="*.ts" --include="*.tsx"` returns ONLY the redirect file in `app/c/[slug]/`.
- [ ] Update docs references `/c/[slug]`→`/i/[slug]` where docs are being rebranded (Phase 7), including CLAUDE.md route table and architecture docs.
- [ ] Confirm no route collision: `app/i/` does not exist today (checked; only `app/icons/` which is unaffected).

---

## Phase 5: Rebrand, Email Templates

All senders change from `RoleBoost <transcripts@roleboost.app>` to `IdentiBoost <transcripts@identiboost.com>`. Requires the Resend domain verification from Phase 0 first, or every send fails.

- [ ] `lib/email/transcript.ts`: FROM (5)→`'IdentiBoost <transcripts@identiboost.com>'`; APP_URL fallback (6) `https://roleboost.app`→`https://identiboost.com`; professional-side subject (59) "A recruiter just chatted with your RoleBoost AI"→"Someone just chatted with your IdentiBoost AI" and matching heading (52); body company fallback (46) 'An anonymous recruiter'→'An anonymous contact'; contact-side subject (73) "Your RoleBoost conversation with ${candidateName}"→"Your IdentiBoost conversation with ${candidateName}" and heading (66); footer (27) "Powered by RoleBoost AI · honest by design"→"Powered by IdentiBoost AI · honest by design"; role label (15) `${candidateName}'s AI` already correct; profile link (69) `/c/`→`/i/` (Phase 4).
- [ ] `lib/email/digest.ts`: FROM (4)→IdentiBoost address; subject (67) "Your RoleBoost week: ..."→"Your IdentiBoost week: ..."; h2 (48) "Your week on RoleBoost"→"Your week on IdentiBoost"; body (49) "...what recruiters did with your profile..."→"...what your contacts did with your profile...".
- [ ] `lib/email/meeting.ts`: FROM (5)→IdentiBoost address; h2 (53) "New meeting request" keep; body (54) "A recruiter asked to meet with you through your RoleBoost Personal Assistant."→"A contact asked to meet with you through your IdentiBoost AI."; subject (67) "Meeting request from ..." keep (no brand token); transcript role label (44) `${candidateName}'s AI` keep; user-side literal 'Recruiter'→'Contact'.
- [ ] `lib/email/meeting-reminder.ts`: FROM (4)→IdentiBoost address; h2 (43) "A recruiter is still waiting to hear from you"→"A contact is still waiting to hear from you"; body (44) "...through your RoleBoost Personal Assistant..."→"...through your IdentiBoost AI..."; subject (58) keep (no brand token).
- [ ] `lib/email/client.ts`: no copy changes (verify by grep).
- [ ] After deploy: send one of each email type to a real inbox and verify FROM name/address, subject, body, footer, and that all links point at identiboost.com/i/. Check SPF/DKIM pass in the received headers.

---

## Phase 6: Rebrand, Metadata and SEO

(Applies the Phase 3 string changes; this phase is the checklist that nothing metadata-shaped is missed.)

- [ ] `app/layout.tsx`: title default + template, description, keywords, authors, applicationName, openGraph (siteName/title/description/url), twitter card, appleWebApp, canonical base (metadataBase from APP_URL). Verify in browser dev tools on the deployed preview.
- [ ] `app/manifest.ts`: name, short_name, description.
- [ ] `app/opengraph-image.tsx` + `app/twitter-image.tsx`: wordmark, tagline, supporting line render "IdentiBoost / Your identity. Boosted."
- [ ] `app/icons/[size]/route.tsx`: "I" monogram renders at all sizes (check /icons/192 and /icons/512).
- [ ] `app/(marketing)/page.tsx`: metadata + Organization/WebSite JSON-LD names, descriptions, URLs.
- [ ] `app/(marketing)/recruiters/page.tsx`: metadata per the evaluator-page decision.
- [ ] `app/boosts/page.tsx`, `app/boosts/[slug]/page.tsx`, `app/boosts/[slug]/opengraph-image.tsx` (+ twitter-image re-export): titles, descriptions, alt text, RB→IB initials, wordmark.
- [ ] `app/i/[slug]/page.tsx`: generateMetadata title/description "on IdentiBoost"; confirm noindex default and the search_discoverable opt-in still gate indexing.
- [ ] `app/privacy/page.tsx` and `app/terms/page.tsx`: metadata titles "| IdentiBoost".
- [ ] `app/robots.ts` + `app/sitemap.ts`: base URL identiboost.com; sitemap contains `/i/` URLs only.
- [ ] Verify with a crawler pass on the preview deploy: no og:/twitter:/canonical/JSON-LD value contains "roleboost" (curl the HTML and grep).

---

## Phase 7: Rebrand, README and Documentation

- [ ] Replace the codebase `README.md` with the "New README.md Content" block from the pivot brief (IDENTIBOOST_PIVOT_README.md, section "New README.md Content"). Verify: README opens with "# IdentiBoost" and the env-var block includes CLERK_WEBHOOK_SECRET note if you choose to add it (the brief's block omits SUPERADMIN_EMAILS and CLERK_WEBHOOK_SECRET; recommend appending both to the README env section to match reality).
- [ ] `CLAUDE.md`: title (1) "# CLAUDE.md, RoleBoost"→IdentiBoost; "What This Project Is" (17)→universal professional presence description; domain line (24) "roleboost.app"→"identiboost.com"; design-system path references (87, 537, 545) update after the directory rename; route table `/c/[slug]`→`/i/[slug]`; keep every architecture rule intact.
- [ ] Rename `design-system/roleboost/`→`design-system/identiboost/`; in MASTER.md update the 5 RoleBoost mentions (1, 4, 12, 36, 303); fix its em dashes while touching it (project rule).
- [ ] `todo.md`: decide to carry forward or replace with TODOS.md; if kept, update the SEO/legal sections (154-176): NEXT_PUBLIC_APP_URL value, sitemap URL, privacy@/legal@ addresses, "the state in which RoleBoost is established".
- [ ] `docs/VISION.md`: rewrite the opening/problem/market sections to the universal professional presence positioning per the pivot brief (sections: The Problem, The Candidate Truth, The Solution/How It Works, The Market, Competitive Positioning, Business Model, footer). Core architecture sections stay.
- [ ] `docs/PRD.md`: update framing sections (§1 Overview, §2 Onboarding role split, §6 email subject lines to the new IdentiBoost subjects, header Domain line); leave §12 SQL schema untouched.
- [ ] `docs/CANDIDATE_ASSET_PRODUCTION_SKILL.md`: brand-name references only per the pivot do-not-touch rule ("only update brand name references"): title, trigger prompt, "RoleBoost palette" naming, closing-pitch URLs "at roleboost.app"→"at identiboost.com", output header/footer lines, public URL pattern→identiboost.com/i/[slug]. Keep the structure and workflow identical.
- [ ] Rename `docs/architecture/specs/ROLEBOOST_AI_BRAIN_SPEC.md`→`IDENTIBOOST_AI_BRAIN_SPEC.md` and update its 17 brand references + any files linking to it (`docs/architecture/specs/README.md`, CLAUDE.md).
- [ ] Rename `docs/prompts/RoleBoost_NotebookLM_Prompt_Library.md`→`IdentiBoost_NotebookLM_Prompt_Library.md` and update its 5 references + linkers.
- [ ] `docs/architecture/` tree: update brand/domain references in 11-anti-spam.md (1), 12-security.md (1), 13-automations.md (2, includes a `https://roleboost.app` example), README.md (3), specs/DASHBOARD_POLISH_BUILD.md (4), specs/ELITE_SYSTEM_PROMPT_BUILD_SPEC.md (2), specs/README.md (1), specs/SUPERADMIN_DASHBOARD.md (1).
- [ ] `docs/marketing/`: MARKETING_SITE_BUILD.md (22 refs incl. domain), MARKET-RESEARCH.md (26), PLAIN-ENGLISH-OVERVIEW.md (8), README.md (2). These are positioning docs; rebrand names/domains and add a note that positioning has pivoted (full rewrite optional).
- [ ] `docs/sample-users/`: PERSONA_NARRATIVE_GUIDE.md (18 refs incl. 9 getroleboost.com/c/ URLs→identiboost.com/i/), README.md (1), and the three asset-package .md files (claire-hutchins 12, jordan-mills 10, ryan-kowalski 10, each with "Learn more at roleboost.app" spoken-pitch lines→identiboost.com).
- [ ] `ai-brain-architecture-snapshot.md` (528 KB historical archive, 63 RoleBoost + ~15 domain refs): DECIDED 2026-07-14: rebrand it. Find and replace all RoleBoost/roleboost.app/getroleboost.com/transcripts@ strings and the `/c/[slug]` URL patterns per the global rules; contents otherwise unchanged.
- [ ] `public/boosts/README.md` and `docs/marketing/README.md` link text: sweep for brand strings.

---

## Phase 8: Verification

Run from the repo root after Phases 3-7. Every step must pass before deploy.

- [ ] `grep -ri "roleboost" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" --include="*.mjs" --include="*.yml" app components lib middleware.ts next.config.ts package.json .github .env.example` returns ZERO lines (code surface fully clean; migrations excluded by design).
- [ ] `grep -ri "roleboost" --include="*.md" . | grep -v supabase/migrations | grep -v ai-brain-architecture-snapshot` returns zero lines (or only the archived-snapshot exception if kept).
- [ ] `grep -rn "getroleboost" .` returns zero lines.
- [ ] `grep -rn "roleboost.app" . | grep -v supabase/migrations | grep -v ai-brain-architecture-snapshot` returns zero lines.
- [ ] `grep -rn "'/c/\|\"/c/\|\`/c/" app components lib --include="*.ts" --include="*.tsx"` returns only the `app/c/[slug]` redirect file.
- [ ] `grep -rn "Personal Assistant" app components lib --include="*.ts" --include="*.tsx"` returns zero user-facing hits (per the [Name]'s AI rename).
- [ ] `grep -rn "—" app components lib --include="*.tsx" --include="*.ts"` shows no NEW em dashes introduced by the rebrand (pre-existing flagged ones tracked separately).
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` exits clean (0 errors; the ~16 pre-existing warnings are acceptable per project rule).
- [ ] `npm run build` succeeds with the placeholder public env (same set CI uses, with NEXT_PUBLIC_APP_URL=https://identiboost.com).
- [ ] Manual flow (local dev with real env): sign up→onboarding shows "I want to represent myself"→resume upload→dashboard header/nav show IdentiBoost logo→AI Studio loads→publish→`/i/<slug>` renders with "Ask [Name]'s AI anything" and the IdentiBoost disclaimer→`/c/<slug>` 308-redirects→chat works→transcript download filename starts `identiboost-`.
- [ ] Manual metadata check: `curl -s localhost:3000 | grep -io "roleboost"` empty; page source shows IdentiBoost titles/OG.

---

## Phase 9: Deployment

- [ ] Push the rebrand branch, open the PR into main, confirm CI (typecheck, lint, build) is green.
- [ ] Merge to main; Vercel deploys production. Verify the deployment log uses the IdentiBoost env set from Phase 1.
- [ ] Point identiboost.com DNS at Vercel (A/CNAME per Vercel instructions); confirm SSL issues and `https://identiboost.com` serves the app with valid cert.
- [ ] Verify www.identiboost.com redirects to the apex (or vice versa, pick one canonical).
- [ ] Confirm all 5 cron jobs show as scheduled in the production project and the first `deliver-transcripts` run returns 200 (check function logs; requires CRON_SECRET set).
- [ ] Confirm the Clerk webhook (production URL) delivers: sign up a fresh test account on production and see the `users` row.
- [ ] Confirm WAF rules "chat"/"schedule"/"deliver" are active in the production project.
- [ ] First live public-profile test: publish a test profile and load `https://identiboost.com/i/<slug>` signed out on a phone; chat one exchange; confirm `https://identiboost.com/c/<slug>` redirects to `/i/<slug>`.
- [ ] Submit `https://identiboost.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools; request indexing of `/` and `/boosts`.
- [ ] Delete or archive the test account/profile.

---

## Phase 10: First Live Profile (Rob Ramos)

The founder profile is the platform's flagship asset. Run every learning loop end to end on production.

- [ ] Sign up rob's account on production with the SUPERADMIN_EMAILS address; complete onboarding choosing "I want to represent myself". Verify: routed to the professional dashboard, admin access also works at /admin.
- [ ] Upload the real résumé; confirm parse populates the profile draft. Add professional sources (LinkedIn export, GitHub if relevant). Verify: sources listed, char counts sane.
- [ ] Run the guided intake interview (all passes). Verify: brain readiness score rises, inconsistencies (if any) surfaced and resolved, `intake_completed` true.
- [ ] Generate the Professional Context Document, pick an angle, set it active. Verify: the document renders titled "Rob Ramos: Professional Context Document".
- [ ] Add 3-5 custom Q&A pairs (learning loop 2). Verify: they appear in AI Studio and the AI uses them word-for-word in a test chat.
- [ ] Sandbox self-test (learning loop 4): run the full 20-question diagnostic. Verify: verdicts render; strengthen at least one weak field from the coaching.
- [ ] Publish; set slug `rob-ramos`. Verify: `https://identiboost.com/i/rob-ramos` loads signed out, header reads "Ask Rob's AI anything", disclaimer says "Powered by IdentiBoost."
- [ ] Live chat session (as an anonymous visitor, different browser/device): ask at least 5 questions including one adversarial and one with numbers (triggers complexity router + grounding validation). Verify: answers grounded, no hallucinated claims, model tracking columns populated on the assistant turns.
- [ ] Identify as the visitor (name + email + company) mid-chat; end the conversation. Verify transcript delivery (the two-sided loop): Rob's copy arrives ("Someone just chatted with your IdentiBoost AI"), FROM `IdentiBoost <transcripts@identiboost.com>`; the visitor copy arrives ("Your IdentiBoost conversation with Rob Ramos") with the profile link pointing at identiboost.com/i/rob-ramos. If nothing arrives within 15 minutes, the cron sweep should deliver; investigate RESEND_API_KEY and function logs if not.
- [ ] Gap analysis (learning loop 3): after the transcript lands, check AI Studio's prompt bot. Verify: at least one gap/expansion prompt surfaced from the real conversation; adopt a suggested answer and confirm it lands in custom Q&A.
- [ ] External transcript hardening (learning loop 5): paste a real past conversation (any source) into Harden. Verify: gaps identified, hardening plan renders, strengthen one field.
- [ ] Context augment loop (learning loop 6): after the above training, re-run the context document augment. Verify: the document re-synthesizes including the new material and stays selected.
- [ ] AI intake augmentation confirmation (learning loop 1 closes): confirm the brain fields reflect interview answers in AI Studio.
- [ ] Final six-loop sign-off: intake interview ✔, custom Q&A ✔, transcript gap analysis ✔, sandbox self-testing ✔, external hardening ✔, context augment ✔. All verified against the live rob-ramos brain, each with a concrete observed result noted next to this checkbox.
- [ ] Share test: generate the QR code in Share Hub, scan it from a phone, confirm it opens identiboost.com/i/rob-ramos. Put the link in an email signature and click it from a mail client.

---

## Open risks and decisions (tracked; not blocking checkbox generation)

1. Demo media is brand-baked: `public/boosts/*.mp3` audio scripts end with "Learn more ... at roleboost.app" spoken aloud, and the visual-boost PNGs/resume JPGs likely show RoleBoost branding. Find-and-replace cannot fix binaries. Options: regenerate the demo Boosts for IdentiBoost, or temporarily pull the /boosts examples.
2. Employer-side depth: DECIDED 2026-07-14: light rename for v1 (Candidates→Professionals, Hiring→Evaluating); the structural rethink of the evaluator workspace (contacts/CRM framing, CRM export) moves to the post-launch roadmap alongside the embed widget.
3. Paddle pricing names vs. schema: new tiers "Business" and "Team" are not in the `users.subscription_tier` CHECK constraint; wiring billing later will need a migration, conflicting with "schema stays as-is". Defer billing (recommended) and resolve then.
4. `RESEND_API_KEY` absent from the old project's env: email delivery has possibly never worked in RoleBoost production. Treat all email flows as first-time verification, not regression testing.
5. Known P0 security items inherited from roleboost todo.md (Paddle webhook stub, anon INSERT policy on chat_sessions, transcript_sent flipped before send, check_rate_limit PUBLIC grant (fixed by migration 29), defensive writes for late migrations, which a fresh DB makes moot). The rebrand does not fix these; carry them into the IdentiBoost backlog.
6. Clerk/Supabase account reuse vs. fresh: decided in Phase 0; affects whether existing RoleBoost users/data exist in IdentiBoost at all.
