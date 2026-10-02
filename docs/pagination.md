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
2. In the Console footer, click **Pagination**. On its **Settings** tab, Dobermann reads the response and proposes the settings — review and **Save**
3. On the **Execute** tab, choose **Fetch all pages** or **Get next N pages** and click **Run**

That's it. Dobermann handles page iteration, total page calculation, and concurrent fetching. Pages stream into the Console as they land, and the Completed tab shows them as one table.

---

## Setting Up Pagination

### The Pagination window

After a single run, the Console footer offers two buttons: **Next Page**, which fetches one more page, and **Pagination**, which opens a window with two tabs — **Settings** and **Execute**.

### Settings Tab

The Settings tab has two sections:

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

You don't need to type these manually — the Settings tab handles it. But if you prefer, you can also edit them directly in the endpoint's query parameters, or paste an endpoint that already carries them.

---

## Pagination in the Request Body

Some APIs — typically POST searches — page through values in the **request body** rather than query parameters, for example:

```jsonc
{
    "Query": "Status = 'active'",
    "Page": "{{A8:PAGE:0:header.totalCount}}",
    "Size": "{{A8:SIZE:20}}"
}
```

Dobermann drives pagination from the body using the **same `{{A8:PAGE}}` and `{{A8:SIZE}}` templates** — just place them in the body instead of (or as well as) query parameters. Everything else works the same: first page on Run, then **Fetch all pages** or **Get next N pages**, with total pages calculated from the response.

**Setting it up:**

1. In the body editor, type `{{A8:` and pick **PAGE** (inserts `{{A8:PAGE:0}}`) and **SIZE** (inserts `{{A8:SIZE:20}}`). Both are recognised as valid templates with hover help. This alone enables **Next Page**.
2. Run the endpoint, then open **Pagination** in the Console. It detects that pagination lives in the body — the key fields show as **read-only "Body field"** and a note explains it. Pick the **Total record count** path and Save; Dobermann writes it back into the body template (`{{A8:PAGE:0}}` → `{{A8:PAGE:0:header.totalCount}}`), which enables **Fetch all pages**.

**Notes:**

- Page/size templates should sit at the **top level** of the body as quoted string values (e.g. `"Page": "{{A8:PAGE:0}}"`).
- If both query params and the body contain pagination templates, the **query parameter** takes precedence — keep pagination in one place.
- Body pagination is for endpoints whose only variables are the pagination pair. If the body also contains data-driven `{{variables}}` (a CSV-driven batch), use query-parameter pagination instead.

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
- **Total count path** — Dot-notation path to the total record count in the API response. Used to calculate total pages and show "Page X of Y"

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

Once pagination is configured and you've run the first page, the **Execute** tab of the Pagination window shows the current page, page size, total records and total pages, and two choices.

### Fetch all pages

Fetches every remaining page. Dobermann calculates the total from the `totalCount` and `pageSize` values extracted from your first response.

**How it works:**
1. First page executes and returns response metadata
2. Dobermann extracts total count and page size from the response
3. Calculates remaining pages
4. Creates and executes all remaining pages concurrently

### Get next N pages

Fetch a specific number of additional pages. Enter the count (e.g., 50) and Dobermann fetches the next 50 pages from where you left off. Use it when the total can't be worked out, or when you only want a sample.

### Next Page

The **Next Page** button in the Console footer fetches one more page without opening the window.

### Concurrency

Pages are fetched several at a time, within the environment's **Max Concurrency** (see [Environments — Parallel Processing](/docs/environments/#parallel-processing)). Higher concurrency means faster completion, but more load on the target API.

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

The Execute tab shows these as **Total records** and **Total pages**.

If either value can't be determined, **Fetch all pages** isn't offered — use **Get next N pages** instead.

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
3. Click **Pagination**, choose **Fetch all pages**, click **Run** — Dobermann creates pages 1-204 and runs them concurrently
4. Results stream into the Console as each page completes; the Completed tab is one table across every page
5. Export all 20,480 records to Excel or CSV when done

---

## Troubleshooting

### "Fetch all pages" Not Available

The total count or page size couldn't be extracted from the response. Check:
- The **total count field** path matches your API's response structure
- The response actually contains a numeric value at that path
- Page size is configured (either via `{{A8:SIZE}}` or found in the response)

Use **Get next N pages** as an alternative — it doesn't require total count.

### Only First Page Fetched

Check that:
- Pagination settings are saved (not just opened)
- The `{{A8:PAGE}}` template is in your endpoint's query parameters
- The first page returned a success response. If it failed, reprocessing it won't then fetch the rest — run **Fetch all pages** again once it succeeds

### Some Pages Failed
{: #reprocess-pages }

Click **Reprocess** at the bottom of the Console and choose **Errors only**. Just the failed pages run again, each with its own page number — nothing else is fetched. **Split array errors** isn't offered for a paginated batch. See [Batch Reprocessing](/docs/batch-reprocessing/).

### Wrong Page Numbers

Check the **start value** setting:
- APIs using `page=0` for the first page need start value **0**
- APIs using `page=1` for the first page need start value **1**

Dobermann tries to auto-detect this from the response, but you can override it in the settings.

### Rows missing or doubled across pages

If the API doesn't order records stably, two pages can overlap. Ask for a sort parameter the API honours (`?sort=created_at`) so every page is cut from the same ordering.

---

## Related Topics

- [Console](/docs/console/) — Monitoring execution and analysing results
- [Endpoints — Query Parameters](/docs/endpoints/#query-parameters) — Where pagination variables are configured
- [Template Variables](/docs/template-variables/) — Full variable syntax reference
- [Environments — Parallel Processing](/docs/environments/#parallel-processing) — Environment-level concurrency settings
