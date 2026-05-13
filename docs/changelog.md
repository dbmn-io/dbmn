---
title: Changelog
layout: default
nav_order: 99
parent: Documentation
---

# Changelog

All notable changes to Dobermann are documented here.

## Unreleased

## v0.1.5 — 2026-05-13

### Added
- **Import endpoints from Postman collections** — The Import/Export view now accepts a Postman v2.1 collection `.json` file alongside the existing `.dbmn.zip`. Drag the file in, pick which requests to import, choose whether to use the folder names from the collection or import everything into one folder, and you're done. DBMN is a focused tool, so several Postman concepts have no equivalent and are not imported (pre-request/test scripts, saved response examples, OAuth/API-key auth, non-raw body modes, folder hierarchy beyond one level); affected endpoints are flagged in the import preview, and the [Postman import docs](/docs/import-export/#importing-from-postman-collections) cover exactly what does and doesn't come across. (GitHub Issue #189)
- **Console flags responses with no rows at the current row basis** — When some transactions in a batch have data at the row basis path and others don't (e.g. an `OLPN` array that exists on most responses but is missing or `[]` on a handful), the table silently dropped those responses' rows — making it look like the API failed. Three places now surface the problem: (1) a persistent warning notification in the standard console toolbar slot (same place as Pause / batch-failure): `⚠ N of M responses had no rows at <rowBasis>`; (2) a `⚠️` icon next to the active View name in the toolbar so the problem is visible at a glance; (3) the same icon next to every affected view in the View dropdown, so when picking a view you can see in advance which ones won't surface rows on this dataset. Hidden when the row basis is `root` or every response has rows. The shared footer notification helper now supports a `source` tag so the rowbasis warning only clears its own message — it won't nuke a pause notification owned by someone else (though when both want the same slot at the same time, the data-shape warning wins, on the basis that the Paused status pill already conveys the execution state). (GitHub Issue #250)

### Improved
- **Endpoint body editor — large-payload UX** — Editing a 5,000+ line raw JSON body was painful: the editor grew unbounded so the whole page scrolled instead of the editor; Ctrl-F found matches but couldn't scroll to them; and the action toolbar overflowed off-screen on narrow panels, hiding Undo / Redo / Format. Four changes: (1) the editor caps at 60% of the viewport height with Monaco's internal scrollbar handling overflow — Find widget reveal now works; (2) new **Full Window** button (top-right of the editor toolbar) pins the editor edge-to-edge for max editing space, **Esc** exits; (3) the toolbar no longer wraps or clips — when buttons don't fit, secondary actions (Encode, Delete, Redo, Undo, Comment in that order) collapse into a **More ▼** dropdown so primary actions stay visible at any width; (4) Full Window reuses the same Monaco instance, so edits persist when toggling. (GitHub Issue #249)
- **Endpoint footer — direct buttons + responsive overflow** — Duplicate, Download Template, and Delete (previously hidden inside the **More** menu) are now direct footer buttons alongside Paste and Share. The Delete button now uses an in-button arm-and-confirm — first click swaps the label to "Click again to confirm" with a red background; second click within 4s triggers the existing transaction-count check and native confirm. The **More** dropdown is now purely an overflow destination — it only appears when the panel is too narrow to fit everything; lower-priority buttons (Download Template, then Paste, Duplicate, Share, finally Delete) collapse into it as width shrinks. Save / Run / Add stay pinned at every width, and resizing the panel re-flows in real time.

### Fixed
- **Endpoint body editor reported the wrong line for JSONC syntax errors** — A body template with `//` comments AND a real syntax error (e.g. a missing comma) had the editor underline the first `//` instead of the actual broken line — making the error look like "comments are forbidden" when they're not. The validator stripped comments through a "safe" wrapper that, on detecting the stripped result was invalid, fell back to returning the original commented text — so `JSON.parse` then choked on the first `//` it saw. Validation now uses the unwrapped stripper so the parser always sees comment-free input and the error marker lands on the real syntax issue (and comments stay legal). (GitHub Issue #251)
- **Run Batch — Step 3 wouldn't let you paste a single value into a single cell** — On Step 3: Review & Edit Data, copying one value from another cell and pasting it into a target cell did nothing useful — the grid checked that the pasted column count *exactly equalled* the number of remaining columns from the target cell, so any single-value paste (or any partial-width paste) was rejected and re-routed to the paste area or refused outright. The check now only redirects when the paste has *more* columns than fit; same-or-fewer just lands at the target cell (the existing paste loop already handles partial widths). (GitHub Issue #252)
- **Console rendered empty arrays as an out-of-place block** — Cells containing `[]` showed a centred, padded "No items" pill that looked like a separate UI element rather than a value. Empty arrays now render as a quiet inline `[ ]` marker matching the rest of the cell's typography, with consistent wording across the main table and inline expansions. (GitHub Issue #250)
- **Console: Input tab unusable** — Opening the Input tab on any execution showed "No Data Found — Cannot read properties of null (reading 'rowBasis')". The Named Views work didn't wire the Input tab into the new view system, so the first access blew up trying to read a non-existent view. The Input tab now uses pre-canned read-only auto-views — **Mapped Columns** (only the input columns referenced by the endpoint's `{{template variables}}`) and **All Columns** (every input column) — generated on the fly from the endpoint config and the input data. The View dropdown lets you flip between them; there's no editor (these views are derived, not authored). Defaults to **Mapped Columns** when the endpoint has template variables, **All Columns** otherwise. The × hide-column button is also suppressed on read-only views. (GitHub Issue #248)
- **Delete button missing on paused batches; stale Console after tree-delete** — Two related bugs in the Console / tree-view interaction. (1) Pausing a live batch hid the **Delete** button — it only came back if you closed and re-opened the Console. The live-state path treated `paused` and `stopped` differently for Delete visibility, where the re-open path treated them the same. Both paths now show Delete for paused and stopped batches consistently. (2) Deleting a transaction or batch from the tree view left any open Console webview for that record on screen, showing data that no longer existed. The delete command now closes the matching Console webview after successful deletion (matches the behaviour you already get when deleting from inside the Console). (GitHub Issue #217)

## v0.1.4 — 2026-05-07

### Added
- **Auto-generated `DEFAULT` view on first open** — Brand-new endpoints, or the first time you open the Console for a URL+method scope that has no saved views, used to drop you onto a `Root` view containing only the response's top-level scalar fields — frequently empty for envelope-shaped Manh responses where the actual data sits under `data.items[]` or `data.lines[]`. Now you land on a `DEFAULT` view that picks the response's main array as the row basis (using a `data` / `items` / `results` / `records` / `body` / `content` / `response` / `payload` name preference, falling back to the highest-scoring array of objects in the response) and surfaces up to 20 columns from a sample row. Editing `DEFAULT` and saving promotes it to a regular user view — no further auto-regeneration. Delete it to get a fresh one. `DEFAULT` is per-tab (Completed and Errors generate independently) and never travels via endpoint export — recipients always derive their own from their first response. (GitHub Issue #242)
- **View Editor — quick-win polish** — Tree opens with the first two levels expanded for fresh views (so you see the structure on open, not just root keys). Every group row now has a tri-state checkbox that cascades to all leaves under it — `checked` when all are selected, `indeterminate` when some, `unchecked` when none. New **Sort** button in the Selected Columns header re-orders selected columns to match JSON source order. New **Remove All** button clears every selected column (arms a confirm step when more than 5 are selected). (GitHub Issue #242)
- **Magic-link sign-in** — A new **Email me a sign-in link** option in the Account sign-in screen and on dbmn.io. Enter your email, click the link in your inbox, and you're signed in — no password needed. Sits alongside the existing email/password and "Sign in via Browser" paths; clicking the link from email hands you straight back into VS Code via the existing URI handler. The extension is sign-in only — if there's no account for that email, you're pointed at **Create Account on dbmn.io**. (GitHub Issue #233)
- **Faster signup** — `register.html` is now a single-screen form. Default path is **Email me a sign-in link**: enter email, click link, 30-day trial starts. A "Use a password instead" toggle is still there for users who prefer it. The pre-signup questionnaire (role, tools, use cases) has been removed — friction reduction is the priority; those questions will resurface post-onboarding. (GitHub Issue #233)
- **Sticky column headers** — The Console main table's column header row now stays pinned at the top while you scroll the data underneath. (GitHub Issue #238)
- **Named Views — dedicated docs page** — The View Manager has graduated to its own [Named Views](/docs/named-views/) sub-page under Console. Covers the View dropdown, View Editor, Row Basis (with worked example), Set as Row, Save As, Default View, Hide a Column, and how views travel with endpoints.
- **Help icon in the View editor modal** — Opens the [Named Views](/docs/named-views/#the-view-editor) docs page. (GitHub Issue #236)
- **Help icon in the Raw tab** — Opens the Raw tab section of the Console docs. (GitHub Issue #236)

### Changed
- **Copy / Share Endpoint excludes inherited environment headers** — Previously the share output included every header row visible on the endpoint, including the inherited (greyed-out, environment-supplied) ones — which meant your auth tokens and host-specific values travelled with the share. Only endpoint-specific headers are included now; the recipient's active environment supplies inherited headers as it always does. Endpoints copied under earlier versions still paste cleanly.
- **Named Views are now shared by URL + method** — Previously, each endpoint kept its own private view library, so users with many endpoints pointing at the same URL (e.g. several flavours of `POST /lpn/search` — by id, by pallet, by item, by date) had to rebuild the same views on every endpoint. Views are now scoped by URL + method, so any endpoint targeting the same `METHOD /path` shares one view library — save a view on one, see it on all of them. Existing views are migrated automatically the first time you open the Console after upgrading; if two endpoints had different views with the same name, both are preserved with `(2)` / `(3)` suffixes. Deleting an endpoint no longer removes views shared with siblings. (GitHub Issue #237)

### Fixed
- **Inline array expansion broken on large datasets** — On responses with more than 200 top-level rows, clicking `▶ N records` was effectively unusable: the parent column wouldn't grow to fit the nested table (it overflowed into adjacent columns), and the moment the row scrolled out of view the expansion was lost — scrolling back showed it collapsed again. Both come from the virtual-scroll layer (per-cell width locks; off-screen rows torn from the DOM). Fixed: dropped the per-cell inline width-lock so cells size to their nested content; gave each expansion a deterministic id so a Set on the manager can restore open state when virtual-scroll recreates the row; lazy-render the nested table HTML only on actual expand (avoids generating thousands of hidden nested tables up front); and skip virtual windowing entirely while any expansion is open (capped at 5,000 rows) so variable expanded-row heights don't break the offset math and cause "scroll jank". Multi-expand across many rows works again. (GitHub Issue #238)
- **Console help icons did nothing when clicked** — Every (i) help icon in the Console (Execution Summary, Search, Copy, Export, Pagination) was silently broken — clicking did nothing. Now they open the right section on dbmn.io. The Copy and Export icons also no longer trigger their parent dropdown when clicked. (GitHub Issue #236)
- **View Editor wouldn't let you pick an array of primitives as a column** — A response field like `LocationIds: ["ED0407E01"]` showed up as an empty expand/collapse group with no checkbox — there was no way to surface it in the table. The tree builder treated every array as a group regardless of element type. Arrays whose elements are all primitives (or null) are now leaves with a checkbox, just like any scalar field; the cell renders `[N items]`. Arrays of objects are unchanged — they still group for the Row Basis flow. Search inside the View Editor also finds these now. (GitHub Issue #239)
- **Copy and Export emitted "[N items]" instead of the actual array values** — Once you could pick a primitive array column, the next problem surfaced: every Copy / CSV / TSV / Excel / Markdown / HTML / SQL export rendered the cell as the display summary (e.g. `[1 items]`), not the underlying values. The export pipeline pre-stringified every cell with the same formatter the on-screen grid uses, so the per-format serialisers in the export service never saw the raw array. Now the pipeline passes raw values through and each formatter handles arrays itself: arrays of primitives become comma-joined (`"ED0407E01"`, or `"ABC,EFG"` quoted by CSV), JSON exports keep them as native arrays, and arrays of objects fall back to JSON. Object cells likewise serialise to JSON instead of `[object Object]`. (GitHub Issue #239)
- **Run Batch paste from Excel produced blank rows in Step 3** — Pasting tab-separated data from Excel (or pipe-delimited data) into Run Batch's paste tab worked through Step 1 and Step 2, then showed every row as blank in Step 3 Review. Only comma-separated paste worked. The paste handler was normalising the pasted content to CSV but storing the *original* delimiter on state, so Step 3's parser tried to split comma-delimited content by tab and got nothing back. The stored delimiter now always matches the normalised content. (GitHub Issue #240)
- **"Download Template" did nothing when clicked** — The new menu item from 0.1.3 was effectively dead: the click handler was never exposed on `window`, so the inline `onclick` threw a ReferenceError silently, and a separate CSS rule (`pointer-events: none` on the disabled state) swallowed the click whenever the endpoint had unsaved changes. Both fixed: the function is now exposed, and clicking on a new or unsaved endpoint shows a clear footer notification ("Save endpoint before downloading template") instead of failing silently. (GitHub Issue #241)

### Improved
- **Condensed Console column headers and rows** — Header row was using ~36-40px of vertical real estate per column; now ~24-27px. Sort and × hide actions live to the right of the title and only appear on hover (sort direction stays visible while a column is sorted). The `▶ N records` and `Set as Row` controls inside `data` cells dropped their chunky filled-button look in favour of inline links so the row isn't dominated by them. `Set as Row` is hidden until the array is actually expanded (it used to show on every collapsed cell). Nested tables sit flush under the controls — no dark wrapper, no extra padding, no double border. The `└` ancestor-column indicator was dropped (it was wrapping onto two lines on narrow cells without adding value). (GitHub Issue #238)

## v0.1.3 — 2026-05-03

### Added
- **Named Views — full Console redesign** — The Completed/Errors tabs now run on a Named Views model. A view is a saved configuration of which columns appear and which array in the response produces one row each (`Row Basis`). Pick `root` for one row per response, or any selected array path to denormalise that array. Multiple views per tab; switch instantly via the View dropdown; the most recently saved view is the default. Views save on the endpoint, so they ride along with endpoint export/import — share an endpoint and your views go with it. The editor has Available Columns search, expand-collapse groups (auto-expanded for views you're editing), drag- and keyboard-reorderable Selected Columns, and a `Set as Row` button on every expand-cell that drills the active view in place without leaving the screen. **Save As** clones the current view to a new name — fork an existing view to experiment without losing the original. CSV / Excel / clipboard exports all match the rendered table exactly. (GitHub Issue #229)
- **Download Template** — New option in the endpoint's **More** menu that generates an Excel template from the endpoint's `{{template variables}}`. The .xlsx file includes correct column data types (number, date, boolean, string), date format awareness from format modifiers, a sample data row, and 100 pre-formatted empty rows in an Excel Table with autofilter. (GitHub Issue #230)
- **Smart Run button** — The two separate **Run API** and **Run Batch** footer buttons are now a single intelligent button. It shows "Run API" when the endpoint has no template variables (direct execution with pagination), or "Run Batch" when template variables are present (opens the batch runner). The tree view play icon and endpoint search quick access also use the same smart routing. (GitHub Issue #232)
- **Sort state persistence** — Column sort (column and direction) is now saved per endpoint per root path and restored when reopening the console (GitHub Issue #228)
- **Excel-safe copy** — New **Excel** and **CSV (Excel)** options in the Copy and Export dropdowns. These prefix text-typed columns with an apostrophe so Excel preserves leading zeros and large numbers instead of converting to scientific notation. Excel copy uses TSV for clean column-separated paste. (GitHub Issue #225)

### Fixed
- **Silent CSV column shift on Run Batch upload** — When a row in an uploaded CSV / TSV / pipe-delimited file had the wrong number of columns (e.g. an unquoted comma like `SKU,FIX-004`, or a European-decimal value like `99,99`), the surplus field was silently dropped or the columns shifted into the wrong template variables — corrupting the batch with no warning. Run Batch now blocks Step 1 → Step 2 whenever any row's column count differs from the header, and replaces the upload tabs with a **repair panel**: a scrollable line-numbered list of every row with the offending ones flagged by a left-bar accent and an `N cols` pill on the right. The header line is pinned at the top. Click any data row to edit it inline; the pill updates live as you type. A `Show flagged only` toggle lets you focus on the bad rows when there are many. Cancel goes back to the upload tabs; Continue is disabled until every row aligns. For bulk-pattern issues, fix the source file and re-upload. Pipe-delimited files are now recognised alongside comma and tab. (GitHub Issue #226)
- **Console settings not saving** — Fixed bug where column visibility, root path, and sort state were never persisted for endpoints without prior settings. Also fixed race condition where saved view was overwritten on report open. (GitHub Issue #228)
- **Column hide (X) not saving** — Clicking X on column or group headers now persists the change to backend settings
- **Expanded nodes ignoring column visibility** — Expanding an inline array now honors the root column visibility settings instead of showing all columns

### Improved
- **Console search patterns** — Search now supports comma-separated OR (`abc,def`), AND (`active+pending`), wildcards (`abc*`, `a?c`), negation (`-error`), and exact match (`"phrase"`). Plain text search works as before. (GitHub Issue #227)
- **RAW tab response headers** — Headers view now displays as a styled two-column table (Header / Value) instead of plain text in the Monaco editor, making keys and values easy to scan at a glance
- **Console HTML export** — Body cells no longer carry inline styles (border, padding, background). Header row keeps its styling. Prevents VS Code theme colours from bleeding into Excel paste. (GitHub Issue #225)

## v0.1.2 — 2026-03-28

### Added
- **FlexionTech → DBMN migration** — Existing FlexionTech Active8 users can migrate their endpoints, environments, and folders to Dobermann via a one-click button on the Account page. Auto-detects when the FlexionTech extension is installed and surfaces a footer notification linking to the migration flow.
- **Auto-trial on sign-up** — New users now receive a 30-day trial automatically when they create their DBMN account — no manual activation step required.

### Fixed
- **License gating ignored environment licenses** — Batch execution, pagination, Fetch All, and concurrency limits now recognise environment-level licenses. Previously, an environment license alone wouldn't unlock these features without a separate user license.
- **Silent failure on batch execute** — License errors during a batch run now show a VS Code warning with a "View Plans" CTA. Previously, the Run Batch panel closed silently.
- **Email templates broken in Outlook dark mode** — Auth and transactional emails redesigned for Outlook dark mode compatibility.

## v0.1.1 — 2026-03-23

### Fixed
- **Activity bar title** — Changed from "DBMN" to "Dobermann" so the sidebar icon tooltip matches the extension name

## v0.1.0 — 2026-03-14

Initial release under DBMN publisher.

### Added
- **Sign In (New Token)** *(experimental)* — New OAuth button that forces fresh credentials by bypassing your browser's existing session with the identity provider. Use it when your roles or permissions have changed on the server and your current token has stale claims. Always visible alongside Sign In for OAuth environments. (GitHub Issue #212)
- **`{{A8:DBMN_TOKEN}}` system variable** — Auto-resolves to the signed-in user's DBMN access token in environment headers. Set `Authorization: Bearer {{A8:DBMN_TOKEN}}` once and the extension handles token injection and refresh. Gives you access to Puppy School.
- **DBMN Puppy School** — Live REST API sandbox for DBMN puppy training. GS1/EDI-aligned supply chain data (shipments, purchase orders, inventory). Supports 3-level nested uploads, paginated queries, and bulk inserts. Includes ~70k rows of realistic seed data. 50k row limit per user with 48h auto-purge. Requires active license or trial. (GitHub Issue #210)
- **Puppy School Reference Tables** — Carriers, locations, products, and trading partners as FK-validated lookup tables. GET responses include nested reference objects (e.g., carrier breed and motto embedded in shipments). New `/reference/<type>` endpoints for browsing valid values. All seed data replaced with dog-themed content (Dobermann branding). (GitHub Issue #210)
- **DBMN Registration & Licensing** — New user registration system with hard gate (sign-in required before any functionality). Supabase backend with PostgreSQL, Edge Functions, and Row Level Security. License tiers: 30-day trial, user ($15/mo), environment ($250/mo), and free tier with feature-gated limits. Privacy-safe telemetry tracking aggregate usage counters only. (GitHub Issue #208)
- **Redesigned free tier limits** — Individual API calls are now unlimited (replaces Postman). Power features are gated: 5 batch executions/week, pagination limited to 3 pages (Fetch All requires license), concurrency locked to 1 thread. Licensed users get unlimited batch/pagination/concurrency.
- **Excel import** — Import data from Excel tables regardless of where the table starts in the sheet (no longer requires A1). Filtered spreadsheets let you choose to import all rows or visible rows only.
- **Inline grid validation with load progress** — Validation errors highlight immediately as rows render during large file loads; the Next button shows loading progress and the Filter Errors button is always visible on Step 3
- **Always-visible row count** — Console data tabs now show the total row count at all times, not just when a search is active
- **Filter-aware copy/export** — Copy and Export now operate on filtered rows when a search is active, not all rows
- **Pagination UX overhaul** — Configure pagination directly from Console with auto-detected settings; "Fetch All" and "Get Next X Pages" with concurrent execution and execute-as-you-create pattern
- **Block reprocess for paginated batches** — Reprocess is disabled for paginated batches since re-fetching pages is the correct approach

### Fixed
- RAW tab now uses ~95% less memory for large batches (lazy card body rendering)
- **Batch file processing UX** — Improved performance and UX of file processing for batch uploads. Single footer progress bar across all steps, accurate time estimates for large files, and renamed button to "Import Data". (GitHub Issue #223)
- **Console RAW tab batch flashing** — Eliminated full-container DOM rebuild that caused the RAW tab to flash on every new batch result. Content updates now rebuild only the affected card body in-place. (GitHub Issue #222)
- **Telemetry data pipeline** — Fixed end-to-end telemetry: flush now uses additive upsert RPC (was failing silently due to missing user_id), stats formula corrected (batch_runs not batch_records), and Account dashboard detects post-sign-in auth transition to load stats immediately
- **Endpoint body editor line highlight** — Toned down the selected-line background in the Monaco editor so it no longer obscures text. For Jakes eyes only. (GitHub Issue #213)
- **Console batch controls** — Fixed changing threads, error mode, and batch name during execution; removed Stop button (use Pause instead) and reduced notification noise
- **Per-transaction URL in RAW tab** — Batch execution cards now show each transaction's resolved URL, headers, and query params instead of repeating the first member's details
- **Grid paste mismatch stays on Step 3** — Pasting mismatched columns or unparseable dates into a grid that already has data now shows a warning notification instead of redirecting to Step 1
- **Console RAW tab improvements** — Fixed save settings error, View Logs for individual executions, error handling without redundant popups, and direct log file paths

### Changed
- **Console** — Renamed "Report" webview to "Console"
- **Redesigned Environment webview** — Three-tab layout (General, Authentication, Headers & Variables) with shared Token Details section
- **Redesigned Run Batch workflow** — 5-step flow (Load Data → Map & Transform → Review & Edit Data → Review JSON → Execute) with new tab design, dedicated data grid step, and Enter Data button for direct entry

### Migrating from Active8
1. In Active8: use Import/Export to export your environments and endpoints
2. Install Dobermann from the Marketplace
3. In Dobermann: import the exported file
4. Uninstall Active8

## v0.0.50 — 2026-02-15

### Added
- **Template variable modifiers** — Validate and transform data with pipe syntax: `{{Name:string|3-50|upper}}`, `{{Qty:number|int|>0}}`, `{{Code:string|opt}}` for omitting empty keys, `{{Val:number|null}}` for null values
- **Modifier toolbar** — Visual toolbar for adding modifiers to template variables without memorizing syntax
- **`|asString` modifier** — Force any value to be treated as a string in JSON output
- **HTML response viewer** — Three view modes (Raw/Render/Text) for HTML responses in the RAW tab
- **Paste header confirmation modal** — Review and confirm pasted headers before they're applied
- **Rich copy from Console** — Copy transaction data as TSV, HTML, Markdown, or CSV
- **RAW tab improvements** — Enhanced JSON viewing with Monaco Editor integration
- **CSV auto-sort** — Detects unsorted CSV data for nested arrays and offers one-click sort with backup
- **Run Batch tabbed interface** — Three tabs: Enter Data, Upload File, Paste Text with tab data indicators
- **Tab delimiter support** — Auto-detects tab-delimited data from Excel paste and converts to CSV
- **Smart paste detection** — Mismatched column paste redirects to Paste Text tab with notification
- **Full-window drop zone** — Files can be dropped anywhere in Run Batch webview

### Changed
- Request and Logs tabs hidden in Console (RAW tab now provides this functionality)

### Fixed
- Import compatibility for older `.dbmn.zip` export formats
- Nested array template processing — root-level CSV variables correctly group into separate transactions
- File upload column mapping for CSV, TXT, and Excel files
- Marketplace presentation and metadata
- Error transaction Console tabs display correctly on re-open
- Copy Batch regenerates transactions for the target environment

## v0.0.49 — 2026-01-31

### Added
- **New template editor** — Monaco-based editor with syntax highlighting, autocomplete, and real-time error detection for template variables
- **ENV variables** — Reference environment-specific values with `{{ENV:varName}}` syntax
- **Sequence modifiers** — `:local`, `:global`, `:parent` modifiers for `A8:sequence` in nested arrays
- **Batch reprocessing** — Reprocess only failed transactions from a previous batch run
- **Smart paste** — Intelligent paste handling for grid data entry
- **Date math modifiers** — `+2d`, `-1d`, `+4h`, `+30m` for date/datetime variables
- **Settings tab** — File links for requests, responses, CSV, and folders in Console

### Changed
- Rebranded from "Active8" to "Dobermann" across all UI

### Fixed
- Query param repetition creating duplicate transactions instead of unique batches
- Slow batch generation for query param repetition with large CSVs
- Progressive Tab copy for deeply nested templates up to 4 levels
- Paste into number fields creating unusable text in Enter Data grid
- Blank rows with unchecked booleans not auto-deleted
- Nested batch execution stopping after first chunk
- Console export not using selected root element and visible columns
- Status-based classification for Console tabs

## v0.0.48 — 2026-01-14

### Fixed
- Nested array batch execution transaction counts
- Run API not processing A8 system variables correctly
- Unified JSON generation refactor for consistency

## v0.0.47 — 2026-01-13

### Fixed
- Nested array grouping correction for complex templates

## v0.0.46 — 2026-01-12

### Added
- **A8 datetime format specifiers** — Custom format strings for `A8:datetime` and `A8:date` variables
- **Date/DateTime format modifiers** — Control output format of date columns: `{{COL:date:iso}}`, `{{COL:datetime:YYYY-MM-DD}}`
- **Keyboard shortcuts for grid** — Tab, Shift+Tab, Enter, Ctrl+D, Escape, and arrow key navigation
- **Progressive Tab copy** — Tab creates a new row and copies parent values for faster bulk entry
- **Blank field validation** — Warns about empty fields when clicking Next in grid entry

### Changed
- Bug fix for data loss with large integers in batch mode data entry

### Fixed
- Date variable UTC timezone handling
- JSON escaping for special characters in substituted values

## v0.0.45 — 2026-01-12

### Added
- **Quick find menu** — Fast endpoint search via ALT-D E
- **JSONL support** — View JSONL responses in Console
- **BASE64 encoding** — Encode template sections using `:BASE64` suffix for PubSub/message queue APIs
- **Shorthand `{{}}` syntax** — Empty braces use the JSON key as the parameter name
- **Grid data entry** — Type-aware inputs: checkboxes for booleans, numeric validation for numbers
- **Enhanced mapping table** — Source Type dropdown with validation warnings for precision loss

### Changed
- Batch folder link opens in native file explorer when no workspace is open

### Fixed
- Virtual scrolling in Console for large datasets
- Template variables embedded in strings now substitute correctly (e.g. `"ACAU-{{SKU}}"`)
- URL path variables work in batch execution (e.g. `/api/location/{{pk}}`)
- Multiple occurrences of same variable all substitute correctly

## v0.0.44 — 2025-11-20

### Added
- **Copy CSV** — Quick clipboard export from Export menu
- **Max CSV rows parameter** — Configurable limit beyond default 100k
- **Nested template data** — Load nested data from a single CSV file

### Fixed
- Response file link appears immediately after API execution
- Contextual help icons in Console
- JWT validation accepts L1 organizations for MAWM
- Queued batches no longer timeout after 10 minutes
- Leading zeros preserved when switching data type from number to string

## v0.0.43 — 2025-11-10

### Fixed
- Import/Export reliability improvements
- Documentation fixes

## v0.0.42 — 2025-11-05

### Added
- **Import/Export** — Share endpoints and environments via `.active8.zip` files with conflict detection and resolution
- **Contextual help icons** — In-webview documentation with inline modals

### Fixed
- Drag-and-drop file upload enables Next button in Run Batch
- Import deduplication by folder+name matching

## v0.0.41 — 2025-10-30

### Added
- **Pagination support** — Experimental pagination in Console and endpoint
- **Inline Run Batch button** — Rocket icon in tree view

### Changed
- Delete endpoint moved from tree view to endpoint webview with transaction count warning
- Run Batch button removed from endpoint webview

### Fixed
- Format JSON body line breaks

## v0.0.40 — 2025-10-17

### Fixed
- Service isolation and batch status validation
- Query param repetition for batch operations
- Save and restore disabled query parameters
