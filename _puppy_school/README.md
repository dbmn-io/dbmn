# Puppy School content

Source of truth for Puppy School lesson content. **Copy lives here; it is not authored in
`puppy-school/index.html`.**

**Rendered once, on dbmn.io** (decided 2026-09-17). The extension does not render lessons:
it is a single Hub tab, and a lesson inside it would cover the screens being taught. The
extension links here, and shows progress and badges in its Account section.

## How it is rendered

| Piece | Where |
|---|---|
| Collection `puppy_school`, `/puppy-school/<slug>/`, Liquid off for lesson bodies | `_config.yml` |
| The page: header, progress rail, lesson head, checkpoint panel, page data, copy templates | `_layouts/puppy_school.html` |
| Paste-it-back and share-it-back widgets, swapped in at their markers | `_includes/puppy_school/` |
| Behaviour: progress, checkpoint, widgets, graduation, certificate | `puppy-school/course.js` |
| Look | `puppy-school/course.css` (badge grid in `account/shared.css`) |
| Copy shared by every lesson (checkpoint states, sign-in prompt, widget notices) | `_data/puppy_school_copy.yml` |
| Reviewer notes can never reach a page: stripped before render, build fails on a leak | `_plugins/puppy_school_guard.rb` |
| Badge artwork, exported from the extension, served to the raw-HTML pages | `_data/dbmn_badges.json` → `/account/badges.json` |

Rules the layout keeps:

- **Lessons are public.** Anyone can read them. Signing in adds the progress rail, Check My
  Homework, the two widgets, graduation and the certificate.
- **Front matter reaches the browser through an explicit allow-list** (`#ps-meta`), never
  `page | jsonify`. Human-readable copy goes into `<template>` elements instead of JSON,
  because `{icon:role}` becomes an `<svg>` — right in HTML, fatal in JSON.
- **The server decides everything.** The page never writes progress, never knows an answer,
  and never stores what a learner pastes. Text that comes back from the API is set with
  `textContent`.
- Markers: `<!-- paste-it-back -->`, `<!-- share-it-back -->`, `<!-- course-cta -->`
  (landing), `<!-- certificate -->` (graduation).

Run it locally from vs-dbmn: `npm run dev:local`, then http://127.0.0.1:4000/puppy-school/.
Served from `127.0.0.1` the pages use the local Supabase stack and show a LOCAL ribbon
(`account/shared.js`). Tests, also in vs-dbmn: `npm run test:e2e:lessons` plays a learner
through all five lessons from THESE files and measures every number the copy states;
`npm run test:e2e:course` does the whole course in a browser, to a downloaded certificate.

## Files

| File | What it is |
|---|---|
| `00-landing.md` | Public landing page. Sells the course to signed-out visitors; shows begin/resume to signed-in ones. |
| `01-first-contact.md` … `05-own-template.md` | The five lessons, in order. |
| `99-graduation.md` | Graduation: shown to graduates only. Badges, the certificate, where to go next. |

## Front matter

Lessons carry everything the course engine needs that isn't prose:

```yaml
lesson_id: lesson_2        # stable id — used by check_lesson_completion and progress rows
number: 2                  # display number
slug: the-big-load
title: The Big Load
goal: One line shown under the title
estimate: ~15 minutes
completion:
  criteria: Machine-checked condition, stated for humans
  summary: Short form used in progress UI
checkpoint:
  pass: Shown on the pass screen
  fail: Shown on the fail screen, above the specific incomplete list from the RPC
```

`lesson_id` is the contract with the backend. Changing one means migrating
`user_course_progress.completed_lessons` and the `check_lesson_completion` RPC together.

Lessons that review a template the learner built carry a `review` block and place a
`<!-- share-it-back -->` marker in the body where the exchange should render:

```yaml
review:
  endpoint: My Replenishment Orders   # what the learner is asked to Share
  prompt: DBMN's opening line
  pass: Shown when the review has no errors
  fail: Shown above the findings when it does
```

