---
title: Console
layout: default
nav_order: 5
parent: Documentation
has_children: true
---

# Console

When you hit **Run**, Dobermann opens the Console — your real-time window into what's happening. Single requests complete in a flash. Batches stream results as they run, with live progress, pause/resume controls, and full transaction detail.

## Starting an Execution

Dobermann uses a **smart Run button** that automatically detects the right execution mode:

- **No template variables** → Runs a single API request (shows as "Run API")
- **Has template variables** → Opens the batch runner (shows as "Run Batch")

This works the same everywhere: the endpoint footer button, the sidebar play icon, and Quick Access search.

### Single Request (Run API)

Execute a single API request to test configuration, verify responses, or perform one-off operations. The button shows "Run API" when the endpoint has no `{{template variables}}`.

**From endpoint webview:**
1. Configure endpoint (method, URL, headers, body) — no template variables
2. Click **Run API**
3. Console opens with results

**From sidebar:**
1. Click the play icon on the endpoint

**From Quick Access (Alt+D E):**
1. Press **Alt+D E** to open fuzzy search
2. Select endpoint → choose **Run**

### Batch Execution (Run Batch)

Execute the same endpoint multiple times with different data — entered in the grid or loaded from a file. The button shows "Run Batch" when the endpoint has `{{template variables}}`.

**From endpoint webview:**
1. Click **Run Batch** to open the batch preparation flow
2. Walk through the 5-step process: Load Data → Map & Transform → Review & Edit Data → Review JSON → Execute
3. Click **Execute** in Step 5 — the Console opens and the batch begins

**From sidebar:**
1. Click the play icon on the endpoint — Dobermann detects template variables and opens the batch runner

See [Batch Preparation](/docs/batch-preparation/) for the full 5-step workflow.

