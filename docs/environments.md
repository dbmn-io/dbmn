---
title: Environments
layout: default
nav_order: 2
parent: Documentation
has_children: true
---

# Environments

Environments represent different API targets — production, staging, development, or anything else — each with their own authentication, configuration, and variables. Switch between targets from the Hub header without reconfiguring endpoints.

## Overview

Each environment contains:
- **Connection details** — Base URL, type, System and description
- **Authentication** — DBMN, JWT token, OAuth, Google Service Account, or none
- **Target timezone** — Timezone for datetime operations
- **Parallel processing** — How many requests a batch sends at once
- **Run in** — Where the web app sends this environment's requests from
- **Variables** — Key-value pairs available in templates via the `ENV:` prefix
- **Headers** — Environment-level headers included in every request

## Managing Environments

### Adding an Environment

1. In the Hub, open {icon:nav-environments} **Environments** and click **Add Environment**, or choose **New environment** at the foot of the header's {icon:env-switcher} environment selector
2. The **New environment** dialog asks for the [System](#system) first, then the **Base URL**. Click **Continue**
3. The environment opens in a tab with a name taken from the URL. On the **General** tab, change the name if you like and pick a type
4. On the **Authentication** tab, choose a method and configure it
5. Click **Save Environment**

The System comes first so that a Standard System's settings apply from the start. Two checks happen on **Continue**:

- **The address belongs to a different Standard System.** Dobermann asks **Use** that System, or **Keep** the one you chose. Nothing switches without you seeing it.
- **An environment already has this URL.** Dobermann says so and offers to **Open** it. **New** adds another environment for the same URL anyway; two can differ in sign-in or settings. When the existing one is on a different System from the one you chose, **Move** moves it to yours. This is the only way a saved environment changes System.

The environment appears in the Environments list and in the header's {icon:env-switcher} environment selector.

### Editing an Environment

Click an environment in the Environments list to open it in a tab. Change what you need and click **Save Environment**. **Run API** and **Run Batch** elsewhere in the Hub keep using the saved version until you do.

### Setting the Active Environment

Every request goes to the **active environment**. Two ways to choose it:

- Click the {icon:env-switcher} environment selector at the top of the Hub and pick from the list. It reads `No environment` until you have chosen one. The pencil beside each environment opens it, and **New environment…** at the foot of the list adds one.
- In a saved environment's editor, click **Set as Active** in the footer.

Production environments are highlighted in the selector, and the Hub header is highlighted as a warning while one is active. The colour comes from your theme. The paw print in the Environments list marks the active one.

### Deleting an Environment

Open the environment and click **Delete Environment** in the footer. If runs have been recorded against it, Dobermann tells you how many transactions are linked before you confirm.

Endpoints are not tied to an environment, so deleting one deletes no endpoints. Endpoints belong to a **System**, and so does each environment — see [The Hub — Systems](/docs/hub/#systems).

## General
{: #general }

The General tab contains environment identity, type classification, and execution settings.

### Environment Details
{: #environment-details }

#### Environment Name

A descriptive name for the environment (e.g., "Production US", "Staging Europe", "Dev Sandbox").

#### Base URL

The root of the API for this environment.

**Examples:**
- `https://api.example.com` — Generic API
- `https://api.staging.example.com` — Staging server
- `https://api.github.com` — GitHub API
- `http://localhost:8080` — Local development

**Important:**
- Must include protocol (`https://` or `http://`)
- Do not include a trailing slash
- This URL is prepended to every endpoint path
- **The host is fixed once the environment exists:** `https://api.example.com` is that environment's address. For a different host, create a new environment. The path can change: click the pencil beside the `System: URL` heading. A batch already running keeps the URL it started with, so a change never moves it to a different place.

#### Variables in the Base URL
{: #base-url-variables }

Added in v0.4.0
{: .label .label-green }

Part of the path can be a variable, filled from the environment's variable of that name each time a request goes:

- `https://api.example.com/v2.0/{{tenant}}/{{company}}`: the tenant and company are the environment's `tenant` and `company` variables
- `https://api.example.com/functions/{{version}}/playground`: `v1` becomes the `version` variable

Write it `{{name}}` or `{{ENV:name}}`. The name must match the variable's exactly, case included, and the value is sent exactly as you typed it: `V1` and `v1` are different paths to most servers. Give the variable **Options** and tick **Header** to switch it from the Hub header (see [Variables](#variables)).

A variable can't be part of the host (`https://{{env}}.example.com`). The host is what the environment is, so one environment per host.

Before a run, a variable the URL uses that has no value is asked for, and the run waits for it.

#### Environment Type
{: #environment-type }

Pick a type from the dropdown: Production, Staging, UAT, QA/Testing, Development (the default), Sandbox, Training, Integration, Performance or Local. Type is how environments are grouped, and it drives the production safeguards.

Setting an environment to **Production** turns on two protections automatically — there's no separate setting to enable:
{: #prod-protect }

- The **Hub header is highlighted as a warning** whenever that environment is active, and the environment is highlighted in the selector, so there's no mistaking what you're connected to.
- A **confirmation appears before any live execution** — both **Run API** and the final **Execute** step of a batch run. The dialog offers to stop warning for 15, 30 or 60 minutes when doing repeated work; the snooze ends when you reload the window.

Whether an environment is Production is yours to say. If the warnings get in the way, change the environment's type.

#### System
{: #system }

Added in v0.4.0
{: .label .label-green }

Which API this environment belongs to — `wms`, `erp`, and so on. Endpoints carry the same System, and `@` in the [Endpoints search](/docs/hub/#search) shows only the active environment's System. See [The Hub — Systems](/docs/hub/#systems).

You choose it in the **New environment** dialog, before the URL. **Standard Systems**, set up by DBMN, are listed first, then your own, then **+ Add new System…**. Leave it unpicked and a base URL that matches a Standard System picks it. On a Standard System, the environment's sign-in URLs and token settings come from that System; anything you set on the environment itself still wins.

**The System is fixed once the environment exists,** like its URL's host: the editor shows them together at the top, `System: URL`, with a pencil to change the URL's path. For a different System, create a new environment. An older environment saved without a System can still be given one; it's fixed from its next save. To move every environment and endpoint from one of your Systems to another, use **Merge** under {icon:nav-settings} **Settings** → **Systems**.

#### Description

Optional field for notes about the environment:
- Purpose and use cases
- Access restrictions
- Tenant or customer information
- Maintenance windows

### Execution Settings

#### Parallel Processing
{: #parallel-processing }

How many requests a batch sends at the same time: **Max Concurrency**, **Sequential** being one at a time.

| Level | Requests in flight |
|-------|--------------------|
| **Sequential** | 1 — one request at a time (safest) |
| **Light Parallel** | 2 |
| **Moderate Parallel** | 4 |
| **Heavy Parallel** | 8 |
| **Extreme Parallel** | 16 |

This is the ceiling. Each batch picks its own **Processing Mode** in Run Batch's **Review** step, up to this limit — see [Batch Preparation](/docs/batch-preparation/#processing-mode).

**Choosing a level:**
- Start with **Sequential** when testing a new API
- Increase gradually while monitoring for rate limit errors (429 responses)
- APIs with strict rate limits may need Sequential or Light
- APIs designed for bulk operations can typically handle Heavy or Extreme

Higher concurrency means faster batches and more load on the target API. If you see 429 errors, come down a level.

#### Target Timezone
{: #target-timezone }

The timezone used for all datetime operations in this environment. It affects how `A8:date`, `A8:datetime`, and date math modifiers resolve, and how a `datetime` value you type into the Run API form is converted.

- Select a timezone from the dropdown (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`)
- Default: **UTC**

**Example:**
With timezone set to `America/New_York`:
- `{{A8:datetime}}` → `2026-02-18T09:30:00` (Eastern Time, not UTC)

#### Run in
{: #run-in }

Added in v0.4.0
{: .label .label-green }

Where this environment's requests are sent from. **For now, only the web app uses this setting.** DBMN for VS Code and the desktop app are local agents themselves: they send every request, whatever it says. It's saved with the environment, so all three show it.

| Option | In the web app |
|--------|----------------|
| **Browser** | Requests go straight from your browser tab. |
| **Local agent** | The web app hands each request to DBMN for VS Code on your computer, which sends it. |
| **Cloud worker** | Coming soon. |

**When to choose Local agent:**
- The API doesn't accept requests from a browser. Many business APIs don't, and the web app says so when it meets one. Sent from DBMN for VS Code, it answers.
- You'd rather keep the environment's secrets out of the browser. A Local agent environment's token, client secret or key is entered in DBMN for VS Code (**Environments** → the environment → **Authentication**), and the web app never holds it.

**What it needs:** DBMN for VS Code installed and open, signed in to the same DBMN account. A run started while VS Code is closed waits, saying **Please open VS Code**, and starts by itself once it's open. In the Hub header, the VS Code icon beside the environment's name is in the text colour while VS Code is connected, and grey while it isn't.

**The first run asks your browser.** The web app reaches DBMN for VS Code on your own computer, and browsers ask before letting a website do that. The first time, DBMN shows **Connect to DBMN for VS Code** and explains the prompt that follows; click **Continue**, then allow it in the browser. The prompt is the browser's, so it differs:

- **Chrome and Edge** ask once per site whether app.dbmn.io may look for and connect to devices on your local network. Choose **Allow**. To change it later: the icon to the left of the address → **Site settings** → **Local network access**.
- **Firefox** does not ask.
- **Brave** does not ask by default. Allow it first: `brave://settings/content/localhostAccess`, add app.dbmn.io, then run again.
- **Safari** cannot reach VS Code at all, and the web app says so: **Safari can't reach DBMN for VS Code. Use Chrome, Edge or Firefox for environments that run through VS Code.** On a Mac, use another browser, or the desktop app.

If the browser is blocking it, the web app says **Your browser is blocking DBMN from reaching VS Code** and the run waits; allow it in the browser's site settings and run again. The full table of what each browser can do is on [Your Data — Which browser](/docs/your-data/#browsers).

**If VS Code closes during a batch,** the requests it was sending at that moment may or may not have reached the API. They're listed under **Errors**: check them before running them again. A batch set to **Stop on first error** stops there; **Resume** it once VS Code is open. Otherwise the batch waits for VS Code and carries on when it's back.

**In DBMN for VS Code and the desktop app** the setting changes nothing: each is a local agent and sends every request itself. The web app can't use the desktop app as its local agent; if you have the desktop app, run from it. An environment set to Local agent and opened in the desktop app signs in there and keeps its secrets there, so enter them once on its **Authentication** tab.

## Authentication
{: #authentication }

The **Authentication** tab offers five methods:

### DBMN

Authenticate using your DBMN account. Sign in once, in the Hub's {icon:nav-account} **Account** section, and the Authorization header is injected automatically at execution time.

**How to use:**
1. Select **DBMN** as the authentication method
2. If you're already signed in to DBMN, that's it
3. If not, Dobermann asks you to sign in when you run

**Token management:**
- Tokens are acquired and refreshed automatically
- No manual copy/paste needed
- If your session expires, Dobermann prompts you to sign in again before execution

{: .note }
> **DBMN auth is how you reach [The Training Ground](/docs/playground/)**, the practice API that [Puppy School](/puppy-school/) runs on.

### Manual JWT Token

Direct authentication using a JWT (JSON Web Token).

**How to use:**
1. Select **Manual JWT Token** as the authentication method
2. Obtain a JWT token from your API provider
3. Paste the token in the **JWT Token** field
4. Click **Save Environment**

**Token format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Dobermann shows token expiry when the JWT carries an `exp` claim, and warns you before it lapses. Paste a fresh token to refresh.

### OAuth

OAuth 2.0 authentication flow for secure, delegated access.

**Fields:**
- **Client ID** — Your OAuth application identifier
- **Client Secret** — Optional; required for confidential clients
- **Authorization URL** — OAuth provider's authorization endpoint
- **Token URL** — OAuth provider's token endpoint
- **OAuth Flow** — **Authorization Code with PKCE** (recommended), **Authorization Code**, or **Client Credentials**
- **Client authentication** — how the client secret reaches the token endpoint: **In the request body** (`client_secret_post`, the default) or **Basic header** (`client_secret_basic`). A Standard System sets the default for its environments; change it if your provider refuses the token request with 401.
- **Scopes** — Optional, space-separated

**OAuth flow:**
1. Configure the fields and click **Save Environment**
2. Click **Sign In** in the footer
3. Your browser opens to the authorization URL
4. Log in and grant permissions
5. Dobermann receives the token automatically

Access tokens are stored in VS Code's encrypted secret storage and refreshed automatically when they expire. The footer offers:

- **Sign In** — uses your existing browser session with the identity provider; you may be signed in without re-entering credentials.
- **Sign In (New Token)** — forces fresh credentials. Use this when your roles or permissions have changed on the server and the current token has stale claims.
- **Refresh Token** — when a refresh token is held, fetches a new access token without the browser.
- **Sign Out** — drops the stored tokens.

**Relative URLs:**
If the authorization URL or token URL starts with `/`, Dobermann prepends the environment's base URL.

```
Base URL: https://api.example.com
Authorization URL: /oauth/authorize
Token URL: /oauth/token

Resolves to:
Authorization URL: https://api.example.com/oauth/authorize
Token URL: https://api.example.com/oauth/token
```

For detailed setup instructions including provider configuration, see the [OAuth Setup Guide](/docs/oauth-setup/).

### Google Service Account

Authenticate using a Google Cloud service account for Google APIs (Cloud Platform, Pub/Sub, Storage, BigQuery, and more).

**How to use:**
1. Select **Google Service Account** as the authentication method
2. Paste your service account JSON key into **Service Account JSON**, or use the upload button
3. Select an **OAuth Scopes** preset:
   - **Cloud Platform (Full Access)**
   - **Pub/Sub**
   - **Cloud Storage**
   - **BigQuery**
   - **Custom Scopes** — enter your own
4. Click **Test Authentication** to verify the credentials
5. Click **Save Environment**

**Service account JSON format:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "name@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### No Authentication

For APIs that need none, or where the only credential is a header you set yourself under **Headers & Variables**.

### Token Details

Once a token is held, the **Token Details** panel shows it read-only: a **Valid** / expiring / expired pill, **Decoded** and **Encoded** views, **Copy**, and a **Raw JSON** expander. The same panel serves whichever method is active.

## Headers & Variables
{: #headers-variables }

The Headers & Variables tab manages environment-level request headers and reusable template variables.

### Headers
{: #headers }

Environment-level headers go out with every request made against this environment, on any endpoint that has **Include environment-level headers** ticked (it is, by default). Put values here that apply across all endpoints — API keys, content types, tenant identifiers — rather than repeating them on each endpoint.

### Variables
{: #variables }

Environment variables are key-value pairs accessible in templates via the `ENV:` prefix (e.g. `{{ENV:warehouse}}`).

Common uses:
- Organisation codes, warehouse IDs, tenant identifiers
- API keys and tokens that vary between environments
- Default values shared across multiple endpoints

**How they work:**
- ENV variables are **not** prompted during Run API
- ENV variables **don't** appear in the data entry grid during Run Batch
- They're resolved automatically from the active environment's variable list
- If a variable is missing, execution fails with a clear error

See [Template Variables — ENV](/docs/template-variables/#environment-variables-env) for usage syntax.

**Options.** Give a variable a list of **Options**, comma-separated in the table, and its **Value** becomes a dropdown of them. A value that isn't one of them reads **Pick one…**, highlighted as a warning, until you choose one. Leave Options empty and the value is whatever you type.

**Labels.** A code that means little on its own can have a name: type the option as `840 = Brisbane, 880 = Melbourne`. The Value dropdown and the Hub header show **Brisbane**, with `840` beside it in the list; requests always send `840`.

**Header.** Tick **Header** to switch the variable from the Hub header without opening the editor. It gets its own segment after the environment name, outlined together with it, reading its value (or its label); it reads `pick <name>` while it's empty or, with options, until it holds one of them. Click the segment for its options, or **Add…** to type a new **Value**, with a **Label** if you like: it's added to the options and picked. See [The Hub — Environment selector](/docs/hub/#environment-selector).

**An editor left open** follows a change made elsewhere (a pick in the header, a save in another tab or on another device): with no edits of your own it updates and says what moved; with edits, **Save** stops and offers **Reload** or **Keep editing**, so nothing is written over the change.

**Before a run,** every variable the run needs must have a value: each variable in the header, and each variable the [Base URL](#base-url-variables) uses. One that's empty, or, with options, not one of them, is asked for: one dialog lists them all, a dropdown for a variable with options and a box for one without. **Use** saves the answers and the run goes on; **Cancel** stops it, and so does leaving a box empty. A value typed for a header variable joins its options. A header variable the run doesn't need is never in the way: untick **Header**. On Run Batch's **Execute** step, **Sending To** lists each header variable with its value.

## Organisation Selection
{: #organization-selection }

Some APIs serve several organisations with one sign-in and expect each request to say which one it is for, usually in a header. In Dobermann the organisation is an ordinary environment variable:

1. Under **Variables**, add `org` with your organisations as its **Options**, and tick **Header**
2. Under **Headers**, add the header the API reads with the variable as its value: `Organization` set to `{{ENV:org}}`. Add any others (a `Location`, say) the same way
3. Switch organisation from the Hub header whenever you like, without signing in again

A new environment on a Standard System that works this way has steps 1 and 2 done already: its headers are in place, written `{{org}}` (the same as `{{ENV:org}}` in an environment's headers), and it has an empty `org` variable in the header. Select the environment, and the header reads `pick org`; click it and **Add…** your first organisation. A run before then stops and asks for one.

Dobermann doesn't look inside your token for organisations, or check the header against it: if the value is wrong, the API says so. An environment from an earlier version that has an organisation is set up on the first start of 0.4.0: its headers get the four Dobermann used to add by itself, **Organization**, **SelectedOrganization**, **Location** and **SelectedLocation**, each `{{ENV:org}}` (a header it already listed is left as it was), and `org` is in the header with that organisation as its one option. **Add…** the others there, and delete any of the four headers the API doesn't need.

The same works for a company, a client or a tenant on any API: `/companies({{ENV:company}})/orders` in a path, `?client={{ENV:client}}` in a query string, or a header.

## Troubleshooting

### Token Expired

**Symptoms:** API requests return 401 Unauthorized

**Solutions:**
- **DBMN:** Sign in again when prompted — your session is refreshed automatically
- **JWT:** Paste a new token and save
- **OAuth:** Click **Sign In (New Token)** to force fresh credentials
- **Google Service Account:** Check the key hasn't been revoked; paste a fresh key if needed

### OAuth Flow Fails

**Symptoms:** Browser opens but authentication doesn't complete

**Check:**
- Redirect URI matches the OAuth provider configuration
- Client ID and secret are correct
- Authorization URL and token URL are valid
- Network connectivity to the OAuth provider

See the [OAuth Setup Guide](/docs/oauth-setup/) for detailed configuration help.

### Set as Active is disabled

**Set as Active** is only offered on a saved environment that isn't already active. Save your changes first, or use the header selector.

### API Calls Use the Wrong URL

**Symptoms:** Requests go to the wrong server

**Check:**
- The header selector shows the environment you meant
- The Base URL is correct and has no trailing slash
- A variable in the Base URL has the value you meant, case included: `{{version}}` set to `V1` sends `/V1/`, not `/v1/`
- Endpoint paths start with `/`

## Related Topics

- [OAuth Setup Guide](/docs/oauth-setup/) — Detailed OAuth and Google auth configuration
- [The Hub](/docs/hub/) — The environment selector and Systems
- [Endpoints](/docs/endpoints/) — Configure and manage API endpoints
- [Import/Export](/docs/import-export/) — Share environment configurations (credentials stripped by default)
