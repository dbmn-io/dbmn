---
title: Changelog
layout: default
nav_order: 99
parent: Documentation
---

# Changelog

All notable changes to Dobermann are documented here.

## Unreleased

### Fixed
- **Console help icons did nothing when clicked** — Every (i) help icon in the Console (Execution Summary, Search, Copy, Export, Pagination) was silently broken — clicking did nothing. Now they open the right section on dbmn.io. The Copy and Export icons also no longer trigger their parent dropdown when clicked. (GitHub Issue #236)

### Added
- **Named Views — dedicated docs page** — The View Manager has graduated to its own [Named Views](/docs/named-views/) sub-page under Console. Covers the View dropdown, View Editor, Row Basis (with worked example), Set as Row, Save As, Default View, Hide a Column, and how views travel with endpoints.
- **Help icon in the View editor modal** — Opens the [Named Views](/docs/named-views/#the-view-editor) docs page. (GitHub Issue #236)
- **Help icon in the Raw tab** — Opens the Raw tab section of the Console docs. (GitHub Issue #236)

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
