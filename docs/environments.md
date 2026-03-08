---
title: Environments
layout: default
nav_order: 2
parent: Documentation
has_children: true
---

# Environments

Environments represent different API targets — production, staging, development, or anything else — each with their own authentication, configuration, and variables. Switch between targets instantly without reconfiguring endpoints.

## Overview

Each environment contains:
- **Connection details** — Base URL and environment metadata
- **Authentication** — JWT tokens, OAuth, or Google Service Account
- **Target timezone** — Timezone for datetime operations
- **Parallel processing** — Concurrency level for batch execution
- **Variables** — Key-value pairs available in templates via `ENV:` prefix
- **Headers** — Environment-level headers included in every request

## Managing Environments

### Adding Environments

1. Click the **+** icon next to "Environments" in the sidebar
2. Fill in environment details
3. Configure authentication method
4. Click **Save Environment**

The environment will appear in the sidebar tree view, grouped by type.

### Editing Environments

1. Click an environment name in the sidebar
2. Modify any details in the webview
3. Changes are saved automatically

### Deleting Environments

1. Right-click an environment in the sidebar
2. Select **Delete Environment**
3. Confirm the deletion

**Note:** Deleting an environment does not delete associated endpoints — they will remain but show as disconnected until assigned to another environment.

### Setting Active Environment

1. Right-click an environment in the sidebar
2. Select **Set as Active**
3. The active environment is used for all endpoint executions

The currently active environment is shown with a checkmark in the tree view.