The rules themselves live server-side, keyed by `lesson_id`:
`supabase/functions/playground/course-review.ts` in vs-dbmn. The page POSTs the pasted text
to the Training Ground API as `{ "share_text": "…" }` at `/course/review/lesson_5` and
renders the findings that come back (200 pass, 422 fail). Only the outcome and the findings
are kept — what the learner pasted is never stored. A passing review is what the checkpoint
consumes; the page never writes progress itself.

Lessons that check something the learner *produced* carry a `verify` block and a
`<!-- paste-it-back -->` marker (Lesson 4: the filtered report, copied from the Console):

```yaml
verify:
  endpoint: /course/verify/lesson_4   # POSTed to the Training Ground API as { "paste": "…" }
  prompt: DBMN's line above the paste box
  pass: Shown on a 200
  fail: Shown on a 422, above the findings the API returns
```

The page is a text box and a button, nothing more. It POSTs what was pasted, with the
learner's DBMN session, to `<playground base URL><endpoint>` and renders `findings[].message`
from the response. **The answers never reach the page**: the rules live in
`supabase/functions/playground/course-verify.ts` in vs-dbmn, the expected row count is
computed from the learner's own data at request time, and the findings are worded to say
what's wrong without saying what's right. Keep it that way — no expected values in front
matter, copy, data attributes or scripts. Nothing pasted is stored; the function logs only
the outcome, and `check_lesson_completion` reads that.

## Body conventions

The renderers rely on these, so keep to them:

- `## Step N — Title` starts a step. Everything up to the next `##` belongs to it.
- `## Bonus Credit — Title` is an optional section after the last step. It is never part of
  the checkpoint and should render visibly as extra — for things that are true and useful
  but aren't Dobermann itself (Lesson 4's API-side filtering is the model). The main steps
  teach the product; bonus credit teaches the habit around it.
- Prose above the first `## Step` is lesson intro copy.
- **A step is one action and one thing to notice.** Two verbs in the title means two steps.
  Aim for 60-150 words; a step over ~200 is a wall and should be split. Lesson 3 is the
  worked example: ten steps, ~1,200 words.
- **Never write "Step" inside a step.** The Run Batch loader has its own numbered screens;
  call them by name (Load Data, Map & Transform, Review & Edit Data, Review JSON, Execute
  Batch) so the lesson's own numbering is the only one on the page.
- **End a step with what the learner should see**, so they can check themselves before
  moving on.
- **Don't give away a number the lesson is about to reveal.** Lesson 3 never says how many
  records are broken until the close, because finding that out is the lesson.
- **Every fenced code block gets a Copy button.** Don't fence anything you don't want copied.
- Blockquotes starting `> **🐾 Dobermann Philosophy**` or `> **🦴 Dig Deeper**` render as
  callouts at the foot of the lesson. Any other blockquote renders as an inline aside.
- `<!-- share-it-back -->` is replaced by the share-it-back thread (lessons with a `review`
  block only). HTML comment so Liquid and both renderers pass it through.
- `<!-- paste-it-back -->` is replaced by the paste box (lessons with a `verify` block only).
- **Fence tags:** `json` for anything JSON-shaped — endpoint templates included, they're
  JSONC — `csv` for CSV, `text` for everything else (search expressions, this file's token
  examples). Never an untagged fence, never `JSON`.
- Support address is `support@dbmn.io` — every fail screen and the graduation page use it.
- Tables render as-is.
- `note_to_reviewer` in front matter is internal — it must never reach a renderer.
- **Icons are written as `{icon:<role>}`**, never as an image or an icon name — see below.

## Icons

When a step says "click the paste button", the lesson shows the button's icon inline so
the learner can find it. The token names the button's *function*, not its picture:

```text
open {icon:nav-api-catalogue} **API Catalogue**, then click {icon:paste-endpoint}
```

The roles and their SVGs are owned by the extension — `ICON_ROLES` in vs-dbmn
`src/webviews/shared/icons.js` — and exported here as `_data/dbmn_icons.json` by
`npm run docs:icons` in vs-dbmn (automatically on every release). If the product changes
the icon it draws for "paste endpoint", the next export changes it on every page that
says `{icon:paste-endpoint}`. Nothing in this folder needs editing.

