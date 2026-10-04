# CLAUDE.md — Dobermann (dbmn.io)

## Overview
Public website, documentation, and blog for Dobermann (https://dbmn.io).
Built with Jekyll + just-the-docs theme. Deployed via GitHub Actions on push to `main`.

**The docs describe the product as it is, in the product's own words.** The UI has changed
shape more than once; the rules below exist so the docs change with it.

## Structure
- `index.html` — Landing page (custom HTML, not processed by Jekyll theme)
- `docs/` — User documentation (Markdown, processed by Jekyll)
- `docs/index.md` — Documentation hub with quick links
- `docs/hub.md` — The Hub: rail, list panel, header, tabs, Settings. Link here for anything about *where* a control is
- `docs/changelog.md` — Release history (generated; see Changelog)
- `docs/internal/` — Production notes, excluded from the build
- `_puppy_school/` — The Puppy School course (own rules: `_puppy_school/README.md`)
- `blog/index.md` — Blog listing page
- `_posts/` — Blog posts (YYYY-MM-DD-title-slug.md format)
- `images/` — Site images and logos
- `_data/dbmn_icons.json` — The product's icons, exported from vs-dbmn (`npm run docs:icons`); never edit by hand
- `_plugins/` — `dbmn_icons.rb` (icon tokens), `docs_terms_guard.rb` (retired vocabulary fails the build), `puppy_school_guard.rb`, `puppy_school_version.rb`
- `_config.yml` — Jekyll configuration
- `.github/ISSUE_TEMPLATE/` — Public issue templates
- `.github/workflows/deploy-pages.yml` — GitHub Actions deployment workflow

## Branches: what deploys and when
- `main` deploys to dbmn.io on every push. **Only docs that are true of the released
  extension go on `main`.**
- `next-release` holds docs for the next release — new pages, changed labels, API fields that
  need a backend deploy. It is merged into `main` on release day by the **dbmn-release** skill
  in vs-dbmn, so docs, icons and changelog go live together.
- A fix to a doc that is wrong about the *current* release goes straight to `main`.
- Puppy School course changes (`_puppy_school/`, `puppy-school/`) are committed separately
  from reference-doc changes, so either can be reviewed or reverted on its own.

## Keeping the docs true: the process
Docs are updated **during** feature development in vs-dbmn, not after. The owning steps live
in the vs-dbmn skills — **dbmn-workflow** (build), **dbmn-close-issue** (finish),
**dbmn-release** (ship) — and come down to this:

1. **Every user-visible change gets a docs check before the issue closes.** Grep `docs/` for
   the feature's words *and for the old label*. Update the page, or say in the closing
   summary that a page is needed.
2. **A renamed or removed control is a retired term.** Add the old phrase to `RETIRED` in
   `_plugins/docs_terms_guard.rb` with the new wording as the hint. The next build fails on
   every page that still uses it, and the message says what to write instead.
3. **Write the UI's own labels, in bold, exactly as rendered**: **Copy to Share**, **Rows per
   request**, **Import Data**. When a step says "click the paste button", show the button:
   `{icon:paste-endpoint}` (roles in `_data/dbmn_icons.json`; the picture updates itself when
   the product's does).
4. **Anchors are an API.** The extension's help icons and the changelog link to
   `/docs/<page>/#<anchor>`. Before renaming a heading, keep its anchor with `{: #old-anchor }`.
   Check `data-help-section` in vs-dbmn `src/` and `[Docs](…)` links in vs-dbmn `CHANGELOG.md`.
5. **Build before committing**: `bundle exec jekyll build`. The guards run then. A guard hit
   is a doc that is wrong, or a RETIRED entry that is too broad — fix the right one.
6. **Prefer words to screenshots.** Screenshots rot at the speed of the UI. Use icon tokens
   and the control's label. If a picture is ever needed, generate it from the vs-dbmn
   Playwright suites at release time, like the icons, rather than by hand.

## UI vocabulary
What the product calls things now. Use these; the guard rejects most of the retired ones.

| Say | Not | Notes |
|---|---|---|
| the **Hub** | sidebar, tree view, panel | One editor tab; the VS Code sidebar closes when it opens |
| **rail** / **list panel** / **tabs** | | Rail sections: Environments, API Catalogue, History, Import, Export; pinned: Account, Settings |
| **environment selector** (header) | status bar, right-click → Set as Active | Also **Set as Active** in the environment editor footer |
| **Add Endpoint**, **Add Environment** | + icon, New Endpoint | |
| **New Endpoint from Clipboard** / **Paste Endpoint** | Paste | Catalogue button / new-endpoint button |
| **Copy to Share** | Share | Endpoint footer |
| **tags** | folders | Folders were migrated to tags |
| **System** | | Short lowercase name for one API; on endpoints and environments |
| **History** | Executions, Executions sidebar | Rail label. Settings panel is "Transactions" |
| **Import** / **Export** → one `.dbmn.zip` | Export Workspace, Export Endpoint, Merge/Replace | |
| **Run API** / **Run Batch** | play icon | Footer buttons and catalogue row icons |
| Run Batch steps: **Load Data**, **Map & Transform**, **Review & Edit Data**, **Review & Configure**, **Execute Batch** | Review JSON | |
| **Import Data** | Read Data | Load Data button |
| **Rows per request** | Reps, Maximum Repetitions | Review & Configure |
| **Error Handling**: **Stop on first error** / **Continue processing** (default) | Stop on First Error, Max Error Count, Percentage-Based | Execute Batch, and the Console Settings tab |
| **Processing Mode** / **Max Concurrency** | threads | Per batch / per environment ceiling |
| **Pagination** (Console footer) → **Fetch all pages**, **Get next N pages**, **Next Page** | Configure Pagination, Fetch All, Execute tab | |
| Console tabs: **Links**, **Input**, **Raw**, **Completed**, **Error**, **Settings** | Execute tab, Request tab | **Links** only on a chained run |
| **Chain** (Console toolbar, Completed tab) → **Chain from …**, **Send them to endpoint:** | | Run Batch banner: **Chained from** |
| **help mode** (help button at the right end of the Hub header, or <kbd>?</kbd>) | help icon, ? icon | No screen has per-control help icons; help mode covers the Hub and every tab |
| **Reprocess**, **Re-run**, **Copy**, **Delete**, **Pause**, **Resume**, **Cancel** | Copy Batch, Rename, Stop | Console footer |
| **Logs**, **Raw / Render / Text** | View Logs, Rendered | Raw tab |
| the view button, named after the active view | `View: <name>` | Named Views |
| **The Training Ground** | Playground, Puppy School (for the API) | The API. **Puppy School** is the course |
| `~/Dobermann-Workspace`, `{environment}/{endpoint}/` | `.active8/results/` | `.active8/` holds only the database |
| Ctrl+W | Alt+D E, Quick Access | The only VS Code keybinding |

Never name a customer platform (Manhattan Active or any other) in public copy.

## Adding a New Doc Page
1. Create `docs/page-name.md` with front matter:
   ```yaml
   ---
   title: Page Title
   layout: default
   nav_order: N
   parent: Documentation
   ---
   ```
2. Add to the quick links table in `docs/index.md`
3. Give sections that the extension or changelog may link to a stable anchor: `{: #anchor }`
4. Build, commit to the right branch (see Branches)

## Adding a Blog Post
1. Create `_posts/YYYY-MM-DD-title-slug.md` with front matter:
   ```yaml
   ---
   title: "Post Title"
   layout: default
   ---
   ```
2. Commit and push — auto-deploys

## Template Variable Syntax in Docs
Dobermann uses `{{variable}}` syntax which clashes with Jekyll's Liquid templating.
This is handled automatically — **write docs with `{{}}` naturally**, no escaping needed.

The `_config.yml` sets `render_with_liquid: false` for all files under `docs/`,
which tells Jekyll 4 to skip Liquid processing entirely on documentation pages.
Source files in the repo stay clean and readable.

**Important:** This only applies to `docs/*.md` files. Blog posts and `index.html`
may use real Liquid syntax (e.g. `{{ post.title }}`) and are processed normally.

## Icon tokens
`{icon:<role>}` renders the product's own SVG for that control. Roles come from vs-dbmn
`src/webviews/shared/icons.js` via `npm run docs:icons`; the list is in
`_data/dbmn_icons.json`. Unknown roles are left visible and warned about at build time.
Tokens inside code spans and blocks are left alone.

## Pipes in Markdown Table Code
Kramdown uses `|` as the table column separator. If you need a literal `|` inside
a backtick code span within a table cell, the backslash escape (`\|`) does NOT work
inside backticks — it renders as `\|` literally.

**Use `<code>` with `&#124;` instead:**
```
| Modifier | Example |
|----------|---------|
| Upper | <code>{{SKU:string&#124;upper}}</code> |
```

This renders as `{{SKU:string|upper}}` in the browser. Only needed for code spans
inside table cells that contain pipes. Regular text pipes use `\|` as normal.

## Code Block Syntax Highlighting
- Use `json` for valid JSON blocks (no comments, no trailing commas)
- Use `javascript` for JSONC blocks (with `//` comments or trailing commas)
- Use plain ` ``` ` for non-code content (error messages, plain text examples)

## Changelog
The **extension repo** (vs-dbmn `CHANGELOG.md`) is the single source of truth for the changelog.
`docs/changelog.md` here is generated from it by vs-dbmn `scripts/release-publish.js`.

- **Never edit `docs/changelog.md` directly** — always update vs-dbmn `CHANGELOG.md`
- The docs guard skips it: it is history, and old labels in old entries are correct

## Video Assets
Videos live in `assets/videos/`. Before embedding a video in any page or committing a new video file, check:

1. **Size** — should be under 2MB. If larger, compress with:
   ```bash
   ffmpeg -i INPUT.mp4 -an -c:v libx264 -crf 28 -preset slow -r 15 -movflags +faststart OUTPUT.mp4
   ```
2. **Faststart** — the `moov` atom must be at the start of the file, not the end. Verify with:
   ```bash
   python3 -c "
   import struct; f = open('FILE.mp4', 'rb'); pos = 0
   for _ in range(5):
       h = f.read(8)
       if len(h) < 8: break
       size = struct.unpack('>I', h[:4])[0]; name = h[4:8].decode('ascii', errors='replace')
       print(f'offset={pos} atom={name} size={size}'); f.seek(pos + size); pos += size
   "
   ```
   The `moov` atom should appear before `mdat`. If not, re-run the ffmpeg command above (`-movflags +faststart` fixes it).
3. **No audio** — strip audio with `-an` for screen recordings (saves ~10-15% file size)
4. **No junk files** — delete `Zone.Identifier` files and unused originals before committing

## Local build
```bash
~/.local/share/gem/ruby/3.4.0/bin/bundle exec jekyll build    # guards run here
~/.local/share/gem/ruby/3.4.0/bin/bundle exec jekyll serve --host 127.0.0.1 --port 4000
```
`npm run dev:local` in vs-dbmn starts the site alongside the local backend. The vs-dbmn
scripts find this repo through `$DBMN_DOCS_REPO`, default `/home/jaffa/Projects/dbmn/dbmn`.

## Key Rules
- This is the single source of truth for user-facing documentation
- The private repo (vs-dbmn) contains internal dev docs only
- Docs should be updated DURING feature development, not after
- Do not add internal development documentation here (devNotes, requirements, bugFixes)
- Blog posts go in `_posts/` — use for release announcements, tips, use cases
- Write `{{variable}}` naturally in docs — `render_with_liquid: false` handles it
