---
title: Troubleshooting
layout: default
nav_order: 10
parent: Documentation
---

# Troubleshooting

This guide covers common issues, error messages, and solutions for Dobermann. Issues are organized by category for easy reference.

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
- Environment shows warning icon
- Error message: "Token expired" or "Unauthorized"

**Solutions:**

**For JWT authentication:**
1. Open environment configuration
2. Select "Manual JWT Token"
3. Obtain fresh token from your API provider
4. Paste new token
5. Save environment

**For OAuth authentication:**
1. Open environment configuration
2. Click "Re-authenticate with OAuth"
3. Complete OAuth flow in browser
4. Token refreshes automatically

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

### Organization Selection Required

**Symptoms:**
- Requests fail with "Organization header missing"
- Environment shows organization warning

**Solution:**
1. Open environment configuration
2. Wait for organization list to load
3. Select your organization from dropdown
4. Headers are added automatically

## Endpoint Configuration

### Template Variables Not Replaced

**Symptoms:**
- Request shows literal `{{variable}}` text
- API returns validation error

**Causes and solutions:**

**Variable not mapped:**
- Load CSV file
- Open column mapping interface
- Map each variable to a data column
- Verify green checkmarks appear

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
Dobermann auto-encodes query parameters and path variables. For special cases, pre-encode values in your CSV file.

### Type Validation Errors

**Symptoms:**
- Error: "Type mismatch for variable X"
- Number expected but got string

**Solutions:**
- Specify type in variable: `{{qty:number}}`
- Ensure CSV data formatting matches: numbers without quotes, booleans as `true`/`false`

### Request Body Syntax Errors

**Symptoms:**
- Error: "Invalid JSON in request body"
- Red underline in JSON editor

**Common mistakes:**
- Trailing commas in JSON
- Missing quotes around keys
- Mismatched braces or brackets

**Solutions:**
- Use the built-in JSON validator
- Check matching braces and brackets
- Use `Ctrl+/` to comment out problematic lines for testing

### Endpoint Won't Save

**Required fields checklist:**
- Endpoint name provided
- HTTP method selected
- URL path configured
- Valid JSON body (if POST/PUT)

## Execution Problems

### Batch Stops Immediately

**Symptoms:**
- Batch stops after 1 request
- Status shows stopped

**Check error tolerance setting:**
1. Open endpoint configuration
2. Review error tolerance section
3. If "Stop on First Error" is selected, first failure stops batch

**Solutions:**
- Change to "Maximum Error Count: 10"
- Or "Percentage-Based: 10%"
- Or "Continue on All Errors"

### Execution Hangs

**Symptoms:**
- Request never completes
- Spinning indicator runs forever

**Debug steps:**
1. Check API server status
2. Test with curl/Postman
3. Verify network connectivity
4. Review firewall/proxy settings
5. Check VS Code output panel

### Slow Batch Performance

**Causes:**
- API response time (check average in progress monitor)
- Large response payloads
- Network latency (VPN, geographic distance)

**Solutions:**
- Run smaller batches (100-500 rows)
- Execute during off-peak hours
- Increase timeout if needed

### Variables Show Wrong Data

**Symptoms:**
- Request has unexpected values
- Data seems shifted or misaligned

**Check:**
- Verify column mapping is correct
- Check column names match
- Look for extra spaces in headers
- Ensure consistent delimiter
- Verify UTF-8 encoding

## Data File Issues

### File Won't Load

**Check:**
- Must be `.xlsx`, `.xls`, `.csv`, or `.txt` extension
- UTF-8 encoding recommended
- Header row required
- Consistent delimiter (comma, tab, semicolon)
- File isn't locked by Excel
- Try copying to new location

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
- Excel may change date formats
- Numbers may lose leading zeros
- Use "Save As" -> "CSV UTF-8"

## Console and Results

### Console Not Opening

**Solutions:**
1. Check VS Code output panel
2. Manually open from Executions sidebar
3. Verify `.active8/results/` directory exists
4. Reload VS Code window

### Results Missing Data

**Possible causes:**
- Request timed out before response
- Connection dropped during request
- Check API logs for server-side issues

### Export Fails

**Check:**
- Write permissions in target directory
- Disk space available
- File path length (max 255 chars)

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
- Update VS Code and Node.js
- Check system date/time is correct

**Development/Staging:**
- Self-signed certs are common
- Add to trusted certificates

### Rate Limiting

**Symptoms:**
- Error: "429 Too Many Requests"
- Batch stops mid-execution

**Solutions:**
- Pause batch to cool down
- Reduce batch size
- Run during off-peak hours
- Contact API admin to increase limits

## VS Code and Extension

### Extension Not Loading

1. Check Extensions panel - verify Dobermann is enabled
2. Click "Reload Required" if shown
3. Restart VS Code
4. Reinstall extension if needed

### Sidebar Tree Not Showing

1. Open Command Palette -> "Dobermann: Reload"
2. Or restart VS Code
3. Check `.active8/` directory exists

### Webview Won't Open

1. Check VS Code output panel
2. Disable other extensions (possible conflict)
3. Clear VS Code cache
4. Update VS Code to latest version

### Performance Issues

**Causes:** Large batch in progress, many executions in history, large CSV files loaded.

**Solutions:**
- Close unnecessary webviews
- Clear old execution history
- Reduce batch sizes
- Disable other extensions

## Getting Help

### Diagnostic Information

When reporting issues, include:

1. **Dobermann version:** Extensions panel -> Dobermann -> Version number
2. **VS Code version:** Help -> About
3. **Error messages:** VS Code output panel or Developer Tools console
4. **Reproduction steps:** What you did, expected, and actual behavior
5. **Environment:** Operating system, API target, authentication method

### Reporting Issues

- [GitHub Issues](https://github.com/dbmn-io/dbmn/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/dbmn-io/dbmn/discussions) - Questions and community help

## Related Topics

- [Environments](/docs/environments/) - Authentication and connection setup
- [Endpoints](/docs/endpoints/) - API configuration
- [Console](/docs/console/) - Running requests and analysing results
- [Batch Preparation](/docs/batch-preparation/) - CSV and variable mapping
