---
title: Console
layout: default
nav_order: 5
parent: Documentation
has_children: true
---

# Console

When you hit **Run**, Dobermann opens the Console — your real-time window into what's happening. Single requests complete in a flash. Batches stream results as they run, with live progress, pause/resume controls, and full transaction detail. The Console opens as a tab in the [Hub](/docs/hub/), and every run stays under {icon:nav-history} **History** so you can reopen it later.

## Starting an Execution

Two things put results in the Console, and both open it for you:

- **Run API** {icon:run-api} — one request. If the endpoint has `{{template variables}}` it asks for their values first, and you can paste a spreadsheet row to fill them. See [Run API](/docs/run-api/).
- **Run Batch** {icon:run-batch} — the same endpoint driven from a file, through the 5-step flow: Load Data → Map & Transform → Review & Edit Data → Review & Configure → Execute Batch. It appears once the endpoint has template variables. See [Batch Preparation](/docs/batch-preparation/).

Both live in the endpoint editor's footer and on each endpoint's row in the API Catalogue.

### Execution Queue
{: #execution-queue }

Running multiple batches? Dobermann queues them automatically.

**How it works:**
- Start a batch on one endpoint, then start another — the second batch enters the queue
- A notification tells you: *Batch "…" has been queued and will start when the current batch completes*
- The Console footer reads **Queued** while it waits, with **Starts in ~4m** once the running batch has an estimate, or **After** its name; the header's activity chip counts it (`1 running · 1 queued`)
- Queued batches start automatically in order when the previous batch finishes
- **Cancel** in a queued batch's footer takes it out of the queue; it never starts
- A single request — a paginated **Run API** before any further pages are fetched — runs straight away beside a batch; only batches queue behind batches

**Use cases:**
- Prepare several batches across different endpoints, then kick them all off
- Queue overnight data loads without babysitting each one
- Process different data sets against the same endpoint back-to-back

---

## Console Layout

The Console is where everything happens — monitoring progress during a batch, inspecting results after completion, and exporting data for further analysis.

A large batch opens on its first transactions within a second; the rest stream in behind them while the progress bar reads **Loading transactions**, and results that land meanwhile are merged in.

### Status
{: #execution-summary }

The pill beside the title says where the run is:

| Pill | Meaning |
|---|---|
| **RUNNING** | Requests are in flight |
| **COMPLETED** | Every request succeeded (2xx) |
| **COMPLETED WITH ERRORS** / **PARTIAL** | Finished, some requests failed |
| **ERROR** | The run failed |
| **PAUSED** / **STOPPED** / **CANCELLED** | Stopped by you, or by the error handling |
| **PREPARING** / **PENDING** | Not started yet, or waiting in the queue |

The run's details — environment, organisation, endpoint, full request URL, ID, HTTP status, start time and duration, and for a batch its name, error handling and processing mode — are on the [Settings tab](#settings-tab).

### Batch Controls
{: #batch-controls }

During a batch execution, the footer offers:

**Pause** — Halts execution after the current request completes. All progress is saved. Click **Resume** to continue from the exact position. Useful for rate limit cooling or reviewing errors mid-run.

**Cancel** — Stops the batch. A cancelled batch can still be **Resume**d, or its failures reprocessed later.

**Name** — On the Settings tab, rename the batch at any time so it is easy to find in History.

### Real-Time Progress (Batch)

While a batch runs, the Console footer shows live progress — the phase (Preparing, Queued, Executing, Paused, Completed, Stopped, Failed), completion, success and failure counts, and elapsed time. Results stream into the tabs below as each request completes, so you can start inspecting transactions before the batch finishes.

---

## Tabs

The Console organises data across these tabs. **Links** appears only on a run that has been
[chained](/docs/chain/):

### Links Tab
{: #links-tab }

The runs this one's rows came from (**Came From**) and went to (**Sent To**), with where they
differ. See [The Links tab](/docs/chain/#links-tab).

### Input Tab
{: #input-tab }

Shows the source data used to generate API requests.

**What's displayed:**
- All rows from your data grid or uploaded file
- Column headers and values as loaded
- A **Result** column: the status of the transaction that sent each row
- Record count indicator

**Key behaviour:**
- Available for batch executions with loaded data
- Copy and Export (CSV or Excel) during or after execution; both follow the search box and the Result filter
- Views don't apply to the Input tab (source data is always one row per record)

#### Filter rows by result
{: #input-status }

The **Result** dropdown shows only the rows whose transaction is **Completed**, **Error** or **Running**, or rows **Not processed** yet (waiting, or not sent). Each option shows its row count.

- Copy and Export follow the filter. Choose **Error** and export to Excel to get the list of rows to fix and send again.
- Right-click a row → **View transaction** to see the request and response it belongs to.
- When a failed request was split into smaller ones, a row takes the result of the smaller request it ended up in.
- If your file has its own `result` column, DBMN's is called **DBMN Result**.

### Raw Tab
{: #raw-tab }

The Raw tab gives you complete visibility into every request and response — the full HTTP conversation for each transaction.

**Features:**
- **Transactions** — One card each: status, HTTP code and time, then its input rows, request and response. Expand All / Collapse All in the bar. A long list shows a window of cards with **Scroll for more** at the end
- **Status** — Show only Pending, Running, Completed, Error or Split transactions, with counts. While the batch runs, the tab opens on **Running**; it goes back to All when the batch finishes unless you picked a status yourself
- **Show Input / Request / Response** — Choose what each transaction shows. Input is greyed out when there are no input rows
- **Full request/response JSON** — Syntax-highlighted, with the parent keys pinned at the top as you scroll
- **Request Body / Details** — Details shows the endpoint, query parameters and headers. A request with no body (blank or `{}`) shows Details only, and Request starts switched off
- **Response Body / Headers** — Headers appears when the response carried any
- **Reprocess** — Run a failed transaction again, in a batch or on its own (see [Batch Reprocessing](/docs/batch-reprocessing/))
- **Logs** — Per-transaction log entries for debugging, in a window you can copy from
- **Copy All** — The whole transaction to the clipboard
- **Raw / Render / Text** — For an HTML response, see it as source, as a page, or as plain text
- Response count indicator

When a run has **one transaction**, the Raw tab shows it directly — no list to expand. Its search highlights matches in the request and response.

**Use cases:**
- Debug a specific failed request by inspecting the exact payload sent
- Verify variable substitution worked correctly
- Check response headers and status codes
- View API error messages in full detail

### View a transaction from any row
{: #view-transaction }

Right-click a row on the **Input**, **Completed** or **Error** tab and choose **View transaction**. The transaction opens in a window with the same view as the Raw tab: its input rows, request and response side by side, with search and full-window editors. Esc leaves a full-window editor first, then closes the window.

On an Error row the menu also offers **Reprocess**, which runs that transaction again.

### Completed Tab
{: #completed-tab }

Shows all successful transactions (2xx responses) in a data table.

**Features:**
- Tabular view of all completed requests
- Full response data for each transaction
- Response times and status codes
- Right-click a row to [view its transaction](#view-transaction)
- Count indicator

**Use case:** Analyse successful patterns, extract data from responses, verify expected output.

**Chain** in the toolbar sends the rows this tab shows into another endpoint's **Run Batch**. See [Chain](/docs/chain/).

### Error Tab
{: #error-tab }

Shows all failed transactions — 4xx client errors, 5xx server errors, network errors, and timeouts.

**Features:**
- Error messages from the API
- Request context that caused the error
- Status codes and response times
- Right-click a row to [view its transaction](#view-transaction) or **Reprocess** it
- Automatically hidden if there are zero errors

**Use case:** Debug failures, identify data quality issues, spot rate limiting or API problems.

### Settings Tab
{: #settings-tab }

Everything about the run that isn't a result:

| Section | What's there |
|---|---|
| **Sending To** | Environment, Organization, Endpoint, Request URL |
| **Configure** (batch) | **Name** — editable, so you can rename a batch — **Error Handling** and **Processing Mode**. A change to threads applies to the next transactions prepared, within the environment's maximum |
| **Execution** | ID, HTTP Status (single requests), Started, Duration |
| **Lineage** | For a copied batch: Copied From, Original Environment, Copied At |
| **Variables** | The values the run used |
| **Files** | **Request**, **Response** and **Folder** links to the files saved in your [workspace](/docs/your-data/) |

---

## Data Table Features

The Completed and Error tabs use a powerful data table for analysing results:

### Named Views
{: #named-views }

The Completed and Error tabs run on **Named Views** — saved configurations that control which columns appear and which array in the response produces one row each. Multiple views per tab; switch instantly; views save on the endpoint so they travel with it on export/share.

> **[→ Read the Named Views guide](/docs/named-views/)** for the view button, the View Editor, row basis, Set as Row, Save As, and how views travel with endpoints.

### Search
{: #search }

Search across all visible columns simultaneously. Plain text search works as before (case-insensitive substring matching). Advanced patterns let you combine terms, use wildcards, exclude rows, and match exact phrases.

Operators light up in colour as you type — if a `+` or `-` doesn't change colour, it's being treated as part of a term, not as an operator.

| Syntax | Meaning | Example | Matches |
|---|---|---|---|
| `,` | OR between terms | `abc123,abc124` | rows containing either term |
| space `+term` | AND between terms | `active +Dallas` | rows containing both terms |
| space `-term` | Exclude rows | `active -Dallas` | rows containing "active" but NOT "Dallas" |
| `*` | Zero or more characters | `abc*` | "abcdef", "abc123" |
| `?` | Exactly one character | `a?c` | "abc", "a1c" |
| `"quoted"` | Exact cell value | `"New York"` | only literal "New York" |
| plain text | Substring (default) | `hello` | "Hello World" |

**Word-boundary rule.** `+` and `-` are operators only at the start of the search, or after whitespace / `,` / another operator. Everywhere else they're literal characters — so `ACAU-ASR3690` matches as-is, hyphens included.

| You type | Parsed as |
|---|---|
| `ACAU-ASR3690 -"07"` | include rows with `ACAU-ASR3690`, exclude rows with cell exactly `"07"` |
| `ACAU-ASR3690 + "07"` | rows with `ACAU-ASR3690` AND cell exactly `"07"` |
| `ACAU-ASR3690-"07"` | literal substring match for the whole string (no operator picked up) |
| `foo+bar` | literal substring `foo+bar` — add spaces to AND: `foo + bar` |

**How clauses combine.** Every comma is OR. Every clause is its own independent search. A `-foo` only constrains the clause it sits in — adding another clause via `,` won't be limited by it.

| You type | Meaning |
|---|---|
| `WOOF -Rub +da,Rub` | (WOOF AND da AND NOT Rub) OR (Rub) — the second clause pulls Rub rows in |
| `foo -bar,baz` | (foo AND NOT bar) OR (baz) |
| `foo,-error` | (foo) OR (rows without `error`) — almost every row, since most rows don't contain `error` |
| `foo -error` | rows matching `foo` AND not containing `error` — write this when you want global exclusion |
| `-error,-pending` | (NOT error) OR (NOT pending) — almost every row |
| `-error -pending` | rows without `error` AND without `pending` — single clause, ANDed |
| `foo -err,bar -err` | (foo AND NOT err) OR (bar AND NOT err) — `-err` repeated so it kills both clauses |

Patterns are combinable: `active +pending,-error`, `"exact",-exclude,wild*`

- Always shows the row count — total rows when no search is active, filtered/total when searching
- Case-insensitive matching across all patterns
- **Copy and Export respect the active search filter** — only the filtered rows are included. On the Input tab, the [Result filter](#input-status) applies too

**Tips:**
- Search for specific error messages or exclude them: `-error`
- Find rows with particular values using wildcards: `SHIP*`
- Filter by status codes: `200` or exclude failures: `-4??`
- Combine terms with commas: `abc123,abc124`
- Require multiple terms with spaced `+`: `active +Chicago`
- Match exact cell values with quotes: `"New York"`

### Sorting
{: #sorting }

Click any column header to sort. Sort is saved on the active view, so it persists across tab switches and console reloads.

- **First click:** Sort ascending
- **Second click:** Sort descending
- **Third click:** Remove sort

Sub-tables (rendered when expanding an `▸ N records` cell) sort independently — their sort state is local to the open expand-cell.

## Pagination
{: #pagination }

Dobermann has full support for paginated APIs — configure page and size parameters, auto-detect settings from API responses, and fetch hundreds of pages with concurrent execution. Run a paginated endpoint once, then click **Pagination** in the Console footer.

See the dedicated [Pagination](/docs/pagination/) guide for the complete workflow.

---

## Copy & Export
{: #copy-options }

Copy data to the clipboard or export to a file from the toolbar above the table. To use the
rows as another API's input, [Chain](/docs/chain/) them instead: no clipboard, no file, no limit. All options respect the current tab, search filter, sort order, and visible columns — and, on the Input tab, the [Result filter](#input-status).

Column headers are the field names your view shows: a nested column such as `location.city` is headed `city`. When two columns share a name — `location.name` and `product.supplier.name`, say — those two are headed by their path instead, so a spreadsheet never has two columns called `name`.

### Copy
{: #copy }

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

When pasting into Excel, numeric-looking text fields (e.g. GLN codes like `0012345000015`) are automatically converted to numbers, losing leading zeros. Use the **Excel** or **CSV (Excel)** copy options to prevent this — they prefix text columns with an apostrophe (`'`) that tells Excel to treat the value as text. For guaranteed type preservation without any prefix characters, use **Export → Excel** instead.

### Export
{: #export }

The **Export** dropdown saves data to a file. It is available once the batch has finished.

| Format | Details |
|--------|---------|
| **CSV** | Plain text, streams line-by-line — handles any size |
| **CSV (Excel)** | CSV with text fields prefixed to prevent Excel number coercion |
| **Excel** | Formatted `.xlsx` workbook with colour-coded status codes and typed columns — guaranteed type preservation. One sheet each for Input, Success and Errors: the sheet for the tab you're on keeps your search, columns and view; the others are exported whole. Exported from the Input tab, the Input sheet keeps the Result filter |

### Limits

Large copy/export operations can overwhelm target applications or the extension host. Dobermann enforces sensible limits, and greys out an option that would exceed them, saying so:

| Action | Format | Limit | Reason |
|--------|--------|-------|--------|
| Copy | Standard / Excel / Markdown | 1,000 rows | Paste crashes Excel/Outlook with large tables |
| Copy | CSV / CSV (Excel) | 10,000 rows | Lighter format, higher tolerance |
| Export | Excel | 2,000,000 cells | The spreadsheet library runs out of memory beyond this |
| Export | CSV / CSV (Excel) | Unlimited | Streams line-by-line |

If you hit a limit, switch to CSV export (file) — it streams without memory constraints. Sending
the rows to another API? [Chain](/docs/chain/) has no limit.

---

## Help mode
{: #help-mode }

Every control in the Console links to its section of these docs. Turn on
[help mode](/docs/hub/#help-mode) with the {icon:help} help button at the right end of the Hub header, or
press <kbd>?</kbd>: documented controls get a dashed outline, and clicking one opens its docs.
<kbd>Esc</kbd> leaves.

---

## Execution History
{: #execution-history }

Every run, single or batch, is listed under {icon:nav-history} **History** on the Hub rail, newest first. Click one to reopen its Console with full results. **Settings → Transactions** chooses whether History shows the current environment or all of them, and how runs are grouped. To remove runs, turn on **Select**, tick them, and click **Delete**. See [The Hub — History](/docs/hub/#history).

A run's own actions are in its Console footer:

- **Re-run** — a single request, sent again as a new transaction
- **Reprocess** — a batch's failures, or any part of it; see [Batch Reprocessing](/docs/batch-reprocessing/)
- **Copy** — a copy of a batch, to run against another environment
- **Delete** — the run and its files

### Workspace Files

Every request and response is also saved as JSON in your [Dobermann workspace](/docs/your-data/#dobermann-workspace), organised by environment, endpoint and batch. The **Files** section of the Console's Settings tab links straight to them. They are yours to open, diff, or feed to anything else.

---

## Error Handling
{: #error-handling }

### Error Handling setting

Chosen on the **Execute Batch** step, and shown on the Console's Settings tab:

| Setting | Behaviour |
|---------|-----------|
| **Continue processing** (default) | The batch runs to the end. Failed requests collect on the Error tab for you to reprocess |
| **Stop on first error** | The batch stops at the first failed request |

**Continue processing** is the right choice for most loads — you get every failure in one run, then [reprocess](/docs/batch-reprocessing/) them together. **Stop on first error** suits a run where one failure means the rest shouldn't go either.

### Critical errors

Some failures stop a batch regardless of the setting above, because carrying on would fail every remaining request the same way:

- Responses with a **critical HTTP code** — `401` and `403` by default
- **Network errors** — timeouts, DNS failures, connection refused

Both are configurable under **Hub → Settings → Execution**. See [The Hub — Settings](/docs/hub/#settings).

### Authentication

A batch member refused with `401` against a DBMN-authenticated environment is retried once with a refreshed token before it counts as a failure. Other requests are not retried automatically: a failed transaction stays on the Error tab until you [reprocess](/docs/batch-reprocessing/) it.

---

## Performance

### Parallel Processing

Each batch picks a **Processing Mode** on the Execute Batch step, up to the ceiling set per environment (see [Environments — Parallel Processing](/docs/environments/#parallel-processing)). Higher concurrency = faster batches, but more server load.

### Large Batches

For big loads:
- Put more rows in each request — **Rows per request** on Review & Configure — before adding threads. See [Batch Preparation](/docs/batch-preparation/#step-4-review-json)
- Results stream to disk as they arrive, so the Console stays responsive
- Run during off-peak hours to avoid rate limiting

---

## Troubleshooting

### Execution Won't Start

**Check:**
- Endpoint is saved (no unsaved changes)
- An environment is selected in the Hub header, and its authentication is valid
- You are signed in to DBMN if the environment uses DBMN auth
- No validation errors in the endpoint

### Which Input Rows Failed?
{: #find-failed-rows }

1. Open the **Input** tab and set **Result** to **Error**. Only the rows whose transaction failed are left.
2. Right-click a row → **View transaction** to see its request and the error side by side.
3. **Export → Excel** for the list of rows to fix and send back.

One failed request can carry many rows. If the error doesn't say which, the request shows every row it sent.

### Batch Stops Unexpectedly

**Check:**
- **Error Handling** on the Settings tab — was it **Stop on first error**?
- Recent error messages in the Error tab
- A `401` or `403`, or a network error, stops a batch at once — see [Critical errors](#error-handling)
- API rate limits hit (look for 429 status codes)

### Execution Hangs

**Possible causes:**
- API server not responding
- Network connectivity issue
- Firewall blocking request

**Solutions:**
- Check API server status
- Test with curl/Postman
- Verify network connectivity
- On the Raw tab, set **Status** to **Running** to see the requests still in flight

### Wrong Data in Requests

**Check:**
- Column mapping is correct (Batch Preparation)
- Source data has correct values
- Variable names match exactly
- No extra spaces in column headers

---

## Related Topics

- [Named Views](/docs/named-views/) — Save column layouts and row-per-X shapes; switch and export instantly
- [Pagination](/docs/pagination/) — Configure and run paginated API requests
- [Chain](/docs/chain/) — Send a run's results into another endpoint's Run Batch
- [Batch Reprocessing](/docs/batch-reprocessing/) — Re-run failed transactions without re-executing the whole batch
- [The Hub](/docs/hub/) — History, the activity chip, and execution settings
- [Endpoints](/docs/endpoints/) — Configuring API requests
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Environments](/docs/environments/) — Authentication, timezone, and parallel processing
- [Troubleshooting](/docs/troubleshooting/) — Common issues and solutions
