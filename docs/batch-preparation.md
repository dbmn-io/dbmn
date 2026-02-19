---
title: Batch Preparation
layout: default
nav_order: 4
parent: Documentation
---

# Batch Preparation

Batch execution allows you to run the same API endpoint multiple times with different data. Load an Excel/CSV file, paste tabular data, or type values directly into the grid. Dobermann walks you through a 5-step flow — from data loading to execution.

## Overview
{: #overview }

Batch preparation follows five steps:

| Step | Name | Purpose |
|------|------|---------|
| 1 | **Load Data** | Choose how to get data in — upload a file, paste text, or enter data manually |
| 2 | **Map & Transform** | Map source columns to template variables and configure data formats |
| 3 | **Review & Edit Data** | Review, edit, add, and validate rows before generating JSON |
| 4 | **Review JSON** | Preview the generated JSON payloads and configure batch parameters |
| 5 | **Execute Batch** | Review execution settings and run the batch |

### Two Entry Paths

There are two ways into the batch flow, and they converge at Step 3:

**File / Paste path** (all 5 steps):

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5
Load     Map &     Review    Review   Execute
Data     Transform & Edit    JSON     Batch
                   Data
```

**Enter Data path** (skips file loading and mapping):

```
Step 1 → Step 3 → Step 4 → Step 5
Load     Review    Review   Execute
Data     & Edit    JSON     Batch
         Data
```

- **File / Paste**: Upload a file or paste tabular data, then map columns to template variables. The grid in Step 3 is pre-populated with your mapped data.
- **Enter Data**: Click the **Enter Data** button on Step 1 to jump straight to an empty grid with columns matching your template variables. Type values directly — no file needed.

Both paths merge at Step 3, where you can review and edit the data before generating JSON.

---

## Step 1 — Load Data
{: #step-1-load-data }

Step 1 is where you choose how to get data into the batch flow. There are three options:

### Upload File

Drag a file onto the upload area or click to browse. Supported formats:

- `.xlsx` / `.xls` — Excel workbooks
- `.csv` — Comma-separated values
- `.txt` — Tab or comma-separated
- Character encoding: UTF-8 (recommended), ASCII

After loading, Dobermann displays:
- **Row count** — Total data rows (excludes header)
- **Column list** — All column names detected
- **Preview table** — First rows of data

**Review checklist:**
- Correct number of columns
- Data appears in correct columns
- No missing delimiters
- Special characters display properly

### Paste Text

Switch to the **Paste Text** tab and paste CSV, TSV, or tab-delimited data directly. This is useful when copying a few rows from Excel or another tool.

Dobermann auto-detects tab-delimited data (common when pasting from Excel) and converts it to CSV format internally.

### Enter Data (Manual Entry)

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

After loading data via file or paste, click **Read Data** to proceed to Step 2.

---

## Step 2 — Map & Transform
{: #step-2-map-transform }

Map source data columns to template variables in your endpoint configuration. This step only appears when using the File or Paste path.

### Automatic Mapping

Dobermann automatically maps columns when the column name matches a template variable. Mapping is case-insensitive — `SKU`, `sku`, and `Sku` all map to `{{sku}}`.

### Manual Mapping

For columns that don't auto-map:

1. Find the unmapped variable in the mapping table
2. Click the dropdown next to the variable name
3. Select the corresponding source data column
4. Mapping is saved automatically

**Example:**
```
Template Variable    | Source Column
---------------------|-------------
{{item_id}}         | sku
{{item_desc}}       | description
{{qty}}             | quantity
{{location}}        | warehouse
```

### Mapping Validation

Dobermann validates your mapping:

- **All required variables mapped** — green checkmarks
- **No duplicate mappings** — each variable maps to one column
- **Column exists in source data** — mapped columns must be present

Unmapped required variables show a red indicator. Resolve all mapping issues before proceeding.

### Source Format Configuration

The **Source Format** column lets you specify how source values should be interpreted before conversion.

**Number Formats:**

| Format | Example Input | Description |
|--------|---------------|-------------|
| Standard | `1234.56` | Regular decimal numbers |
| COBOL | `+000000099.9900` | COBOL packed decimal with sign |
| Scientific | `1.23E+04` | Scientific notation |
| Currency | `$1,234.56` | Currency with symbols and separators |

**Date Formats:**

| Format | Example Input | Description |
|--------|---------------|-------------|
| Auto-detect | Various | Attempts to parse common formats |
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

Click **Next** to proceed to Step 3. Dobermann validates all data type coercions before advancing.

---

## Step 3 — Review & Edit Data
{: #step-3-review-edit-data }

Step 3 presents your data in an editable grid. Depending on how you got here:

- **File / Paste path** — The grid is pre-populated with your mapped and transformed data
- **Enter Data path** — The grid is empty with columns matching your template variables

This is your last chance to review and modify data before JSON generation.

### Editing the Grid

| Action | How |
|--------|-----|
| **Edit a cell** | Click the cell and type |
| **Add a row** | Tab from the last cell in the last row, or use the Add Row button |
| **Delete a row** | Select the row and press Delete, or use the row context menu |
| **Paste data** | Select a cell and paste — data fills across cells and rows |
| **Undo** | `Ctrl+Z` / `Cmd+Z` to undo the last change |
| **Fill down** | `Ctrl+D` to copy the value from the cell above |

### Grid Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell. From last cell, adds a new row |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move down to same column in next row |
| `Shift+Enter` | Move up to same column in previous row |
| `Arrow Keys` | Navigate between cells |
| `Ctrl+D` | Copy value from cell above (fill-down) |
| `Escape` | Clear current cell |

### Progressive Tab Copy (Nested Templates)

For templates with nested structures (e.g., orders with line items), the grid supports progressive Tab copy:

1. Fill first row completely
2. Tab from last cell — adds a new row
3. Tab again (without typing) — copies root-level values (e.g., order ID, destination)
4. Tab again — copies next nesting level values
5. Type to cancel progressive copy and enter unique values

A hint appears to guide you through the progressive copy levels.

### Validation

When you click **Next** to proceed to Step 4, Dobermann validates your data:

**Blank field check:**
- Scans for empty cells in required columns
- Shows a warning listing which rows and columns are blank
- You can acknowledge the warning and proceed, or go back and fill in the values
- Fields marked with the `|opt` modifier are excluded from this check

**Modifier constraint validation:**
- Validates cell values against any modifier constraints defined on the template variable
- Checks include: minimum/maximum length, exact length, min/max numeric values, integer requirements, and date format validity
- Invalid cells are highlighted with a red background
- A summary of validation errors appears in the footer
- You must fix all constraint errors before proceeding

**Auto-cleaning:**
- Completely empty rows are automatically removed before validation

### Column Width

For endpoints with many template variables, the grid scrolls horizontally. Each column has a minimum width to keep content readable.

---

## Step 4 — Review JSON
{: #step-4-review-json }

Step 4 shows a preview of the generated JSON payloads that will be sent to the API. Review the output to confirm variable substitution and structure are correct.

**What's displayed:**
- JSON preview with syntax highlighting
- Total API calls to be made
- Request size estimate

### Batch Configuration

**Error Tolerance:**

Control how errors affect batch execution:

| Setting | Behaviour |
|---------|-----------|
| **Stop on First Error** | Batch stops immediately on any failure (default) |
| **Maximum Error Count** | Stops after N failures (e.g., 5) |
| **Percentage-Based** | Stops if error rate exceeds threshold (e.g., 10%) |
| **Continue on All Errors** | Runs to completion regardless of failures |

**Choosing a setting:**

| Scenario | Recommended Setting |
|----------|-------------------|
| Critical data migration | Stop on First Error |
| Bulk update with validation | Max 5 errors |
| Large import (10,000 rows) | 5% error tolerance |
| Data quality testing | Continue on all errors |

### Maximum Repetitions (Advanced)

Limit how many times array values repeat in requests.

**Default behaviour:**
If CSV has fewer rows than array size in template, Dobermann repeats CSV rows:
```
CSV: 3 rows
Template array: 10 items
Result: [row1, row2, row3, row1, row2, row3, row1, row2, row3, row1]
```

**With maxRepetitions=2:**
```
CSV: 3 rows
Max repetitions: 2
Result: [row1, row2, row3, row1, row2, row3] (stops after 2 cycles)
```

Click **Next** to proceed to Step 5.

---

## Step 5 — Execute Batch
{: #step-5-execute-batch }

Step 5 shows the execution summary and lets you start the batch.

**Execution summary:**
- Endpoint name, HTTP method, and URL path
- Target environment and organization
- Number of API calls to execute
- Processing mode (sequential or parallel)
- Error tolerance setting
- Batch name (editable)

Click **Execute** to start the batch. The Console opens automatically and results stream in real-time.

### Monitoring Progress

**Progress indicators:**
- **Progress bar** — Visual completion percentage
- **Status text** — "Processing 45 of 100..."
- **Success counter** — Green checkmark with count
- **Error counter** — Red X with count
- **Elapsed time** — Running timer
- **Requests per second** — Throughput metric

### Pausing and Stopping

**Pause** — Temporarily halt execution after the current request completes. Resume from the exact position. Useful for rate limit cooling or reviewing errors mid-run.

**Stop** — Terminate batch immediately. Partial results are saved. Cannot resume (must start over).

### Batch Results

When the batch completes:
- Console opens automatically with full results
- Results saved to workspace (`.active8/results/`)
- Execution remains in history sidebar

See [Console](console) for detailed results, export features, and error analysis.

---

## Advanced Features

### Variable Types

Specify data types in template variables for validation. See [Template Variables](template-variables) for the full reference on types, modifiers, auto-generated variables, and advanced syntax.

**Quick reference:**

| Type | Syntax | Example |
|------|--------|---------|
| String (default) | `{{sku}}` | Text value |
| Number | `{{quantity:number}}` | Removes quotes, validates numeric |
| Boolean | `{{is_active:boolean}}` | `true`/`false`, `1`/`0`, `yes`/`no` |
| Date | `{{ship_date:date}}` | Date value with optional format modifiers |

### Pagination Support (A8:PAGE)

For APIs supporting pagination, use the special `{{A8:PAGE}}` variable:

```
/api/items?page={{A8:PAGE}}&limit=100
```

- First request: `page=1`
- Second request: `page=2`
- Continues incrementing automatically

### Batch File Organisation

```
.active8/
├── batches/
│   └── {endpoint-id}/
│       ├── latest.csv
│       └── {timestamp}.csv
└── results/
    └── {endpoint-id}/
        └── {timestamp}.json
```

---

## Troubleshooting

### File Not Loading

**Symptoms:** File browser appears but file doesn't load

**Check:**
- File extension is `.xlsx`, `.xls`, `.csv`, or `.txt`
- File encoding is UTF-8
- File is not locked by another application
- File size is reasonable (<10MB recommended)

### Column Mapping Fails

**Symptoms:** Columns don't auto-map or mapping shows errors

**Solutions:**
- Check CSV header row has column names
- Verify column names don't have special characters
- Manually map columns using dropdowns
- Check for extra spaces in column names

### Validation Errors in Step 3

**Symptoms:** Red-highlighted cells in the data grid, footer showing validation errors

**Solutions:**
- Click on highlighted cells to see what's wrong
- Check modifier constraints on the template variable (e.g., length limits, numeric ranges)
- Fill in blank required fields
- Fix data format issues (e.g., text in a number column)
- Remove or fix invalid rows

### Batch Stops Immediately

**Symptoms:** Batch stops after first request

**Check:**
- Error tolerance setting (may be "Stop on First Error")
- First request succeeded (check status code)
- Template variables are correctly mapped
- API endpoint is correct and accessible

### Variables Not Substituting

**Symptoms:** Template variables appear literally in request (e.g., `{{sku}}` in JSON)

**Causes:**
- Variable not mapped to a source data column
- Column name mismatch
- Variable misspelled in template

**Solutions:**
- Review column mapping in Step 2
- Ensure all variables have green checkmarks
- Check variable names match exactly (including case)

### Performance Issues

**Symptoms:** Batch runs very slowly

**Optimisation:**
- Reduce file size (batch in smaller chunks)
- Check API response times (may be server-side)
- Ensure network connection is stable
- Close unnecessary VS Code extensions

### Memory Issues

**Symptoms:** VS Code becomes slow or crashes during large batch

**Solutions:**
- Process in smaller batches (<1000 rows at a time)
- Close other VS Code windows
- Increase VS Code memory limit
- Export results immediately after completion

## Best Practices

**Data preparation:**
- Clean data before importing (remove duplicates, fix formatting)
- Include meaningful column headers
- Test with small sample (10-20 rows) first
- Keep backups of original data files

**Error handling:**
- Start with "Stop on First Error" for testing
- Use percentage tolerance for production runs
- Review first few errors before continuing large batches
- Export results frequently for large batches

**Performance:**
- Optimal batch size: 100-500 rows
- Split large files into multiple batches
- Run batches during off-peak hours (avoid API rate limits)
- Monitor API response times for degradation

**Data validation:**
- Use Step 3 to review data before generating JSON
- Validate CSV data externally before importing
- Test endpoint with single execution first
- Review column mapping carefully
- Check variable types match API expectations

## Related Topics

- [Endpoints](endpoints) — Template variables and configuration
- [Template Variables](template-variables) — Variable syntax, types, modifiers, and editing
- [Console](console) — Running and monitoring requests
- [Import/Export](import-export) — Sharing endpoint configurations
