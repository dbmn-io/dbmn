---
title: Console
layout: default
nav_order: 5
parent: Documentation
---

# Console

When you hit **Run API** or **Run Batch**, Dobermann opens the Console — your real-time window into what's happening. Single requests complete in a flash. Batches stream results as they run, with live progress, pause/resume controls, and full transaction detail.

## Starting an Execution

### Single Request (Run API)

Execute a single API request to test configuration, verify responses, or perform one-off operations.

**From endpoint webview:**
1. Configure endpoint (method, URL, headers, body)
2. Click **Run API**
3. Enter values for template variables (if any)
4. Console opens with results

**From sidebar:**
1. Right-click endpoint → **Run API**
2. Enter variable values when prompted

**From Quick Access (Alt+D E):**
1. Press **Alt+D E** to open fuzzy search
2. Select endpoint → choose **Run API**

### Batch Execution (Run Batch)

Execute the same endpoint multiple times with different data — entered in the grid or loaded from a file.

**From endpoint webview:**
1. Click **Run Batch** to open the batch preparation flow
2. Walk through the 5-step process: Load Data → Map & Transform → Review & Edit Data → Review JSON → Execute
3. Click **Execute** in Step 5 — the Console opens and the batch begins

**From sidebar:**
1. Right-click endpoint → **Run Batch**
2. Walk through the batch preparation steps
3. Click **Execute** — the Console opens automatically

See [Batch Preparation](batch-preparation) for the full 5-step workflow.

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
- **Stopped** — Batch stopped by user
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

**Stop** — Terminates execution immediately. Partial results are saved. Cannot resume (would need to start over).

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
- Root path selector is hidden (not applicable to source data)

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

### Root Path Navigation
{: #root-path-navigation }

Navigate nested JSON response structures without writing code.

**How it works:**
- Dropdown labelled `Root:` in the toolbar
- Select which JSON path to use as the table root
- Changes which data fields appear as columns

**Example:**
```json
{
  "data": {
    "items": [
      {"id": 1, "name": "Item A"},
      {"id": 2, "name": "Item B"}
    ]
  }
}
```
- Select root path: `data.items`
- Table shows columns: `id`, `name`

### Search
{: #search }

Search across all visible columns simultaneously.

- Always shows the row count — total rows when no search is active, filtered/total when searching
- Case-insensitive matching
- **Copy and Export respect the active search filter** — only the filtered rows are included

**Tips:**
- Search for specific error messages
- Find rows with particular values
- Filter by status codes (search "200" or "404")

### Column Management
{: #column-management }

Click **Manage Columns** to customise which columns are visible:

- **Search columns** — Filter column list by name
- **Select All / Deselect All** — Quick toggle
- **Reset to Default** — Restore original column selection
- **Toggle checkboxes** — Show/hide individual columns

### Sorting

Click any column header to sort:
- **First click:** Sort ascending
- **Second click:** Sort descending
- **Third click:** Remove sort
- **Multi-column sort:** Hold `Shift` and click additional columns

## Pagination
{: #pagination }

For large result sets, Dobermann uses pagination to improve performance.

**Pagination info** shows current page context:
- Current page number (e.g., "Page 2 of 10")
- Record range (e.g., "Records 51-100 of 1,000")
- **Next Page** button to load more

### Get Multiple Pages

Click **Get Multiple Pages** when pagination is available:

- **Get All Remaining Pages** — Fetches all pages automatically with progress bar and cancel option
- **Get Page Range** — Specify From/To page numbers for a specific subset

Results append to the existing table data.

---

## Copy & Export
{: #copy-options }

Copy data to the clipboard or export to a file. All options respect the current tab, search filter, sort order, and visible columns.

### Copy

The **Copy** dropdown copies data straight to your clipboard — no file needed.

| Format | Best for | What you get |
|--------|----------|--------------|
| **For Spreadsheet (TSV)** | Excel, Google Sheets | Tab-separated values — pastes directly into cells |
| **For Email (HTML)** | Outlook, Gmail, Word, Teams, Confluence | Styled HTML table with formatting |
| **For Jira/Docs (Markdown)** | GitHub, Jira, Notion | GitHub Flavoured Markdown table |
| **CSV** | Scripts, data pipelines | Comma-separated plain text |

**Example workflow:**
1. Switch to Error tab
2. Search for a specific error pattern
3. Sort by timestamp
4. Click Copy → **For Email (HTML)**
5. Paste into Outlook — formatted table appears inline

### Export

The **Export** dropdown saves data to a file.

| Format | Details |
|--------|---------|
| **CSV** | Plain text, streams line-by-line — handles any size |
| **Excel (.xlsx)** | Formatted workbook with colour-coded status codes and typed columns |

### Limits

Large copy/export operations can overwhelm target applications or the extension host. Dobermann enforces sensible limits:

| Action | Format | Limit | Reason |
|--------|--------|-------|--------|
| Copy | HTML / TSV | 1,000 rows | Paste crashes Excel/Outlook with large tables |
| Copy | Markdown | 1,000 rows | Paste crashes target apps |
| Copy | CSV | 10,000 rows | Lighter format, higher tolerance |
| Export | Excel | 2,000,000 cells | XLSX library OOM in extension host |
| Export | CSV | Unlimited | Streams line-by-line |

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
- Pause — Stopped/incomplete

Click any execution to reopen the Console with full results.

**Context menu options:**
- **View** — Open results
- **Export Results** — Save to file
- **Re-run** — Execute again with same data
- **Delete** — Remove from history

### Workspace Files

Results are automatically saved to your workspace:

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

Concurrency is configured per environment (see [Environments — Parallel Processing](environments#parallel-processing)). Higher concurrency = faster batches, but more server load.

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

- [Endpoints](endpoints) — Configuring API requests
- [Batch Preparation](batch-preparation) — Data loading and column mapping
- [Environments](environments) — Authentication, timezone, and parallel processing
- [Troubleshooting](troubleshooting) — Common issues and solutions
