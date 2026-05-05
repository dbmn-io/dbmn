---
title: Getting Started
layout: default
nav_order: 1
parent: Documentation
---

# Getting Started with Dobermann

Dobermann enables bulk data migration through REST APIs — load, extract, and migrate massive datasets without writing scripts.

## Quick Start

Get up and running in 5 steps:

1. **Create an Environment** — Define your API base URL and authentication
2. **Create an Endpoint** — Configure HTTP method, URL, headers, and body template
3. **Run It** — Click Run and Dobermann auto-detects whether to execute a single request or open the batch runner
4. **Run a Batch** — Upload a file, paste data, or type values directly. Map columns, review your data, and execute
5. **Watch it Go** — The Console opens automatically with results streaming in real-time. Sit back and watch your batch execute — don't grab a coffee, you'll miss the show.

## First Launch: What to Expect

When you sign in to an OAuth environment for the first time, your browser and VS Code will show a few standard security prompts. These are normal — here's what to expect.

### "Open Visual Studio Code?" (Browser)

After you authenticate with your OAuth provider, the browser redirects back to VS Code using a `vscode://` link. Your browser will ask permission to open it.

- Click **Open** (or **Allow**)
- Optionally check **Always allow** to skip this prompt in future

### "Do you trust this domain?" (VS Code)

VS Code asks you to confirm trust for the domain that triggered the redirect. You may see this for your OAuth provider's domain and for dbmn.io. This is a one-time prompt per domain.

- Click **Open** to continue

### "Untrusted publisher" badge (Marketplace)

New extensions on the VS Code Marketplace show an "Unverified" badge until the publisher is verified by Microsoft. This is standard for all new extensions and will resolve once verified publisher status is granted.

All three prompts are standard VS Code and browser security measures — not bugs or issues with Dobermann.

## Core Concepts

### Environments

Environments define where your APIs run (development, staging, production). Each environment includes a base URL, authentication method (JWT, OAuth, or Google Service Account), and optional configuration like timezone and parallel processing.

### Endpoints

Endpoints are complete API request configurations — HTTP method, URL path, query parameters, headers, and a request body template. Configure once, then run individually or in batches with thousands of rows. Share endpoints with your team in a single click.

### Template Variables

Template variables use `{{variableName}}` syntax to create dynamic requests. Variables work in URL paths, query parameters, headers, and request bodies. For batch execution, source data columns map to template variables.

### Transactions

Every API request (individual or batch) creates a transaction record with request details, response data, and execution metadata.

### Batch Execution

Batch execution processes multiple API requests from your data. Upload a file, paste tabular data, or type values directly into the grid. Map columns to template variables, review and edit your data, configure options, and execute. A 5-step flow guides you from data loading to execution, with real-time monitoring in the Console.

## Your First Workflow

Follow this complete workflow to execute your first API request.

### Step 1: Create an Environment

1. Click the **+** icon next to "Environments" in the sidebar
2. Enter environment name (e.g., "Development")
3. Enter base URL (e.g., `https://api.example.com`)
4. Choose authentication method and configure credentials
5. Click **Save Environment**
6. Right-click environment and select **Set as Active**

### Step 2: Create an Endpoint

1. Click the **+** icon next to "Endpoints" in the sidebar
2. Enter endpoint name (e.g., "Create Order")
3. Select HTTP method (POST)
4. Enter URL path (e.g., `/api/orders`)
5. Add headers if needed (e.g., `Content-Type: application/json`)
6. Define request body template with variables
7. Click **Save Endpoint**

**Example request body:**
```json
{
    "orderId": "{{orderId:number}}",
    "customerName": "{{customerName:string}}",
    "quantity": "{{quantity:number}}"
}
```

### Step 3: Run It

Click the **play icon** on your endpoint in the sidebar, or click **Run** in the endpoint footer. Dobermann detects the `{{template variables}}` and opens the batch runner automatically.

> **Tip:** If you remove the template variables and hardcode values, the same button switches to "Run API" for a single request — no configuration needed.

### Step 4: Run a Batch

1. Click the play icon (or **Run Batch** in the endpoint footer) — Dobermann opens the batch runner
2. Upload an Excel/CSV file, paste data, or click **Enter Data** to type values directly
3. Map source data columns to template variables (file/paste path):
   - `orderId` → `ORDER_ID`
   - `customerName` → `CUSTOMER_NAME`
   - `quantity` → `QUANTITY`
4. Review and edit data in the grid — fix any validation errors
5. Review the generated JSON preview
6. Configure batch options (error tolerance, batch name) and click **Execute**

### Step 5: Watch it Go

The Console opens automatically and results stream in real-time as each request completes. You'll see live progress, success/error counts, and response times — all updating as the batch runs.

## What's Next?

Now that you've completed your first workflow, explore these features:

**Template Variables:** Learn about data types, modifiers, auto-generated variables, and the template editor. See [Template Variables](/docs/template-variables/).

**Batch Preparation:** Master data loading, column mapping, and data transformations. See [Batch Preparation](/docs/batch-preparation/).

**Console:** Understand queue, parallel processing, error tolerance, and analyse results with the Console. See [Console](/docs/console/).

**Environments:** Configure authentication (JWT, OAuth, Google Service Account), timezone, parallel threads, and more. See [Environments](/docs/environments/).

**Sharing:** Copy endpoint configurations and paste them in Teams, Outlook, or Confluence. See [Endpoints](/docs/endpoints/#sharing).

**Import/Export:** Share endpoint and environment configurations with your team. See [Import/Export](/docs/import-export/).

## Getting Help

If you encounter issues or have questions:

1. Check the [Troubleshooting](/docs/troubleshooting/) guide
2. Review relevant documentation sections
3. Check execution logs for error details
4. [Report issues](https://github.com/dbmn-io/dbmn/issues) on GitHub

## Related Topics

- [Environments](/docs/environments/) — Managing API environments
- [Endpoints](/docs/endpoints/) — Endpoint configuration and template variables
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Console](/docs/console/) — Running requests, monitoring progress, and analysing results
- [Import/Export](/docs/import-export/) — Sharing configurations
- [Troubleshooting](/docs/troubleshooting/) — Common issues and solutions
