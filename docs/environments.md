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
- **Variables** — Key-value pairs available in templates via the `ENV:` prefix
- **Headers** — Environment-level headers included in every request

## Managing Environments

### Adding an Environment

1. In the Hub, open {icon:nav-environments} **Environments** and click **Add Environment**
2. Fill in the **General** tab: name, base URL, type
3. On the **Authentication** tab, choose a method and configure it
4. Click **Save Environment**

The environment appears in the Environments list and in the header's {icon:env-switcher} environment selector.

### Editing an Environment

Click an environment in the Environments list to open it in a tab. Change what you need and click **Save Environment**. **Run API** and **Run Batch** elsewhere in the Hub keep using the saved version until you do.

### Setting the Active Environment

Every request goes to the **active environment**. Two ways to choose it:

- Click the {icon:env-switcher} environment selector at the top of the Hub and pick from the list. It reads `No environment` until you have chosen one.
- In a saved environment's editor, click **Set as Active** in the footer.

Production environments are red in the selector, and the Hub header turns red while one is active. The paw print in the Environments list marks the active one.

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
- **The URL is locked once saved.** The field is read-only after the first save, so a batch can never quietly start going to a different server. For a different URL, create a new environment.

#### Environment Type
{: #environment-type }

Pick a type from the dropdown: Production, Staging, UAT, QA/Testing, Development (the default), Sandbox, Training, Integration, Performance or Local. Type is how environments are grouped, and it drives the production safeguards.

Setting an environment to **Production** turns on two protections automatically — there's no separate setting to enable:

- The **Hub header turns red** whenever that environment is active, and the environment is red in the selector, so there's no mistaking what you're connected to.
- A **confirmation appears before any live execution** — both **Run API** and the final **Execute** step of a batch run. The dialog offers to stop warning for 15, 30 or 60 minutes when doing repeated work; the snooze ends when you reload the window.

If the warnings get in the way, change the environment's type. Unless it's protected — see below.

#### Prod Protect
{: #prod-protect }

For environments DBMN manages for your organisation, the type is set centrally and the dropdown is read-only — so the production safeguards above cannot be switched off by reclassifying the environment.

[Read about Prod Protect](/docs/prod-protect/)

#### System

Which API this environment belongs to — `wms`, `erp`, and so on. Endpoints carry the same System, and the API Catalogue can show only the endpoints of the active environment's System. Choose one, or create one with **+ Add new System…**. See [The Hub — Systems](/docs/hub/#systems).

#### Description

Optional field for notes about the environment:
- Purpose and use cases
- Access restrictions
- Tenant or customer information
- Maintenance windows

#### Enable Mock Requests

When ticked, runs return mock responses instead of calling the API.

**Use cases:**
- Testing endpoint configuration without hitting real APIs
- Demonstrating functionality without credentials
- Development when backend is unavailable

**Limitations:**
- Mock responses are simplified and may not reflect actual API behaviour
- Only basic success scenarios are mocked
- Not suitable for integration testing

### Execution Settings

#### Parallel Processing
{: #parallel-processing }

How many requests a batch sends at the same time. Tick **Enable parallel batch processing** and choose a **Max Concurrency**:

| Level | Requests in flight |
|-------|--------------------|
| **Sequential** | 1 — one request at a time (safest) |
| **Light Parallel** | 2 |
| **Moderate Parallel** | 4 |
| **Heavy Parallel** | 8 |
| **Extreme Parallel** | 16 |

This is the ceiling. Each batch picks its own **Processing Mode** on the Execute Batch step, up to this limit — see [Batch Preparation](/docs/batch-preparation/#step-5-execute-batch).

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

## Organisation Selection
{: #organization-selection }

Some APIs issue one token for several organisations and expect each request to say which one it is for. When the token Dobermann holds lists organisations, they appear as sub-rows under the environment in the Hub's {icon:env-switcher} environment selector. Pick one and the selector reads `Environment · Org`; until you do it reads `(pick org)`.

The chosen organisation is sent as environment headers — `Organization`, `SelectedOrganization`, `Location` and `SelectedLocation` — on every request. Switch organisations from the selector at any time without signing in again.

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
- Endpoint paths start with `/`

## Related Topics

- [OAuth Setup Guide](/docs/oauth-setup/) — Detailed OAuth and Google auth configuration
- [Prod Protect](/docs/prod-protect/) — Centrally pinned environment types
- [The Hub](/docs/hub/) — The environment selector and Systems
- [Endpoints](/docs/endpoints/) — Configure and manage API endpoints
- [Import/Export](/docs/import-export/) — Share environment configurations (credentials stripped by default)
