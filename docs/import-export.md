---
title: Import/Export
layout: default
nav_order: 8
parent: Documentation
---

# Import/Export

Dobermann provides comprehensive import and export functionality for sharing endpoint configurations, environments, and workflows across teams or between workspaces.

## Overview

You can import and export:
- **Individual endpoints** - Single API configuration
- **Folders** - All endpoints within a folder
- **Environments** - Connection and auth settings (excluding sensitive data)
- **Complete workspace** - All endpoints, folders, and environments

## Exporting Data

### Export Individual Endpoint

**From sidebar:**
1. Right-click endpoint
2. Select **Export Endpoint**
3. Choose save location
4. File saved as `{endpoint-name}.json`

**From endpoint webview:**
1. Open endpoint editor
2. Click **... More** menu
3. Select **Export**
4. Choose save location

**Exported data includes:**
- HTTP method and URL path
- Headers (custom and organization)
- Query parameters
- Request body template
- Variable definitions

**Excluded:**
- Environment association
- Execution history
- Data files
- Authentication tokens

### Export Folder

Export all endpoints within a folder:

1. Right-click folder in sidebar
2. Select **Export Folder**
3. Choose save location
4. File saved as `{folder-name}-export.json`

### Export Environment

**From sidebar:**
1. Right-click environment
2. Select **Export Environment**
3. Choose save location
4. File saved as `{environment-name}-env.json`

**Exported data includes:**
- Environment name and type
- Base URL
- Description
- Mock mode setting
- Authentication method (type only)
- OAuth configuration (URLs and scopes only)

**Excluded for security:**
- JWT tokens
- OAuth client secrets
- Access tokens
- Refresh tokens
- Organization IDs

**Note:** Recipients must provide their own authentication credentials after importing.

### Export Workspace

Export everything from current workspace:

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Dobermann: Export Workspace"
3. Select command
4. Choose save location

**Contains:**
- All endpoints
- All folders and hierarchy
- All environments (excluding sensitive data)
- Global settings

## Importing Data

### Import Endpoint

**From sidebar:**
1. Click **... More** in Endpoints section header
2. Select **Import Endpoint**
3. Browse to `.json` file
4. Endpoint is created in "Imported" folder

**After import:**
- Review endpoint configuration
- Assign to appropriate folder
- Associate with environment
- Test with single execution

### Import Folder

Import multiple endpoints at once:

1. Click **... More** in Endpoints section header
2. Select **Import Folder**
3. Browse to `{folder-name}-export.json`

**Import behavior:**
- New folder created with original name
- If folder exists, number is appended (e.g., "API Endpoints (2)")
- All endpoints imported under new folder

### Import Environment

**From sidebar:**
1. Click **+** next to Environments
2. Select **Import Environment**
3. Browse to `{environment-name}-env.json`

**After import:**
- Verify base URL is correct
- Configure authentication (provide credentials)
- Test connection

### Import Workspace

Import complete workspace export:

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Dobermann: Import Workspace"
3. Choose import mode

**Import modes:**

**Merge:**
- Imports new items
- Skips existing items (by ID)
- Preserves current workspace
- Safe for incremental updates

**Replace:**
- Deletes all existing data
- Imports all items from file
- Use for clean migration
- Warning: Cannot be undone

### Importing from Postman Collections

Dobermann can import endpoints directly from a Postman v2.1 collection JSON file. This makes it easy to bring an existing API library into Dobermann without rebuilding each request by hand.

**How to use it:**

1. Open the Import/Export view (right-click in the Dobermann sidebar → **Import/Export**)
2. Choose **Import**
3. Drag your Postman collection `.json` file onto the drop zone (or browse to it)
4. Use the Postman Import Options to choose how to bring the requests in
5. Tick the items you want and click **Import Configuration**

**Postman Import Options:**

- **Include headers from collection** *(off by default)* — when ticked, request headers from each Postman request are imported alongside the endpoint. Dobermann will warn you before enabling this, because in most cases you should leave headers on the Environment (so they apply to every endpoint that uses it). Only enable this if a specific endpoint genuinely needs different headers from its environment.
- **Folder destination** — either keep the folder names from the Postman collection (the immediate parent folder of each request becomes the Dobermann folder) or import everything into a single existing or new folder of your choice.

#### What gets imported

Dobermann reads only the fields it can map directly to a Dobermann endpoint. Variables in `{{this}}` syntax pass through unchanged — they continue to resolve from your active environment, exactly as they did in Postman.

| Dobermann field | Source in Postman                         |
|-----------------|-------------------------------------------|
| Name            | `item.name`                               |
| Method          | `request.method`                          |
| Path            | `request.url.path` (host portion stripped)|
| Body            | `request.body.raw` (raw mode only)        |
| Folder          | Immediate parent folder name              |
| Query params    | `request.url.query`                       |
| Description     | `request.description`                     |
| Headers         | `request.header` *(optional, off by default)*  |

