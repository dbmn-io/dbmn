---
title: Changelog
layout: default
nav_order: 99
parent: Documentation
---

# Changelog

All notable changes to Dobermann are documented here.

## v0.4.0 — 2026-11-16

### Highlights
- **DBMN in the browser** — [app.dbmn.io](https://app.dbmn.io) runs the Hub, Run API, Run Batch, the Console and History with nothing installed; **Run in: Local agent** sends requests through VS Code for APIs a browser can't reach.
- **Free and open source, no account needed** — In VS Code everything works signed out, with no weekly batch limit. Signing in adds your endpoints on every computer, Weekly Usage and Puppy School.
- **Your endpoints and environments in your account** — On every computer you sign in on and in the web app, a change made elsewhere arriving live. Secrets never leave the machine.
- **Compare (Beta)** — Line a result up against up to three others, DEV against PROD or today against last week, cell by cell, and export to Excel.
- **Better search in Endpoints and History** — Type `post inventory`, `#tag`, `@`, `!error` or `7d`; **Build a search** writes it for you; right-click an endpoint for **Show history**.

### Added
- **Compare (Beta)** — Line a result up against up to three other results of the same endpoint: DEV against PROD, or this morning against last week. Start from **Compare** on the Console's **Completed** tab; pick the key that identifies a record, the columns to compare (**Strict**, **Relaxed** or **Don't compare**), then see every record as **Same**, **DIFF** or **Missing**, cell by cell, **Side by side** or **Compact**. A key one result repeats (one to many) is compared too, the Baseline's record against each, and the **Relationship** column shows and filters how each row's key meets the results. Filter to the differences, open a record's JSON from every result side by side, and export to Excel. Nothing is sent: Compare reads results already in History, at any size. Compares are saved in the Hub's new **Reporting** list. Beta: tell us what you find. [Docs](https://dbmn.io/docs/compare/) (GitHub Issue #298)
- **Search one column** — In the Console's and Compare's search, `@status=active`, `@sku~WOOF`, `@quantityOnHand>10`, `@uom=EA|CS` (either) or `@quantityOnHand=10..90` (between) searches that column alone; type `@` to pick a column, then an operator. Words alongside still search the whole row, and Copy and Export keep to the rows found. [Docs](https://dbmn.io/docs/console/#search-columns)
- **DBMN in the browser** — [app.dbmn.io](https://app.dbmn.io): the Hub, Run API, Run Batch, the Console and History in your browser, with nothing installed. History is kept in the browser until you choose **Use a folder…**, which keeps it in a folder on your computer: any folder, set up from the browser, or the one DBMN for VS Code uses, so both show the same History, older versions' runs included (Chrome and Edge). Sign in with your DBMN account. [Docs](https://dbmn.io/docs/your-data/#web-app) (GitHub Issues #343, #441, #443)
- **Run in: Local agent** — A web app environment can send its requests through DBMN for VS Code on your computer: for APIs that refuse requests from a browser, and to keep an environment's secrets out of the browser. VS Code must be open and signed in to the same account; the first run asks the browser's permission and DBMN explains it first. A run started while VS Code is closed waits for it. [Docs](https://dbmn.io/docs/environments/#run-in) (GitHub Issues #344, #374)
- **Save your endpoints and environments to your DBMN account** — At your first DBMN sign-in, VS Code asks once: save your endpoints, environments and Systems to your account, or keep them on this computer. Saved, they are on every computer you sign in on and in the web app, and a change made elsewhere arrives live; a copy is exported to a folder you pick first, and secrets never leave the machine. Closing the question keeps everything on this computer; **Settings → Endpoints → Save to my account…** saves them any time, and the web app's Home says so while VS Code's are still only on your computer. Signed out, VS Code keeps working on this computer's copy: what you change goes to your account when you sign in again (changed in both places, the newer one is kept and the other saved as a copy), and **Remove from this computer** in Settings takes it off a shared computer. [Docs](https://dbmn.io/docs/hub/#settings) (GitHub Issues #342, #427)
- **Your DBMN settings follow your endpoints** — With your endpoints in your account, Confirm transaction deletion, the critical error codes, network errors as critical, auto-open Console and Max CSV rows are the same in VS Code and the web app. Kept on this computer, they stay VS Code's own. (GitHub Issue #281)
- **Standard Systems** — A new environment starts from its System: Standard Systems, configured by DBMN, then your own, then the base URL. A URL that matches a Standard System picks it, and sign-in URLs and token settings come from the System; your own settings on an environment still win. Like the URL's host, the System can't be changed once the environment exists. A System of your own named like a Standard System is switched to it. [Docs](https://dbmn.io/docs/environments/#system) (GitHub Issue #415)
- **Switch a value from the Hub header** — Give an environment variable **Options** and its value is picked from them. Tick **Header** and it gets a segment after the environment name: click to switch, or **Add…** a value. A run first asks for any header variable that's empty or not one of its options; untick **Header** for one a run doesn't need. [Docs](https://dbmn.io/docs/environments/#variables) (GitHub Issue #424)
- **Labels for options** — Type an option as `840 = Brisbane`: the header and the pick lists show Brisbane, and requests still send 840. **Add…** in the header takes a label too. [Docs](https://dbmn.io/docs/environments/#variables) (GitHub Issue #424)
- **A variable in the Base URL** — Part of the path can be a variable, `/functions/{{version}}/playground`, filled from the environment on every request; a run asks for it if it's empty, and a running batch keeps the URL it started with. The path can now be changed after creation, from the pencil by the heading; the host stays. [Docs](https://dbmn.io/docs/environments/#base-url-variables) (GitHub Issue #424)
- **Suggestions when you type `{{`** — In an endpoint's path, query parameters and headers, and in an environment's headers, typing `{{` lists the environment's variables as `ENV:name` and the generated values (`A8:sequence`, `A8:date`…); an endpoint also offers the run-time names it already uses. Arrow keys and Enter pick one. An environment's headers now take `{{ENV:name}}` as well as `{{name}}`, and `{{ENV:name}}` in a path or query parameter is filled in for Run API and Run Batch alike. [Docs](https://dbmn.io/docs/template-variables/#environment-variables-env)
- **Themes** — The palette button beside help shows the themes one at a time, each as a Dobermann screen in its own colours; **Use** applies one. In VS Code a theme colours DBMN's panels only and **Follow system** is VS Code's own theme. In the browser the theme is shared with dbmn.io. [Docs](https://dbmn.io/docs/hub/#theme) (GitHub Issue #373)
- **OAuth sign-in stays signed in** — The refresh token is kept, so an expired access token is renewed silently before a request, during a batch and after a 401. **Refresh Token** in the environment editor uses it before opening a browser. Sign Out forgets it. [Docs](https://dbmn.io/docs/environments/#authentication) (GitHub Issue #359)
- **A run's files in one archive** — Each run's requests, responses and logs are kept in one compressed archive in the run folder instead of a file per transaction; a workspace measured at 252,071 loose files shrinks about 17×. Older runs' files still read. (GitHub Issue #358)
- **A warning when an endpoint keeps a header of its own** — Headers belong on the environment, which adds them to every request. While an endpoint carries a header row of its own, its Headers section says so and links to the docs. [Docs](https://dbmn.io/docs/environments/#headers)
- **JSON Lines responses** — An API that answers in JSON Lines (one JSON record per line: `application/x-ndjson`, `application/jsonl`, a `.jsonl` URL, or a body that is plainly one record per line) is read record by record. It is still one transaction: Completed gives each line its own row, and Raw labels the body **JSONL** with **Lines** (as received) and **Pretty**. A line that isn't JSON is counted in the label, never dropped silently. [Docs](https://dbmn.io/docs/console/#jsonl) (GitHub Issue #115)
- **Tag suggestions** — Typing in an endpoint's **Tags** lists up to five tags already in use, each shown as the tag it becomes, with **New tag** last; ↓/↑ and Enter or Tab pick one. **Manage tags…** beside the field opens Manage Tags, and an open editor shows a rename, merge or delete at once. [Docs](https://dbmn.io/docs/endpoints/#tags) (GitHub Issue #432)
- **Progress while a big response downloads** — The Console footer counts records and MB as they arrive. When the API says how much is coming (`X-Total-Count` or `Content-Length`) you get a real percentage and the time left; otherwise a busy bar and the download speed. At 100% it says **Processing** until the rows are in. [Docs](https://dbmn.io/docs/console/#jsonl) (GitHub Issue #115)

### Changed
- **The API Catalogue is now Endpoints** — The rail, the list and **Settings → Endpoints**: the same endpoints, grouped and searched as before, under a plainer name. [Docs](https://dbmn.io/docs/hub/#endpoints)
- **No DBMN account needed in VS Code** — Run API, Run Batch, pagination, Fetch all and Max Concurrency all work signed out, with no weekly batch limit, and the Standard Systems still list. Signing in adds saving your endpoints to your account, Weekly Usage and Puppy School. The web app still needs an account. [Docs](https://dbmn.io/docs/hub/#account) (GitHub Issue #418)
- **Telemetry is optional and minimal** — Daily counts only, never an environment's address or an API's path, and VS Code's own telemetry setting is respected. **Account → Weekly Usage → Share usage counts with DBMN** (or `dbmn.telemetry.enabled`) turns it off; signed out, nothing is sent. [Docs](https://dbmn.io/docs/telemetry/) (GitHub Issue #419)
- **Home shows the build** — The version on Home carries the commit it was built from, such as v0.4.0 · 64ca0bc, in VS Code, the web app and the desktop app, so two builds of one version can be told apart. (GitHub Issue #447)
- **One search box, and a query builder** — In Endpoints and History, words find rows in any order (`post inventory`), `"two words"` together, and `-word` leaves out. Short signs narrow: a method as a bare word (`get`), `#tag`, `@` the active System or `@dbmn`, and in History `!error`, `~` the active environment and `7d`. The same kind twice is either: `get post`. Typing `#`, `@`, `!` or `~` lists what it can be; **Enter** writes it into the box. **Build a search**, inside the box, writes the search for you from what you pick; what's in the box is the whole search, so delete it there. The box wraps to show a long search, and Recent stays while you search, with the recent endpoints that match. **Settings → Endpoints → Show** is gone: `@` in the box is the current System. [Docs](https://dbmn.io/docs/hub/#search) (GitHub Issue #444)
- **Show history** — Right-click an endpoint in Endpoints for Open, Run API, Run Batch, **Show history** (History with only its runs) and Delete. [Docs](https://dbmn.io/docs/hub/#endpoints) (GitHub Issue #444)
- **A batch keeps its name** — The name given in Run Batch's Review is the run's: History lists it by that name with its endpoint underneath, and the Console's title, tab and **Settings → Name** show it. Renaming it there renames the run, not the endpoint. [Docs](https://dbmn.io/docs/console/) (GitHub Issue #445)
- **Review and Execute are one step** — Run Batch has four steps: Source, Map, Validate, Review. **Name**, **Error Handling** and **Processing Mode** are in Review's **Configure**, where it is sent in **Sending To**, and **Execute** is Review's button. Reading a file shows its progress in the step itself, and the footer's buttons keep one width, so nothing in the footer moves. A batch is named after where its rows came from and when, `inventory-67k 12 Nov 16:30`, until you name it. [Docs](https://dbmn.io/docs/batch-preparation/#step-4-review-json) (GitHub Issue #435)
- **Review always names the array** — With one array in the template, **Array** shows at any Rows per request, not only above 1. [Docs](https://dbmn.io/docs/batch-preparation/#batch-configuration)
- **Secrets live in the vault** — Tokens, client secrets, service-account keys and OAuth sessions are kept in VS Code's secret storage, never in plain settings or state. Copies from earlier versions move in once at start-up. Deleting an environment deletes its tokens too. (GitHub Issues #362, #367)
- **Max Concurrency is the one setting** — The **Enable parallel batch processing** checkbox is gone: **Max Concurrency** alone says how many requests a batch sends at once, **Sequential** being 1. **Behaviour change:** an environment saved with parallel processing off opens as Sequential, which is what it ran. [Docs](https://dbmn.io/docs/environments/#parallel-processing)
- **Mock Requests removed** — **Enable Mock Requests** on an environment is gone; the Training Ground does that job. **Behaviour change:** an environment that had it on now calls the real API. The endpoint editor's **Mock Response** sample tab stays. [Docs](https://dbmn.io/docs/playground/)
- **The organisation is an ordinary variable** — It's the `org` variable with options you type; nothing is read from your token, and DBMN no longer adds or checks Organization and Location headers by itself: an environment sends the headers it lists. An environment from an earlier version that has an organisation gets the four it used to send, **Organization**, **SelectedOrganization**, **Location** and **SelectedLocation**, as `{{ENV:org}}` in its headers, and `org` in the Hub header, so its requests carry what they did before. The header's list is no longer every organisation in your token: **Add…** the few you use there, and edit or remove them in the environment. [Docs](https://dbmn.io/docs/environments/#organization-selection) (GitHub Issue #424)
- **The workspace folder's marker is `.dbmn`** — The `.active8` folder inside your DBMN workspace is renamed `.dbmn` at start-up and left as a link, so an older version sharing the folder keeps working. History is unchanged. (GitHub Issue #344)
- **Cancel asks first, and a cancelled batch resumes** — Cancel on a running batch offers Keep running, Pause instead or Cancel batch. Resume carries on from the next row, from the Console or History, and sends again the requests Cancel cut off. Cancel stops the requests in flight too; a cut-off request shows **Cancelled**, never an error. [Docs](https://dbmn.io/docs/console/#batch-controls) (GitHub Issues #335, #323)
- **Reprocess is for finished batches** — It offers Errors only, Split array errors and All; a paused or cancelled batch is resumed instead. **Behaviour change:** Reprocess Incomplete and Pending only are gone. [Docs](https://dbmn.io/docs/batch-reprocessing/) (GitHub Issue #335)
- **The progress panel is the bar** — In the Console, Run Batch and Compare footers the whole panel fills as the work goes, drawn as a Console's tab is: the status colour as a tint and as the panel's outline, the text in its own colours. (GitHub Issues #335, #438)
- **A Console's tab shows its progress** — In the Hub's tab bar, a Console's tab is tinted, with a line along its top, as far as the run has got, in the footer's colour for its status: blue running, yellow paused, green completed, red failed. The open tab and the Console's heading are one surface, in the tab's colour all the way across, with the line showing how far the run has got, and while it runs a deeper tint too; the open tab doesn't change on hover. A cancelled run is grey. Text on a tint, the footer panel's count and time left included, reads at 4.5:1 or better in every bundled theme. (GitHub Issue #438)
- **Alt+W closes the active tab** — In VS Code, the web app and the desktop app alike: a browser keeps Ctrl+W for itself and closes the whole page. In the web app, closing or reloading the page while a tab holds unsaved work asks first. [Docs](https://dbmn.io/docs/shortcuts/)
- **The DBMN name in the Hub header** — The header and Home show DBMN in its brand font, and the header's icons are readable on a production environment.

### Removed
- **Prod Protect** — Environment types are no longer set and locked centrally by DBMN: you choose an environment's type, and a production environment still turns the header red and asks before a run.

### Fixed
- **Fetch all gets every page when the API sends fewer per page than asked** — Asked for 2,000 a page, an API that sends 500 (as the Training Ground does) was counted at 2,000, and Fetch all stopped at a quarter of the rows without a word. DBMN now goes by the page size and pages the API says it sends, and the Pagination window shows them. After the first page, DBMN asks for the page size the API sends, so an API that counts its pages by the size asked doesn't skip rows, and a warning says so. An endpoint whose page size is a plain number gets **Fetch all** too when the API says its pages. (GitHub Issue #446)
- **A Re-run that works says COMPLETED** — Re-running a single request after a failed attempt showed **COMPLETED WITH ERRORS** even when the new attempt succeeded. The status now follows the latest attempt. [Docs](https://dbmn.io/docs/console/#execution-history)
- **The Raw tab no longer flashes while a batch runs** — With a Status filter on (the tab opens on **Running** while a batch runs), every result redrew every card: the list flashed, and a card you had closed opened again. Now a result adds, removes or updates only its own card. [Docs](https://dbmn.io/docs/console/#raw-tab) (GitHub Issue #431)
- **A test failure says so** — An answer the endpoint's test turns down is still an error, but the Console now shows it as **TEST FAILED**, with the test and its reason under the card's header, a **Test failed** choice in the Raw tab's Status (each transaction counts under one status), and a **Reason** column first on the Error tab. Such a transaction goes straight to Error instead of counting under Completed first, and its log shows the test script and each test's result. [Docs](https://dbmn.io/docs/console/#raw-tab) (GitHub Issue #428)
- **The Console's buttons show whether or not you're signed in** — Delete, Re-run, Next Page and the rest were hidden behind a **Sign In** button while signed out of DBMN, and stayed hidden after signing in until the tab was reopened. Signing in is offered from **Account** only.
- **OAuth sign-in errors show at once** — An error from the sign-in page used to wait 60 seconds and then say "timeout"; it now fails at once with the server's reason, and an answer that isn't for this sign-in is ignored. Custom OAuth URLs are suggested from the whole base URL, so a base path is no longer lost. (GitHub Issue #361)
- **The Run Batch step bar no longer jumps** — Each step keeps the same share of the bar as steps tick off and their summaries change; a long summary ends in an ellipsis and shows in full on hover. (GitHub Issue #397)
- **PKCE with a client secret** — Confidential clients (Azure AD, Okta web apps) get the secret alongside PKCE in the token exchange. Credentials no longer appear in DBMN Logs in any form. (GitHub Issues #363, #369)
- **Fetch all on body pagination asked for one page too many** — With the page number in the request body, Fetch all planned one page past the end and recorded an empty page. [Docs](https://dbmn.io/docs/pagination/) (GitHub Issue #316)
- **Fetch all gets every page through a brief server hiccup** — A page that fails for a moment (the server busy or failing for now, or no answer) is asked for again, twice at most, before it counts as an error. Before, the table came up one page short. [Docs](https://dbmn.io/docs/pagination/)
- **The Error tab no longer shows Input rows** — While a large batch's input rows were still loading, the first error could switch to the Error tab and the input rows were drawn under it. (GitHub Issue #337)
- **Time left in a reused Console** — A reprocess or resume clears the last estimate instead of counting down a spent one. (GitHub Issue #336)
- **Excel on every table tab** — The Input tab offered CSV only, so the list of rows to send back (Result = Error) could not go to Excel. Every table tab now offers CSV and Excel. [Docs](https://dbmn.io/docs/console/#input-status) (GitHub Issue #304)
- **An expired DBMN sign-in no longer signs you out** — The header shows **DBMN sign-in expired** and everything keeps running. Signing in on the website no longer ends the extension's session. (GitHub Issue #396)
- **One sign-in at a time** — When a run needs DBMN sign-in and then the environment's own, DBMN asks first and names the environment that asks next. (GitHub Issue #396)
- **A response labelled JSON that isn't** — The body is kept instead of the transaction failing with the body lost. (GitHub Issue #115)
- **The Hub fills its panel** — No more margin around the Hub with its bottom cut off, and nothing can scroll the header out of view. (GitHub Issue #353)
- **Rail icons keep their size in a short window** — What doesn't fit moves behind **…**; Account and Settings stay put. (GitHub Issue #293)

## v0.3.1 — 2026-10-08

### Added
- **Home** — With no tab open the Hub shows Home, and it opens there: Puppy School first, Quick start, what's new since your last version, this week's usage and tips. [Docs](https://dbmn.io/docs/hub/#home) (GitHub Issue #348)
- **Lists slide out over the tabs** — Environments, API Catalogue and History open over the tabs and close once you pick something, so tabs keep their full width. The rail is icons only. [Docs](https://dbmn.io/docs/hub/#list-panel) (GitHub Issue #349)
- **Full window on Review** — A request on Run Batch's Review step goes full window, as on the Console's Raw tab; **Esc** exits. [Docs](https://dbmn.io/docs/hub/#tabs) (GitHub Issue #352)

### Changed
- **Review names what repeats** — Configure shows **Grouped by**, the columns that start a new request, with the ⓘ beside it; and **Array**, the array your rows are packed into, once Rows per request is above 1. [Docs](https://dbmn.io/docs/batch-preparation/#batch-configuration) (GitHub Issue #354)
- **Your last tabs wait on Home** — **Behaviour change:** the Hub no longer reopens the previous session's tabs by itself; **Re-open** on Home brings them back. [Docs](https://dbmn.io/docs/hub/#home) (GitHub Issue #348)
- **Close all keeps a Run Batch you haven't run** — Along with unsaved editors, Close all tabs keeps a Run Batch holding data, and closing one by itself asks first. [Docs](https://dbmn.io/docs/hub/#tabs) (GitHub Issue #348)

### Fixed
- **Execute sends what Review shows** — An array inside an object (`{ "Payload": { "Documents": [ … ] } }`) now gets **Rows per request** on Review; Execute no longer packs rows from a saved setting Review never showed. **Behaviour change:** that setting is now visible — set it to 1 for one call per row. [Docs](https://dbmn.io/docs/batch-preparation/#batch-configuration) (GitHub Issue #354)

## v0.3.0 — 2026-10-05

### Added
- **Puppy School and badges in the Hub** — Account shows the five-lesson course on the Training Ground, how far you are, and the badges you have earned; a new badge raises a toast. Lessons live on dbmn.io. [Docs](https://dbmn.io/docs/hub/#account)
- **Chain: a run's results become another API's input** — On a completed run's **Completed** tab, **Chain** sends the rows the table shows into another endpoint's **Run Batch**: no clipboard, no file, no row limit. Both Consoles get a **Links** tab showing where rows came from and went. [Docs](https://dbmn.io/docs/chain/) (GitHub Issue #247)
- **Run Batch steps across the top** — The five steps run across the top, each showing what it decided; click one to move. After **Import Data**, Run Batch walks past Map and Validate when nothing needs you and lands on Review. [Docs](https://dbmn.io/docs/batch-preparation/#step-bar) (GitHub Issue #247)
- **Help mode, everywhere** — One help button in the Hub header (or <kbd>?</kbd>) outlines every control that has docs, in the Hub and every open tab; click one to open its section on dbmn.io. It replaces the "?" icons. [Docs](https://dbmn.io/docs/hub/#help-mode)
- **Run Batch remembers your mapping** — Map a file's columns once and the next Run Batch on that endpoint maps the same columns for you. Tick **Update Endpoint Template** to rename the template's variables after their columns instead. [Docs](https://dbmn.io/docs/batch-preparation/#remember-mapping) (GitHub Issue #307)
- **Right-click a row to see its transaction** — On the Input, Completed and Error tabs, **View transaction** opens its input rows, request and response side by side. On an Error row, **Reprocess** runs it again. [Docs](https://dbmn.io/docs/console/#view-transaction) (GitHub Issue #296)
- **Filter input rows by result** — The Input tab shows each row's **Result** and filters to Completed, Error, Running or Not processed. Copy and Export follow the filter, so Error → Excel is the list of rows to fix. [Docs](https://dbmn.io/docs/console/#input-status) (GitHub Issue #304)
- **Paste a spreadsheet row into the Run API form** — Copy a header row and one data row from Excel or a CSV, then click **Paste** (or Ctrl+V in any field); every field whose name matches a column is filled. [Docs](https://dbmn.io/docs/run-api/#paste-a-row) (GitHub Issue #302)
- **Right-click a run in History** — The actions its Console footer would show: **Pause**, **Resume**, **Cancel**, **Delete**, **Open**, **Reprocess…** and **Re-run**. [Docs](https://dbmn.io/docs/hub/#history) (GitHub Issue #314)
- **Delete and update endpoints in bulk** — In the API Catalogue, **Select** offers **Delete**, **Export** and **Update**. **Update** replaces Set System…: one dialog sets the System and adds or removes tags in a single save, so thirty endpoints no longer take thirty seconds. [Docs](https://dbmn.io/docs/hub/#api-catalogue) (GitHub Issues #310, #315)
- **Recent endpoints at the top of the catalogue** — The five endpoints you last opened, saved or ran sit above the tree. The section collapses, hides while you search, and can be switched off under Settings → API Catalogue → Recent. [Docs](https://dbmn.io/docs/endpoints/#recent)
- **Parent keys stay pinned as you scroll JSON** — In the Raw tab, the endpoint Body and the Data Transformer preview, the enclosing objects and arrays stay at the top of the editor, up to five levels. [Docs](https://dbmn.io/docs/console/#raw-tab) (GitHub Issue #296)
- **Run Batch no longer insists on a column for an optional variable** — If your template has `{{sku|opt}}` and your file has no `sku` column, leave it unmapped: the request simply leaves `sku` out (`|null` sends `null`). Required variables must still be mapped. [Docs](https://dbmn.io/docs/template-variables/)
- **Sign in from the Hub header** — While signed out, the header shows **Sign in to DBMN** in place of the environment selector. [Docs](https://dbmn.io/docs/hub/#environment-selector)
- **Open folder in Settings** — Beside **Change folder…**, **Open folder** shows the DBMN workspace folder on disk, so you can check where your history lives. [Docs](https://dbmn.io/docs/hub/#settings)

### Changed
- **Review step matches the Raw tab** — Run Batch's Review step now looks like the Console's Raw tab and shows the first five requests the batch will send (or all of them), not just one, each with the input rows behind it. **Configure** beside it shows only the settings that apply, and the ⓘ on API calls explains how rows become requests. Variable names may contain dots (`{{location.gln}}`). [Docs](https://dbmn.io/docs/batch-preparation/#step-4-review-json) (GitHub Issue #308)
- **Run Batch Next always re-checks** — Next stays enabled on Map and Validate; pressing it with something left to fix lists what. Validate checks every row and opens on the rows to fix. Delete a row from its number; Ctrl+Z undoes it. [Docs](https://dbmn.io/docs/batch-preparation/#validation) (GitHub Issue #247)
- **Nested batches: a new request when any header field changes** — Rows used to fold into one request whenever the *first* header variable matched, and **API calls** counted the same way. **Behaviour change:** rows that share an identifier but disagree on another header field now go out as two requests; check **API calls** on Review against the orders you expect. [Docs](https://dbmn.io/docs/batch-preparation/#nested-grouping)
- **DBMN's default views show the status code and the body** — The DEFAULT view DBMN builds for a response used to include every field of its own wrapper: eleven response headers, `status`, `httpStatusText`, `executionId`, with `error` off the side of the table. It now adds only `httpStatus` beside your API's fields, so a failed request opens with `error` in view. Your saved views are unchanged, and the View editor still offers every field.
- **A cleaner Raw tab** — Status and Show Input / Request / Response sit in the bar. A run with one transaction shows it directly. A request with no body shows its details only. Retry is now called **Reprocess**. [Docs](https://dbmn.io/docs/console/#raw-tab) (GitHub Issue #306)
- **Paginated batches can be reprocessed** — Reprocess re-runs failed pages like any other batch. Split Array Errors is still not offered there. [Docs](https://dbmn.io/docs/batch-reprocessing/) (GitHub Issue #296)
- **Restart with a batch running** — The next start pauses it and any batch queued behind it, and tells you in the Hub with a link to History. [Docs](https://dbmn.io/docs/troubleshooting/#batch-after-restart) (GitHub Issue #313)
- **Copy batch removed from the Console** — The footer's **Copy** button, which copied a batch to another environment, is gone. Copy and Export of results are unchanged. [Docs](https://dbmn.io/docs/console/#copy-options)
- **Console icons** — The Console uses the same icon set as the rest of the Hub instead of emoji. (GitHub Issue #312)

### Fixed
- **Transaction history survives two VS Code windows** — With two windows open, each saved its own copy of the history database over the file, so runs recorded in one window could vanish when the other saved. DBMN now merges what the file gained before it saves.
- **`{{A8:sequence}}` increases every time you run an endpoint** — The counter only advanced during part of a batch, so every run handed out the same number. Every draw now spends a number, and all occurrences in the same object share one. **Behaviour change:** previewing consumes numbers too, so the sequence can jump; a number is never reused. (GitHub Issue #288)
- **`|opt` and `|null` work in nested templates** — A blank cell behind `{{part:string|opt}}` was sent as `""`, `|null` sent `""`, and a typed variable with a modifier was sent as a string. **Behaviour change:** grouped batches that relied on `""` for an empty `|opt` field now omit it. [Docs](https://dbmn.io/docs/template-variables/)
- **Large batches open at once and no longer slow everything down** — A batch with thousands of transactions showed its first rows within a second instead of minutes; the rest stream in. A running batch counted its members by loading every one, many times a second, which stalled the Hub; it is one query now. [Docs](https://dbmn.io/docs/console/) (GitHub Issue #312)
- **The Raw tab stays quick on thousands of transactions** — It renders a window of cards with **Scroll for more**, opens on **Running** while the batch runs, and asks only for the bodies on screen. [Docs](https://dbmn.io/docs/console/#raw-tab) (GitHub Issue #312)
- **Console Settings tab works again** — Name, Error Handling and Processing Mode save again, and raising threads takes effect on the next transactions. The Completed tab keeps your scroll position as results arrive, and the Activity drawer's progress bar fills. [Docs](https://dbmn.io/docs/console/#settings-tab) (GitHub Issue #312)
- **A queued batch can be cancelled, and shows when it will start** — It reads **Queued** with "Starts in ~4m", Cancel leaves the queue, and a single request runs straight away instead of queueing. [Docs](https://dbmn.io/docs/console/#execution-queue) (GitHub Issue #309)
- **Fetch all pages kept every page** — Fetching the remaining pages wrote one page over the one before it, so Export, Copy and a reopened run read one page twice and missed another. Re-run Fetch all pages on an affected run.
- **Retrying the first page no longer fetches every page** — A later successful retry of a failed first page could quietly fetch up to 99 more. (GitHub Issue #296)
- **Training Ground: Fetch all pages no longer loses rows** — List endpoints sorted on a shared timestamp alone, so pages could overlap. Pages are now stably ordered.
- **The Console no longer opens on "No Data Found" for a fast, paginated Run API** — A page that answered within a second of the Console opening drew from a table of results taken before the result arrived.
- **The Error tab count is right while you retry failures** — Resume and retry left the count where it was over an empty table; it now follows each retry.
- **History shows a fixed batch as fixed** — Reprocessing a failed transaction of a finished batch ran it, but History kept the old failure count.
- **Reprocess works on a single transaction** — Retrying a failed transaction that wasn't part of a batch did nothing and left it showing Pending. (GitHub Issue #296)
- **Split transactions show the row they came from** — After **Split array errors**, each new transaction showed an input row picked by position, often the wrong one. (GitHub Issue #304)
- **No more "Unsorted data detected" on a plain bulk upload** — A flat template has nothing to group by, yet Run Batch re-ordered your file. Flat templates are now loaded exactly as you gave them.
- **No more two columns called `name`** — Where two fields share a name (`location.name`, `product.supplier.name`), those columns are headed by their path, on screen and in every copy and export.
- **Excel export honours the search filter** — With a search active, Export → Excel wrote every row of the tab. The sheet for the tab you are on now carries your filter, columns and view.
- **Console results no longer go blank while you scroll** — The table sized its scroll buffer for rows taller than they are. It now measures the real row height and keeps rows ready ahead of you. (GitHub Issue #287)
- **Format keeps comments on their line** — Formatting an endpoint body moved a trailing comment onto the next line. [Docs](https://dbmn.io/docs/endpoints/#request-body) (GitHub Issue #305)
- **Paste Endpoint works on a new endpoint in the Hub** — A new endpoint opened from the Hub hid its Paste button and ignored Ctrl+V, because the Hub's drafts were not recognised as new. A pristine draft now opens on a **New Endpoint** strip with **Paste Endpoint** first. (GitHub Issue #291)
- **CSV and batch-data notifications appear in the endpoint editor** — Messages from the CSV upload and mapping flow were written to a bar that only existed in Run Batch, so the endpoint editor's batch-data flow dropped them silently. They use the shared toast now. (GitHub Issue #268)
- **Hub settings survive a restart** — Group by, Show, the Recent toggle, transaction filters and the column width were forgotten on every restart. They are kept with your other DBMN settings now.
- **Hub tabs are no longer squashed by the side panel** — The tab area keeps at least 600px; the list panel yields and hides on narrow windows. Settings, Account, Import and Export open as Hub tabs instead of in the panel, and full-window editors keep their footer as a strip you hover to reveal. (GitHub Issue #292)
- **Hub Import & Export were empty** — The Export page listed nothing and Import's drop zone did nothing, because the page never started up inside the Hub.
- **An empty API Catalogue offers New Endpoint from Clipboard** — Before your first endpoint, the catalogue showed only **+ Add Endpoint**; the clipboard button appeared only once there was an endpoint. Both are there from the start. [Docs](https://dbmn.io/docs/hub/#api-catalogue)
- **Import no longer stops at a duplicate endpoint name** — Clashing endpoints are renamed "Name (folder)", and anything that can't be imported is listed.
- **Systems survive export and import** — Exports now carry the System name; import matches an existing System by name or creates it. Older export files still import. (GitHub Issue #290)
- **Loading a file that's open in Excel** — The Windows file dialog refuses a file another program holds open; the dropzone now says drag & drop works. A file that can't be read is now named with the real error instead of `Error reading file: undefined`. (dbmn-io/dbmn Issue #4)
- **A newly licensed environment is noticed without signing out** — DBMN kept a "not licensed" answer until you signed out and back in. It now re-checks, at most every ten minutes.
- **Usage counts can no longer be lost when two windows sync at once** — The server now adds the weekly usage increment in a single step. (GitHub Issue #295)
- **Hub header no longer clips the environment name** — Descenders were cut off; the header is taller and carries the DBMN mark. (GitHub Issue #285)
- **Restarting the extension host no longer leaves two Hub tabs** — DBMN re-attaches to the Hub tab VS Code restores instead of opening a second one. (GitHub Issue #286)

### Security
- **Exports no longer carry credentials by default** — An export wrote each environment's OAuth client secret and Google service-account key in plaintext while the docs called export files safe to commit. Exports now strip them; tick **Include environment credentials** when you do want them. **Action required:** if you shared or committed an export made before this release, rotate the OAuth client secrets and service-account keys in it. (GitHub Issue #289)

## v0.2.1 — 2026-08-24

### Added
- **Prod Protect** — environment types set centrally and locked for managed environments, so a production instance can't be reclassified. Production environments now show in red in the environment selector. [Docs](https://dbmn.io/docs/prod-protect/) (GitHub Issue #273)
- **New endpoints inherit the System from the active environment** — creating an endpoint (New or Paste) now pre-selects the active environment's System.
- **Production environment safeguards** — Environments typed **Production** now turn the Hub header red and require a confirmation before every live execution. **Behaviour change:** this is driven by the environment type alone, with no setting to switch it off. [Docs](https://dbmn.io/docs/environments/#environment-type) (GitHub Issue #273)
- **VS Code chords work from inside the Hub** — Command Palette, Quick Open, New / Open File, toggle Sidebar / Panel / Terminal, Settings and the Ctrl/Cmd+Shift view-focus chords now reach VS Code even when focus is deep inside a Hub tab.

### Fixed
- **Download Template no longer produces columns for `{{ENV:…}}` / `{{V8:…}}` variables** — Templates were emitting variables the runner already substitutes, so you were asked to fill values that had no effect. ENV, V8 and A8 prefixes are now excluded. [Docs](https://dbmn.io/docs/endpoints/#download-template) (GitHub Issue #284)
- **Batch rows weren't auto-grouped with multiple arrays** — Grouping only examined the first top-level array, so a static block ahead of the data-driven one made every CSV row its own request. **Behaviour change:** the same endpoint and CSV may now produce fewer transactions. [Docs](https://dbmn.io/docs/batch-preparation/#step-4-review-json) (GitHub Issue #279)
- **Hub environment dropdown showed multiple orgs ticked** — Every environment's remembered org was ticked, not just the active one's. The tick now appears only under the active environment. (GitHub Issue #273)
- **Endpoint URL was covering the endpoint name in the Hub catalogue** — Rows repeated the path their group header already showed, squeezing the name into an ellipsis. The prefix is now stripped and the name column gets more room. (GitHub Issue #274)

## v0.2.0 — 2026-07-20

### Added
- **Click cut-off console cells to see the full value, smartly formatted** — Any cell whose text is **truncated on screen** (cut off with an ellipsis), or whose value is **structured** (escaped JSON, BASE64 blob, ZPL label markup), is now click-to-expand — a `maximize` icon fades in at the cell's right edge on hover, and a quick preview shows on the tooltip. Clicking opens a modal with the value auto-detected and formatted — JSON is pretty-printed, escaped JSON is unescaped, BASE64 is decoded (and pretty-printed if it wraps JSON), ZPL is shown byte-accurate. It **expands nested payloads recursively** too: a JSON field that is itself an escaped-JSON string or a BASE64-of-JSON blob (common in integration messages — `Header`, `ExceptionMessages`, `data`) is decoded in place so the whole tree is readable, while opaque/encrypted tokens that merely look like BASE64 are left untouched. A **Format** picker overrides the detection (Auto with nested expansion / Auto / JSON / Escaped JSON / BASE64 / ZPL / Raw) and there's a one-click **Copy**. Discoverability now tracks what's actually cut off rather than a fixed character count, so short-but-clipped values are reachable too. (GitHub Issue #271)
- **Run API on parameterised endpoints** — Endpoints with template variables now offer both **Run API** (fill values in a single DBMN modal) and **Run Batch** (drive from a CSV) — previously the batch flow was forced, so the single-shot path was unreachable. Buttons appear on the endpoint editor footer and on each hub catalogue row. Values run through batch prep's own `applyModifiers`, so `|>0`, `|int`, `|3-50`, `|opt`, `|null` etc. enforce the same rules Run Batch uses — errors paint inline against each field without dismissing the modal. Two-column layout when the endpoint has more than 5 variables.
- **Bulk select + delete on Hub transactions** — The transactions tab has a modal "Select" mode that keeps the default view clean and reveals checkboxes only when you ask for them. Click the **Select** toggle above the list once to reveal per-row + per-group checkboxes (toggling a group's checkbox ticks every transaction in that group, across any group-by mode — date, endpoint, environment, status); click it again to select every transaction matching the current filters; click again to clear. The sectional footer mirrors the import/export pattern — a subtle "N selected" on the left, a **Delete** button on the right (only the one action, no clutter) — and a small ✕ next to the Select toggle exits selection mode. Delete honours the existing `dbmn.ui.confirmTransactionDeletion` setting and runs as a single SQL transaction with a >50%-of-table safety guard for large databases. Also new: a **date-range filter** (From / To), and the search box now scans request/response **body content** automatically — type a SKU or order id and it surfaces transactions where it appears anywhere in the payload, not just in the endpoint name or error metadata. (GitHub Issue #246)
- **DBMN Hub** — A single unified management surface for the extension, opening in an editor tab from a new activity-bar icon. The Hub hosts these sections, with the environment selector pinned to the top of the nav so it's always visible across sections:
  - **API Catalogue** — Faceted browser of endpoints (search, method chips, group by URL / Method / System / None, filter to Current Environment or All Systems). Each row has a play icon — single-call run when the endpoint has no template variables, batch run when it does. Click the row body to edit. **Single-pane rule:** column 1 holds the Hub, column 2 holds at most one workspace pane at a time (editor OR console OR Run Batch); switching between them prompts the existing Save / Discard / Cancel dialog when there are unsaved changes, so you never strand a half-edited endpoint.
  - **Environments** — Manage environments inline + an **Add Environment** affordance; the active environment is marked with a paw-print icon and the env selector in the header tracks org selection too (inline sub-rows under each env, click to switch env + org in one step).
  - **History** — Transaction history with status chips, search, and Group by date / endpoint / environment / status. Click to open the matching console.
  - **Import / Export** and **Account** — embedded directly inside the Hub (the standalone webviews still work via the command palette, but the Hub variants don't take a separate editor tab — they swap in place).
  - **Settings** — All DBMN-namespace preferences in one place: API Catalogue Show + Group by, Transactions Show + Group by, Execution (auto-open console on completion, treat network errors as critical, critical HTTP codes, max CSV rows), UI (confirm transaction deletion), Workspace folder + executions database path with a **Change folder…** button, Systems list + add, and the legacy menu toggle.
- **Window controls on Run Batch** — Run Batch now matches the endpoint, environment, and console editors with a maximise / close cluster in the top-right.
- **Pagination via the request body** — DBMN pagination previously only worked when page/size lived in query parameters. Many search endpoints page through the **body** instead (`{ "Query": "...", "Page": "...", "Size": "..." }`), where cranking `Size` up to fetch everything in one call hurts performance. You can now put the same `{{A8:PAGE:0:header.totalCount}}` and `{{A8:SIZE:20}}` templates in the body, and DBMN drives pagination from there — first page on Run, then **Fetch Next Page / Fetch All** in the console, with total-pages calculated from the response just like query-param pagination. The body editor now autocompletes `PAGE` and `SIZE` after `{{A8:` (inserting the basic `{{A8:PAGE:0}}` / `{{A8:SIZE:20}}`) and recognises both as valid templates instead of flagging them as unknown A8 variables. To enable **Fetch All** you need a total-count path — the console's **Configure Pagination** dialog now handles body endpoints too: pick the total record count from the response and DBMN writes it back into the body template (`{{A8:PAGE:0}}` → `{{A8:PAGE:0:header.totalCount}}`), the same guided flow that already existed for query-param pagination. (GitHub Issue #245)

### Improved
- **View builder sees fields that only appear in some responses** — The console's column picker used to derive its list of selectable fields from the **first** response alone. When that response had no detail rows (e.g. a transaction that returned an empty `data.lines`), those detail fields were unpickable — you had to hand-run a batch with a known-good record just to configure the view. The picker now merges the schema across responses (stopping once the schema stops growing, capped for large result sets), so detail fields surface as long as *any* sampled response contains them. The picker's column search also matches the full path now — searching `address` returns `data.address.street` **and** `data.address.town`, not just fields literally named "address". (GitHub Issue #270)
- **Responses missing detail rows are no longer silently dropped** — When a view pivots on a detail path (row basis) and a response has nothing there, that response used to vanish from the table entirely — even when you'd selected columns from a level *above* the detail (e.g. a header id or status). Those responses now still appear as a row with the ancestor columns filled in and the detail cells left blank, so you can see which records came back empty instead of them disappearing. (GitHub Issue #270)
- **Run Batch steps now scroll properly and never hide content behind the footer** — Every step scrolls within a standard container with the action bar pinned below it (no more content cut off on small windows); the Execute button stays disabled until you've scrolled the summary to the bottom; and the redundant pinned page heading is gone (the tab name already shows it).
- **Console and Run Batch open beside the Hub in column 2** — Previously the console could land in column 1 on top of the Hub depending on async timing (the registry's reveal-on-focus hardcoded column 1, and the console's `Beside` rule could resolve to whichever editor happened to be active when the execution completed). Both now pin to column 2 and the registry leaves the panel in whichever column it was created in.
- **Console toolbar — compact layout** — The toolbar was wasteful at narrow widths: emoji search icon stuck up next to the input, the row count printed both next to the search box and below the table, four separate help icons crowded the toolbar, and the `View:` prefix duplicated information the dropdown already showed. The 🔍 emoji becomes a Lucide search glyph inside the search box; the inline `(X of Y)` count moves into the footer row count (which now shows `filtered of total rows` when a search is active); the four toolbar help icons collapse to two (one after the search box, one after Export); the `View:` prefix is dropped from the view selector; the toolbar padding tightens for less vertical bulk. Across every webview, the context-help icon is now Lucide `file-question-mark` for a more consistent visual language. (GitHub Issue #262)

### Removed
- **Legacy sidebar tree views** — The "Environments", "API Endpoints", and "Transactions" sidebar trees have been removed; clicking the DBMN activity-bar icon now always opens the Hub. The Hub has replaced every workflow the trees offered (catalogue browsing, environment management, transaction history with bulk delete) and the `dbmn.useLegacyMenu` escape-hatch setting is gone. Several command-palette entries that only made sense in a tree context (Refresh Explorer, Search Endpoints, Add/Rename/Delete System, Rename/Delete Environment Folder, View Execution Details, Show Queue Position, Run Now, View Execution Logs, Toggle Batch Progress) are also removed — Hub UI covers them or they had no remaining caller. (GitHub Issue #246)

### Changed
- **Running an endpoint now requires being signed in to DBMN** — Execution stays free and unlimited (single API calls aren't metered), but you now need to be signed in before you can run anything, so every execution is tied to your account. Previously a signed-out user could run single-call endpoints on environments that use their own auth (OAuth / API key / none); now the **Run** action prompts you to sign in first (the same one-step magic-link flow), and the run continues after you click the emailed link. In the Hub's API Catalogue, the per-row play icon is hidden while you're signed out — browsing and editing endpoints stay fully available — and reappears the moment you sign in. (GitHub Issue #208)
- **One sign-in, one place** — The Account panel used to offer three different ways to sign in (magic-link form, email + password form, "Sign in via browser" button); the playground gate used a separate two-step modal. Both are unified now: a single **Sign in to DBMN** button in the Account panel (and its Hub-embedded twin) opens the same modal the playground uses, the modal is one step — email + Sign In + Cancel — and the email is pre-filled from your last sign-in even after a sign-out or expired token. New email addresses are registered automatically (the same Supabase OTP call handles both new and returning users), so there's no separate "register" path. The legacy password and browser sign-in code paths are removed. (GitHub Issue #263)
- **Console search — `+` and `-` now require a word boundary** — `+` AND and `-` exclude only count as operators at the start of the search or after a space (`,` still works anywhere outside quotes). Hyphens and pluses inside identifiers — `ACAU-ASR3690`, `foo+bar` — are now literal characters, so they no longer collide with the operators. Operators light up in colour as you type, so if a `+` or `-` doesn't change colour, it's being treated as part of the term. Each comma-separated OR clause renders as its own subtly-tinted chip with the comma inverted between them, so multi-clause queries are visually obvious. **Breaking:** no-space `foo+bar` and `ACAU-ASR3690+"07"` are now literal substring searches — type `foo + bar` and `ACAU-ASR3690 + "07"` to combine. (GitHub Issue #261)
- **Console search — every comma is OR, every clause is independent** — A negative like `-error` now only constrains the clause it sits in. So `WOOF -Rub +da,Rub` correctly returns rows matching the first clause (WOOF + da, no Rub) plus rows matching the second clause (Rub). To exclude something across every alternative, repeat it in each clause — `foo -err,bar -err` — or keep it in a single clause (no comma). **Behaviour change:** queries like `foo,-error` previously meant "match foo and globally exclude error"; they now mean "(foo) OR (rows without error)" — write `foo -error` (no comma) for the old meaning. The same applies to `-error,-pending`, which is now `(NOT error) OR (NOT pending)` — write `-error -pending` for "exclude both". (GitHub Issue #261)

### Fixed
- **Console search now finds text inside nested cells** — Searching for a value that plainly existed in the response could return no matches when that value lived inside an object or array cell (an expand-cell array, a nested payload). Those cells were being collapsed to the literal `[object Object]` before matching, so their contents were invisible to search. Cell values are now deep-stringified for matching, so a SKU, id, or any text inside a nested cell is found. (GitHub Issue #270)
- **Pausing a paginated batch now actually stops it** — Hitting Pause on a running paginated batch (Fetch All) left transactions executing — pause flagged the status but never halted the work, and resume couldn't reliably pick it back up. Paginated batches now run under a single execution loop like a standard batch, so Pause stops execution at the next transaction and Resume continues the remaining pages. (GitHub Issue #266)
- **Endpoint templates contained 100 invisible "phantom" rows** — Templates created via **Create Template** on an endpoint reserved 100 blank rows below the sample row and styled every cell in them. Excel showed those rows as empty, but Run Batch's loader treated them as real data and produced 100+ phantom transactions with no source values — errors the user couldn't fix from the UI. Two fixes: (1) the template generator now emits only the header row and the sample row (Excel Tables auto-extend when you type below them); (2) the batch loader now passes `skipEmptyRows: true` on every Excel import, so any XLSX with trailing or interspersed blank rows — DBMN-generated or hand-edited — is filtered on load. (GitHub Issue #256)
- **Run Batch is now offered when only a query parameter has a template variable** — The smart-run "single API vs Run Batch" decision only inspected the body and path for `{{user variables}}`, so an endpoint with `customerId={{customerId}}` as a query parameter and no body/path templates went straight to single API every time. Query-param values (with `enabled: true`) are now part of the detection. The in-editor **Run** button shared the same blind spot through a stale input selector (`paramValue`/`headerValue` instead of the rendered `query-param-value`/`header-value` fields) — it now counts query-param **and** header placeholders too, so the button correctly flips to **Run Batch**. (GitHub Issue #257)
- **Commented-out body placeholders no longer force Run Batch** — A body whose only `{{placeholders}}` sat inside `//` or `/* */` comments (e.g. a `// "Query": "{{SKU}}"` line you'd disabled) still flipped the button to **Run Batch** and then prompted for CSV input with nothing to fill. The body is now comment-stripped before the variable count, so a fully commented-out template runs as a single **Run API**. (GitHub Issue #255)
- **Query-param repetition dropped your other query params** — Running a batch whose query had a repeated value (e.g. `query: ItemId={{SKU}}[ or ]`) sent **only** that repeated parameter — any other enabled query param, most importantly `size`, was discarded. The host then fell back to its default page size (20) and silently returned a fraction of the matches. Repetition transactions now carry every enabled query param, so `size=90` (and the like) reach the host as intended. The batch log also reports an `issue#224` line confirming how many input items were included across the query groups, and warns when blank values cause rows to be skipped — so you can verify nothing was dropped. (GitHub Issue #224)
- **Save and Continue did nothing** — When prompted to save unsaved changes before switching context (e.g. closing the editor with pending edits, or running another endpoint while the current editor is dirty), clicking **Save and Continue** would silently time out and treat the response as "didn't save", abandoning the user's edits or aborting the action. The base webview was posting a `saveCurrentContext` message that no frontend listened for; it now invokes the subclass save handler directly so the editor's own save trigger runs.
- **Console — "Remaining time" hides on completion** — Stays visible on Pause/Stop when an ETA was calculated; resumes the countdown on Resume. (GitHub Issue #264)
- **Console — expanding a sub-row keeps scroll position** — Viewport stays anchored at the button, and clicking the same button again collapses without jumping. Hiding a column inside a sub-row now persists across all saved views and re-expands. (GitHub Issue #267)

## v0.1.5 — 2026-05-13

### Added
- **Import endpoints from Postman collections** — The Import/Export view now accepts a Postman v2.1 collection `.json` file alongside the existing `.dbmn.zip`. Drag the file in, pick which requests to import, choose whether to use the folder names from the collection or import everything into one folder, and you're done. DBMN is a focused tool, so several Postman concepts have no equivalent and are not imported (pre-request/test scripts, saved response examples, OAuth/API-key auth, non-raw body modes, folder hierarchy beyond one level); affected endpoints are flagged in the import preview, and the [Postman import docs](/docs/import-export/#importing-from-postman-collections) cover exactly what does and doesn't come across. (GitHub Issue #189)
- **Console flags responses with no rows at the current row basis** — When some transactions in a batch have data at the row basis path and others don't (e.g. an `OLPN` array that exists on most responses but is missing or `[]` on a handful), the table silently dropped those responses' rows — making it look like the API failed. Three places now surface the problem: (1) a persistent warning notification in the standard console toolbar slot (same place as Pause / batch-failure): `⚠ N of M responses had no rows at <rowBasis>`; (2) a `⚠️` icon next to the active View name in the toolbar so the problem is visible at a glance; (3) the same icon next to every affected view in the View dropdown, so when picking a view you can see in advance which ones won't surface rows on this dataset. Hidden when the row basis is `root` or every response has rows. The shared footer notification helper now supports a `source` tag so the rowbasis warning only clears its own message — it won't nuke a pause notification owned by someone else (though when both want the same slot at the same time, the data-shape warning wins, on the basis that the Paused status pill already conveys the execution state). (GitHub Issue #250)

### Improved
- **Endpoint body editor — large-payload UX** — Editing a 5,000+ line raw JSON body was painful: the editor grew unbounded so the whole page scrolled instead of the editor; Ctrl-F found matches but couldn't scroll to them; and the action toolbar overflowed off-screen on narrow panels, hiding Undo / Redo / Format. Four changes: (1) the editor caps at 60% of the viewport height with Monaco's internal scrollbar handling overflow — Find widget reveal now works; (2) new **Full Window** button (top-right of the editor toolbar) pins the editor edge-to-edge for max editing space, **Esc** exits; (3) the toolbar no longer wraps or clips — when buttons don't fit, secondary actions (Encode, Delete, Redo, Undo, Comment in that order) collapse into a **More ▼** dropdown so primary actions stay visible at any width; (4) Full Window reuses the same Monaco instance, so edits persist when toggling. (GitHub Issue #249)
- **Endpoint footer — direct buttons + responsive overflow** — Duplicate, Download Template, and Delete (previously hidden inside the **More** menu) are now direct footer buttons alongside Paste and Share. The Delete button now uses an in-button arm-and-confirm — first click swaps the label to "Click again to confirm" with a red background; second click within 4s triggers the existing transaction-count check and native confirm. The **More** dropdown is now purely an overflow destination — it only appears when the panel is too narrow to fit everything; lower-priority buttons (Download Template, then Paste, Duplicate, Share, finally Delete) collapse into it as width shrinks. Save / Run / Add stay pinned at every width, and resizing the panel re-flows in real time.

### Fixed
- **Endpoint body editor reported the wrong line for JSONC syntax errors** — A body template with `//` comments AND a real syntax error (e.g. a missing comma) had the editor underline the first `//` instead of the actual broken line — making the error look like "comments are forbidden" when they're not. The validator stripped comments through a "safe" wrapper that, on detecting the stripped result was invalid, fell back to returning the original commented text — so `JSON.parse` then choked on the first `//` it saw. Validation now uses the unwrapped stripper so the parser always sees comment-free input and the error marker lands on the real syntax issue (and comments stay legal). (GitHub Issue #251)
- **Run Batch — Step 3 wouldn't let you paste a single value into a single cell** — On Step 3: Review & Edit Data, copying one value from another cell and pasting it into a target cell did nothing useful — the grid checked that the pasted column count *exactly equalled* the number of remaining columns from the target cell, so any single-value paste (or any partial-width paste) was rejected and re-routed to the paste area or refused outright. The check now only redirects when the paste has *more* columns than fit; same-or-fewer just lands at the target cell (the existing paste loop already handles partial widths). (GitHub Issue #252)
- **Console rendered empty arrays as an out-of-place block** — Cells containing `[]` showed a centred, padded "No items" pill that looked like a separate UI element rather than a value. Empty arrays now render as a quiet inline `[ ]` marker matching the rest of the cell's typography, with consistent wording across the main table and inline expansions. (GitHub Issue #250)
- **Console: Input tab unusable** — Opening the Input tab on any execution showed "No Data Found — Cannot read properties of null (reading 'rowBasis')". The Named Views work didn't wire the Input tab into the new view system, so the first access blew up trying to read a non-existent view. The Input tab now uses pre-canned read-only auto-views — **Mapped Columns** (only the input columns referenced by the endpoint's `{{template variables}}`) and **All Columns** (every input column) — generated on the fly from the endpoint config and the input data. The View dropdown lets you flip between them; there's no editor (these views are derived, not authored). Defaults to **Mapped Columns** when the endpoint has template variables, **All Columns** otherwise. The × hide-column button is also suppressed on read-only views. (GitHub Issue #248)
- **Delete button missing on paused batches; stale Console after tree-delete** — Two related bugs in the Console / tree-view interaction. (1) Pausing a live batch hid the **Delete** button — it only came back if you closed and re-opened the Console. The live-state path treated `paused` and `stopped` differently for Delete visibility, where the re-open path treated them the same. Both paths now show Delete for paused and stopped batches consistently. (2) Deleting a transaction or batch from the tree view left any open Console webview for that record on screen, showing data that no longer existed. The delete command now closes the matching Console webview after successful deletion (matches the behaviour you already get when deleting from inside the Console). (GitHub Issue #217)

## v0.1.4 — 2026-05-07

### Added
- **Auto-generated `DEFAULT` view on first open** — Brand-new endpoints, or the first time you open the Console for a URL+method scope that has no saved views, used to drop you onto a `Root` view containing only the response's top-level scalar fields — frequently empty for envelope-shaped Manh responses where the actual data sits under `data.items[]` or `data.lines[]`. Now you land on a `DEFAULT` view that picks the response's main array as the row basis (using a `data` / `items` / `results` / `records` / `body` / `content` / `response` / `payload` name preference, falling back to the highest-scoring array of objects in the response) and surfaces up to 20 columns from a sample row. Editing `DEFAULT` and saving promotes it to a regular user view — no further auto-regeneration. Delete it to get a fresh one. `DEFAULT` is per-tab (Completed and Errors generate independently) and never travels via endpoint export — recipients always derive their own from their first response. (GitHub Issue #242)
- **View Editor — quick-win polish** — Tree opens with the first two levels expanded for fresh views (so you see the structure on open, not just root keys). Every group row now has a tri-state checkbox that cascades to all leaves under it — `checked` when all are selected, `indeterminate` when some, `unchecked` when none. New **Sort** button in the Selected Columns header re-orders selected columns to match JSON source order. New **Remove All** button clears every selected column (arms a confirm step when more than 5 are selected). (GitHub Issue #242)
- **Magic-link sign-in** — A new **Email me a sign-in link** option in the Account sign-in screen and on dbmn.io. Enter your email, click the link in your inbox, and you're signed in — no password needed. Sits alongside the existing email/password and "Sign in via Browser" paths; clicking the link from email hands you straight back into VS Code via the existing URI handler. The extension is sign-in only — if there's no account for that email, you're pointed at **Create Account on dbmn.io**. (GitHub Issue #233)
- **Faster signup** — `register.html` is now a single-screen form. Default path is **Email me a sign-in link**: enter email, click link, 30-day trial starts. A "Use a password instead" toggle is still there for users who prefer it. The pre-signup questionnaire (role, tools, use cases) has been removed — friction reduction is the priority; those questions will resurface post-onboarding. (GitHub Issue #233)
- **Sticky column headers** — The Console main table's column header row now stays pinned at the top while you scroll the data underneath. (GitHub Issue #238)
- **Named Views — dedicated docs page** — The View Manager has graduated to its own [Named Views](/docs/named-views/) sub-page under Console. Covers the View dropdown, View Editor, Row Basis (with worked example), Set as Row, Save As, Default View, Hide a Column, and how views travel with endpoints.
- **Help icon in the View editor modal** — Opens the [Named Views](/docs/named-views/#the-view-editor) docs page. (GitHub Issue #236)
- **Help icon in the Raw tab** — Opens the Raw tab section of the Console docs. (GitHub Issue #236)

### Changed
- **Copy / Share Endpoint excludes inherited environment headers** — Previously the share output included every header row visible on the endpoint, including the inherited (greyed-out, environment-supplied) ones — which meant your auth tokens and host-specific values travelled with the share. Only endpoint-specific headers are included now; the recipient's active environment supplies inherited headers as it always does. Endpoints copied under earlier versions still paste cleanly.
- **Named Views are now shared by URL + method** — Previously, each endpoint kept its own private view library, so users with many endpoints pointing at the same URL (e.g. several flavours of `POST /lpn/search` — by id, by pallet, by item, by date) had to rebuild the same views on every endpoint. Views are now scoped by URL + method, so any endpoint targeting the same `METHOD /path` shares one view library — save a view on one, see it on all of them. Existing views are migrated automatically the first time you open the Console after upgrading; if two endpoints had different views with the same name, both are preserved with `(2)` / `(3)` suffixes. Deleting an endpoint no longer removes views shared with siblings. (GitHub Issue #237)

### Fixed
- **Inline array expansion broken on large datasets** — On responses with more than 200 top-level rows, clicking `▶ N records` was effectively unusable: the parent column wouldn't grow to fit the nested table (it overflowed into adjacent columns), and the moment the row scrolled out of view the expansion was lost — scrolling back showed it collapsed again. Both come from the virtual-scroll layer (per-cell width locks; off-screen rows torn from the DOM). Fixed: dropped the per-cell inline width-lock so cells size to their nested content; gave each expansion a deterministic id so a Set on the manager can restore open state when virtual-scroll recreates the row; lazy-render the nested table HTML only on actual expand (avoids generating thousands of hidden nested tables up front); and skip virtual windowing entirely while any expansion is open (capped at 5,000 rows) so variable expanded-row heights don't break the offset math and cause "scroll jank". Multi-expand across many rows works again. (GitHub Issue #238)
- **Console help icons did nothing when clicked** — Every (i) help icon in the Console (Execution Summary, Search, Copy, Export, Pagination) was silently broken — clicking did nothing. Now they open the right section on dbmn.io. The Copy and Export icons also no longer trigger their parent dropdown when clicked. (GitHub Issue #236)
- **View Editor wouldn't let you pick an array of primitives as a column** — A response field like `LocationIds: ["ED0407E01"]` showed up as an empty expand/collapse group with no checkbox — there was no way to surface it in the table. The tree builder treated every array as a group regardless of element type. Arrays whose elements are all primitives (or null) are now leaves with a checkbox, just like any scalar field; the cell renders `[N items]`. Arrays of objects are unchanged — they still group for the Row Basis flow. Search inside the View Editor also finds these now. (GitHub Issue #239)
- **Copy and Export emitted "[N items]" instead of the actual array values** — Once you could pick a primitive array column, the next problem surfaced: every Copy / CSV / TSV / Excel / Markdown / HTML / SQL export rendered the cell as the display summary (e.g. `[1 items]`), not the underlying values. The export pipeline pre-stringified every cell with the same formatter the on-screen grid uses, so the per-format serialisers in the export service never saw the raw array. Now the pipeline passes raw values through and each formatter handles arrays itself: arrays of primitives become comma-joined (`"ED0407E01"`, or `"ABC,EFG"` quoted by CSV), JSON exports keep them as native arrays, and arrays of objects fall back to JSON. Object cells likewise serialise to JSON instead of `[object Object]`. (GitHub Issue #239)
- **Run Batch paste from Excel produced blank rows in Step 3** — Pasting tab-separated data from Excel (or pipe-delimited data) into Run Batch's paste tab worked through Step 1 and Step 2, then showed every row as blank in Step 3 Review. Only comma-separated paste worked. The paste handler was normalising the pasted content to CSV but storing the *original* delimiter on state, so Step 3's parser tried to split comma-delimited content by tab and got nothing back. The stored delimiter now always matches the normalised content. (GitHub Issue #240)
- **"Download Template" did nothing when clicked** — The new menu item from 0.1.3 was effectively dead: the click handler was never exposed on `window`, so the inline `onclick` threw a ReferenceError silently, and a separate CSS rule (`pointer-events: none` on the disabled state) swallowed the click whenever the endpoint had unsaved changes. Both fixed: the function is now exposed, and clicking on a new or unsaved endpoint shows a clear footer notification ("Save endpoint before downloading template") instead of failing silently. (GitHub Issue #241)

### Improved
- **Condensed Console column headers and rows** — Header row was using ~36-40px of vertical real estate per column; now ~24-27px. Sort and × hide actions live to the right of the title and only appear on hover (sort direction stays visible while a column is sorted). The `▶ N records` and `Set as Row` controls inside `data` cells dropped their chunky filled-button look in favour of inline links so the row isn't dominated by them. `Set as Row` is hidden until the array is actually expanded (it used to show on every collapsed cell). Nested tables sit flush under the controls — no dark wrapper, no extra padding, no double border. The `└` ancestor-column indicator was dropped (it was wrapping onto two lines on narrow cells without adding value). (GitHub Issue #238)

## v0.1.3 — 2026-05-03

### Added
- **Named Views — full Console redesign** — The Completed/Errors tabs now run on a Named Views model. A view is a saved configuration of which columns appear and which array in the response produces one row each (`Row Basis`). Pick `root` for one row per response, or any selected array path to denormalise that array. Multiple views per tab; switch instantly via the View dropdown; the most recently saved view is the default. Views save on the endpoint, so they ride along with endpoint export/import — share an endpoint and your views go with it. The editor has Available Columns search, expand-collapse groups (auto-expanded for views you're editing), drag- and keyboard-reorderable Selected Columns, and a `Set as Row` button on every expand-cell that drills the active view in place without leaving the screen. **Save As** clones the current view to a new name — fork an existing view to experiment without losing the original. CSV / Excel / clipboard exports all match the rendered table exactly. (GitHub Issue #229)
- **Download Template** — New option in the endpoint's **More** menu that generates an Excel template from the endpoint's `{{template variables}}`. The .xlsx file includes correct column data types (number, date, boolean, string), date format awareness from format modifiers, a sample data row, and 100 pre-formatted empty rows in an Excel Table with autofilter. (GitHub Issue #230)
- **Smart Run button** — The two separate **Run API** and **Run Batch** footer buttons are now a single intelligent button. It shows "Run API" when the endpoint has no template variables (direct execution with pagination), or "Run Batch" when template variables are present (opens the batch runner). The tree view play icon and endpoint search quick access also use the same smart routing. (GitHub Issue #232)
- **Sort state persistence** — Column sort (column and direction) is now saved per endpoint per root path and restored when reopening the console (GitHub Issue #228)
- **Excel-safe copy** — New **Excel** and **CSV (Excel)** options in the Copy and Export dropdowns. These prefix text-typed columns with an apostrophe so Excel preserves leading zeros and large numbers instead of converting to scientific notation. Excel copy uses TSV for clean column-separated paste. (GitHub Issue #225)

### Fixed
- **Silent CSV column shift on Run Batch upload** — When a row in an uploaded CSV / TSV / pipe-delimited file had the wrong number of columns (e.g. an unquoted comma like `SKU,FIX-004`, or a European-decimal value like `99,99`), the surplus field was silently dropped or the columns shifted into the wrong template variables — corrupting the batch with no warning. Run Batch now blocks Step 1 → Step 2 whenever any row's column count differs from the header, and replaces the upload tabs with a **repair panel**: a scrollable line-numbered list of every row with the offending ones flagged by a left-bar accent and an `N cols` pill on the right. The header line is pinned at the top. Click any data row to edit it inline; the pill updates live as you type. A `Show flagged only` toggle lets you focus on the bad rows when there are many. Cancel goes back to the upload tabs; Continue is disabled until every row aligns. For bulk-pattern issues, fix the source file and re-upload. Pipe-delimited files are now recognised alongside comma and tab. (GitHub Issue #226)
- **Console settings not saving** — Fixed bug where column visibility, root path, and sort state were never persisted for endpoints without prior settings. Also fixed race condition where saved view was overwritten on report open. (GitHub Issue #228)
- **Column hide (X) not saving** — Clicking X on column or group headers now persists the change to backend settings
- **Expanded nodes ignoring column visibility** — Expanding an inline array now honors the root column visibility settings instead of showing all columns

### Improved
- **Console search patterns** — Search now supports comma-separated OR (`abc,def`), AND (`active +pending`), wildcards (`abc*`, `a?c`), negation (`-error`), and exact match (`"phrase"`). Plain text search works as before. (GitHub Issue #227)
- **RAW tab response headers** — Headers view now displays as a styled two-column table (Header / Value) instead of plain text in the Monaco editor, making keys and values easy to scan at a glance
- **Console HTML export** — Body cells no longer carry inline styles (border, padding, background). Header row keeps its styling. Prevents VS Code theme colours from bleeding into Excel paste. (GitHub Issue #225)

## v0.1.2 — 2026-03-28

### Added
- **FlexionTech → DBMN migration** — Existing FlexionTech Active8 users can migrate their endpoints, environments, and folders to Dobermann via a one-click button on the Account page. Auto-detects when the FlexionTech extension is installed and surfaces a footer notification linking to the migration flow.
- **Auto-trial on sign-up** — New users now receive a 30-day trial automatically when they create their DBMN account — no manual activation step required.

### Fixed
- **License gating ignored environment licenses** — Batch execution, pagination, Fetch All, and concurrency limits now recognise environment-level licenses. Previously, an environment license alone wouldn't unlock these features without a separate user license.
- **Silent failure on batch execute** — License errors during a batch run now show a VS Code warning with a "View Plans" CTA. Previously, the Run Batch panel closed silently.
- **Email templates broken in Outlook dark mode** — Auth and transactional emails redesigned for Outlook dark mode compatibility.

## v0.1.1 — 2026-03-23

### Fixed
- **Activity bar title** — Changed from "DBMN" to "Dobermann" so the sidebar icon tooltip matches the extension name

## v0.1.0 — 2026-03-14

Initial release under DBMN publisher.

### Added
- **Sign In (New Token)** *(experimental)* — New OAuth button that forces fresh credentials by bypassing your browser's existing session with the identity provider. Use it when your roles or permissions have changed on the server and your current token has stale claims. Always visible alongside Sign In for OAuth environments. (GitHub Issue #212)
- **`{{A8:DBMN_TOKEN}}` system variable** — Auto-resolves to the signed-in user's DBMN access token in environment headers. Set `Authorization: Bearer {{A8:DBMN_TOKEN}}` once and the extension handles token injection and refresh. Gives you access to Puppy School.
- **DBMN Puppy School** — Live REST API sandbox for DBMN puppy training. GS1/EDI-aligned supply chain data (shipments, purchase orders, inventory). Supports 3-level nested uploads, paginated queries, and bulk inserts. Includes ~70k rows of realistic seed data. 50k row limit per user with 48h auto-purge. Requires active license or trial. (GitHub Issue #210)
- **Puppy School Reference Tables** — Carriers, locations, products, and trading partners as FK-validated lookup tables. GET responses include nested reference objects (e.g., carrier breed and motto embedded in shipments). New `/reference/<type>` endpoints for browsing valid values. All seed data replaced with dog-themed content (Dobermann branding). (GitHub Issue #210)
- **DBMN Registration & Licensing** — New user registration system with hard gate (sign-in required before any functionality). Supabase backend with PostgreSQL, Edge Functions, and Row Level Security. License tiers: 30-day trial, user ($15/mo), environment ($250/mo), and free tier with feature-gated limits. Privacy-safe telemetry tracking aggregate usage counters only. (GitHub Issue #208)
- **Redesigned free tier limits** — Individual API calls are now unlimited (replaces Postman). Power features are gated: 5 batch executions/week, pagination limited to 3 pages (Fetch All requires license), concurrency locked to 1 thread. Licensed users get unlimited batch/pagination/concurrency.
- **Excel import** — Import data from Excel tables regardless of where the table starts in the sheet (no longer requires A1). Filtered spreadsheets let you choose to import all rows or visible rows only.
- **Inline grid validation with load progress** — Validation errors highlight immediately as rows render during large file loads; the Next button shows loading progress and the Filter Errors button is always visible on Step 3
- **Always-visible row count** — Console data tabs now show the total row count at all times, not just when a search is active
- **Filter-aware copy/export** — Copy and Export now operate on filtered rows when a search is active, not all rows
- **Pagination UX overhaul** — Configure pagination directly from Console with auto-detected settings; "Fetch All" and "Get Next X Pages" with concurrent execution and execute-as-you-create pattern
- **Block reprocess for paginated batches** — Reprocess is disabled for paginated batches since re-fetching pages is the correct approach

### Fixed
- RAW tab now uses ~95% less memory for large batches (lazy card body rendering)
- **Batch file processing UX** — Improved performance and UX of file processing for batch uploads. Single footer progress bar across all steps, accurate time estimates for large files, and renamed button to "Import Data". (GitHub Issue #223)
- **Console RAW tab batch flashing** — Eliminated full-container DOM rebuild that caused the RAW tab to flash on every new batch result. Content updates now rebuild only the affected card body in-place. (GitHub Issue #222)
- **Telemetry data pipeline** — Fixed end-to-end telemetry: flush now uses additive upsert RPC (was failing silently due to missing user_id), stats formula corrected (batch_runs not batch_records), and Account dashboard detects post-sign-in auth transition to load stats immediately
- **Endpoint body editor line highlight** — Toned down the selected-line background in the Monaco editor so it no longer obscures text. For Jakes eyes only. (GitHub Issue #213)
- **Console batch controls** — Fixed changing threads, error mode, and batch name during execution; removed Stop button (use Pause instead) and reduced notification noise
- **Per-transaction URL in RAW tab** — Batch execution cards now show each transaction's resolved URL, headers, and query params instead of repeating the first member's details
- **Grid paste mismatch stays on Step 3** — Pasting mismatched columns or unparseable dates into a grid that already has data now shows a warning notification instead of redirecting to Step 1
- **Console RAW tab improvements** — Fixed save settings error, View Logs for individual executions, error handling without redundant popups, and direct log file paths

### Changed
- **Console** — Renamed "Report" webview to "Console"
- **Redesigned Environment webview** — Three-tab layout (General, Authentication, Headers & Variables) with shared Token Details section
- **Redesigned Run Batch workflow** — 5-step flow (Load Data → Map & Transform → Review & Edit Data → Review JSON → Execute) with new tab design, dedicated data grid step, and Enter Data button for direct entry

### Migrating from Active8
1. In Active8: use Import/Export to export your environments and endpoints
2. Install Dobermann from the Marketplace
3. In Dobermann: import the exported file
4. Uninstall Active8

## v0.0.50 — 2026-02-15

### Added
- **Template variable modifiers** — Validate and transform data with pipe syntax: `{{Name:string|3-50|upper}}`, `{{Qty:number|int|>0}}`, `{{Code:string|opt}}` for omitting empty keys, `{{Val:number|null}}` for null values
- **Modifier toolbar** — Visual toolbar for adding modifiers to template variables without memorizing syntax
- **`|asString` modifier** — Force any value to be treated as a string in JSON output
- **HTML response viewer** — Three view modes (Raw/Render/Text) for HTML responses in the RAW tab
- **Paste header confirmation modal** — Review and confirm pasted headers before they're applied
- **Rich copy from Console** — Copy transaction data as TSV, HTML, Markdown, or CSV
- **RAW tab improvements** — Enhanced JSON viewing with Monaco Editor integration
- **CSV auto-sort** — Detects unsorted CSV data for nested arrays and offers one-click sort with backup
- **Run Batch tabbed interface** — Three tabs: Enter Data, Upload File, Paste Text with tab data indicators
- **Tab delimiter support** — Auto-detects tab-delimited data from Excel paste and converts to CSV
- **Smart paste detection** — Mismatched column paste redirects to Paste Text tab with notification
- **Full-window drop zone** — Files can be dropped anywhere in Run Batch webview

### Changed
- Request and Logs tabs hidden in Console (RAW tab now provides this functionality)

### Fixed
- Import compatibility for older `.dbmn.zip` export formats
- Nested array template processing — root-level CSV variables correctly group into separate transactions
- File upload column mapping for CSV, TXT, and Excel files
- Marketplace presentation and metadata
- Error transaction Console tabs display correctly on re-open
- Copy Batch regenerates transactions for the target environment

## v0.0.49 — 2026-01-31

### Added
- **New template editor** — Monaco-based editor with syntax highlighting, autocomplete, and real-time error detection for template variables
- **ENV variables** — Reference environment-specific values with `{{ENV:varName}}` syntax
- **Sequence modifiers** — `:local`, `:global`, `:parent` modifiers for `A8:sequence` in nested arrays
- **Batch reprocessing** — Reprocess only failed transactions from a previous batch run
- **Smart paste** — Intelligent paste handling for grid data entry
- **Date math modifiers** — `+2d`, `-1d`, `+4h`, `+30m` for date/datetime variables
- **Settings tab** — File links for requests, responses, CSV, and folders in Console

### Changed
- Rebranded from "Active8" to "Dobermann" across all UI

### Fixed
- Query param repetition creating duplicate transactions instead of unique batches
- Slow batch generation for query param repetition with large CSVs
- Progressive Tab copy for deeply nested templates up to 4 levels
- Paste into number fields creating unusable text in Enter Data grid
- Blank rows with unchecked booleans not auto-deleted
- Nested batch execution stopping after first chunk
- Console export not using selected root element and visible columns
- Status-based classification for Console tabs

## v0.0.48 — 2026-01-14

### Fixed
- Nested array batch execution transaction counts
- Run API not processing A8 system variables correctly
- Unified JSON generation refactor for consistency

## v0.0.47 — 2026-01-13

### Fixed
- Nested array grouping correction for complex templates

## v0.0.46 — 2026-01-12

### Added
- **A8 datetime format specifiers** — Custom format strings for `A8:datetime` and `A8:date` variables
- **Date/DateTime format modifiers** — Control output format of date columns: `{{COL:date:iso}}`, `{{COL:datetime:YYYY-MM-DD}}`
- **Keyboard shortcuts for grid** — Tab, Shift+Tab, Enter, Ctrl+D, Escape, and arrow key navigation
- **Progressive Tab copy** — Tab creates a new row and copies parent values for faster bulk entry
- **Blank field validation** — Warns about empty fields when clicking Next in grid entry

### Changed
- Bug fix for data loss with large integers in batch mode data entry

### Fixed
- Date variable UTC timezone handling
- JSON escaping for special characters in substituted values

## v0.0.45 — 2026-01-12

### Added
- **Quick find menu** — Fast endpoint search via ALT-D E
- **JSONL support** — View JSONL responses in Console
- **BASE64 encoding** — Encode template sections using `:BASE64` suffix for PubSub/message queue APIs
- **Shorthand `{{}}` syntax** — Empty braces use the JSON key as the parameter name
- **Grid data entry** — Type-aware inputs: checkboxes for booleans, numeric validation for numbers
- **Enhanced mapping table** — Source Type dropdown with validation warnings for precision loss

### Changed
- Batch folder link opens in native file explorer when no workspace is open

### Fixed
- Virtual scrolling in Console for large datasets
- Template variables embedded in strings now substitute correctly (e.g. `"ACAU-{{SKU}}"`)
- URL path variables work in batch execution (e.g. `/api/location/{{pk}}`)
- Multiple occurrences of same variable all substitute correctly

## v0.0.44 — 2025-11-20

### Added
- **Copy CSV** — Quick clipboard export from Export menu
- **Max CSV rows parameter** — Configurable limit beyond default 100k
- **Nested template data** — Load nested data from a single CSV file

### Fixed
- Response file link appears immediately after API execution
- Contextual help icons in Console
- JWT validation accepts L1 organizations
- Queued batches no longer timeout after 10 minutes
- Leading zeros preserved when switching data type from number to string

## v0.0.43 — 2025-11-10

### Fixed
- Import/Export reliability improvements
- Documentation fixes

## v0.0.42 — 2025-11-05

### Added
- **Import/Export** — Share endpoints and environments via `.active8.zip` files with conflict detection and resolution
- **Contextual help icons** — In-webview documentation with inline modals

### Fixed
- Drag-and-drop file upload enables Next button in Run Batch
- Import deduplication by folder+name matching

## v0.0.41 — 2025-10-30

### Added
- **Pagination support** — Experimental pagination in Console and endpoint
- **Inline Run Batch button** — Rocket icon in tree view

### Changed
- Delete endpoint moved from tree view to endpoint webview with transaction count warning
- Run Batch button removed from endpoint webview

### Fixed
- Format JSON body line breaks

## v0.0.40 — 2025-10-17

### Fixed
- Service isolation and batch status validation
- Query param repetition for batch operations
- Save and restore disabled query parameters
