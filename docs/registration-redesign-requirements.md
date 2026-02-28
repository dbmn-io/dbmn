# Registration Redesign Requirements

## Context

Current flow: Register (email/password) → Email confirm → Questionnaire → Extension. This is transactional and doesn't capture data from users who abandon. New flow: questionnaire-first progressive disclosure that learns about users even if they don't complete signup, tracks funnel stages, and uses JSONB storage so questions can evolve without schema migrations.

## Decisions

- **Supabase confirmation email**: Keep it. No custom confirmation email. The Edge Function sends a separate *welcome/onboarding* email after confirmation, not a duplicate confirmation.
- **Questions first**: Questionnaire before account creation. Captures responses even from users who abandon at the signup step.
- **Anonymous response capture**: New `signup_responses` table stores answers without requiring authentication. Linked to `user_id` after signup.
- **JSONB storage**: All questionnaire answers stored in a single `responses` JSONB column — questions can change without schema migrations.
- **Toggle UX**: Multi-select questions use pill/chip toggle buttons instead of checkboxes. Active state uses `--brand-accent`.
- **Edge Functions**: All live in `vs_active_8` (private repo).

## Question Flow (one screen per step)

| Step | Type | Content |
|------|------|---------|
| 1 | Intro | Value prop + "Let's Get Started" CTA |
| 2 | Text input | **Your Name** (required) |
| 3 | Text input | **Company** (optional) |
| 4 | Dropdown | **Your Role** — Developer, Consultant, Business Analyst, Sys Admin, Manager, Other |
| 5 | Multi-toggle | **Current Tools** — Postman, Excel, Bespoke tools, Vendor-provided tools, Other (textarea) |
| 6 | Multi-toggle + textarea | **Use Cases** — Data load, Data extract, Validate, Support, API Design, API Documentation + "Tell us more" |
| 7 | Multi-toggle | **Important Features** — Security, Data sovereignty, Speed, Team collaboration, Transparency, SOX compliance |
| 8 | Multi-toggle + textarea | **Trial Goals** — Replace manual processes, Evaluate for team adoption, Speed up bulk operations, Replace/supplement Postman, Proof of concept, Improve API workflow + "Tell us more" |
| 9 | URL + text inputs | **Socials** — LinkedIn URL, Twitter/X handle |
| 10 | Email/password | **Create Account** — email, password, confirm password, "Start Your Free Trial" |

Progress bar across the top showing current step / total steps.

## Toggle Button UX

Each option is a pill/chip button that toggles on/off (multi-select, not radio). Active state uses `--brand-accent` background. "Other" option reveals a textarea when toggled on.

## Requirements

### R1: Progressive Questionnaire

One question per screen with fade/slide transitions. Steps 1-9 are questionnaire, step 10 is account creation. Progress bar updates on each step. Linear Back + Next navigation — no skip buttons.

### R2: Funnel Tracking

Track three stages in `signup_responses.funnel_stage`:

| Stage | Trigger | What it tells you |
|-------|---------|-------------------|
| `questions_completed` | User finishes step 9 (socials, last question) | They engaged but haven't committed |
| `signup_started` | User reaches step 10 (create account screen) | They intended to sign up |
| `signup_completed` | `signUp()` succeeds, `user_id` backfilled | Full conversion |

Responses are written to `signup_responses` at `questions_completed`. The row is updated in-place as the user progresses through signup.

### R3: Anonymous Response Storage — JSONB

New table — accepts inserts without authentication. Uses JSONB for all questionnaire data:

