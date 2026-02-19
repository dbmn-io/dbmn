---
title: Sharing Endpoints
layout: default
nav_order: 2
parent: Endpoints
grand_parent: Documentation
---

# Sharing Endpoints
{: #sharing-endpoints }

Share any endpoint with your team in seconds. The recipient gets the full configuration — method, path, headers, body, variables — ready to paste and use.

---

<!-- VIDEO PLACEHOLDER: Replace the div below with your embed once recorded -->
<!-- YouTube:  <iframe width="100%" height="400" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe> -->
<!-- Loom:     <div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.loom.com/embed/VIDEO_ID" frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div> -->

---

## How It Works

### Step 1 — Share

The sender opens an existing endpoint and clicks **Share**.

Dobermann copies the endpoint to the clipboard in two formats simultaneously:

| Format | Where it renders |
|--------|-----------------|
| **Rich HTML** | Teams, Outlook, Confluence, Gmail |
| **Plain text (JSONC)** | Slack, Notepad, any text editor |

Paste it wherever your team communicates. The recipient sees the full endpoint configuration — styled and readable.

### Step 2 — Create a New Endpoint

The recipient opens Dobermann and creates a **new endpoint** (the Paste button only appears on unsaved endpoints).

### Step 3 — Paste

Click **Paste**. Dobermann reads the clipboard, parses the JSONC metadata, and populates everything:

- Endpoint name, HTTP method, and path
- Description
- All headers (with enabled/disabled state preserved)
- All query parameters
- The complete request body with template variables

If the shared endpoint includes headers the recipient doesn't have, a confirmation modal appears asking whether to add them.

### Step 4 — Save and Run

Review the imported configuration, adjust anything if needed, and save. The endpoint is ready to use.

---

## What Gets Shared

When you click Share, the clipboard contains structured JSONC like this:

```javascript
// Name: Create Order
// Method: POST
// Path: /api/orders
// Description: Create a new order
// Header: Authorization: Bearer {%raw%}{{ENV:API_TOKEN}}{%endraw%} [enabled]
// Header: Content-Type: application/json [enabled]
// QueryParam: sendEmail: true [enabled]

{
  "customerId": "{%raw%}{{customerId:string}}{%endraw%}",
  "items": [
    {
      "sku": "{%raw%}{{sku:string|upper}}{%endraw%}",
      "quantity": "{%raw%}{{quantity:number|int}}{%endraw%}"
    }
  ]
}
```

Everything is preserved — variable types, modifiers, header state, query parameters. The recipient gets the exact same endpoint.

---

## Tips

- **Share before onboarding** — Send endpoints to new team members so they can start immediately
- **Paste into wikis** — The rich HTML format looks great in Confluence and Notion
- **Version your endpoints** — Share updated configurations when API contracts change
- **Combine with environments** — The shared endpoint uses environment variables (`ENV:API_TOKEN`), so each team member resolves them against their own environment

---

## See Also

- [Endpoints](../endpoints) — Full endpoint configuration reference
- [Template Variables](../template-variables) — Variable syntax, types, and modifiers
- [Import/Export](../import-export) — Bulk workspace and endpoint import/export
