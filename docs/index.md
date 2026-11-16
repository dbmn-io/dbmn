---
title: Documentation
layout: default
nav_order: 1
has_children: true
---

# Dobermann Documentation

Welcome to the Dobermann documentation. Dobermann enables bulk data migration through REST APIs — load, extract, and migrate millions of records without writing scripts. It is free and [open source](/docs/open-source/).

## New here? Start with Puppy School

[**Puppy School**](/puppy-school/) is a free, hands-on course: five lessons on a live practice API, about an hour end to end. You install Dobermann, connect it to The Training Ground, load 67,000 records, break a load and fix it, build a report, and write your own template. Every lesson earns a badge. It is the fastest way to learn the product, and you need nothing but a free DBMN account.

## Quick Links

| Guide | Description |
|-------|-------------|
| [Puppy School](/puppy-school/) | The course: five lessons on a live API, free |
| [Getting Started](/docs/getting-started/) | Installation and your first run |
| [The Hub](/docs/hub/) | Where everything lives: rail, lists, tabs, settings |
| [Help Mode](/docs/help-mode/) | Press `?` or click the help button: every control links to its page here |
| [Environments](/docs/environments/) | Configure API connections, authentication, and environment types |
| [↳ OAuth Setup Guide](/docs/oauth-setup/) | OAuth and Google Service Account configuration |
| [Endpoints](/docs/endpoints/) | Configure API requests, share with your team |
| [↳ Sharing Endpoints](/docs/sharing-endpoints/) | Copy an endpoint to share, paste it on the other side |
| [↳ Template Variables](/docs/template-variables/) | Variable syntax, types, modifiers, and editing |
| [Run API](/docs/run-api/) | Send one request; paste a spreadsheet row to fill its values |
| [Batch Preparation](/docs/batch-preparation/) | Load data and map columns |
| [Console](/docs/console/) | Run requests, monitor progress, analyse results |
| [↳ Named Views](/docs/named-views/) | Save column layouts and row-per-X shapes; one response, many lenses |
| [↳ Pagination](/docs/pagination/) | Configure and run paginated API requests |
| [↳ Chain](/docs/chain/) | Send a run's results into another endpoint's Run Batch, and trace the link |
| [↳ Batch Reprocessing](/docs/batch-reprocessing/) | Re-run only failed transactions from a previous batch |
| [Compare](/docs/compare/) | A result against up to three others, cell by cell: environments, or one environment over time (Beta) |
| [Import/Export](/docs/import-export/) | Share configurations with your team |
| [The Training Ground](/docs/playground/) | The practice API behind Puppy School: endpoints, data, limits |
| [Shortcuts](/docs/shortcuts/) | Keyboard shortcuts |
| [Migration Guide](/docs/migration/) | Moving from FlexionTech to DBMN publisher |
| [Your Data & Privacy](/docs/your-data/) | Where data is stored and what leaves your machine |
| [Troubleshooting](/docs/troubleshooting/) | Common issues and solutions |
| [Changelog](/docs/changelog/) | Release history and what's new |
| [Open Source](/docs/open-source/) | The licence, the repository, building it yourself, contributing |

## What is Dobermann?

Every enterprise system speaks REST. But migrating data through REST APIs still means custom scripts, fragile integrations, and developers pulled away from real work. Dobermann changes that — take your data, map it to any API, and load millions of records with parallel processing, validation, and real-time results.

- **Endpoint Configuration** — Define HTTP method, URL, headers, body templates, and share them with your team
- **Template Variables** — Map source data columns to API fields with type validation, modifiers, and conditional logic
- **Environment Management** — Manage connections, authentication (DBMN, JWT, OAuth, Google Service Account), and per-environment variables
- **Batch Execution** — Process thousands of rows with parallel processing and live progress
- **Live Results** — Watch results stream in as your batch executes, then shape them with Named Views and export
- **Compare** — Line up saved results from DEV, UAT and PROD, or from last week and today, and see cell by cell what changed

## Installation

Nothing to install: open [app.dbmn.io](https://app.dbmn.io) in your browser and sign in with a free DBMN account.

Or use the VS Code extension, which needs no account:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Dobermann"
4. Click Install
5. Click the Dobermann icon in the Activity Bar — the [Hub](/docs/hub/) opens

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbmn.dobermann), or [build it from source](/docs/open-source/#build).

A desktop app to download, for Windows, macOS and Linux, is coming soon.

## Support

- [Report Issues](https://github.com/dbmn-io/dobermann/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/dbmn-io/dobermann/discussions) - Questions and community help
- [The source](https://github.com/dbmn-io/dobermann) - Dobermann is open source: read it, build it, contribute
- [support@dbmn.io](mailto:support@dbmn.io)
