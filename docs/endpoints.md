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

Click the **+** icon on the Endpoints tree panel. You get a blank configuration with all sections ready to fill in.

### Organising with Folders

Create folders to group endpoints by feature, service, or project. Right-click the tree view or a folder to create sub-folders. Drag and drop endpoints between folders to reorganise.

### Quick Access (Alt+D E)

Skip the tree entirely. Press **Alt+D E** (chord shortcut — press Alt+D, release, then press E) to open fuzzy search across all endpoints. Type a few characters to filter by name, method, path, or folder, then choose your action:

- **Run** — Smart execution. Dobermann auto-detects whether to run a single API call or open the batch runner based on template variables
- **Edit Endpoint** — Open the configuration editor

Fully keyboard-driven. No mouse required.

### Deleting Endpoints

Right-click an endpoint and select **Delete Endpoint**. Dobermann shows the number of associated transactions before deletion so you don't accidentally lose history.

---

## Endpoint Configuration

### Basic Settings

| Field | Description |
|-------|-------------|
| **Endpoint Name** | Appears in the tree view — make it descriptive |
| **HTTP Method** | GET, POST, PUT, PATCH, or DELETE |
| **Endpoint Path** | URL path starting with `/` — combined with your environment's base URL at execution time |
| **Description** | Optional context, visible on hover in the tree |

---

