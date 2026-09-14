# Puppy School content

Source of truth for Puppy School lesson content. **Copy lives here; it is not authored in
`puppy-school/index.html`.**

The intent (see the delivery design) is that this content is rendered twice:

1. **dbmn.io** — the Jekyll site renders these files at `/puppy-school/`
2. **In the extension** — a Hub tab fetches the same content as JSON and renders it natively

Which is why the content is stored as data rather than as page markup.

## Files

| File | What it is |
|---|---|
| `00-landing.md` | Public landing page. Sells the course to signed-out visitors; shows begin/resume to signed-in ones. |
| `01-first-contact.md` … `05-own-template.md` | The five lessons, in order. |
| `99-graduation.md` | Completion screen, certificate copy, and the checkpoint copy shared by every lesson. |

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

The rules themselves live server-side, keyed by `lesson_id` — see
`docs/playground/share-it-back-brief.md` in vs-dbmn. A passing review is what the
checkpoint consumes; the page never writes progress itself.

## Body conventions

The renderers rely on these, so keep to them:

- `## Step N — Title` starts a step. Everything up to the next `##` belongs to it.
- Prose above the first `## Step` is lesson intro copy.
- **Every fenced code block gets a Copy button.** Don't fence anything you don't want copied.
- Blockquotes starting `> **🐾 Dobermann Philosophy**` or `> **🦴 Dig Deeper**` render as
  callouts at the foot of the lesson. Any other blockquote renders as an inline aside.
- `<!-- share-it-back -->` is replaced by the share-it-back thread (lessons with a `review`
  block only). HTML comment so Liquid and both renderers pass it through.
- Support address is `support@dbmn.io` — every fail screen and the graduation page use it.
- Tables render as-is.
- `note_to_reviewer` in front matter is internal — it must never reach a renderer.

## Jekyll gotcha

Lesson bodies contain `{{template variables}}`, which collide with Liquid. `_config.yml`
sets `render_with_liquid: false` for `docs/` only — **the same scope rule has to be added
for this collection** before it is rendered, or Jekyll will eat the variables.

## Known dependencies

Copy here describes behaviour that the backend phase delivers. Until those land:

- **Lesson 3** tells the learner their reference data is theirs alone. True only once
  reference rows are user-scoped.
- **Lesson 4** completes on an export. Requires the extension to record exports as
  telemetry (`recordExport()` is implemented but never called) and to flush promptly.
- **Lesson 1** links a starter `.dbmn.zip` that does not exist yet.
- **Lesson 2** states a 60,000 record threshold; the deployed RPC currently checks 67,000.
- **Lesson 4** uses `locationGln` as a query-param filter. The playground currently passes
  filter keys straight to PostgREST (`parsePagination` → `.eq(key, value)`), so only the
  snake_case column name `location_gln` works today. The backend phase should camelCase-map
  filter keys — the API responds in camelCase, so accepting snake_case only is a wart.