- dbmn.io: `_plugins/dbmn_icons.rb` replaces the token after render (works with
  `render_with_liquid: false`); `.dbmn-icon` in `css/brand.css` sizes it to the text.
- Extension Hub renderer: `window.Icons.roleIcon(role)` returns the same SVG.
- Unknown role → the token is left visible and the build logs a warning. Add the role to
  `ICON_ROLES` in vs-dbmn (a unit test pins each role to the control that draws it) and
  re-export.

Roles used by the lessons so far: `nav-environments`, `nav-api-catalogue`, `nav-history`,
`nav-account`, `env-switcher`, `add-endpoint`, `paste-endpoint`, `paste-row`, `run-api`,
`run-batch`, `add-query-param`, `filters`.

## Jekyll gotcha

Lesson bodies contain `{{template variables}}`, which collide with Liquid. `_config.yml`
sets `render_with_liquid: false` for this collection, as it does for `docs/`. Keep it: the
browser test asserts `{{gtin}}` reaches the page literally.

## Known dependencies

The copy describes behaviour that is written but not all released. As of 2026-09-17 the
course needs **all** of these before it is published. Everything in vs-dbmn is on branch
`worktree-run-api-row-paste`.

Backend — `supabase db push`, then `supabase functions deploy playground --no-verify-jwt`:

- `20260917000001_open_environments.sql` — no licence gate on the Training Ground. Lessons
  2, 3 and 4 use full-licence features (more than five batches a week, 16 concurrent
  requests, more than three pages, **Fetch all pages**).
- `20260917000002_playground_product_suppliers.sql` — every product gets a supplier, a
  reorder quantity and a sometimes-blank supplier part number. Lessons 4 and 5.
- `20260917000004_playground_reference_ownership.sql` — reference records a learner adds
  are visible to and usable by that learner alone. Without it the first learner to finish
  Lesson 3 fixes the error file for everyone after them.
- `20260917000005_course_submissions.sql` — the outcome of each paste-it-back and
  share-it-back. Never the pasted content.
- `20260917000006_course_completion.sql` — `check_lesson_completion` for all five lessons,
  and it now **records** the pass itself; the page can no longer write progress. Lesson 2's
  threshold becomes the 60,000 the copy states. Lesson 3 also needs inventory that uses a
  product or location the learner added. `lesson_2_1` is still accepted as `lesson_3`;
  stored progress ids are **not** migrated yet — do that in the release that switches the
  page to these files.
- The playground function: `product.supplier` / `reorderQty` / `supplierSku` on inventory,
  `lines` on the purchase-order list (Lesson 5 Steps 1 and 7), camelCase filter keys
  (Lesson 4 Bonus Credit's `locationGln`), `POST /course/verify/lesson_4`,
  `POST /course/review/lesson_5`, and reference-data errors that name the missing value.

- `20260917000007_badges.sql` — the badge catalogue, server-side awards, `get_my_badges()`,
  and the private certificate (`issue_my_certificate`).
- `20260917000008_backfill_lesson_completions.sql` — carries learners who passed lessons on
  the old page across. **Deploy before this site**, or they show 0 of 5.

All of the above has run end to end on a local Supabase stack (vs-dbmn:
`npm run test:e2e:backend`, `test:e2e:lessons`, `test:e2e:course`). None of it is deployed.
Deploy order: migrations, then the playground function, then merge this branch.

Extension — a release containing:

- Run API row paste, issue #302 (Lesson 2 Step 3, Lesson 5 Step 4).
- `|opt` omitting keys in **nested** templates. Before the fix a blank part number goes out
  as `""`, and Lesson 5 Step 6's "no `supplierSku` key at all" is false.

Still open:

- **Lesson 1** links a starter `.dbmn.zip` that does not exist yet.
- **Badge artwork** is a placeholder rosette until the real designs land
  (`src/webviews/shared/badges.js` in vs-dbmn, then `npm run docs:icons`).
- **Most users have no profile name** (nothing creates `user_profiles` rows since the
  questionnaire was retired), so the certificate name box usually starts empty.