### Execution Queue
{: #execution-queue }

Running multiple batches? Dobermann queues them automatically.

**How it works:**
- Start a batch on one endpoint, then start another — the second batch enters the queue
- A notification tells you: "Batch has been queued and will start when the current batch completes"
- Queue position and wait time are displayed while waiting
- Queued batches start automatically in order when the previous batch finishes

**Use cases:**
- Prepare several batches across different endpoints, then kick them all off
- Queue overnight data loads without babysitting each one
- Process different data sets against the same endpoint back-to-back

---

## Console Layout

The Console is where everything happens — monitoring progress during a batch, inspecting results after completion, and exporting data for further analysis.

### Execution Summary
{: #execution-summary }

The top section displays high-level execution metrics in compact stat cards:

**Status Badge:**
- **Success** — All requests succeeded (2xx responses)
- **Partial** — Some requests failed
- **Failed** — All requests failed
- **Paused** — Batch paused by user
- **Running** — Batch currently executing
- **Queued** — Waiting for another batch to complete

**Summary Statistics:**
- **URL** — Full resolved API endpoint with query parameters
- **HTTP Status** — Response status code (single executions only)
- **Time** — Execution start timestamp
- **Duration** — Total execution time in `HH:MM:SS` format
- **ID** — Unique execution identifier for tracking
- **Calls** (batch only) — Completed vs planned transaction count (e.g., `77/77`)
- **Threads** (batch only) — Parallel processing level (e.g., `1` = sequential, `16` = 16 concurrent)

### Batch Controls

During a batch execution:

**Pause** — Halts execution after the current request completes. All progress is saved. Click **Resume** to continue from the exact position. Useful for rate limit cooling or reviewing errors mid-run.

**Rename** — Edit the batch name during execution for easier identification in history.

### Real-Time Progress (Batch)

While a batch runs, you see live updates:
- **Progress bar** — Visual completion percentage
- **Row counter** — "Processing 45 of 100..."
- **Success rate** — Green counter with checkmark
- **Failure count** — Red counter (if any)
- **Elapsed time** — Running timer
- **Requests per second** — Throughput metric
- **Estimated time remaining**

Results stream into the tabs below as each request completes — no need to wait for the batch to finish.

---

## Tabs

The Console organises data across five tabs:

### Input Tab
{: #input-tab }

Shows the source data used to generate API requests.

**What's displayed:**
- All rows from your data grid or uploaded file
- Column headers and values as loaded
- Record count indicator

**Key behaviour:**
- Available for batch executions with loaded data
- Exportable as CSV during or after execution
- Views control doesn't apply to the Input tab (source data is always one row per record)

### Raw Tab
{: #raw-tab }

The Raw tab gives you complete visibility into every request and response — the full HTTP conversation for each transaction.

**Features:**
- **Transaction navigation** — Browse through all transactions
- **Full request/response JSON** — Syntax-highlighted in a Monaco editor
- **View Logs** — Per-transaction log entries for debugging
- **View modes** — Toggle between Raw, Rendered, and Text views (useful for HTML responses)
- Response count indicator

**Use cases:**
- Debug a specific failed request by inspecting the exact payload sent
- Verify variable substitution worked correctly
- Check response headers and status codes
- View API error messages in full detail

### Completed Tab
{: #completed-tab }

Shows all successful transactions (2xx responses) in a data table.

**Features:**
- Tabular view of all completed requests
- Full response data for each transaction
- Response times and status codes
- Count indicator

**Use case:** Analyse successful patterns, extract data from responses, verify expected output.

### Error Tab
{: #error-tab }

Shows all failed transactions — 4xx client errors, 5xx server errors, network errors, and timeouts.

**Features:**
- Error messages from the API
- Request context that caused the error
- Status codes and response times
- Automatically hidden if there are zero errors

**Use case:** Debug failures, identify data quality issues, spot rate limiting or API problems.

### Settings Tab
{: #settings-tab }

Execution metadata and configuration details.

**What's shown:**
- Execution ID and timestamps
- Endpoint and environment details
- Execution lineage (parent/child relationships)
- Links to request/response files saved in workspace

---

## Data Table Features

The Completed and Error tabs use a powerful data table for analysing results:

### Named Views
{: #named-views }

The Completed and Errors tabs run on **Named Views** — saved configurations that control which columns appear and which array in the response produces one row each. Multiple views per tab; switch instantly; views save on the endpoint so they travel with it on export/share.

> **[→ Read the Named Views guide](/docs/named-views/)** for the View dropdown, View Editor, Row Basis, Set as Row, Save As, and how views travel with endpoints.

### Search
{: #search }

Search across all visible columns simultaneously. Plain text search works as before (case-insensitive substring matching). Advanced patterns let you combine terms, use wildcards, exclude rows, and match exact phrases.

| Syntax | Meaning | Example | Matches |
|---|---|---|---|
| `,` | OR between terms | `abc123,abc124` | rows containing either term |
| `+` | AND between terms | `active+Dallas` | rows containing both terms |
| `*` | Zero or more characters | `abc*` | "abcdef", "abc123" |
| `?` | Exactly one character | `a?c` | "abc", "a1c" |
| `-` prefix | Exclude rows | `-error` | rows NOT containing "error" |
| `"quoted"` | Exact cell value | `"New York"` | only literal "New York" |
| plain text | Substring (default) | `hello` | "Hello World" |

Patterns are combinable: `active+pending,-error`, `"exact",-exclude,wild*`

- Always shows the row count — total rows when no search is active, filtered/total when searching
- Case-insensitive matching across all patterns
- **Copy and Export respect the active search filter** — only the filtered rows are included

**Tips:**
- Search for specific error messages or exclude them: `-error`
- Find rows with particular values using wildcards: `SHIP*`
- Filter by status codes: `200` or exclude failures: `-4??`
- Combine terms with commas: `abc123,abc124`
- Require multiple terms with +: `active+Chicago`
- Match exact cell values with quotes: `"New York"`

### Sorting

Click any column header to sort. Sort is saved on the active view, so it persists across tab switches and console reloads.

- **First click:** Sort ascending
- **Second click:** Sort descending
- **Third click:** Remove sort

Sub-tables (rendered when expanding an `▸ N records` cell) sort independently — their sort state is local to the open expand-cell.

## Pagination
{: #pagination }

Dobermann has full support for paginated APIs — configure page and size parameters, auto-detect settings from API responses, and fetch hundreds of pages with concurrent execution.

See the dedicated [Pagination](/docs/pagination/) guide for the complete workflow.

---

## Copy & Export
{: #copy-options }

Copy data to the clipboard or export to a file. All options respect the current tab, search filter, sort order, and visible columns.

### Copy

The **Copy** dropdown copies data straight to your clipboard — no file needed.

| Format | Best for | What you get |
|--------|----------|--------------|
| **Standard** | Outlook, Gmail, Word, Teams, Confluence | Styled HTML table with formatting |
| **Excel** | Excel, Google Sheets | Tab-separated values with text-type preservation — pastes directly into cells with leading zeros and large numbers intact |
| **CSV** | Scripts, data pipelines | Comma-separated plain text |
| **CSV (Excel)** | CSV consumers that need type preservation | CSV with text fields prefixed to prevent number coercion |
| **Markdown** | GitHub, Jira, Notion | GitHub Flavoured Markdown table |

**Example workflow:**
1. Switch to Error tab
2. Search for a specific error pattern
3. Sort by timestamp
4. Click Copy → **Standard**
5. Paste into Outlook — formatted table appears inline

**Preserving leading zeros in Excel:**

When pasting into Excel, numeric-looking text fields (e.g. GLN codes like `0012345000015`) are automatically converted to numbers, losing leading zeros. Use the **Excel** or **CSV (Excel)** copy options to prevent this — they prefix text columns with an apostrophe (`'`) that tells Excel to treat the value as text. For guaranteed type preservation without any prefix characters, use **Export → Excel (.xlsx)** instead.

### Export

The **Export** dropdown saves data to a file.

| Format | Details |
|--------|---------|
| **CSV** | Plain text, streams line-by-line — handles any size |
| **CSV (Excel)** | CSV with text fields prefixed to prevent Excel number coercion |
| **Excel (.xlsx)** | Formatted workbook with colour-coded status codes and typed columns — guaranteed type preservation |

### Limits

Large copy/export operations can overwhelm target applications or the extension host. Dobermann enforces sensible limits:

| Action | Format | Limit | Reason |
|--------|--------|-------|--------|
| Copy | Standard / Excel | 1,000 rows | Paste crashes Excel/Outlook with large tables |
| Copy | Markdown | 1,000 rows | Paste crashes target apps |
| Copy | CSV / CSV (Excel) | 10,000 rows | Lighter format, higher tolerance |
| Export | Excel (.xlsx) | 2,000,000 cells | XLSX library OOM in extension host |
| Export | CSV / CSV (Excel) | Unlimited | Streams line-by-line |

If you hit a limit, switch to CSV export (file) — it streams without memory constraints.

---

## Execution History

All executions (single and batch) are saved in the sidebar.

### Viewing History

Expand **Executions** in the sidebar to see past runs grouped by endpoint:

**Icons:**
- Checkmark — All successful
- Warning — Partial (some failures)
- X — All failed
- Pause — Paused/incomplete

Click any execution to reopen the Console with full results.

**Context menu options:**
- **View** — Open results
- **Export Results** — Save to file
- **Re-run** — Execute again with same data
- **Delete** — Remove from history

### Workspace Files

Results are automatically saved to your [Dobermann workspace](/docs/your-data/#dobermann-workspace):

```
.active8/
└── results/
    └── {endpoint}/
        └── {timestamp}.json
```

- Files open automatically in the editor after execution
- Compare executions using diff tools
- Excluded from git by default (`.active8/` in `.gitignore`)

---

## Error Handling

### Error Tolerance

Configure how errors affect batch execution (set during batch preparation):

| Setting | Behaviour |
|---------|-----------|
| **Stop on First Error** | Batch stops immediately on any failure |
| **Maximum Error Count** | Stops after N failures (e.g., 5) |
| **Percentage-Based** | Stops if error rate exceeds threshold (e.g., 10%) |
| **Continue on All Errors** | Runs to completion regardless of failures |

**Choosing a setting:**
- **Stop on First Error** — Critical data loads where any failure is unacceptable
- **Max Error Count** — Bulk updates where a few failures are OK
- **Percentage-Based** — Large batches (10,000+ rows) where some failures are expected
- **Continue on All** — Exploratory runs or data quality testing

### Network Resilience

- Default timeout: 30 seconds (configurable per endpoint)
- Automatic retry (1 attempt) with exponential backoff for rate limits
- Clear error messages for timeouts, connection issues, and SSL errors

---

## Performance

### Parallel Processing

Concurrency is configured per environment (see [Environments — Parallel Processing](/docs/environments/#parallel-processing)). Higher concurrency = faster batches, but more server load.

### Large Batches

For batches over 1,000 rows:
- Results stream to disk incrementally (no memory buildup)
- Progress auto-saved periodically
- Split very large files into multiple batches if needed
- Run during off-peak hours to avoid rate limiting

---

## Troubleshooting

### Execution Won't Start

**Check:**
- Endpoint is saved (no unsaved changes)
- Environment has valid authentication
- Required variables are configured
- No validation errors in endpoint

### Batch Stops Unexpectedly

**Check:**
- Error tolerance setting (may be "Stop on First Error")
- Recent error messages in Error tab
- API rate limits hit (look for 429 status codes)
- Network interruption

### Execution Hangs

**Possible causes:**
- API server not responding
- Network connectivity issue
- Firewall blocking request

**Solutions:**
- Check API server status
- Test with curl/Postman
- Verify network connectivity
- Check the Raw tab for the last request sent

### Wrong Data in Requests

**Check:**
- Column mapping is correct (Batch Preparation)
- Source data has correct values
- Variable names match exactly
- No extra spaces in column headers

### Results Not Saving

**Check:**
- Write permissions in `.active8/` directory
- Disk space available
- File not locked by another process
- Check VS Code output panel for errors

---

## Related Topics

- [Named Views](/docs/named-views/) — Save column layouts and row-per-X shapes; switch and export instantly
- [Pagination](/docs/pagination/) — Configure and run paginated API requests
- [Batch Reprocessing](/docs/batch-reprocessing/) — Re-run failed transactions without re-executing the whole batch
- [Endpoints](/docs/endpoints/) — Configuring API requests
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Environments](/docs/environments/) — Authentication, timezone, and parallel processing
- [Troubleshooting](/docs/troubleshooting/) — Common issues and solutions
