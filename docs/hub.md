---
title: The Hub
layout: default
nav_order: 1.5
parent: Documentation
---

# The Hub

Everything in Dobermann happens in one editor tab: the **Hub**. Click the Dobermann icon in the VS Code Activity Bar and the Hub opens; the VS Code sidebar closes, because the Hub has its own navigation. By default the Hub also opens itself when VS Code starts (the `dbmn.preloadHubOnStartup` setting), on [Home](#home).

The Hub has four parts, left to right and top to bottom:

| Part | What it is |
|---|---|
| **Header** | The DBMN mark, the environment selector, and the activity chip |
| **Rail** | Sections: {icon:nav-environments} Environments, {icon:nav-api-catalogue} API Catalogue, {icon:nav-history} History, {icon:nav-reporting} Reporting, {icon:nav-import} Import, {icon:nav-export} Export, and pinned at the bottom {icon:nav-account} Account and {icon:nav-settings} Settings |
| **List panel** | Slides out over the tabs when you click a rail item: your endpoints, your environments, your past runs |
| **Tabs** | Where things open: endpoint editors, environment editors, Run Batch, and the Console. With no tab open, [Home](#home) |

---

## Header
{: #header }

### Environment selector
{: #environment-selector }

The {icon:env-switcher} selector in the header shows which environment every request will go to. It reads `No environment` until you pick one. Click it and choose from the list; environments typed **Production** are highlighted, and the whole header is highlighted as a warning while one is active, so there is no mistaking what you are connected to. See [Environments — Environment Type](/docs/environments/#environment-type).

The pencil beside each environment in the list opens it in the editor, and **New environment…** at the foot of the list adds one.

Variables the environment shows in its header (an organisation, a company, a client: see [Environments — Variables](/docs/environments/#variables)) follow its name, one segment each, and the environment and its variables are outlined together. A segment reads the variable's value, or its label (`840 = Brisbane` reads **Brisbane**); it reads `pick org`, naming the variable and highlighted as a warning, while it's empty or, with options, until it holds one of them. A run waits for it. Click a segment for its options, with a tick by the current one and the value beside a label, and **Add…** at the foot to type a new **Value** and, if you like, a **Label**: it's added to the options and picked.

The selector is the main way to set the active environment. The other is the **Set as Active** button in the footer of a saved environment's editor.

Signed out of DBMN, the header shows **Sign in to DBMN** where the selector was. It opens the same sign-in as [Account](#account): enter your email, and a new address is registered as it signs in. The selector comes back once you are signed in.

If your DBMN sign-in expires, the header shows **DBMN sign-in expired**. Endpoints and batches keep running on your last known licence for up to 4 weeks. Click it to sign in again before then.

### Activity chip
{: #activity-chip }

The chip on the right of the header reads `Idle`, `N running`, `N running · N queued`, `N paused`, or `Recent failure`. Click it for a drawer listing what is running, what is queued, the newest paused batches, and what finished recently. Click an entry to open its Console.

### Help mode
{: #help-mode }

Every control in DBMN links to its section of these docs. Click the {icon:help} help button at the
right end of the header, or press <kbd>?</kbd> anywhere you are not typing. A banner at the top
reads **Help mode** while it is on. It covers the Hub and every open tab: each documented control
gets a dotted outline, and clicking one opens its docs instead of doing its job. Nothing else runs
while help mode is on. Press <kbd>Esc</kbd>, or the help button again, to leave. See
[Help Mode](/docs/help-mode/).

### Theme
{: #theme }

The {icon:theme-picker} palette button beside the help button shows the themes one at a time,
each as a Dobermann screen in its own colours. Step through them with the arrows (or the arrow
keys), or click the theme either side; **Use** (or <kbd>Enter</kbd>) applies the one in the middle.
Closing changes nothing. **Follow
system** comes first:

- In the web app and the desktop app it switches between a light theme and a dark one when your
  computer does (pick which in **Settings → UI**). In a browser the theme is shared with dbmn.io,
  so the website wears it too.
- In VS Code it is VS Code's own theme. Any other theme colours Dobermann's panels (the Hub, its
  tabs and the Console), not the rest of VS Code.

The theme belongs to the device, or to this VS Code.

---

## API Catalogue
{: #api-catalogue }

Your endpoints. Grouped by the URL path they share by default; **Settings → API Catalogue → Group by** offers `URL`, `System`, `Method` or `None (flat)`.

| Control | What it does |
|---|---|
| **Search** | Finds endpoints as you type: words in any order, a method, `#tag` and `@System`. See [Search](#search) |
| {icon:build-search} **Build a search** | Pick a **System**, **Method** and **Tags**, and it writes the search for you |
| {icon:add-endpoint} **Add Endpoint** | Opens a blank endpoint editor in a new tab |
| {icon:paste-endpoint} **New Endpoint from Clipboard** | Opens a new endpoint filled from an endpoint a teammate shared — see [Sharing Endpoints](/docs/sharing-endpoints/) |
| **Select** | Turns on checkboxes for bulk actions on the selection. **Delete** names what goes and asks first; their History is kept. **Export** writes them to a `.dbmn.zip`. **Update** sets their System, adds tags, and removes any of the tags they carry, all at once |
| **Recent** | The five endpoints you last saved or ran, pinned above the groups. While you search, the recent ones that match. Turn it off in Settings |

Each row shows the method, name and path, with {icon:run-api} **Run API** on the right. Endpoints with `{{template variables}}` also show {icon:run-batch} **Run Batch**. Click the row to open the endpoint in a tab.

Right-click an endpoint for **Open**, **Run API**, **Run Batch**, **Show history** (History with only its runs) and **Delete**.

Endpoints are not filed in folders. They carry **tags**, and the catalogue is grouped for you. See [Endpoints — Tags](/docs/endpoints/#tags).

---

## Environments
{: #environments }

Your environments, each with its base URL. Click a row to open it in a tab. {icon:add-endpoint} **Add Environment** opens a blank environment editor. The paw print marks the active environment; to change it, use the header selector.

See [Environments](/docs/environments/).

---

## History
{: #history }

Every run, single or batch, newest first. Each row shows its status, the batch's name (or the endpoint's), the endpoint and path, and a line with the method, how long ago, the environment, the HTTP status and the run time. Click a row to reopen its Console with full results.

| Control | What it does |
|---|---|
| **Search** | Finds runs as you type, in what was sent and received too: words in any order, a method, `#tag`, `@System`, `!status`, `~environment` and `7d`. See [Search](#search) |
| {icon:build-search} **Build a search** | Pick the scope, dates, endpoint, statuses and methods, and it writes the search for you |
| **Select** | Turns on checkboxes; the red **Delete** removes the selected runs and their files. Settings → UI can ask you to confirm first |
| **Settings → Transactions → Show** | `Current Environment` or `All Environments` |
| **Settings → Transactions → Group by** | `Date`, `Endpoint`, `Environment`, `Status` or `None (flat)` |

Right-click a row for the actions its Console footer would show for that state: **Pause** a running batch, **Resume** a paused, stopped or cancelled one, **Cancel** a queued batch or a single request still in flight, **Delete**, and **Open**. **Reprocess…** and **Re-run** open the Console, where their options are. See [Console](/docs/console/) and [Batch Reprocessing](/docs/batch-reprocessing/).

---

## Search
{: #search }

The API Catalogue, History and Reporting have one search box each, and all three read it the same way. What you type is the whole search: change it or delete it right there.

| Type | Finds |
|---|---|
| words, in any order | rows with every word somewhere in them: name, path, description, body, tags, status, environment |
| `"two words"` | the words together |
| `-word` | rows without it |
| `get` `post` `put` `patch` `delete` | that method (`"get"` in quotes is the word) |
| `#inventory` | that tag (`#"puppy school"` for one with a space) |
| `@` / `@dbmn` | the active environment's System / that System |
| `!error` `!paused` | that status (History) |
| `~` / `~prod` | the active environment / that one (History; in Reporting, any of a compare's results) |
| `24h` `7d` `2w` | since then (History and Reporting); `2026-11-01..2026-11-12` between two days |

The same kind twice is either of them: `get post` is GET or POST, `#a #b` either tag. Different kinds all apply: `@ get #inventory` is the active System's GET endpoints tagged inventory.

Typing suggests as you go: `#` lists your tags, `@` the Systems, `!` the statuses and `~` the environments, the most used first; a word lists the tags, Systems and methods that hold it. ↑ ↓ and **Enter** (or a click) write it into the box. **Esc** closes the list, and a second **Esc** clears the box.

{icon:build-search} **Build a search**, inside the box, opens on what the box says and shows the search it builds as you pick. **Use search** puts it in the box, so you can type it yourself next time.

| You type | You get |
|---|---|
| `post bulk` | POST endpoints with "bulk" in them |
| `@ get #puppy-school` | The active System's GET endpoints tagged puppy-school |
| `#inventory -report` | Endpoints tagged inventory, without "report" |
| `~ !error 7d 404` | This week's failed runs in the active environment with 404 in them (History) |
| `"Get Carriers" !completed` | That endpoint's completed runs (History; **Show history** writes the name for you) |

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
| **API Catalogue** | **Group by**. **Recent** on or off. **Manage Tags…** to rename, merge or delete tags across every endpoint. **Stored**: where your endpoints, environments and Systems live, **On this computer only** or **In your DBMN account**; **Save to my account…** moves them to your account, after a copy is exported to a folder you pick. Signed out, it says **On this computer, from your DBMN account**: you keep working on this computer's copy, and your changes go to your account when you sign in again (changed in both places, the newer one is kept and the other saved as a copy). **Remove from this computer** takes the copy off a shared computer. Secrets never leave this computer |
| **Transactions** | **Show** and **Group by** for History |
| **Execution** | **Auto-open console on completion**. **Treat network errors as critical**: timeouts, DNS and connection failures stop a batch at once, whatever its error handling. **Critical HTTP codes**, default `401, 403`, which also stop a batch at once. **Max CSV rows** for batch uploads |
| **UI** | **Confirm transaction deletion**. **Theme**: see [Theme](#theme) |
| **Workspace** | The **DBMN workspace folder**, with **Open folder** and **Change folder…**, and the path of the executions database. In the web app: **History is kept in this browser only** and **Use a folder…** until a folder is chosen (Chrome and Edge). See [Your Data](/docs/your-data/#dobermann-workspace) and [DBMN in the browser](/docs/your-data/#web-app) |
| **Systems** | The Standard Systems and your own, and **Add System**. Click one of yours to rename it; **Merge** moves its endpoints and environments into another System and deletes it; **Delete** is offered once nothing uses it. Standard Systems are set up by DBMN and can't be changed here |

### Systems
{: #systems }

A **System** is a short name for one API you work with: `wms`, `erp`, `crm`. Environments and endpoints both carry one, and it is how the catalogue knows which endpoints belong with the active environment. A new endpoint inherits the System of the active environment. Names are lowercase letters and digits, up to 16 characters. **Standard Systems** are set up by DBMN and carry the settings for an API many people use, such as how to sign in to it; your own Systems are names only. A new environment picks its System in the **New environment** dialog, and keeps it (see [Environments — System](/docs/environments/#system)). An endpoint's System can be changed in its editor, or created there with **+ Add new System…**. To change many endpoints at once, tick them in **Select** mode and click **Update**.

---

## Home
{: #home }

With no tab open, the tab area shows **Home**, and the Hub opens on it every time VS Code starts:

- **Pick up where you left off** lists the tabs you had open last time. **Re-open** brings them back; the Hub does not reopen them by itself.
- **Puppy School** shows the five lessons and the badges you have earned. **Start Puppy School** (or **Continue**) opens the course on dbmn.io. Once you graduate, it shows your graduate badge.
- **Quick start**: **Add Endpoint**, **New Endpoint from Clipboard**, **Add Environment** and **Import**.
- **What's new** counts the new features and fixes since the version you used before, with a link to the [Changelog](/docs/changelog/).
- **This week** shows your API calls, batches, rows processed and run time, while you are signed in.
- A tip, changing every 15 seconds.

The rail's names sit beside its icons on Home. Everywhere else the rail is icons only; hover one for its name.

---

<a id="collapse"></a>

## List panel
{: #list-panel }

Click {icon:nav-environments} **Environments**, {icon:nav-api-catalogue} **API Catalogue**, {icon:nav-history} **History** or {icon:nav-reporting} **Reporting** in the rail and its list slides out over the tabs. Click the same item again to close it, or another to switch lists. The tabs underneath keep their width.

The panel closes by itself when you open something from it: an endpoint, an environment, a run, **Add Endpoint**. Searching, filters, **Select** and collapsing a group leave it open. **Esc**, or a click on the dimmed tabs, also closes it. Drag its right edge to make it wider; the Hub remembers the width.

---

## Tabs
{: #tabs }

Endpoints, environments, Run Batch, the Console and Compare open as tabs in the Hub's tab area, not as separate VS Code editors. Each opens once; clicking it again brings its tab forward.

- Drag tabs to reorder them.
- **Close all** appears once two or more tabs are open. Anything unsaved stays open: an edited endpoint or environment, and a Run Batch holding data you haven't run. The rest close, Consoles included; a running batch carries on, and [History](#history) opens its Console again.
- **Ctrl+W** (Cmd+W on Mac) closes the active tab while the Hub has focus. A tab with unsaved changes asks **Save / Discard / Cancel** first; a Run Batch holding data asks **Close and lose it** or **Keep open**.
- Full-window editors (a request body, a Raw pane, a request on Run Batch's Review step) keep the footer as a thin strip at the bottom; hover it to reach the buttons. **Esc** exits.

---

## Related Topics

- [Getting Started](/docs/getting-started/) — Your first environment, endpoint and run
- [Environments](/docs/environments/) — Base URL, authentication, concurrency
- [Endpoints](/docs/endpoints/) — The endpoint editor
- [Console](/docs/console/) — Results, live progress, export
- [Compare](/docs/compare/) — The saved compares, in the rail's Reporting list
- [Shortcuts](/docs/shortcuts/) — Keyboard shortcuts
