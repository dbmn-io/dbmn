---
title: Endpoints
layout: default
nav_order: 3
parent: Documentation
has_children: true
---

# Endpoints

Endpoints are complete API request configurations — everything Dobermann needs to talk to your API. Each endpoint defines the HTTP method, URL path, headers, query parameters, and a request body template. Configure once, then run individually or in batches with thousands of rows.

## Managing Endpoints

### Creating an Endpoint

In the Hub, open {icon:nav-api-catalogue} **API Catalogue** and click {icon:add-endpoint} **Add Endpoint**. A blank editor opens in a new tab, with a **Paste Endpoint** button at the top for the times a teammate has sent you one — see [Sharing Endpoints](/docs/sharing-endpoints/). The {icon:paste-endpoint} clipboard button beside **Add Endpoint** does the paste in one step.

### Finding Endpoints

The catalogue groups endpoints for you — by the path they share, by System, or by method (**Settings → API Catalogue → Group by**). Type in **Search across everything…** to filter by name, method, path, description or tag, or use {icon:filters} **Filters** for System, Method and Tags. See [The Hub — API Catalogue](/docs/hub/#api-catalogue).

### Recent
{: #recent }

**Recent**, at the top of the catalogue, pins the five endpoints you last saved or ran, so the ones you are working on today are one click away whatever group they live in. Opening an endpoint to look at it does not move it. Collapse it with its chevron, or turn it off under **Settings → API Catalogue → Recent**. Searching, or filtering by method or tag, hides it: when you are looking for something specific, Recent is just noise.

### Tags
{: #tags }

Endpoints carry **tags** rather than living in folders. Type them into the **Tags** field in the editor — `orders`, `migration-q3`, `legacy` — and filter the catalogue by them. **Manage Tags…** in Settings renames, merges or deletes a tag across every endpoint. Tags travel with the endpoint when you share or export it.

### Deleting an Endpoint

Open the endpoint and click **Delete** in the footer; click it again to confirm. To act on several at once, turn on **Select** in the catalogue.

---

## Endpoint Configuration

### Endpoint Details

| Field | Description |
|-------|-------------|
| **Endpoint Name** | Appears in the catalogue — make it descriptive |
| **Method** | GET, POST, PUT, PATCH, or DELETE |
| **Path** | URL path starting with `/` — combined with the active environment's base URL at execution time |
| **Description** | Optional context. Searchable from the catalogue |
| **Tags** | Free-form labels for filtering |
| **System** | Which API this endpoint belongs to. A new endpoint inherits the active environment's System. See [The Hub — Systems](/docs/hub/#systems) |

---

## URL Path
{: #url-path }

The path is appended to the active environment's base URL when running requests. Template variables are fully supported for dynamic paths.

**Examples:**
- `/api/orders/{{orderId}}/status`
- `/api/users/{{userId:number}}/profile`
- `/api/products/{{category}}/{{productId}}/details`

A link icon appears in the path field when template variables are detected.

For full variable syntax, types, and modifiers, see [Template Variables](/docs/template-variables/).

---

## Headers
{: #headers }

HTTP headers define metadata for your requests — content type, authentication tokens, custom identifiers.

### Custom Headers

Click **+** in the Headers section, or **Add → Header** in the footer, to insert a key-value row. Each header has:

- **A checkbox** — untick to leave the header out of requests without deleting it; it stays greyed out on the endpoint so you can turn it back on
- **Template variable support** — use variables in header values; a link icon appears next to any header that contains one
- **Remove** — deletes the row

**Examples:**
- `Authorization`: `Bearer {{authToken:string}}`
- `X-User-ID`: `{{userId:number}}`
- `X-Request-ID`: `REQ-{{requestId}}`

### Environment-Level Headers

**Include environment-level headers** is ticked by default: the active environment's headers go out with every request. Put headers that apply across all endpoints — organisation headers, content-type defaults, API keys — on the environment once, and leave this on. See [Environments — Headers](/docs/environments/#headers).

---

## Query Parameters
{: #query-parameters }

Click **+** in the Query Parameters section, or **Add → Query Parameter** in the footer, to add a row. Each parameter is a key-value pair appended to the URL, with the same checkbox and template-variable support as headers.

**Examples:**
- `itemId`: `PRE-{{sku}}`
- `limit`: `{{maxResults:number}}`
- `includeActive`: `{{isActive:boolean}}`

### Pagination

Dobermann uses two special template variables for paginated APIs:

| Variable | Format | Example |
|----------|--------|---------|
| `{{A8:PAGE}}` | `{{A8:PAGE:start:totalCountPath}}` | `{{A8:PAGE:0:header.totalCount}}` |
| `{{A8:SIZE}}` | `{{A8:SIZE:value:sizePath}}` | `{{A8:SIZE:100:header.pageSize}}` |

- **A8:PAGE** — The page number. `start` is `0` or `1` (first page number). `totalCountPath` is the JSON path to the total record count in the response.
- **A8:SIZE** — The page size. `value` is the number of records per page. `sizePath` is the JSON path to the page size in the response.

{: .note }
> You rarely need to type these. Run the endpoint once, then click **Pagination** in the Console footer — its **Settings** tab reads a real response and writes the right templates onto the endpoint for you.

See the [Pagination guide](/docs/pagination/) for the complete setup and execution workflow.

### Query Parameter Repetition

Combine multiple source data values into a single GET request — useful for APIs that accept filter lists.

**Syntax:** `pattern[ separator ]`

| Pattern | Result |
|---------|--------|
| `ItemId={{ITEM}}[ or ]` | `ItemId=val1 or ItemId=val2 or ItemId=val3` |
| `ItemId={{ITEM}}[&]` | `ItemId=val1&ItemId=val2&ItemId=val3` |
| `status={{STATUS}}[,]` | `status=active,status=pending` |

- Pattern comes before the brackets
- Separator goes inside `[]` — spaces are preserved (`[ or ]` vs `[or]`)
- Empty brackets `[]` default to `&`

In Run Batch, **Values per URL** on the Review step decides how many values go into each URL; **Auto** fits as many as the URL length allows. See [Batch Preparation](/docs/batch-preparation/#step-4-review-json).

---

## Request Body
{: #request-body }

The JSON payload sent to your API. Dobermann provides a full-featured editor with syntax highlighting, autocomplete, and a toolbar for rapid template authoring. In a long body, the objects and arrays around the lines you're reading stay pinned at the top of the editor, up to five levels.

The body editor is shown automatically for POST, PUT, and PATCH. For GET and DELETE it's hidden — click **Add → Request Body** in the footer if you need one, and a banner reminds you that a body is not sent for those methods.

Use [Template Variables](/docs/template-variables/) to map your spreadsheet columns to API fields — with type validation, data transformation, and conditional logic built right in.

### Editor Toolbar

The toolbar above the editor provides quick access to template authoring features:

| Button | Shortcut | What it does |
|--------|----------|------------|
| {icon:editor-line-variable} **Line Variable** | Ctrl+M | Cycle a JSON line through 4 states: regular value → **Input** variable → **Environment** variable → **Generated (A8)** variable → restore original. The dropdown jumps straight to one |
| {icon:editor-insert-var} **Insert Var** | Ctrl+Shift+M | Toggle `{{}}` brackets at the cursor |
| {icon:editor-modifier} **Modifier** | — | Add a type-aware modifier to the variable under the cursor (different options for string, number, date) |
| {icon:editor-encode} **Encode** | — | Toggle BASE64 encoding on a key (`"key"` → `"key:BASE64"`) |
| {icon:editor-comment} **Comment** | Ctrl+/ | Toggle line comments (supports multi-line selection) |
| {icon:editor-delete-line} **Delete** | Ctrl+D | Delete the current line. On a line that opens an object or array, deletes the whole block and tidies the comma |
| {icon:editor-undo} **Undo** / {icon:editor-redo} **Redo** | Ctrl+Z / Ctrl+Shift+Z | Standard undo/redo |
| {icon:editor-format} **Format** | — | Pretty-print the JSON body. Comments stay on their lines |

On a Mac, Cmd stands in for Ctrl. The {icon:window-maximise} icon inside the editor makes it full-window; **Esc** brings it back.

The editor also provides **intelligent autocomplete** as you type inside template variables — suggesting variable types, modifiers, and environment variables. See [Template Variables](/docs/template-variables/) for the full editing experience.

---

## Save & Run
{: #save-run }

**Save Endpoint** (Ctrl+S) commits your changes. Dobermann validates the endpoint name, path, and JSON body syntax first — anything wrong is flagged inline so you can fix it before saving.

Once saved, the footer offers two ways to run it. In the API Catalogue the same two actions are the {icon:run-api} and {icon:run-batch} icons on the endpoint's row.

- **Run API** sends one request. If the endpoint has template variables it asks for their values first. See [Run API](/docs/run-api/).
- **Run Batch** appears once the endpoint has `{{template variables}}` and drives it from a file. See [Batch Preparation](/docs/batch-preparation/).

Both are disabled while there are unsaved changes — save first, so what runs is what you're looking at.

---

## Share, Paste & Duplicate
{: #sharing }

### Copy to Share

**Copy to Share** copies the saved endpoint to the clipboard in **two formats at once**:

1. **Rich HTML** — renders as a styled block in Microsoft Teams, Outlook, Confluence, and any rich-text editor
2. **Plain text (JSONC)** — structured comments with the metadata, headers, parameters, and the full body

**What gets copied (plain text format):**

```javascript
// Name: Create Order
// Method: POST
// Path: /api/orders
// Description: Create a new order
// Tags: orders, migration-q3
// Header: Authorization: Bearer {{ENV:API_TOKEN}} [enabled]
// Header: X-Debug: true [disabled]
// QueryParam: sendEmail: true [enabled]

{
  "customerId": "{{customerId:string}}",
  "items": [
    {
      "sku": "{{sku:string|upper}}",
      "quantity": "{{quantity:number|int}}"
    }
  ],
  "orderDate": "{{createdDate:date|+1d}}"
}
```

Only the endpoint's own headers are copied; headers inherited from the environment stay on the environment.

**How it looks in Teams / Outlook:**

A styled header bar reading **DBMN Endpoint**, followed by a formatted code block with your full endpoint configuration, and a footer link back to dbmn.io. Your colleagues see the endpoint exactly as configured — method, path, headers, body, and all.

**How it looks in Confluence:**

The same styled block renders as a clean code section — paste it straight into a wiki page and your team can see exactly what the endpoint does. No reformatting needed.

**Why this matters:**

- Stop copying JSON snippets into Slack and hoping people understand the context
- New team members can see the exact request shape with variable types and modifiers
- Shared endpoints become living documentation that stays in sync with your actual configuration

### Paste — Create from Shared

Got a shared endpoint from a colleague? Three ways in, all the same result:

- {icon:paste-endpoint} **New Endpoint from Clipboard** in the API Catalogue
- **Paste Endpoint** at the top of a new, unsaved endpoint
- **Ctrl+V** anywhere on a new, unsaved endpoint

Dobermann reads the clipboard, parses the JSONC metadata, and fills in the name, method, path, description, tags, headers (with their enabled state), query parameters and the complete request body. Review, then **Save Endpoint**.

The paste buttons only appear on new, unsaved endpoints.

### Duplicate

Click **Duplicate** in the footer of a saved endpoint. The copy opens as a new unsaved endpoint with the same configuration and the same saved Console views — rename it, change what you need, and save.

Perfect for creating endpoint variants (e.g., "Create Order" → "Create Order (Bulk)") without starting from scratch.

### Download Template
{: #download-template }

Click **Download Template** on a saved endpoint with `{{template variables}}` and Dobermann writes a ready-to-fill `.xlsx`. Column headers come from your variables, the sample row shows a value of the right type for each (`123`, `TRUE`, `2026-01-15`), date format modifiers carry across, and the sheet is an Excel Table with autofilter.

Hand it to the data owner, get it back filled in, drop it onto Run Batch — the columns map themselves.

---

## Footer

Buttons that don't fit the width move into **More**, which only appears when it has something in it. **Add**, **Save Endpoint**, **Run API** and **Run Batch** never move.

---

## Related Topics

- [Template Variables](/docs/template-variables/) — Full variable syntax, types, modifiers, and editing features
- [Sharing Endpoints](/docs/sharing-endpoints/) — Copy to Share, step by step
- [Environments](/docs/environments/) — Manage API connections and authentication
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Import/Export](/docs/import-export/) — Move configurations between machines
- [Keyboard Shortcuts](/docs/shortcuts/) — All keyboard shortcuts including editor shortcuts
