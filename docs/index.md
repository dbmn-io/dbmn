---
title: Documentation
layout: default
nav_order: 1
has_children: true
---

# Dobermann Documentation

Welcome to the Dobermann documentation. Dobermann enables bulk data migration through REST APIs — load, extract, and migrate millions of records without writing scripts.

## Quick Links

| Guide | Description |
|-------|-------------|
| [Getting Started](/docs/getting-started/) | Installation and first steps |
| [Environments](/docs/environments/) | Configure API connections and authentication |
| [↳ OAuth Setup Guide](/docs/oauth-setup/) | OAuth and Google Service Account configuration |
| [Endpoints](/docs/endpoints/) | Configure API requests, share with your team |
| [↳ Sharing Endpoints](/docs/sharing-endpoints/) | Share an endpoint, paste it on the other side |
| [↳ Template Variables](/docs/template-variables/) | Variable syntax, types, modifiers, and editing |
| [Batch Preparation](/docs/batch-preparation/) | Load data and map columns |
| [Console](/docs/console/) | Run requests, monitor progress, analyse results |
| [↳ Named Views](/docs/named-views/) | Save column layouts and row-per-X shapes; one response, many lenses |
| [↳ Pagination](/docs/pagination/) | Configure and run paginated API requests |
| [↳ Batch Reprocessing](/docs/batch-reprocessing/) | Re-run only failed transactions from a previous batch |
| [Import/Export](/docs/import-export/) | Share configurations with your team |
| [Playground](/docs/playground/) | Live API sandbox with ready-to-paste endpoint templates |
| [Shortcuts](/docs/shortcuts/) | Keyboard shortcuts for efficiency |
| [Migration Guide](/docs/migration/) | Moving from FlexionTech to DBMN publisher |
| [Your Data & Privacy](/docs/your-data/) | Where data is stored and what leaves your machine |
| [Troubleshooting](/docs/troubleshooting/) | Common issues and solutions |
| [Changelog](/docs/changelog/) | Release history and what's new |
| [Pricing](/pricing.html) | Plans, pricing, and free trial details |

## What is Dobermann?

Every enterprise system speaks REST. But migrating data through REST APIs still means custom scripts, fragile integrations, and developers pulled away from real work. Dobermann changes that — take your data, map it to any API, and load millions of records with parallel processing, validation, and real-time results.

- **Endpoint Configuration** — Define HTTP method, URL, headers, body templates, and share them with your team
- **Template Variables** — Map source data columns to API fields with type validation, modifiers, and conditional logic
- **Environment Management** — Manage connections, authentication (JWT, OAuth, Google Service Account), and per-environment variables
- **Batch Execution** — Process thousands of rows with parallel processing and live progress
- **Live Results** — Watch results stream in as your batch executes

## Installation

Currently available as a VS Code extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Dobermann"
4. Click Install

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbmn.dobermann).

## Support

- [Report Issues](https://github.com/dbmn-io/dbmn/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/dbmn-io/dbmn/discussions) - Questions and community help
