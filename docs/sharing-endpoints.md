---
title: Sharing Endpoints
layout: default
nav_order: 2
parent: Endpoints
grand_parent: Documentation
---

# Sharing Endpoints
{: #sharing-endpoints }

Share any endpoint with your team in seconds. The recipient gets the full configuration — method, path, headers, body, variables, tags — ready to paste and use.

---

## How It Works

### Step 1 — Copy to Share

The sender opens a saved endpoint and clicks **Copy to Share** in the footer.

Dobermann copies the endpoint to the clipboard in two formats simultaneously:

| Format | Where it renders |
|--------|-----------------|
| **Rich HTML** | Teams, Outlook, Confluence, Gmail |
| **Plain text (JSONC)** | Slack, Notepad, any text editor |

Paste it wherever your team communicates. The recipient sees the full endpoint configuration — styled and readable.

### Step 2 — Paste

The recipient copies the shared text, opens Dobermann, and in {icon:nav-api-catalogue} **API Catalogue** clicks {icon:paste-endpoint} **New Endpoint from Clipboard**. A new endpoint opens with everything filled in:

- Endpoint name, HTTP method, and path
- Description and tags
- All headers (with enabled/disabled state preserved)
- All query parameters
- The complete request body with template variables

**Paste Endpoint** at the top of a new, unsaved endpoint does the same, and so does **Ctrl+V** anywhere on one.

### Step 3 — Save and Run

Review the configuration, adjust anything if needed, and **Save Endpoint**. The endpoint is ready to use against whichever environment the recipient has active.

---

## What Gets Shared

When you click Copy to Share, the clipboard contains structured JSONC like this:

```javascript
// Name: Create Order
// Method: POST
// Path: /api/orders
// Description: Create a new order
// Tags: orders, onboarding
// Header: Authorization: Bearer {{ENV:API_TOKEN}} [enabled]
// Header: Content-Type: application/json [enabled]
// QueryParam: sendEmail: true [enabled]

{
  "customerId": "{{customerId:string}}",
  "items": [
    {
      "sku": "{{sku:string|upper}}",
      "quantity": "{{quantity:number|int}}"
    }
  ]
}
```

Everything is preserved — variable types, modifiers, header state, query parameters, tags. The recipient gets the exact same endpoint. Headers the endpoint inherits from its environment are not copied; they stay on the environment, where the recipient has their own.

Any `// Key:` line the parser doesn't know is ignored, so notes you add above the body do no harm.

---

## Tips

- **Share before onboarding** — Send endpoints to new team members so they can start immediately
- **Paste into wikis** — The rich HTML format looks great in Confluence and Notion
- **Version your endpoints** — Share updated configurations when API contracts change
- **Combine with environments** — The shared endpoint uses environment variables (`ENV:API_TOKEN`), so each team member resolves them against their own environment
- **Several at once** — For a whole set of endpoints with their environments and Console views, use [Export](/docs/import-export/) instead

---

## See Also

- [Endpoints](/docs/endpoints/) — Full endpoint configuration reference
- [Template Variables](/docs/template-variables/) — Variable syntax, types, and modifiers
- [Import/Export](/docs/import-export/) — Many endpoints and environments in one file