```sql
create table signup_responses (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null,
  user_id       uuid references auth.users,
  funnel_stage  text not null default 'questions_completed',
  responses     jsonb not null default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

The `responses` JSONB holds everything:

```json
{
  "display_name": "Sarah",
  "company": "Acme Corp",
  "role": "developer",
  "current_tools": ["postman", "excel", "vendor_provided"],
  "current_tools_other": "Custom Python scripts",
  "use_cases": ["data_load", "validate"],
  "use_cases_detail": "Daily 50k item loads",
  "important_features": ["security", "speed", "sox_compliance"],
  "trial_goals": ["replace_manual", "replace_postman"],
  "trial_goals_detail": "Want to automate daily loads",
  "linkedin_url": "https://linkedin.com/in/sarah",
  "twitter_handle": "@sarah"
}
```

RLS policy: allow anonymous inserts and updates, deny reads. Authenticated users can read their own row (by `user_id`).

### R4: Signup Flow

After questionnaire completion:
1. Show email/password/confirm-password fields → update `funnel_stage` to `signup_started`
2. On submit: `signUp()` with `emailRedirectTo: 'https://dbmn.io/account/index.html'`
3. Update `signup_responses` row: set `user_id`, `funnel_stage` = `signup_completed`
4. Upsert `user_profiles` with `display_name`, `company`, `role` from JSONB
5. Insert trial license
6. Send welcome email via Edge Function

### R5: Tailored Welcome Email

`send-welcome-email` Edge Function (in `vs_active_8`) sends a personalised onboarding email *after* signup — NOT a confirmation email (Supabase handles that).

Contents:
- Greeting using display name
- Relevant doc links based on use case and role
- Getting started guidance tailored to experience level

### R6: Post-Submit Confirmation

After `signUp()`: hide form, show "Check your email" message. If from VS Code (`?redirect=vscode`), redirect via `redirectToVSCode()`.

### R7: Email Confirmation Landing

`emailRedirectTo` points to `index.html` (dashboard). `questionnaire.html` redirects to `register.html` via JS for stale links, preserving hash fragment for auth tokens.

## Files Modified

| File | Repo | Action |
|------|------|--------|
| `account/register.html` | dobermann | Complete rewrite — progressive questionnaire + signup |
| `account/questionnaire.html` | dobermann | Replaced with JS redirect to `register.html` |
| `account/shared.css` | dobermann | Added step, toggle, progress bar styles |
| `docs/registration-redesign-requirements.md` | dobermann | Updated with JSONB + revised questions |
| `supabase/migrations/` | vs_active_8 | `signup_responses` table + RLS policies (separate task) |
| `supabase/functions/send-welcome-email/index.ts` | vs_active_8 | Tailored email content (separate task) |

## Supabase Migration (for vs_active_8)

Ready-to-copy migration file:

```sql
create table if not exists signup_responses (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null,
  user_id       uuid references auth.users,
  funnel_stage  text not null default 'questions_completed',
  responses     jsonb not null default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_signup_responses_funnel on signup_responses (funnel_stage);
create index idx_signup_responses_session on signup_responses (session_id);

alter table signup_responses enable row level security;

create policy "Anyone can insert responses"
  on signup_responses for insert
  with check (true);

create policy "Anyone can update own session"
  on signup_responses for update
  using (true)
  with check (true);

create policy "Authenticated users read own responses"
  on signup_responses for select
  using (auth.uid() = user_id);
```

## Existing Code Reused

- `shared.js` — `initSupabase`, `showAlert`, `callEdgeFunction`, `redirectToVSCode`, `isVSCodeRedirect`
- `shared.css` / `brand.css` — form, button, alert, card, header styles
- Profile upsert pattern and trial license insert pattern from previous questionnaire.html

## Implementation Notes

- Supabase project URL: `https://bxrflqpkiheyrqpikfll.supabase.co`
- VS Code redirect: `?redirect=vscode` param preserved through entire flow
- `redirectToVSCode()` in shared.js handles the `vscode://` URI callback
- `session_id` is a client-side UUID (`crypto.randomUUID()`), not persisted to localStorage
- `send-welcome-email` Edge Function update is out of scope (separate task)

## Open Items

- **Step 5 tool options**: Placeholder list — more options after research
- **RLS update policy**: Client passes `session_id` in `.eq()` filter for updates — standard Supabase pattern