## URL Path
{: #url-path }

The URL path is appended to your environment's base URL when running requests. Template variables are fully supported for dynamic paths.

**Examples:**
- `/api/orders/{{orderId}}/status`
- `/api/users/{{userId:number}}/profile`
- `/api/products/{{category}}/{{productId}}/details`

A link icon appears in the URL field when template variables are detected.

For full variable syntax, types, and modifiers, see [Template Variables](/docs/template-variables/).

---

## Headers
{: #headers }

HTTP headers define metadata for your requests — content type, authentication tokens, custom identifiers.

### Custom Headers

Add headers as key-value pairs. Each header has:
- **Enable/Disable toggle** — disabled headers are greyed out and excluded from requests
- **Template variable support** — use variables in header values
- A link icon appears when a header contains template variables

**Examples:**
- `Authorization`: `Bearer {{authToken:string}}`
- `X-User-ID`: `{{userId:number}}`
- `X-Request-ID`: `REQ-{{requestId}}`

### Environment-Level Headers

Toggle **Include environment-level headers** to inherit headers from your active environment. Inherited headers appear as read-only rows — useful for organisation headers, content-type defaults, or auth tokens that apply across all endpoints.

---

## Query Parameters
{: #query-parameters }

Key-value pairs appended to the URL. Each parameter supports enable/disable toggling and template variables.

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

{: .warning }
> Do not edit these values directly. Use the **Configure Pagination** screen in the Console instead — it auto-detects settings from your API response and writes the correct templates for you.

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

Dobermann automatically splits into multiple requests if URL length or value count limits are exceeded.

---

## Request Body
{: #request-body }

The JSON payload sent to your API. Dobermann provides a full-featured editor with syntax highlighting, autocomplete, and a toolbar for rapid template authoring.

- **Always shown** for POST, PUT, PATCH methods
- **Hidden by default** for GET and DELETE (shown if body has content or you explicitly add it)

Use [Template Variables](/docs/template-variables/) to map your spreadsheet columns to API fields — with type validation, data transformation, and conditional logic built right in.

### Editor Toolbar

The toolbar above the editor provides quick access to template authoring features:

| Button | Shortcut | What it does |
|--------|----------|------------|
| **Line Variable** | Ctrl+M | Cycle a JSON line through 4 states: regular value → Input variable → ENV variable → A8 variable → restore original |
| **Insert Var** | Ctrl+Shift+M | Toggle `{{}}` brackets at cursor position |
| **Modifier** | — | Add type-aware modifiers (shows different options for string, number, date, etc.) |
| **Encode** | — | Toggle BASE64 encoding on a key (`"key"` → `"key:BASE64"`) |
| **Comment** | Ctrl+/ | Toggle line comments (supports multi-line selection) |
| **Delete Line** | Ctrl+D | Delete current line(s) |
| **Undo / Redo** | Ctrl+Z / Ctrl+Shift+Z | Standard undo/redo |
| **Format JSON** | — | Pretty-print the JSON body |

The editor also provides **intelligent autocomplete** as you type inside template variables — suggesting variable types, modifiers, and environment variables. See [Template Variables](/docs/template-variables/) for the full editing experience.

---

## Share, Paste & Duplicate
{: #sharing }

### Share Button — Copy Endpoint to Clipboard

The **Share** button is one of Dobermann's killer features. One click copies your entire endpoint configuration to the clipboard in **two formats simultaneously**:

1. **Rich HTML** — renders beautifully when pasted into Microsoft Teams, Outlook, Confluence, and any rich-text editor
2. **Plain text (JSONC)** — structured comments with metadata, headers, params, and the full body

**What gets copied (plain text format):**

```javascript
// Name: Create Order
// Method: POST
// Path: /api/orders
// Description: Create a new order
// Header: Authorization: Bearer {{ENV:API_TOKEN}} [enabled]
// Header: Content-Type: application/json [enabled]
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

**How it looks in Teams / Outlook:**

A styled header bar reading **DBMN Endpoint**, followed by a formatted code block with your full endpoint configuration, and a footer link back to dbmn.io. Your colleagues see the endpoint exactly as configured — method, path, headers, body, and all.

**How it looks in Confluence:**

The same styled block renders as a clean code section — paste it straight into a wiki page and your team can see exactly what the endpoint does. No reformatting needed.

**Why this matters:**

- Stop copying JSON snippets into Slack and hoping people understand the context
- New team members can see the exact request shape with variable types and modifiers
- Shared endpoints become living documentation that stays in sync with your actual configuration

### Paste Button — Create from Shared

Got a shared endpoint from a colleague? Click **Paste** on a new endpoint (or create a new endpoint first). Dobermann reads the clipboard, parses the JSONC metadata, and populates:

- Endpoint name, method, path, and description
- All headers (with enabled/disabled state preserved)
- All query parameters
- The complete request body

If the shared endpoint includes headers you don't have yet, Dobermann shows a confirmation modal asking whether to add them.

The Paste button only appears on new, unsaved endpoints.

### Duplicate Endpoint

Click **More Actions** → **Duplicate** to create a copy of any saved endpoint. The duplicate gets a "COPY " prefix and opens as a new unsaved endpoint — modify and save to create your variation.

Perfect for creating endpoint variants (e.g., "Create Order" → "Create Order (Bulk)") without starting from scratch.

---

## Test Scripts

{: .note }
> Test scripts are under development and will be documented here when available. Stay tuned.

---

## All Buttons Reference

### Footer Buttons (Always Visible)

| Button | Description |
|--------|-------------|
| **Save Endpoint** (Ctrl+S) | Save current configuration. Validates name, path, and JSON syntax first |
| **Run API** / **Run Batch** | Smart single button. Shows "Run API" when no template variables exist (direct execution), or "Run Batch" when template variables are present (opens batch runner). Disabled when unsaved changes exist |

### Add Section (+) Dropdown

| Option | Description |
|--------|-------------|
| **Request Body** | Show the body editor |
| **Add Header** | Add a new custom header row |
| **Add Query Parameter** | Add a new query parameter row |

### Context-Dependent Buttons

| Button | When Visible | Description |
|--------|-------------|-------------|
| **Paste** | New endpoints only | Parse shared endpoint data from clipboard |
| **Share** | Saved endpoints only | Copy endpoint to clipboard (rich + plain text) |
| **More Actions → Download Template** | Saved endpoints with template variables | Download an Excel template with column headers from `{{variables}}`, correct data types, a sample row, and 100 pre-formatted empty rows |
| **More Actions → Duplicate** | Saved endpoints only | Create a copy with "COPY " prefix |
| **More Actions → Delete** | Saved endpoints only | Delete endpoint (shows transaction count warning) |

---

## Related Topics

- [Template Variables](/docs/template-variables/) — Full variable syntax, types, modifiers, and editing features
- [Environments](/docs/environments/) — Manage API connections and authentication
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Import/Export](/docs/import-export/) — Share configurations with your team
- [Keyboard Shortcuts](/docs/shortcuts/) — All keyboard shortcuts including editor shortcuts
