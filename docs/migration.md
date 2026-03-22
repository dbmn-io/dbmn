---
title: Migration Guide
layout: default
nav_order: 12
parent: Documentation
---

# Migrating from FlexionTech to Dobermann

Dobermann has moved from the **FlexionTech** publisher to the new **DBMN** publisher on the VS Code Marketplace. Your existing endpoints, environments, and data are safe — they live in your VS Code workspace and transfer automatically. This guide walks you through the switch.

## Before You Start

- You should be using the **same VS Code workspace** you used with the FlexionTech version
- The migration takes about 2 minutes
- No data is lost — endpoints, environments, and execution history carry over

## Step 1: Export Your Data

Open the FlexionTech extension and export everything as a backup:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **Dobermann: Export Workspace**
3. Save the file somewhere easy to find

This gives you a safety net. In most cases the data transfers automatically, but it's good practice to have a backup.

## Step 2: Install Dobermann from the Marketplace

Install the new version published under **DBMN**:

1. Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for **"Dobermann"**
3. Look for the one published by **dbmn** (not FlexionTech)
4. Click **Install**

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbmn.dobermann).

## Step 3: Open Dobermann

In the Activity Bar (left sidebar), click **Dobermann** — the icon tooltip now reads "Dobermann" instead of "DBMN".

Your endpoints and environments should appear automatically since they're stored in your workspace.

## Step 4: Verify Your Data

Check that everything came across:

- **Environments** — Open each environment and verify the base URL and auth method are correct. You may need to re-enter credentials (tokens, OAuth secrets) as these are never stored in exports.
- **Endpoints** — Spot-check a few endpoints to confirm the URL, headers, body template, and variables are intact.
- **Test** — Run a single API call against a non-production environment to confirm connectivity.

## Step 5: Import (If Needed)

If your data didn't transfer automatically:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **Dobermann: Import Workspace**
3. Select the export file from Step 1
4. Choose **Merge** to import without overwriting

See [Import/Export](import-export) for details on import modes.

## Step 6: Uninstall the FlexionTech Extension

Once you've confirmed everything works:

1. Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Find the old FlexionTech version
3. Click **Uninstall**
4. Reload VS Code when prompted

## After Migration

- **Re-enter credentials** — OAuth client secrets, JWT tokens, and access tokens are excluded from exports for security. Configure authentication on each environment after migration.
- **Sign in to DBMN** — If you had a DBMN account, sign in again from the Account panel to restore your license and trial status.
- **Same workspace** — Continue using the same VS Code workspace. Your execution history and settings are workspace-scoped.

## Troubleshooting

**I can see both extensions in the Activity Bar**
Uninstall the FlexionTech version (Step 6). Having both installed simultaneously can cause conflicts.

**My endpoints are missing after install**
Make sure you opened the same VS Code workspace. If they're still missing, import the backup from Step 1.

**OAuth stopped working**
Re-enter your OAuth client secret in the environment settings. Secrets are never transferred between extensions.

**Need help?**
[Report an issue](https://github.com/dbmn-io/dbmn/issues) or ask in [GitHub Discussions](https://github.com/dbmn-io/dbmn/discussions).
