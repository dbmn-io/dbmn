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
| [Getting Started](getting-started) | Installation and first steps |
| [Environments](environments) | Configure API connections and authentication |
| [↳ OAuth Setup Guide](oauth-setup) | OAuth and Google Service Account configuration |
| [Endpoints](endpoints) | Configure API requests, share with your team |
| [↳ Sharing Endpoints](sharing-endpoints) | Share an endpoint, paste it on the other side |
| [↳ Template Variables](template-variables) | Variable syntax, types, modifiers, and editing |
| [Batch Preparation](batch-preparation) | Load data and map columns |
| [Console](console) | Run requests, monitor progress, analyse results |
| [↳ Pagination](pagination) | Configure and run paginated API requests |
| [↳ Batch Reprocessing](batch-reprocessing) | Re-run only failed transactions from a previous batch |
| [Import/Export](import-export) | Share configurations with your team |
| [Playground](playground) | Live API sandbox with ready-to-paste endpoint templates |
| [Shortcuts](shortcuts) | Keyboard shortcuts for efficiency |
| [Migration Guide](migration) | Moving from FlexionTech to DBMN publisher |
| [Your Data & Privacy](your-data) | Where data is stored and what leaves your machine |
| [Troubleshooting](troubleshooting) | Common issues and solutions |
| [Changelog](changelog) | Release history and what's new |
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
