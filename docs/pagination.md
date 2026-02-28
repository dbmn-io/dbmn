---
title: Pagination
layout: default
nav_order: 1
parent: Console
grand_parent: Documentation
---

# Pagination

Dobermann makes it easy to work with paginated APIs. Run a single request, configure pagination from the response, then fetch all remaining pages — with concurrent execution and automatic page management.

---

## Quick Start

1. **Run any GET or POST** endpoint that returns paginated data
2. In the Console, click **Configure Pagination** on the Execute tab
3. Dobermann auto-detects your settings from the response — review and save
4. Choose **Fetch All** or **Get Next X Pages** and hit Run

That's it. Dobermann handles page iteration, total page calculation, and concurrent fetching.

---

## Setting Up Pagination

### From a New Endpoint

When you run an individual request against a paginated API, the Console's Execute tab shows a **Configure Pagination** button. Click it to open the pagination settings.

### Settings Tab

The settings dialog has three sections:

#### Page Parameter

| Field | Description |
|-------|-------------|
| **Query param key** | The parameter name for the page number (e.g., `page`). Auto-populated from your endpoint's query parameters |
| **Start value** | Whether your API uses 0-based or 1-based pagination. Auto-detected from the response if possible |
| **Total count field** | JSON path in the response that contains the total record count (e.g., `header.totalCount`). Dropdown is populated from numeric fields found in your response |

#### Size Parameter (Optional)

| Field | Description |
|-------|-------------|
| **Query param key** | The parameter name for page size (e.g., `size`, `limit`). Auto-populated from your endpoint's query parameters |
| **Value** | Number of records per page (e.g., `100`) |
| **Response size field** | JSON path in the response that contains the page size value (e.g., `header.pageSize`). Selecting a field from the dropdown auto-populates the Value |

#### What Gets Saved

When you save, Dobermann writes template variables into your endpoint's query parameters:

| Parameter | Template | Example |
|-----------|----------|---------|
| Page | `{{A8:PAGE:start:totalCountPath}}` | `{{A8:PAGE:0:header.totalCount}}` |
| Size | `{{A8:SIZE:value:sizePath}}` | `{{A8:SIZE:100:header.pageSize}}` |

You don't need to type these manually — the settings dialog handles it. But if you prefer, you can also edit them directly in the endpoint's query parameters.

---

## Template Variable Reference

### {{A8:PAGE}}

Controls page iteration. Supports several formats:

| Format | Example | Description |
|--------|---------|-------------|
| `{{A8:PAGE}}` | — | 0-based pagination, no total count |
| `{{A8:PAGE:1}}` | — | 1-based pagination, no total count |
| `{{A8:PAGE:0:path}}` | `{{A8:PAGE:0:header.totalCount}}` | 0-based with total count for auto-calculation |

- **Start value** — `0` or `1`, determines the first page number
- **Total count path** — Dot-notation path to the total record count in the API response. Used to calculate total pages and show "Page X of Y" in the UI

### {{A8:SIZE}}

Declares the page size so Dobermann can calculate total pages.

| Format | Example | Description |
|--------|---------|-------------|
| `{{A8:SIZE:100}}` | — | Fixed page size of 100 |
| `{{A8:SIZE:100:path}}` | `{{A8:SIZE:100:header.pageSize}}` | Page size of 100, also reads size from response |

- **Value** — The number of records per page
- **Size path** (optional) — Dot-notation path to the page size field in the API response. Used as a fallback if the query parameter value can't be determined

---

## Fetching Pages

Once pagination is configured and you've run the first page, the Execute tab shows your fetch options.

### Fetch All

Fetches every remaining page. Dobermann calculates the total from the `totalCount` and `pageSize` values extracted from your first response.

**How it works:**
1. First page executes and returns response metadata
2. Dobermann extracts total count and page size from the response
3. Calculates remaining pages
4. Creates and executes all remaining pages concurrently (default 4 threads)

### Get Next X Pages

Fetch a specific number of additional pages. Enter the count (e.g., 50) and Dobermann fetches the next 50 pages from where you left off.

### Concurrency

When fetching multiple pages:

- **Auto-triggered** (Fetch All / Get Next X from first run) — defaults to 4 concurrent threads
- **Manual** (clicking Get Pages on an existing batch) — prompts you to choose: 1 (sequential), 2, 4, or 8 threads

Higher concurrency means faster completion, but more load on the target API. Start with 4 and adjust based on your API's rate limits.

---

## Execute-as-you-Create

Dobermann doesn't wait for all pages to be created before starting execution. The pattern is:

1. First page is created and execution starts immediately
2. Remaining pages are bulk-created in the background
3. The execution engine picks up new pages as they're created

This means you see results streaming in within seconds, even when fetching hundreds of pages.

---

## Page Size Changes

If you change the page size after already running pages (e.g., from 100 to 200), Dobermann automatically cleans up the existing batch — cancels any running execution, deletes the old pages, and starts fresh. A notification confirms the cleanup.

---

## How Total Pages Are Calculated

Dobermann calculates total pages from two values extracted from the API response:

```
totalPages = ceil(totalCount / pageSize)
```

- **totalCount** — Read from the path you specified (e.g., `header.totalCount`)
- **pageSize** — Read from the `{{A8:SIZE}}` value, or extracted from the response using the size path

The Console shows this as **"Page X of Y"** with the count of remaining pages.

If either value can't be determined, the "Fetch All" option won't be available — use "Get Next X Pages" instead.

---

## Example: Paginated API

A typical paginated endpoint:

**Query Parameters:**

| Key | Value |
|-----|-------|
| `page` | `{{A8:PAGE:0:header.totalCount}}` |
| `size` | `{{A8:SIZE:100:header.pageSize}}` |

**Response structure:**
```json
{
    "header": {
        "totalCount": 20480,
        "pageSize": 100,
        "currentPage": 0
    },
    "results": [
        { "itemId": "SKU001", "description": "..." },
        { "itemId": "SKU002", "description": "..." }
    ]
}
```

**Workflow:**
1. Run the endpoint — fetches page 0 with `?page=0&size=100`
2. Response shows `totalCount=20480`, `pageSize=100` — so 205 total pages
3. Click **Fetch All** — Dobermann creates pages 1-204 and runs them 4 at a time
4. Results stream into the Console as each page completes
5. Export all 20,480 records to Excel or CSV when done

---

## Troubleshooting

### "Fetch All" Not Available

The total count or page size couldn't be extracted from the response. Check:
- The **total count field** path matches your API's response structure
- The response actually contains a numeric value at that path
- Page size is configured (either via `{{A8:SIZE}}` or found in the response)

Use **Get Next X Pages** as an alternative — it doesn't require total count.

### Only First Page Fetched

Check that:
- Pagination settings are saved (not just opened)
- The `{{A8:PAGE}}` template is in your endpoint's query parameters
- The first page returned a success response (auto-fetch only triggers on success)

### Wrong Page Numbers

Check the **start value** setting:
- APIs using `page=0` for the first page need start value **0**
- APIs using `page=1` for the first page need start value **1**

Dobermann tries to auto-detect this from the response, but you can override it in the settings.

---

## Related Topics

- [Console](../console) — Monitoring execution and analysing results
- [Endpoints — Query Parameters](../endpoints#query-parameters) — Where pagination variables are configured
- [Template Variables](../template-variables) — Full variable syntax reference
- [Environments — Parallel Processing](../environments#parallel-processing) — Environment-level concurrency settings
