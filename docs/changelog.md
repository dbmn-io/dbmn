---
title: Changelog
layout: default
nav_order: 99
parent: Documentation
---

# Changelog

All notable changes to Dobermann are documented here.

## v0.0.51 — Unreleased

### Changed
- **Console** — Renamed "Report" webview to "Console"
- **Redesigned Environment webview** — Three-tab layout (General, Authentication, Headers & Variables) with shared Token Details section

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
