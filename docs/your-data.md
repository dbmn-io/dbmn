---
title: Your Data & Privacy
layout: default
nav_order: 11
parent: Documentation
---

# Your Data & Privacy

Everything stays local. Dobermann stores all your API requests, responses, and logs on your machine — there is no cloud storage. Your data never leaves your machine except for the actual API calls you configure and optional aggregate telemetry counters.

This is a key differentiator from cloud-based API tools: your configurations, credentials, and execution history remain entirely under your control.

---

## Dobermann Workspace

A Dobermann workspace is a **folder on your machine** that you choose on first launch. This is where all execution data — requests, responses, logs, and the execution database — is stored.

- **Not a VS Code workspace** — it's Dobermann's own storage folder, independent of your VS Code project
- You can **switch workspaces** from the Activity Bar at any time
- All execution data lives inside this folder
- You choose the location — put it wherever suits your workflow

---

## What's Stored & Where

### Workspace folder structure

```
{your-workspace}/
├── .active8/
│   ├── executions.db          ← execution metadata (SQLite)
│   └── report-settings.json   ← console display preferences
├── {environment}/
│   └── {endpoint}/
│       ├── transaction-{timestamp}.json           ← request
│       ├── transaction-{timestamp}-response.json  ← response
│       ├── transaction-{timestamp}.log            ← structured log
│       └── batch/{batchId}/
│           ├── input.csv
│           ├── transaction-001.json
│           ├── transaction-001-response.json
│           └── transaction-001.log
```

### Execution Database

- **SQLite** (sql.js WASM) — stores metadata only (status, timestamps, counts)
- No request or response bodies in the database
- Cross-platform, no native dependencies required

### Transaction Files (Audit Trail)

- Every API call produces request + response + log files
- Organised by environment, then endpoint, then batch
- Human-readable JSON — open in any text editor
- Log files use JSON Lines format (one event per line)
- Files persist until you delete them — full audit trail

### Configuration (VS Code Storage)

- Endpoints and environments stored in VS Code's global state
- Credentials (tokens, secrets) stored in VS Code's **encrypted secret storage**
- Never written to disk as plain text

---

## What Leaves Your Machine

### API Calls

- Your configured requests go to your target API — that's the whole point
- Dobermann adds no tracking headers or telemetry to your API calls

### Telemetry (Aggregate Counters Only)

If you're signed in, minimal aggregate usage counters are sent to Supabase:

**What's sent:**
- Call counts, batch run counts, success/failure totals
- Execution time, date, extension version
- Environment license tier (product-level usage only)

**What's NEVER sent:**
- Request or response bodies
- Endpoint configurations, URLs, headers, or tokens
- Any of your data

Telemetry can be disabled by arrangement.

### Nothing Else

- No cloud sync of configurations
- No cloud storage of results
- No analytics beyond aggregate counters

---

## Audit & Compliance

- Full request/response/log trail on local filesystem
- Files organised by environment and endpoint for easy navigation
- JSON format — ingestible by any log aggregation or compliance tool
- SQLite database queryable for execution metadata
- You control retention — delete files when no longer needed

---

## Related Topics

- [Import/Export](/docs/import-export/) — sharing configs (never includes secrets)
- [Migration Guide](/docs/migration/) — keeping your workspace when switching publishers
- [Console](/docs/console/) — viewing execution results
