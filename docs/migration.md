---
title: Migration Guide
layout: default
nav_order: 13
parent: Documentation
---

# Migrating from FlexionTech to Dobermann

Dobermann has moved from the **FlexionTech** publisher to the new **DBMN** publisher on the VS Code Marketplace. Because the publisher has changed, the new extension uses a separate storage namespace — your existing data will **not** carry over automatically. You need to export from the old extension and import into the new one.

The process takes about 2 minutes.

## Before You Start

Open the **same [Dobermann workspace](/docs/your-data/#dobermann-workspace)** you were using with the FlexionTech extension. Execution history (your past batch results and transaction logs) is stored in a SQLite database inside your workspace folder. If you open a different workspace, that history won't be there.

Your endpoints and environments will be migrated via export/import (Step 1–4 below). But execution history stays with the workspace automatically — as long as you keep using the same one, the new extension picks it up.

## Step 1: Export Your Data

While the FlexionTech extension is still installed, export everything:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **Dobermann: Export Workspace**
3. Save the file somewhere easy to find

This exports all your endpoints, folders, and environments into a single file. Sensitive data (tokens, secrets) is excluded for security.

## Step 2: Install Dobermann from the Marketplace

Install the new version published under **DBMN**:

1. Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for **"Dobermann"**
3. Look for the one published by **dbmn** (not FlexionTech)
4. Click **Install**

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbmn.dobermann).

## Step 3: Open Dobermann

In the Activity Bar (left sidebar), click **Dobermann** — the icon tooltip now reads "Dobermann".

The extension will be empty — this is expected. Your data is coming in the next step.

## Step 4: Import Your Data

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **Dobermann: Import Workspace**
3. Select the export file from Step 1
4. Choose **Merge** to import without overwriting

See [Import/Export](/docs/import-export/) for details on import modes.

## Step 5: Re-enter Credentials

Tokens and secrets are never included in exports. For each environment:

- **OAuth** — Re-enter your client secret, then sign in. **Important:** the OAuth redirect URI has changed from `vscode://FlexionTech.active8/oauth-callback` to `vscode://dbmn.dobermann/oauth-callback`. You must update this in your OAuth provider's client configuration — otherwise you'll get an `Invalid parameter: redirect_uri` error in the browser when signing in.
- **JWT** — Re-enter your token
- **Test** — Run a single API call against a non-production environment to confirm connectivity

## Step 6: Uninstall the FlexionTech Extension

Once you've confirmed everything works:

1. Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Find the old FlexionTech version
3. Click **Uninstall**
4. Reload VS Code when prompted

Do not run both extensions at the same time — they can conflict with each other.

## After Migration

- **Sign in to DBMN** — If you had a DBMN account, sign in again from the Account panel to restore your license and trial status.
- **Execution history** — If you kept the same workspace (see Before You Start), your past batch results and transaction logs are already available in the new extension.

## Troubleshooting

**I can see both extensions in the Activity Bar**
Uninstall the FlexionTech version (Step 6). Having both installed simultaneously can cause conflicts.

**OAuth stopped working / `Invalid parameter: redirect_uri`**
The redirect URI changed with the new publisher. Update your OAuth provider's client configuration to use `vscode://dbmn.dobermann/oauth-callback` (was `vscode://FlexionTech.active8/oauth-callback`). Then re-enter your client secret in the environment settings — secrets are never transferred between extensions.

**Need help?**
[Report an issue](https://github.com/dbmn-io/dbmn/issues) or ask in [GitHub Discussions](https://github.com/dbmn-io/dbmn/discussions).
