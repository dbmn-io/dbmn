---
title: The Hub
layout: default
nav_order: 1.5
parent: Documentation
---

# The Hub

Everything in Dobermann happens in one editor tab: the **Hub**. Click the Dobermann icon in the VS Code Activity Bar and the Hub opens; the VS Code sidebar closes, because the Hub has its own navigation. By default the Hub also opens itself when VS Code starts (the `dbmn.preloadHubOnStartup` setting).

The Hub has four parts, left to right and top to bottom:

| Part | What it is |
|---|---|
| **Header** | The DBMN mark, the environment selector, and the activity chip |
| **Rail** | Sections: {icon:nav-environments} Environments, {icon:nav-api-catalogue} API Catalogue, {icon:nav-history} History, {icon:nav-import} Import, {icon:nav-export} Export, and pinned at the bottom {icon:nav-account} Account and {icon:nav-settings} Settings |
| **List panel** | The list for the section you picked: your endpoints, your environments, your past runs |
| **Tabs** | Where things open: endpoint editors, environment editors, Run Batch, and the Console |

---

## Header
{: #header }

### Environment selector
{: #environment-selector }

The {icon:env-switcher} selector in the header shows which environment every request will go to. It reads `No environment` until you pick one. Click it and choose from the list; environments typed **Production** are shown in red, and the whole header turns red while one is active, so there is no mistaking what you are connected to. See [Environments — Environment Type](/docs/environments/#environment-type).

If an environment's token carries more than one organisation, each organisation is a sub-row under it. Pick one and the selector reads `Environment · Org`; until you do it reads `(pick org)`.

The selector is the main way to set the active environment. The other is the **Set as Active** button in the footer of a saved environment's editor.

### Activity chip
{: #activity-chip }

The chip on the right of the header reads `Idle`, `N running`, `N running · N queued`, `N paused`, or `Recent failure`. Click it for a drawer listing what is running, what is queued, the newest paused batches, and what finished recently. Click an entry to open its Console.

### Collapse
{: #collapse }

The {icon:nav-collapse} button hides the rail's labels, leaving the icons. The rail also shows labels only while no tab is open, and the list panel yields to the tabs on a narrow window: the tab area keeps at least 600px, and the header button shows or hides the panel.

---

## API Catalogue
{: #api-catalogue }

Your endpoints. Grouped by the URL path they share by default; **Settings → API Catalogue → Group by** offers `URL`, `System`, `Method` or `None (flat)`.

| Control | What it does |
|---|---|
| **Search across everything…** | Filters by name, method, path, description and tags as you type |
| {icon:filters} **Filters** | Narrow the list by **System**, **Method** and **Tags**. The button shows how many filters are on; × clears them all |
| {icon:add-endpoint} **Add Endpoint** | Opens a blank endpoint editor in a new tab |
| {icon:paste-endpoint} **New Endpoint from Clipboard** | Opens a new endpoint filled from an endpoint a teammate shared — see [Sharing Endpoints](/docs/sharing-endpoints/) |
| **Select** | Turns on checkboxes for bulk actions: **Export** the selection, or **Set System…** on all of them at once |
| **Recent** | The five endpoints you last opened, edited or ran, pinned above the groups. Turn it off in Settings |

Each row shows the method, name and path, with {icon:run-api} **Run API** on the right. Endpoints with `{{template variables}}` also show {icon:run-batch} **Run Batch**. Both read `Sign in to run` until you are signed in. Click the row to open the endpoint in a tab.

Endpoints are not filed in folders. They carry **tags**, and the catalogue is grouped for you. See [Endpoints — Tags](/docs/endpoints/#tags).

---

## Environments
{: #environments }

Your environments, each with its base URL. Click a row to open it in a tab. {icon:add-endpoint} **Add Environment** opens a blank environment editor. The paw print marks the active environment; to change it, use the header selector.

See [Environments](/docs/environments/).

---

## History
{: #history }

Every run, single or batch, newest first. Each row shows its status, the endpoint and path, and a line with the method, how long ago, the environment, the HTTP status and the run time. Click a row to reopen its Console with full results.

| Control | What it does |
|---|---|
| **Search endpoint, path, status, body content…** | Filters the list as you type, including on what was sent and received |
| **Select** | Turns on checkboxes; the red **Delete** removes the selected runs and their files. Settings → UI can ask you to confirm first |
| **Settings → Transactions → Show** | `Current Environment` or `All Environments` |
| **Settings → Transactions → Group by** | `Date`, `Endpoint`, `Environment`, `Status` or `None (flat)` |

Right-click a row for the actions its Console footer would show for that state: **Pause** a running batch, **Resume** a paused or stopped one, **Cancel** a queued one, **Delete**, and **Open**. **Reprocess…** and **Re-run** open the Console, where their options are. See [Console](/docs/console/) and [Batch Reprocessing](/docs/batch-reprocessing/).

---

## Import and Export
{: #import-export }

{icon:nav-import} **Import** and {icon:nav-export} **Export** each open as a tab. Export writes your chosen endpoints and environments to one `.dbmn.zip`; Import reads one back, or a Postman collection. See [Import/Export](/docs/import-export/).

---

## Account
{: #account }

Sign in to DBMN, see your licence and weekly usage, and find **Puppy School & Badges**: the five-lesson course on The Training Ground, with the badges you have earned. **Start Puppy School** opens the course at [dbmn.io/puppy-school](/puppy-school/) in your browser; it reads **Continue** or **Revisit** once you have begun. See [Environments — DBMN authentication](/docs/environments/#dbmn) for what signing in gives your environments.

---

## Settings
{: #settings }

| Panel | Settings |
|---|---|
| **API Catalogue** | **Show** `Current Environment` (only endpoints in the active environment's System) or `All Systems`. **Group by**. **Recent** on or off. **Manage Tags…** to rename, merge or delete tags across every endpoint |
| **Transactions** | **Show** and **Group by** for History |
| **Execution** | **Auto-open console on completion**. **Treat network errors as critical**: timeouts, DNS and connection failures stop a batch at once, whatever its error handling. **Critical HTTP codes**, default `401, 403`, which also stop a batch at once. **Max CSV rows** for batch uploads |
| **UI** | **Confirm transaction deletion** |
| **Workspace** | The **DBMN workspace folder**, with **Open folder** and **Change folder…**, and the path of the executions database. See [Your Data](/docs/your-data/#dobermann-workspace) |
| **Systems** | Your Systems, and **Add System** |

### Systems
{: #systems }

A **System** is a short name for one API you work with: `wms`, `erp`, `crm`. Environments and endpoints both carry one, and it is how the catalogue knows which endpoints belong with the active environment. A new endpoint inherits the System of the active environment. Names are lowercase letters and digits, up to 16 characters. Pick one in the **System** field of either editor, or create one there with **+ Add new System…**.

---

## Tabs
{: #tabs }

Endpoints, environments, Run Batch and the Console open as tabs in the Hub's tab area, not as separate VS Code editors. Each opens once; clicking it again brings its tab forward.

- Drag tabs to reorder them.
- **Close all** appears once two or more tabs are open. Tabs with unsaved changes stay open; the rest close.
- **Ctrl+W** (Cmd+W on Mac) closes the active tab while the Hub has focus. A tab with unsaved changes asks **Save / Discard / Cancel** first.
- Full-window editors (a request body, a Raw pane) keep the footer as a thin strip at the bottom; hover it to reach the buttons. **Esc** exits.

---

## Related Topics

- [Getting Started](/docs/getting-started/) — Your first environment, endpoint and run
- [Environments](/docs/environments/) — Base URL, authentication, concurrency
- [Endpoints](/docs/endpoints/) — The endpoint editor
- [Console](/docs/console/) — Results, live progress, export
- [Shortcuts](/docs/shortcuts/) — Keyboard shortcuts
