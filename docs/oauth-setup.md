---
title: OAuth Setup Guide
layout: default
nav_order: 1
parent: Environments
grand_parent: Documentation
---

# OAuth Setup Guide

This guide covers the setup process for OAuth and Google Service Account authentication in Dobermann. Share this page with your sys admin or identity team if they need to configure the provider side.

---

## OAuth 2.0 Setup

### 1. Create OAuth Client Credentials

In your OAuth provider (e.g., Azure AD, Okta, Auth0, Google Cloud Console):

1. Register a new application / OAuth client
2. Note the **Client ID** — you'll enter this in Dobermann
3. Generate a **Client Secret** if required (confidential client flow)
4. Set the application type to "Web application" or equivalent

### 2. Configure Redirect URIs

Add the following redirect URI to your OAuth provider's allowed callback URLs:

```
vscode://flexiontech.active8/oauth-callback
```

This is the URI Dobermann uses to receive the authorization code after the user authenticates. If your provider requires an exact match, ensure there are no trailing slashes or extra characters.

### 3. Set Scopes

Configure the scopes your application needs. Common examples:

| Provider | Example Scopes |
|----------|---------------|
| Azure AD | `openid profile email api://your-app/read` |
| Okta | `openid profile email` |
| Auth0 | `openid profile email` |
| Google | `https://www.googleapis.com/auth/cloud-platform` |

Enter scopes as a space-separated list in Dobermann's OAuth configuration.

### 4. Get the Auth and Token URLs

You need two URLs from your provider:

- **Authorization URL** — where users are redirected to log in
- **Token URL** — where Dobermann exchanges the authorization code for an access token

**Common provider URLs:**

| Provider | Authorization URL | Token URL |
|----------|------------------|-----------|
| Azure AD | `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize` | `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` |
| Okta | `https://{domain}/oauth2/default/v1/authorize` | `https://{domain}/oauth2/default/v1/token` |
| Auth0 | `https://{domain}/authorize` | `https://{domain}/oauth/token` |
| Google | `https://accounts.google.com/o/oauth2/v2/auth` | `https://oauth2.googleapis.com/token` |

{: .note }
> **Relative URLs:** If your API's authorization and token endpoints are on the same domain as the base URL, you can use relative paths (e.g., `/oauth/authorize`). Dobermann automatically prepends the environment's base URL.

### 5. Configure in Dobermann

1. Open your environment in Dobermann
2. Select **OAuth** as the authentication method
3. Enter:
   - **Client ID** — from step 1
   - **Client Secret** — from step 1 (if applicable)
   - **Authorization URL** — from step 4
   - **Token URL** — from step 4
   - **Scopes** — from step 3
4. Click **Sign In** to authenticate
5. Complete the login flow in your browser
6. Dobermann receives and stores the token automatically

{: .note }
> **Sign In vs Sign In (New Token):** Both buttons are always visible for OAuth environments. **Sign In** uses your existing browser session (you may be signed in automatically). **Sign In (New Token)** forces you to re-enter credentials — use it when your roles or permissions have changed and your current token has stale claims.

---

## Google Service Account Setup

Google Service Accounts provide server-to-server authentication without user interaction — ideal for automated API workflows.

### 1. Create a Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Enter a name and description
6. Grant the appropriate roles (e.g., `BigQuery Data Editor`, `Storage Object Admin`)
7. Click **Done**

### 2. Generate a JSON Key

1. Click on your new service account
2. Go to the **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the key file — keep it secure

### 3. Configure in Dobermann

1. Open your environment in Dobermann
2. Select **Google Service Account** as the authentication method
3. Upload or paste the JSON key file contents
4. Select a scope preset:

| Preset | Scope | Use Case |
|--------|-------|----------|
| **Cloud Platform** | `https://www.googleapis.com/auth/cloud-platform` | Full Google Cloud access |
| **Pub/Sub** | `https://www.googleapis.com/auth/pubsub` | Messaging and event streaming |
| **Storage** | `https://www.googleapis.com/auth/devstorage.read_write` | Cloud Storage read/write |
| **BigQuery** | `https://www.googleapis.com/auth/bigquery` | BigQuery data and jobs |
| **Custom** | (enter your own) | Any Google API scope |

5. Click **Test Authentication** to verify the credentials work
6. Click **Save Environment**

### Security Best Practices

- **Least privilege** — Only grant the roles and scopes your workflow actually needs
- **Key rotation** — Rotate service account keys every 90 days
- **No source control** — Never commit service account JSON to git or share in plain text
- **Project isolation** — Use separate service accounts for different projects or environments
- **Audit logging** — Enable Cloud Audit Logs to track service account activity

---

## Troubleshooting

### OAuth: "Redirect URI mismatch"

Your OAuth provider's allowed redirect URIs don't include `vscode://flexiontech.active8/oauth-callback`. Add it in your provider's application settings.

### OAuth: "Invalid client" or "Unauthorized client"

- Double-check the Client ID — no extra spaces or line breaks
- Verify the Client Secret matches (regenerate if unsure)
- Ensure the application is active/enabled in your provider

### OAuth: Token expires immediately

- Check that the Token URL is correct (not the Authorization URL)
- Verify your provider is issuing refresh tokens (some require specific scopes like `offline_access`)
- Check token lifetime settings in your provider's configuration

### Google: "Permission denied"

- Verify the service account has the required IAM roles
- Check that the scope matches the API you're calling
- Ensure the target API is enabled in your Google Cloud project

### Google: "Invalid key"

- The JSON key file may be corrupted — download a fresh key
- Ensure you're pasting the complete JSON (including opening/closing braces)
- Check that the service account hasn't been deleted or disabled

---

## Related Topics

- [Environments](../environments) — Environment configuration overview
- [Environments — Authentication](../environments#authentication) — Quick reference for all auth methods
