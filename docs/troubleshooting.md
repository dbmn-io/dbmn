---
title: Troubleshooting
layout: default
nav_order: 10
parent: Documentation
---

# Troubleshooting

This guide covers common issues, error messages, and solutions for Dobermann. Issues are organised by category for easy reference. When you report an issue, the Console's Raw tab and **Logs** for the failing transaction are the most useful thing to include.

## Authentication Issues

### First-Time Sign-In Prompts

**Symptoms:**
- Browser asks "Open Visual Studio Code?" after OAuth login
- VS Code shows "Do you trust this domain?" dialog
- Extension shows "Unverified" or "Untrusted publisher" badge

**These are normal.** When you first sign in with OAuth, the browser-to-VS Code redirect triggers standard security prompts:

1. **Browser prompt** — Click **Open** (or **Allow**) to let the browser hand back to VS Code. Check **Always allow** to skip next time.
2. **Domain trust prompt** — VS Code asks you to trust the domain that triggered the redirect (your OAuth provider and/or dbmn.io). Click **Open**. One-time per domain.
3. **Unverified publisher** — New Marketplace extensions show this badge until Microsoft grants verified status. Does not affect functionality.

See [Getting Started — First Launch](/docs/getting-started/#first-launch-what-to-expect) for more detail.

### Token Expired

**Symptoms:**
- API requests return 401 Unauthorized
- A batch stops at once, because 401 is a critical code

**Solutions:**

**DBMN:** open {icon:nav-account} **Account** in the Hub and sign in again. Against a DBMN-authenticated environment a batch member refused with 401 is retried once with a refreshed token before it fails.

**Manual JWT Token:** open the environment, paste a fresh token into **JWT Token**, and **Save Environment**.

**OAuth:** open the environment and click **Sign In (New Token)** in the footer, or **Refresh Token** if one is held.

### OAuth Flow Fails

**Symptoms:**
- Browser opens but doesn't redirect back
- Error: "OAuth authentication failed"
- Stuck on authorization page

**Common causes and fixes:**

**Redirect URI mismatch:**
- Check OAuth provider configuration
- Ensure redirect URI matches exactly
- Format: `vscode://dbmn.dobermann/oauth-callback`

**Client credentials incorrect:**
- Verify client ID is correct
- Check client secret (if required)
- No extra spaces or line breaks

**Network issues:**
- Check firewall/proxy settings
- Verify can reach authorization URL
- Test URL in browser manually

### Organisation Not Selected

**Symptoms:**
- Requests fail because the API wanted an organisation header
- The Hub header reads `(pick org)` after the environment name

**Solution:**
Click the {icon:env-switcher} environment selector in the Hub header and choose an organisation under the environment. See [Environments — Organisation Selection](/docs/environments/#organization-selection).

### Sign in to run

**Symptoms:** The Run API and Run Batch buttons read **Sign in to run**.

Dobermann needs a DBMN account to run anything. Open {icon:nav-account} **Account** and sign in. A free account is enough.

## Endpoint Configuration

### Template Variables Not Replaced

**Symptoms:**
- Request shows literal `{{variable}}` text
- API returns validation error

**Causes and solutions:**

**Variable not mapped:**
- On **Map & Transform**, every required variable needs a column
- Point the unmapped ones at their columns; optional (`|opt`, `|null`) variables may stay unmapped

**Variable name mismatch:**
- Check spelling matches exactly
- Variables are case-sensitive
- Remove extra spaces
- Format: `{{variableName}}` not `{{ variableName }}`

### URL Encoding Issues

**Symptoms:**
- Special characters break URL
- 400 Bad Request errors

**Solutions:**
Dobermann auto-encodes query parameters and path variables. For special cases, pre-encode values in your data file.

### Type Validation Errors

**Symptoms:**
- Cells highlighted amber on **Review & Edit Data**
- A footer message such as `"quantity" has 3 invalid records — must be ≥ 0`

**Solutions:**
- Click **Filter Errors** to see only the rows that failed
- Fix the cells, or fix the file — the rule is on the template variable (`{{qty:number|>=0}}`); hover the column header to see it
- Check the **Source Format** on Map & Transform matches how the file writes numbers and dates

### Request Body Syntax Errors

**Symptoms:**
- Error: "Invalid JSON in request body"
- Red underline in JSON editor

**Common mistakes:**
- Missing quotes around keys
- Mismatched braces or brackets

**Solutions:**
- Click **Format** — it fails on the line that is wrong
- Check matching braces and brackets
- Use `Ctrl+/` to comment out problematic lines for testing; comments and trailing commas are allowed

### Endpoint Won't Save

**Required fields checklist:**
- Endpoint name provided
- HTTP method selected
- Path configured
- Valid JSON body (if POST/PUT/PATCH)

### Run API or Run Batch is disabled

Both are disabled while the endpoint has unsaved changes. **Save Endpoint** (Ctrl+S) first.

## Execution Problems

### Batch Stops Immediately

**Symptoms:**
- Batch stops after one request
- Status shows STOPPED

**Check:**
1. Open the Console's **Settings** tab. If **Error Handling** is **Stop on first error**, the first failure stopped it.
2. Look at the Error tab. A `401` or `403` stops a batch at once whatever the setting; so does a network error. Both are configurable under **Hub → Settings → Execution**.

**Solutions:**
- Fix the cause of the first error (usually authentication), then **Resume** or **Reprocess**
- Next time, choose **Continue processing** on Execute Batch to collect every failure in one run

### Execution Hangs

**Symptoms:**
- Request never completes
- Spinning indicator runs forever

**Debug steps:**
1. On the Raw tab, set **Status** to **Running** to see what is still in flight
2. Check API server status
3. Test with curl/Postman
4. Verify network connectivity, VPN and proxy
5. **Cancel** the batch; its completed work is kept and the rest can be reprocessed

### Slow Batch Performance

**Causes:**
- One row per request — the commonest cause by far
- API response time
- Large response payloads
- Network latency (VPN, geographic distance)

**Solutions:**
- Raise **Rows per request** on **Review & Configure** — the API's documented maximum is the right number. See [Batch Preparation](/docs/batch-preparation/#step-4-review-json)
- Raise **Processing Mode** on Execute Batch, within the environment's **Max Concurrency**
- Execute during off-peak hours

### Variables Show Wrong Data

**Symptoms:**
- Request has unexpected values
- Data seems shifted or misaligned

**Check:**
- Verify column mapping is correct — the endpoint remembers the last mapping, which may not fit this file
- Check column names match
- Look for extra spaces in headers
- Ensure consistent delimiter
- Verify UTF-8 encoding

### Too many requests, or too few

The **API calls** count on **Review & Configure** is the number of requests the batch will send. For a nested template, a new request starts whenever any header field changes — see [How rows become requests](/docs/batch-preparation/#nested-grouping). If the count is wrong, the data or the template is: click ⓘ beside the count to see how the rows were grouped.

## Data File Issues

### File Won't Load

**Check:**
- Must be `.csv`, `.xlsx`, `.xls`, `.tsv` or `.txt`
- UTF-8 encoding recommended
- Header row required
- Consistent delimiter (comma, tab, semicolon)
- **Open in Excel?** The browse dialog on Windows can't pick a file another program holds open. Drag it onto the drop zone instead — that always works

### Column Mapping Fails

**Header row issues:**
- First row must be column names
- No empty header cells
- No duplicate column names
- Remove special characters

### Data Not Substituting Correctly

**CSV data quality:**
- Check for empty cells in data
- Look for special characters
- Verify delimiter consistency
- Check quote escaping

**Excel CSV export issues:**
- Excel may change date formats — set **Source Format** on Map & Transform to match
- Numbers may lose leading zeros — paste from Excel, or load the `.xlsx` directly
- Use "Save As" → "CSV UTF-8"

## Console and Results

### Console Not Opening

**Solutions:**
1. Open {icon:nav-history} **History** in the Hub and click the run
2. Check **Hub → Settings → Execution → Auto-open console on completion** is on
3. Reload the VS Code window

### Results Missing Data

**Possible causes:**
- Request timed out before response
- Connection dropped during request
- Check API logs for server-side issues

### Columns I expected aren't there

The Completed and Error tabs show the columns of the active **view**. Click the view button above the table and choose another, or **Edit** it to add columns. See [Named Views](/docs/named-views/).

### Export Fails or is greyed out

**Check:**
- Export waits until the batch has finished
- Copy stops at 1,000 rows (Standard, Excel, Markdown) or 10,000 (CSV); Excel export at 2,000,000 cells — use CSV export for more. See [Console — Limits](/docs/console/#copy-options)
- Write permissions in the target directory
- Disk space available

## Environment and Network

### Cannot Connect to API

**Check base URL:**
- Protocol is included (`https://`)
- No trailing slash
- Domain is correct
- Port number if needed

**Network connectivity:**
- Can ping API server
- Firewall rules allow connection
- VPN connected if required
- Proxy configured correctly

### SSL Certificate Errors

**Production APIs:**
- Valid certificate should work automatically
- Update VS Code
- Check system date/time is correct

**Development/Staging:**
- Self-signed certs are common
- Add to trusted certificates

### Rate Limiting

**Symptoms:**
- Error: "429 Too Many Requests"
- Failures cluster when concurrency is high

**Solutions:**
- **Pause** the batch to cool down, then **Resume**
- Lower **Processing Mode** on the next run, or the environment's **Max Concurrency**
- Raise **Rows per request** so you need fewer requests
- Run during off-peak hours
- Contact the API admin to increase limits

## VS Code and Extension

### Extension Not Loading

1. Check Extensions panel - verify Dobermann is enabled
2. Click "Reload Required" if shown
3. Restart VS Code
4. Reinstall extension if needed

### The Hub Doesn't Open

1. Click the Dobermann icon in the Activity Bar — the Hub opens as an editor tab and the sidebar closes
2. Run **DBMN: Open Hub** from the Command Palette
3. Reload the VS Code window

### Two Hub Tabs

VS Code restores the Hub tab on restart and Dobermann re-attaches to it. If you ever see two, close one; nothing is lost.

### A Batch Was Running When VS Code Closed
{: #batch-after-restart }

Nothing is lost. On the next start, the batch that was running is paused, and so is any batch that was queued behind it. The Hub tells you which ones, with an **Open History** link; each shows **Paused** and has **Resume** on its right-click menu and in its Console footer. Resume continues from the transactions that had not run, and asks you to sign in first if the environment's token has expired. A single request that was in flight is cancelled; run it again.

### Performance Issues

If VS Code feels sluggish during a large batch, lower **Processing Mode**, and clear old runs from **History** (turn on **Select**, tick, **Delete**). Splitting very large files into several batches also helps.

## Getting Help

### Diagnostic Information

When reporting issues, include:

1. **Dobermann version:** Extensions panel → Dobermann → Version number
2. **VS Code version:** Help → About
3. **The transaction:** open the run under History, right-click the row → **View transaction**, and copy the request and response; the **Logs** button on the Raw tab has the execution log
4. **Reproduction steps:** What you did, expected, and actual behaviour
5. **Environment:** Operating system, API target, authentication method

### Reporting Issues

- [GitHub Issues](https://github.com/dbmn-io/dbmn/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/dbmn-io/dbmn/discussions) - Questions and community help
- [support@dbmn.io](mailto:support@dbmn.io)

## Related Topics

- [Environments](/docs/environments/) - Authentication and connection setup
- [Endpoints](/docs/endpoints/) - API configuration
- [Console](/docs/console/) - Running requests and analysing results
- [Batch Preparation](/docs/batch-preparation/) - Loading data and mapping columns
- [The Hub](/docs/hub/) - Settings that affect execution
