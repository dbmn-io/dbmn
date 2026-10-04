---
title: Batch Preparation
layout: default
nav_order: 4
parent: Documentation
---

# Batch Preparation

**Run Batch** runs the same endpoint once per row of your data — or once per thousand rows, if the API takes arrays. Load an Excel/CSV file, paste tabular data, or type values directly into the grid. Dobermann walks you through a 5-step flow, from data loading to execution, in a tab of the [Hub](/docs/hub/).

Run Batch appears in the endpoint footer, and as the {icon:run-batch} icon on the endpoint's catalogue row, once the endpoint has `{{template variables}}`. Its sibling, [Run API](/docs/run-api/), sends one request — run that first, so you know the template and the API agree before you point a file at it.

## Overview
{: #overview }

Batch preparation follows five steps:

| Step | Name | Purpose |
|------|------|---------|
| 1 | **Load Data** | Choose how to get data in — upload a file, paste text, or enter data manually |
| 2 | **Map & Transform** | Map source columns to template variables and configure data formats |
| 3 | **Review & Edit Data** | Review, edit, add, and validate rows before building requests |
| 4 | **Review & Configure** | See the first requests and how many will be sent, and set Rows per request |
| 5 | **Execute Batch** | Name the batch, choose error handling and concurrency, and run it |

### Two Entry Paths

There are two ways into the batch flow, and they converge at Step 3:

**File / Paste path** (all 5 steps):

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5
Load     Map &     Review    Review &   Execute
Data     Transform & Edit    Configure  Batch
                   Data
```

**Enter Data path** (skips file loading and mapping):

```
Step 1 → Step 3 → Step 4 → Step 5
Load     Review    Review &   Execute
Data     & Edit    Configure  Batch
         Data
```

- **File / Paste**: Upload a file or paste tabular data, then map columns to template variables. The grid in Step 3 is pre-populated with your mapped data.
- **Enter Data**: Click the **Enter Data** button on Step 1 to jump straight to an empty grid with columns matching your template variables. Type values directly — no file needed.

Both paths merge at Step 3, where you can review and edit the data before the requests are built.

---

## Step 1 — Load Data
{: #step-1-load-data }

Step 1 is where you choose how to get data into the batch flow. There are three options:

### Upload File
{: #upload-file }

Drag a file onto the upload area or click to browse. Supported formats:

- `.xlsx` / `.xls` — Excel workbooks. You pick the sheet, and if the sheet has hidden rows you choose **Filtered rows** or **All rows**
- `.csv` — Comma-separated values
- `.tsv` / `.txt` — Tab or comma-separated
- Character encoding: UTF-8 (recommended), ASCII

{: .note }
> **File open in Excel?** Drag it in. On Windows the browse dialog can't pick a file another program holds open; drag and drop always works.

After loading, Dobermann displays the row count (excluding the header), the columns it found, and a preview of the first rows. Check the columns are right and the values landed where you expect before going on.

### Paste Text
{: #paste-text }

Switch to the **Paste Text** tab and paste CSV, TSV, or tab-delimited data directly. This is useful when copying a few rows from Excel. To make a GET's results a POST's input, [Chain](/docs/chain/) them from the Console instead: no clipboard, and no row limit.

Dobermann auto-detects tab-delimited data (common when pasting from Excel) and converts it to CSV format internally.

### Enter Data (Manual Entry)
{: #enter-data }

Click the **Enter Data** button to skip file loading and column mapping entirely. Dobermann creates an empty grid with columns matching your endpoint's template variables. You type values directly into the grid in Step 3.

**When to use Enter Data:**
- Quick ad-hoc requests with a few rows
- Testing an endpoint with specific values
- No file to upload — you know the values

Clicking **Enter Data** jumps directly from Step 1 to Step 3.

### File Requirements

**Header row:**
- First row must contain column names
- Column names should match template variables (or be mapped manually in Step 2)
- Avoid special characters in column names

**Data formatting:**
- Consistent delimiter (comma, tab, semicolon)
- Quote text fields containing delimiters
- One record per row
- Empty cells are treated as empty strings

**Example CSV:**
```csv
sku,description,quantity,warehouse
PRE-ITEM-001,Widget Alpha,100,DC01
PRE-ITEM-002,Widget Beta,250,DC02
PRE-ITEM-003,Widget Gamma,75,DC01
```

After loading data via file or paste, click **Import Data** to proceed to Step 2.

---

### Skipping ahead
{: #skip-ahead }

After **Import Data**, Dobermann presses **Next** for you while nothing needs your attention:

- **Map & Transform** is skipped when every required variable maps to a column with confidence:
  a column this endpoint [remembered](#remember-mapping), or one with the same name ignoring case
  and punctuation. A match on part of a name always stops on Map & Transform for you to check.
- **Review & Edit Data** is skipped too, only when every row passes its checks.

You land on **Review & Configure**, with a note saying what was skipped; **Back** shows the
skipped steps. Anything that needs you (a missing column, a type problem, blank cells, a sort
question) stops on its step as before. Click anything while it runs and you take over.

## Step 2 — Map & Transform
{: #step-2-map-transform }

Map source data columns to template variables in your endpoint configuration. This step only appears when using the File or Paste path.

The table has a **Source** side — the file's column, its **Source Format** and a sample value — and a **Target** side — the template variable, its type, the converted sample, and a status.

### Automatic Mapping

Dobermann automatically maps columns when the column name matches a template variable. Mapping is case-insensitive — `SKU`, `sku`, and `Sku` all map to `{{sku}}`.

### Manual Mapping

For columns that don't auto-map:

1. Find the unmapped variable in the mapping table
2. Click the dropdown next to the variable name
3. Select the corresponding source data column

**Example:**
```
Template Variable    | Source Column
---------------------|-------------
{{item_id}}         | sku
{{item_desc}}       | description
{{qty}}             | quantity
{{location}}        | warehouse
```

### Remember the Mapping
{: #remember-mapping }

When you click **Next** on Map & Transform, the endpoint remembers which column each variable was mapped to. The next Run Batch on that endpoint maps them for you — as long as the new file has those columns. A column it doesn't have falls back to automatic mapping, and you can still change any of them; the new choice is remembered in turn.

The mapping is kept with the endpoint's Run Batch settings. Your template — the Request Body — is not changed.

**Update Endpoint Template** appears once a variable is mapped to a column with a different name. Tick it to rename those variables after their columns once the batch has run — `{{buyerGln}}` mapped to `location.gln` becomes `{{location.gln}}` — so a file with those columns maps itself. The batch you're running is not affected: it finishes on the names it started with.

### Mapping Validation

Dobermann validates your mapping:

- **All required variables mapped**
- **No duplicate mappings** — each variable maps to one column
- **Column exists in source data** — mapped columns must be present

Unmapped required variables are flagged in the Status column. Resolve all mapping issues before proceeding.

**Optional variables don't need a column.** A variable marked `|opt` or `|null` — shown with a ○ in the mapping table — can be left unmapped when your file simply doesn't have that column. Every request then omits the key (`|opt`) or sends `null` (`|null`), exactly as it would for a blank cell. See [Template Variables](/docs/template-variables/).

### Source Format Configuration

The **Source Format** column lets you specify how source values should be interpreted before conversion. It defaults by type — **Standard Number**, **Auto-detect Date**, **Boolean**, or **No Transform** for strings.

**Number Formats:**

| Format | Example Input | Description |
|--------|---------------|-------------|
| Standard Number | `1234.56` | Regular decimal numbers |
| COBOL | `+000000099.9900` | COBOL packed decimal with sign |
| Scientific | `1.23E+04` | Scientific notation |
| Currency | `$1,234.56` | Currency with symbols and separators |

**Date Formats:**

| Format | Example Input | Description |
|--------|---------------|-------------|
| Auto-detect Date | Various | Attempts to parse common formats |
| YYYY-MM-DD | `2024-01-04` | ISO date format |
| MM/DD/YYYY | `01/04/2024` | US date format |
| DD/MM/YYYY | `04/01/2024` | European date format |
| Unix Timestamp | `1704326400` | Seconds since epoch |
| ISO 8601 | `2024-01-04T14:30:00Z` | Full ISO datetime |
| Excel Serial Date | `45295` | Excel serial number (days since 1900) |

**Excel Serial Date:**

Excel stores dates as numbers representing days since January 1, 1900. When exporting from Excel, dates may appear as numbers like `45295` instead of `2024-01-04`.

To handle Excel serial dates:
1. Map your date column normally
2. Change **Source Format** to "Excel Serial Date"
3. The number will be converted to a proper date

**Timezones:** if the template has a `datetime` variable, a **Source Timezone** appears above the table, alongside the environment's **Target Timezone**. Values are converted from one to the other.

Click **Next** to proceed to Step 3. Dobermann validates all data type coercions before advancing.

---

## Step 3 — Review & Edit Data
{: #step-3-review-edit-data }

Step 3 presents your data in an editable grid. Depending on how you got here:

- **File / Paste path** — The grid is pre-populated with your mapped and transformed data
- **Enter Data path** — The grid is empty with columns matching your template variables

This is your last chance to review and modify data before the requests are built. Edits apply to this run; your file on disk is untouched.

### Editing the Grid

| Action | How |
|--------|-----|
| **Edit a cell** | Click the cell and type |
| **Add a row** | Tab from the last cell in the last row, or click **+ Add Row** (Enter Data path) |
| **Delete a row** | Click the × at the end of the row (Enter Data path) |
| **Paste data** | Select a cell and paste — data fills across cells and rows |
| **Undo a paste** | `Ctrl+Z` / `Cmd+Z` |
| **Fill down** | `Ctrl+D` to copy the value from the cell above |
| **See only the problems** | **Filter Errors** in the footer hides every row that passed |

### Grid Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell. From the last cell of the last row, adds a new row |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move down to same column in next row; on the last row, adds a row |
| `Shift+Enter` | Move up to same column in previous row |
| `Arrow Up / Down` | Move between rows |
| `Ctrl+D` | Copy value from cell above (fill-down) |
| `Escape` | Clear current cell |

### Progressive Tab Copy (Nested Templates)

For templates with nested structures (e.g., orders with line items), the grid speeds up repetitive entry:

1. Fill the first row completely
2. Tab from the last cell — a new row is added
3. A hint beside **Add Row** offers to copy the header-level values (e.g., order ID, destination) from the row above. Tab again to take them
4. Type to enter your own values instead

### Validation

When you click **Next** to proceed to Step 4, Dobermann validates your data:

**Blank field check:**
- Scans for empty cells in required columns
- Shows how many empty fields it found, with a **Continue** button
- You can continue, or go back and fill in the values
- Optional (`|opt`, `|null`) and boolean fields are excluded from this check

**Modifier constraint validation:**
- Validates cell values against any modifier constraints defined on the template variable
- Checks include: minimum/maximum length, exact length, min/max numeric values, integer requirements, and date format validity
- Invalid cells are highlighted with an amber background, and the column header shows a dotted underline — hover it to see the rule
- The footer names the column and the rule: `"quantityOnHand" has 1 invalid record — must be ≥ 0`
- You must fix all constraint errors before proceeding

**Auto-cleaning:**
- Completely empty rows are automatically removed before validation

### Column Width

For endpoints with many template variables, the grid scrolls horizontally. Each column has a minimum width to keep content readable.

---

## Step 4 — Review & Configure
{: #step-4-review-json }

Step 4 shows what the batch will send, built by the same code that sends it — for a JSON body, URL parameters, or both.

### Configure
{: #batch-configuration }

**Configure** appears when there is something to set:

| Setting | When | What it does |
|---|---|---|
| **Rows per request** | A flat array (`[ { … } ]`) | How many rows go into each request's array, 1 to 1000. Start at 100: many APIs refuse or time out well before 1000. Go higher only when the API's documentation says it can take more |
| **`orders` per request** | Two or three levels (`orders[].items[]`) | How many top-level entries go into each request |
| **Values per URL** | A repeating URL parameter (`id={{item}}[ or ]`) | How many values go into each URL — Auto fits as many as the URL length allows |
| **Array** | A template with two or more arrays that could repeat | Which one repeats |
| **Body** | BASE64-encoded fields | Show the bodies as sent, or unencoded |

Change a setting and the requests below rebuild by themselves: at once for a dropdown, once you stop typing for a number.

**Summary** shows the **API calls** the batch will make, the **Rows** going into them, and the **Size** of the first request. The ⓘ beside API calls opens *How your rows become API requests*: your template with each variable marked by what it does, how the rows group into requests, and what each request holds.

**Requests** shows every request, or **Request samples** the first five when there are more — each with the input rows behind it and its request: the **Body**, or **Details** (method, URL, query parameters, headers). An endpoint with no body shows its URL. **Show Input / Request** hides or shows those parts of every card.

### Rows per request — the dial most people miss

One row per request works, and it is the slowest possible way to load data. If the endpoint accepts an array, set **Rows per request** to what the API allows and watch **API calls** fall: 67,000 rows at 100 per request is 670 requests, not 67,000. Threads (Step 5) make a load faster; rows per request make it smaller — fewer connections, less overhead, less load on the API. Turn both up.

### How rows become requests (nested templates)
{: #nested-grouping }

When a template has header fields and an array of lines — a purchase order, a shipment — one row of your data is one **line**, and Dobermann folds rows into requests:

> **A new request starts whenever any header field changes.** Rows that agree on every header field become one request; each row adds a line to it.

This is how one flat file becomes one order per supplier and site, with the order number generated rather than supplied:

```json
{
  "poNumber": "PO-{{A8:sequence}}",
  "supplier": "{{supplier}}",
  "shipTo": "{{shipTo}}",
  "lines": [ { "sku": "{{sku}}" } ]
}
```

| supplier | shipTo | sku | Goes into |
|---|---|---|---|
| Wagmore | Atlanta | SKU-A | request 1 |
| Boop | Atlanta | SKU-B | request 2 |
| Wagmore | Atlanta | SKU-C | request 1 — gathered with the first row, though they aren't adjacent |
| Wagmore | Boston | SKU-D | request 3 — same supplier, different site |

{: .warning }
> **If the header carries an identifier from your data, the other header fields must agree with it.** Put `{{poNumber}}` in the header, and every row for `PO-1` has to carry the same supplier, the same ship-to, the same everything else. If one row says Atlanta and another says Boston, that is bad data — and Dobermann will send **two requests for `PO-1`**. What happens next is up to the API: it may reject the second as a duplicate, or it may overwrite the first. Dobermann can't know which header is the right one, so it doesn't guess. Check the **API calls** count against the number of orders you expect before you execute, and fix the file if they differ.

- **The header is true of every line.** Only put something in the header if it holds for the whole order. A per-line value up there gives you one request per row.
- **Rows don't need to be sorted** — matching rows are gathered wherever they sit. Dobermann sorts by the header fields first, so requests come out in that order.
- **Spaces around a value don't count** (`Acme ` is `Acme`), but **case does** — `ACME` is a different header, and gets its own request where you can see it.
- **Generated values aren't part of it.** `{{A8:sequence}}` in the header is handed out after grouping, one number per request. `{{ENV:…}}` values are the same for every row anyway.
- The same rule applies one level down: in a three-level template, a new shipment starts when any of the shipment's own fields changes, and a new package when any of the package's does.

The **API calls** count in this step is the number of requests the rule produced; its ⓘ shows the groups, one row per request. If it isn't what you expected, this is why.

#### Sorting
{: #nested-array-sorting }

A nested template's rows are sorted by the header fields before they are folded, so the lines of one order sit together whatever order the file had them in. When that happens, Step 4 says so: *Unsorted data detected. Sorted by: …*. A flat template — just a list of records — has nothing to group by, and is sent exactly as loaded.

Click **Next** to proceed to Step 5.

---

## Step 5 — Execute Batch
{: #step-5-execute-batch }

Step 5 shows the execution summary and lets you start the batch.

| Section | What's there |
|---|---|
| **Sending To** | **Environment**, **Organization** (if one is selected), and the **Endpoint** as method and full URL |
| **Source Data** | **Source** (the file and sheet, or *Pasted data*), **Records**, **API Calls**, and **Per Call** for a flat array |
| **Configure** | **Name**, **Error Handling** and **Processing Mode** — below |

### Name
{: #batch-name }

The batch name, as it will appear in History. Up to 100 characters.

### Error Handling
{: #error-handling }

| Setting | Behaviour |
|---------|-----------|
| **Continue processing** (default) | The batch runs to the end. Failed requests collect on the Console's Error tab, ready to [reprocess](/docs/batch-reprocessing/) together |
| **Stop on first error** | The batch stops at the first failed request |

**Continue processing** is right for most loads: you see every failure in one run instead of one at a time. Choose **Stop on first error** when one failure means the rest shouldn't go either.

Some failures stop a batch regardless — a `401` or `403`, or a network error — because every remaining request would fail the same way. Those are configurable under **Hub → Settings → Execution**. See [Console — Error Handling](/docs/console/#error-handling).

### Processing Mode
{: #processing-mode }

**Sequential (Safest)** sends one request at a time. **N concurrent requests** sends 2, 4, 8 or 16 at once, up to the environment's **Max Concurrency** — see [Environments — Parallel Processing](/docs/environments/#parallel-processing). If the environment hasn't enabled parallel processing, only Sequential is offered.

### Execute
{: #execute }

**Execute** is enabled once you have scrolled to the bottom of the summary. If the active environment is typed **Production**, a confirmation asks you to proceed — see [Environments — Environment Type](/docs/environments/#environment-type).

The Console opens automatically and results stream in real-time, with live completion, success/error counts, and elapsed time. **Pause** halts the batch after the current request; **Resume** picks up where it left off. The run stays under {icon:nav-history} **History** in the Hub, and every request and response is saved in your [Dobermann workspace](/docs/your-data/#dobermann-workspace).

See [Console](/docs/console/) for detailed results, export features, and error analysis.

---

## Advanced Features

### Variable Types

Specify data types in template variables for validation. See [Template Variables](/docs/template-variables/) for the full reference on types, modifiers, auto-generated variables, and advanced syntax.

**Quick reference:**

| Type | Syntax | Example |
|------|--------|---------|
| String (default) | `{{sku}}` | Text value |
| Number | `{{quantity:number}}` | Removes quotes, validates numeric |
| Boolean | `{{is_active:boolean}}` | `true`/`false`, `1`/`0`, `yes`/`no` |
| Date | `{{ship_date:date}}` | Date value with optional format modifiers |

### Pagination

A GET that pages its results is driven from the Console after a single run, not from Run Batch — see [Pagination](/docs/pagination/).

### Query Parameter Repetition

An endpoint whose query parameter repeats — `ItemId={{ITEM}}[ or ]` — runs as a batch of GETs, each URL carrying as many values as **Values per URL** allows. See [Endpoints — Query Parameter Repetition](/docs/endpoints/#query-parameter-repetition).

---

## Troubleshooting

### File Not Loading

**Symptoms:** File browser appears but file doesn't load

**Check:**
- File extension is `.csv`, `.xlsx`, `.xls`, `.tsv` or `.txt`
- File encoding is UTF-8
- File is open in Excel — drag it onto the drop zone instead of browsing
- **Hub → Settings → Execution → Max CSV rows** is high enough

### Column Mapping Fails

**Symptoms:** Columns don't auto-map or mapping shows errors

**Solutions:**
- Check the header row has column names
- Verify column names don't have special characters
- Manually map columns using the dropdowns
- Check for extra spaces in column names
- The endpoint remembers its last mapping — a column it remembers that this file doesn't have falls back to automatic mapping

### Validation Errors in Step 3

**Symptoms:** Amber-highlighted cells in the data grid, footer showing validation errors

**Solutions:**
- Click **Filter Errors** to see only the rows that failed
- Hover the column header to see the rule the cells broke
- Fill in blank required fields
- Fix data format issues (e.g., text in a number column), or set the **Source Format** on Step 2
- Remove or fix invalid rows

### Batch Stops Immediately

**Symptoms:** Batch stops after the first request

**Check:**
- **Error Handling** was **Stop on first error** — the Console's Settings tab shows which
- The first request failed with `401` or `403`, or a network error — those stop a batch whatever the setting
- Template variables are correctly mapped
- The endpoint path and the active environment are right

### Variables Not Substituting

**Symptoms:** Template variables appear literally in request (e.g., `{{sku}}` in JSON)

**Causes:**
- Variable not mapped to a source data column
- Column name mismatch
- Variable misspelled in template

**Solutions:**
- Review column mapping in Step 2
- Check variable names match exactly (including case)

### Too Many or Too Few Requests

The **API calls** count on Step 4 is the truth about what will be sent. For a nested template, click ⓘ to see how the rows were grouped — a header field that varies per row gives one request per row; see [How rows become requests](#nested-grouping). For a flat template, check **Rows per request**.

### Performance Issues

**Symptoms:** Batch runs very slowly

**Optimisation:**
- Raise **Rows per request** — the single biggest lever
- Raise **Processing Mode**, within the environment's Max Concurrency
- Check API response times (may be server-side)
- Ensure network connection is stable

## Related Topics

- [Run API](/docs/run-api/) — One request, to prove the template first
- [Endpoints](/docs/endpoints/) — Template variables and configuration
- [Template Variables](/docs/template-variables/) — Variable syntax, types, modifiers, and editing
- [Console](/docs/console/) — Running and monitoring requests
- [Batch Reprocessing](/docs/batch-reprocessing/) — Re-run only the failures
- [Import/Export](/docs/import-export/) — Sharing endpoint configurations
