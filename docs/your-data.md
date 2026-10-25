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

A Dobermann workspace is a **folder on your machine**. This is where all execution data — requests, responses, logs, and the execution database — is stored.

- **Not a VS Code workspace** — it's Dobermann's own storage folder, shared across all your VS Code windows and projects
- On first run Dobermann offers the default, `~/Dobermann-Workspace`, or lets you choose a folder. An older `~/Active8-Workspace` is picked up automatically
- See or change it under **Hub → Settings → Workspace**: **Open folder** shows it in your file manager, **Change folder…** moves to another

---

## DBMN in the browser
{: #web-app }

The web app at [app.dbmn.io](https://app.dbmn.io) keeps the same things, in one of two places.

**In the browser.** Until you choose a folder, **Settings → Workspace** reads **History is kept in this browser only**. Runs, their request and response files and the executions database live in the browser's own storage for app.dbmn.io. They survive a reload and a restart, and they are lost if you clear the site's data. DBMN for VS Code does not see them.

**In your DBMN workspace folder.** **Use a folder…** connects the web app to the same folder DBMN for VS Code uses, `~/Dobermann-Workspace` by default. From then on both write to the same executions database and the same files, so **History** is the same in both, and anything made in the browser before that moves across. The browser asks once whether DBMN may edit files in the folder: choose **Allow**. After a restart it may ask again, and **Settings → Workspace** reads **Reconnect folder** until you do. Only Chrome and Edge can do this: in other browsers the button answers **Using a folder needs Chrome or Edge**, and History stays in the browser.

**Where an environment runs makes no difference.** An environment set to **Run in: Local agent** sends its requests through DBMN for VS Code, but the web app records the run, in whichever of the two places it is using. VS Code itself writes nothing for it. See [Environments — Run in](/docs/environments/#run-in).

### Which browser
{: #browsers }

| Browser | Run from the browser | **Run in: Local agent** (through DBMN for VS Code) | **Use a folder…** (History shared with VS Code) |
|---|---|---|---|
| **Chrome**, **Edge** | yes | yes, after a one-time **Local network access** prompt | yes |
| **Firefox** | yes | yes | no, History stays in the browser |
| **Brave** | yes | yes, once Brave's **Localhost access** permission is allowed for app.dbmn.io | no, History stays in the browser |
| **Safari** | yes | **no**: Safari does not let a secure page reach an app on your computer | no, History stays in the browser |

On a Mac where Safari is the only browser allowed, use the desktop app, which sends every request itself and keeps History in a folder, with no VS Code and no browser involved.

---

## What's Stored & Where

### Workspace folder structure

```
{your-workspace}/
├── .active8/
│   └── executions.db          ← execution metadata (SQLite)
├── {environment}/
│   └── {endpoint}/
│       ├── transaction-{timestamp}.json           ← request
│       ├── transaction-{timestamp}-response.json  ← response
│       └── batch/{batchId}/
│           ├── input.csv                          ← the rows you loaded
│           ├── transaction-001.json
│           └── transaction-001-response.json
```

The Console's Settings tab links each run to its files.

### Execution Database

- **SQLite** (sql.js WASM) — stores metadata: status, timestamps, counts, and the Console's saved display settings
- Cross-platform, no native dependencies required
- Shared safely between VS Code windows: before saving, Dobermann folds in anything another window wrote

### Transaction Files (Audit Trail)

- Every API call produces request and response files; a batch keeps its input rows beside them
- Organised by environment, then endpoint, then batch
- Human-readable JSON — open in any text editor
- Files persist until you delete them — full audit trail. Deleting a run from **History** deletes its files too

### Configuration (VS Code Storage)

- Endpoints, environments and Systems are stored in VS Code's global state
- Credentials (tokens, secrets, service-account keys) are stored in VS Code's **encrypted secret storage**
- Never written to disk as plain text — and stripped from exports unless you ask. See [Import/Export](/docs/import-export/#credentials)

---

## What Leaves Your Machine

### API Calls

- Your configured requests go to your target API — that's the whole point
- Dobermann adds no tracking headers or telemetry to your API calls

### DBMN Sign-in

Signing in to DBMN authenticates you with the DBMN service and checks your licence. Your endpoints, environments and data are not sent.

### Telemetry (Aggregate Counters Only)

If you're signed in, minimal aggregate usage counters are sent to DBMN:

**What's sent:**
- Call counts, batch run counts, success/failure totals
- Execution time, date, extension version
- Environment licence tier (product-level usage only)

**What's NEVER sent:**
- Request or response bodies
- Endpoint configurations, URLs, headers, or tokens
- Any of your data

Telemetry can be disabled by arrangement.

### Puppy School

The course runs against [The Training Ground](/docs/playground/), a DBMN-hosted practice API. Data you load there is held for you, isolated from other learners, and purged after 48 hours. The course's checks look only at what landed on that API, and at the report table you choose to paste into a lesson; the pasted text itself is not stored.

### Nothing Else

- No cloud sync of configurations
- No cloud storage of results
- No analytics beyond aggregate counters

---

## Audit & Compliance

- Full request/response trail on local filesystem
- Files organised by environment and endpoint for easy navigation
- JSON format — ingestible by any log aggregation or compliance tool
- SQLite database queryable for execution metadata
- You control retention — delete runs when no longer needed

---

## Related Topics

- [Import/Export](/docs/import-export/) — sharing configs (credentials stripped by default)
- [Migration Guide](/docs/migration/) — keeping your workspace when switching publishers
- [The Hub](/docs/hub/#settings) — the Workspace settings panel
- [Console](/docs/console/) — viewing execution results