## General
{: #general }

The General tab contains environment identity, type classification, and execution settings.

### Environment Details
{: #environment-details }

#### Environment Name

A descriptive name for the environment (e.g., "Production US", "Staging Europe", "Dev Sandbox").

**Best practices:**
- Use clear, descriptive names
- Include region or tenant if managing multiple instances
- Avoid special characters that might cause issues

#### Base URL

The primary API endpoint for this environment.

**Examples:**
- `https://api.example.com` — Generic API
- `https://api.staging.example.com` — Staging server
- `https://api.github.com` — GitHub API
- `http://localhost:8080` — Local development

**Important:**
- Must include protocol (`https://` or `http://`)
- Do not include trailing slash
- This URL is prepended to all endpoint paths
- **URL is immutable after creation** — Once an environment is saved, the Base URL cannot be changed. This ensures batch executions always target the correct server. If you need a different URL, create a new environment.

#### Description

Optional field for notes about the environment:
- Purpose and use cases
- Access restrictions
- Tenant or customer information
- Maintenance windows

#### Mock Requests

When enabled, API requests use mock responses instead of calling real endpoints.

**Use cases:**
- Testing endpoint configuration without hitting real APIs
- Demonstrating functionality without credentials
- Development when backend is unavailable

**Limitations:**
- Mock responses are simplified and may not reflect actual API behavior
- Only basic success scenarios are mocked
- Not suitable for integration testing

### Environment Type
{: #environment-type }

Environment type categorises environments for visual organisation in the tree view. This is purely for display purposes — it doesn't affect functionality.

- **Production** — Live production systems
- **Staging** — Pre-production testing
- **UAT** — User acceptance testing
- **QA/Testing** — Quality assurance
- **Development** — Active development (default)
- **Sandbox** — Experimental/demo
- **Training** — Training environment
- **Integration** — Integration testing
- **Performance** — Performance testing
- **Local** — Local development

Environments are grouped and sorted by type in the sidebar.

### Execution Settings

#### Target Timezone
{: #target-timezone }

Set the timezone used for all datetime operations in this environment. This affects how `A8:date`, `A8:datetime`, and date math modifiers resolve.

**Configuration:**
- Select a timezone from the dropdown (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`)
- Default: **UTC**

**How it works:**
- All `A8:datetime` values are generated in the selected timezone
- Date math modifiers (`+2d`, `-1d`, `+4h`, `+30m`) operate relative to the target timezone
- Useful when your API expects timestamps in a specific timezone

**Example:**
With timezone set to `America/New_York`:
- `{{A8:datetime}}` → `2026-02-18T09:30:00` (Eastern Time, not UTC)

#### Parallel Processing
{: #parallel-processing }

Configure concurrency for batch execution — how many API requests Dobermann sends simultaneously.

**Concurrency levels:**

| Level | Threads | Description |
|-------|---------|-------------|
| **Sequential** | 1 | One request at a time — safest, slowest |
| **Light** | 2 | Gentle parallelism for sensitive APIs |
| **Moderate** | 4 | Good balance of speed and safety |
| **Heavy** | 8 | Fast execution for robust APIs |
| **Extreme** | 16 | Maximum throughput — use with caution |

**Choosing a level:**
- Start with **Sequential** when testing a new API
- Increase gradually while monitoring for rate limit errors (429 responses)
- APIs with strict rate limits may need Sequential or Light
- APIs designed for bulk operations can typically handle Heavy or Extreme

**Impact:**
- Higher concurrency = faster batch completion
- Higher concurrency = more load on the target API
- If you see 429 errors, reduce the concurrency level

## Authentication
{: #authentication }

Dobermann supports three authentication methods:

### Manual JWT Token

Direct authentication using a JWT (JSON Web Token).

**How to use:**
1. Select "Manual JWT Token" as authentication method
2. Obtain a JWT token from your API provider
3. Paste the token in the text area
4. Click **Save Environment**

**Token format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Token expiration:**
- Dobermann displays token expiration time if available
- Visual warnings appear when token is about to expire
- Refresh the token manually when needed

**Best practices:**
- Store tokens securely
- Rotate tokens regularly
- Use environment-specific tokens
- Never commit tokens to source control

### OAuth

OAuth 2.0 authentication flow for secure, delegated access.

**Required fields:**
- **Client ID** — Your OAuth application identifier
- **Authorization URL** — OAuth provider's authorization endpoint
- **Token URL** — OAuth provider's token endpoint
- **Redirect URI** — Callback URL (usually provided by Dobermann)

**Optional fields:**
- **Client Secret** — Required for confidential clients (toggle visibility with eye button)
- **Scopes** — Space-separated list of requested permissions

**OAuth flow:**
1. Configure OAuth settings
2. Click **Sign In**
3. Browser opens to authorization URL
4. Log in and grant permissions
5. Dobermann receives token automatically

**Token management:**
- Access tokens are stored securely
- Refresh tokens are used automatically when access token expires
- Visual indicators show authentication status
- **Sign In** — Standard sign-in. If you already have a browser session with your identity provider, you may be signed in automatically without re-entering credentials.
- **Sign In (New Token)** — Forces you to enter your credentials again, even if your browser remembers a previous session. Use this when your roles or permissions have changed on the server and your current token has stale claims.

**Relative URLs:**
Dobermann supports relative URLs for OAuth endpoints. If authorization URL or token URL starts with `/`, it will be automatically prepended with the environment's base URL.

**Example:**
```
Base URL: https://api.example.com
Authorization URL: /oauth/authorize
Token URL: /oauth/token

Resolves to:
Authorization URL: https://api.example.com/oauth/authorize
Token URL: https://api.example.com/oauth/token
```

For detailed setup instructions including provider configuration, see the [OAuth Setup Guide](oauth-setup).

### Google Service Account

Authenticate using a Google Cloud service account for Google APIs (Cloud Platform, Pub/Sub, Storage, BigQuery, and more).

**How to use:**
1. Select "Google Service Account" as authentication method
2. Upload or paste your service account JSON key file
3. Select the appropriate scope preset:
   - **Cloud Platform** — Full access to Google Cloud APIs
   - **Pub/Sub** — Google Cloud Pub/Sub messaging
   - **Storage** — Google Cloud Storage (read/write)
   - **BigQuery** — BigQuery data and job management
   - **Custom** — Enter your own scopes
4. Click **Test Authentication** to verify credentials
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

**Best practices:**
- Use the minimum scopes required for your use case
- Rotate service account keys periodically
- Never commit service account JSON to source control

### Token Details

After authenticating, the Token Details section appears below the authentication method. It provides a read-only view of your current token.

**Features:**
- **Decoded view** — Shows the decoded JWT payload (claims, expiration, issuer)
- **Encoded view** — Shows the raw encoded token string
- **Copy button** — Copy the full token to clipboard
- **Status pill** — Visual indicator showing token validity:
  - **Valid** — Token is current and usable
  - **Expiring soon** — Token will expire shortly
  - **Expired** — Token has expired and needs refreshing

Token Details is shared across all authentication methods — whichever method provides the active token, its details appear here.

## Headers & Variables
{: #headers-variables }

The Headers & Variables tab manages environment-level request headers and reusable template variables.

### Headers
{: #headers }

Environment-level headers are automatically included in every request. Toggle **Include environment-level headers** on any endpoint to inherit them.

Add custom headers in the environment's header configuration for values that should apply across all endpoints (e.g., API keys, content types, custom identifiers).

### Variables
{: #variables }

Environment variables are key-value pairs accessible in templates via the `ENV:` prefix (e.g. `{{ENV:warehouse}}`). Set them in the Variables section of your environment configuration.

Common uses:
- Organisation codes, warehouse IDs, tenant identifiers
- API keys and tokens that vary between environments
- Default values shared across multiple endpoints

**How they work:**
- ENV variables are **not** prompted during Run API
- ENV variables **don't** appear in the data entry grid during Run Batch
- They're resolved automatically from your active environment's variable list
- If a variable is missing, execution fails with a clear error

See [Template Variables — ENV](template-variables#environment-variables-env) for usage syntax.

## Organization Selection (Manhattan Active)
{: #organization-selection }

{: .note }
> This section applies specifically to Manhattan Active APIs, which require organization headers.

Manhattan Active APIs require organization headers. Dobermann automatically detects available organizations and provides a selection interface.

**How it works:**
1. After authentication, Dobermann fetches available organizations
2. Select your organization from the dropdown
3. Organization headers are automatically added to all requests
4. Switch organizations anytime without re-authenticating

**Organization headers added:**
- `X-Organization-Id`
- `X-Tenant-Id`
- Other Manhattan Active-specific headers

**Visual indicators:**
- Green checkmark — Organization selected
- Warning icon — No organization selected (required for Manhattan Active)

## Environment Tree View

Environments appear in the sidebar tree view with these indicators:

**Status icons:**
- Checkmark — Active environment (used for executions)
- Lock — Authenticated
- Warning — Authentication required or expired
- Building — Organization selected

**Actions:**
- Click name — Open environment editor
- Right-click — Context menu with actions
- Drag endpoints — Move endpoints between environments

## Troubleshooting

### Token Expired

**Symptoms:** API requests return 401 Unauthorized

**Solutions:**
- **JWT:** Paste a new token in environment settings
- **OAuth:** Click **Sign In (New Token)** to force fresh credentials and get an updated token
- **Google Service Account:** Check key expiry, re-upload if needed

### OAuth Flow Fails

**Symptoms:** Browser opens but authentication doesn't complete

**Check:**
- Redirect URI matches OAuth provider configuration
- Client ID and secret are correct
- Authorization URL and token URL are valid
- Network connectivity to OAuth provider

See the [OAuth Setup Guide](oauth-setup) for detailed configuration help.

### Environment Not Selectable

**Symptoms:** Cannot set environment as active

**Solutions:**
- Ensure environment has valid authentication
- Check that base URL is accessible
- Verify environment is saved (not in unsaved state)

### API Calls Use Wrong URL

**Symptoms:** Requests go to incorrect server

**Check:**
- Correct environment is set as active (checkmark)
- Base URL in environment settings is correct
- Base URL does not have trailing slash
- Endpoint paths start with `/`

## Related Topics

- [OAuth Setup Guide](oauth-setup) — Detailed OAuth and Google auth configuration
- [Endpoints](endpoints) — Configure and manage API endpoints
- [Console](console) — Execute requests against environments
- [Import/Export](import-export) — Share environment configurations (excludes sensitive data)