#### What is NOT imported (and why)

Dobermann is not a Postman replacement — it's a focused tool for bulk data loads against REST APIs. Several things in a Postman collection have no equivalent in Dobermann and are deliberately dropped on import:

| Postman feature | Why it's not imported |
|-----------------|-----------------------|
| **Pre-request scripts** (`event[].listen: "prerequest"`) | Dobermann does not run JavaScript hooks. Use template variables, environment variables, or auto-organization headers to compute values. |
| **Test scripts** (`event[].listen: "test"`) | Dobermann does not execute Postman test scripts. Validation is handled in the Console after each batch run. |
| **Saved response examples** (`response[]`) | Dobermann captures live responses each run; saved examples from Postman are not preserved. |
| **Auth methods other than `bearer`** (OAuth 2.0, Basic, API Key, AWS Signature, NTLM, Hawk, etc.) | Auth is configured per-Environment in Dobermann (JWT, OAuth 2.0, Google Service Account, Dobermann auth, or none). Reconfigure these on the Environment after import. |
| **Postman Bearer token (when headers are not included)** | Tokens belong on the Environment, not the endpoint. Set the bearer/JWT token once on your Environment and Dobermann attaches it to every request. |
| **Body modes other than `raw`** (form-data, urlencoded, binary, GraphQL) | Only raw bodies are imported. Other body modes are dropped silently. |
| **Collection-level variables** (`variable[]`) | Variables in `{{this}}` syntax pass through in URLs and bodies, but the *definitions* don't import. Set them on a Dobermann Environment instead. |
| **Postman Environment files** (`*.postman_environment.json`) | Not currently supported — re-create the environment in Dobermann (it's usually a one-time setup with much richer auth options). |
| **Folder hierarchy beyond one level** | Dobermann uses a single level of endpoint folders. Each request is filed under its *immediate* parent folder; deeper ancestors are flattened away. |
| **Cookies, certificates, proxy settings** | Not part of the Dobermann endpoint model. |

You don't need to memorise this list. When you upload a collection, Dobermann scans it and lists exactly which of these features it found at the top of the import preview, and flags each affected endpoint individually with a `⚠ data dropped` chip — hover the chip to see what specifically won't carry across for that request.

If your Postman workflow leans heavily on pre-request/test scripts or non-raw bodies, you may need to redesign that flow — see [Template Variables](/docs/template-variables/) and [Environments](/docs/environments/) for the Dobermann-native equivalents.

## File Formats

### Endpoint JSON Structure

```json
{
  "id": "uuid-here",
  "name": "Location Update",
  "method": "POST",
  "path": "/api/locations/{{locationId}}",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "enabled": true
    }
  ],
  "body": {
    "type": "json",
    "content": "{\"capacity\": {{capacity:number}}}"
  },
  "consoleViews": {
    "success": { "activeView": "PO Lines", "defaultView": "PO Lines", "views": [ /* … */ ] },
    "errors":  { "activeView": "Root",     "defaultView": "Root",     "views": [ /* … */ ] }
  }
}
```

**Console views travel with the endpoint.** Any [Named Views](/docs/console/#named-views) you've saved on the Completed/Errors tabs are exported alongside the endpoint and applied automatically on import. Share an endpoint with a teammate and they get not just the request configuration but also the column layouts, row bases, and sort preferences you've curated.

### Environment JSON Structure

```json
{
  "id": "uuid-here",
  "name": "Production",
  "type": "production",
  "baseUrl": "https://api.example.com",
  "description": "Live production API",
  "authMethod": "oauth",
  "oauthConfig": {
    "authorizationUrl": "/oauth/authorize",
    "tokenUrl": "/oauth/token",
    "scopes": "read write"
  }
}
```

**Note:** Sensitive fields like `clientSecret`, `jwtToken`, `accessToken` are never exported.

## Sharing with Teams

Dobermann export files are JSON — diff-friendly, deterministic, and safe to commit to git. Sensitive fields (JWT tokens, OAuth client secrets, access/refresh tokens) are stripped on export, so the recipient always provides their own credentials after import.

For values that vary per person (API keys, user-specific tokens), use an environment variable in the header instead of hardcoding it:

```json
{
  "headers": [
    { "key": "X-API-Key", "value": "{{ENV:API_KEY}}" }
  ]
}
```

Each team member sets `API_KEY` on their own environment, and the same exported endpoint works for everyone.

## Related Topics

- [Environments](/docs/environments/) - Authentication and connection setup
- [Endpoints](/docs/endpoints/) - Creating and managing API configurations
- [Batch Preparation](/docs/batch-preparation/) - Loading CSV data for batch execution
