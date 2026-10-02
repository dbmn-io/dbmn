---
title: Getting Started
layout: default
nav_order: 1
parent: Documentation
---

# Getting Started with Dobermann

Dobermann enables bulk data migration through REST APIs — load, extract, and migrate massive datasets without writing scripts.

## Two ways to start

**Take the course.** [Puppy School](/puppy-school/) is five hands-on lessons on a live practice API, about an hour in all. It walks you through everything on this page and a good deal more, with a badge for each lesson. If you have an hour, start there. Come back here for the reference.

**Or read on** for the five-minute version against your own API.

## Quick Start

1. **Create an Environment** — where your API lives: base URL and authentication
2. **Create an Endpoint** — HTTP method, path, headers, and a body template
3. **Run It** — **Run API** sends one request and shows you what comes back
4. **Run a Batch** — point the same endpoint at a file, map the columns, execute
5. **Watch it Go** — the Console opens with results streaming in. Don't go for a coffee, you'll miss it.

Everything happens in the [Hub](/docs/hub/), the single tab that opens when you click the Dobermann icon in the VS Code Activity Bar.

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

### The Hub

One editor tab with a rail of sections on the left ({icon:nav-environments} Environments, {icon:nav-api-catalogue} API Catalogue, {icon:nav-history} History, Import, Export, {icon:nav-account} Account, {icon:nav-settings} Settings), a list panel beside it, and a tab area where editors and the Console open. The header holds the {icon:env-switcher} **environment selector**: whatever it shows is where every request goes. See [The Hub](/docs/hub/).

### Environments

Environments define where your APIs run (development, staging, production). Each environment includes a base URL, authentication method (DBMN, JWT, OAuth, or Google Service Account), and optional configuration like timezone and parallel processing.

### Endpoints

Endpoints are complete API request configurations — HTTP method, URL path, query parameters, headers, and a request body template. Configure once, then run individually or in batches with thousands of rows. Share an endpoint with your team in one click.

### Systems

A System is a short name for one API: `wms`, `erp`. Endpoints and environments both carry one, so the catalogue can show you the endpoints that belong with the environment you are connected to. See [The Hub — Systems](/docs/hub/#systems).

### Template Variables

Template variables use `{{variableName}}` syntax to create dynamic requests. Variables work in URL paths, query parameters, headers, and request bodies. For batch execution, source data columns map to template variables.

### Transactions

Every API request (individual or batch) creates a transaction record with request details, response data, and execution metadata. They are listed under **History**.

### Batch Execution

Batch execution processes multiple API requests from your data. Upload a file, paste tabular data, or type values directly into the grid. Map columns to template variables, review and edit your data, check the requests it will send, and execute. A 5-step flow guides you from data loading to execution, with real-time monitoring in the Console.

## Your First Workflow

Follow this complete workflow to execute your first API request.

### Step 1: Create an Environment

1. In the Hub, open {icon:nav-environments} **Environments** and click **Add Environment**
2. Enter an environment name (e.g., "Development")
3. Enter the base URL (e.g., `https://api.example.com`)
4. On the **Authentication** tab, choose a method and configure credentials
5. Click **Save Environment**
6. At the top of the Hub, click the {icon:env-switcher} environment selector and choose your new environment. It is now where every request goes.

### Step 2: Create an Endpoint

1. Open {icon:nav-api-catalogue} **API Catalogue** and click {icon:add-endpoint} **Add Endpoint**
2. Enter an endpoint name (e.g., "Create Order")
3. Select the HTTP method (POST)
4. Enter the path (e.g., `/api/orders`)
5. Add headers if needed — or leave **Include environment-level headers** ticked and put them on the environment once
6. Write the request body template with variables
7. Click **Save Endpoint**

**Example request body:**
```json
{
    "orderId": "{{orderId:number}}",
    "customerName": "{{customerName:string}}",
    "quantity": "{{quantity:number}}"
}
```

Got an endpoint from a colleague? Click {icon:paste-endpoint} **New Endpoint from Clipboard** instead, and the name, method, path, headers and body are filled in for you. See [Sharing Endpoints](/docs/sharing-endpoints/).

### Step 3: Run It

Click **Run API** in the endpoint footer, or the {icon:run-api} icon on the endpoint's row in the API Catalogue. Because this endpoint has `{{template variables}}`, a form asks for one value each — type them, or copy a header row and a data row from your spreadsheet and click {icon:paste-row} **Paste**. Click **Run** and the Console opens with the response.

One request proves the endpoint, the template and the API agree. See [Run API](/docs/run-api/).

### Step 4: Run a Batch

1. Click **Run Batch** in the endpoint footer (or the {icon:run-batch} icon on its catalogue row). It opens as a tab.
2. **Load Data** — drop an Excel or CSV file onto the upload area, paste rows on the **Paste Text** tab, or click **Enter Data** to type values directly. Click **Import Data**.
3. **Map & Transform** — columns whose names match your variables map themselves. Point the rest at their columns:
   - `orderId` → `ORDER_ID`
   - `customerName` → `CUSTOMER_NAME`
   - `quantity` → `QUANTITY`
4. **Review & Edit Data** — fix anything highlighted in the grid
5. **Review & Configure** — check the first requests and how many **API calls** will be made
6. **Execute Batch** — name the batch, choose **Error Handling** and **Processing Mode**, and click **Execute**

### Step 5: Watch it Go

The Console opens automatically and results stream in real-time as each request completes. You'll see live progress, success/error counts, and response times — all updating as the batch runs. The run stays under {icon:nav-history} **History** afterwards.

## What's Next?

Now that you've completed your first workflow, explore these features:

**Puppy School:** The same workflow at scale — 67,000 records, deliberate errors, a report and a template of your own. See [Puppy School](/puppy-school/).

**Template Variables:** Learn about data types, modifiers, auto-generated variables, and the template editor. See [Template Variables](/docs/template-variables/).

**Batch Preparation:** Master data loading, column mapping, and data transformations. See [Batch Preparation](/docs/batch-preparation/).

**Console:** Understand the Console tabs, search, Named Views, and export. See [Console](/docs/console/).

**Environments:** Configure authentication (DBMN, JWT, OAuth, Google Service Account), timezone, parallel requests, and more. See [Environments](/docs/environments/).

**Sharing:** Copy an endpoint to the clipboard and paste it in Teams, Outlook, Confluence — or straight into a colleague's Dobermann. See [Sharing Endpoints](/docs/sharing-endpoints/).

**Import/Export:** Move endpoints and environments between machines as one file. See [Import/Export](/docs/import-export/).

## Getting Help

If you encounter issues or have questions:

1. Check the [Troubleshooting](/docs/troubleshooting/) guide
2. Review relevant documentation sections
3. Open the run under **History** and read its Raw tab and logs
4. [Report issues](https://github.com/dbmn-io/dbmn/issues) on GitHub, or email [support@dbmn.io](mailto:support@dbmn.io)

## Related Topics

- [The Hub](/docs/hub/) — Where everything lives
- [Environments](/docs/environments/) — Managing API environments
- [Endpoints](/docs/endpoints/) — Endpoint configuration and template variables
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Console](/docs/console/) — Running requests, monitoring progress, and analysing results
- [Import/Export](/docs/import-export/) — Sharing configurations
- [Troubleshooting](/docs/troubleshooting/) — Common issues and solutions
