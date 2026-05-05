---
title: Import/Export
layout: default
nav_order: 8
parent: Documentation
---

# Import/Export

Dobermann provides comprehensive import and export functionality for sharing endpoint configurations, environments, and workflows across teams or between workspaces.

## Overview

You can import and export:
- **Individual endpoints** - Single API configuration
- **Folders** - All endpoints within a folder
- **Environments** - Connection and auth settings (excluding sensitive data)
- **Complete workspace** - All endpoints, folders, and environments

## Exporting Data

### Export Individual Endpoint

**From sidebar:**
1. Right-click endpoint
2. Select **Export Endpoint**
3. Choose save location
4. File saved as `{endpoint-name}.json`

**From endpoint webview:**
1. Open endpoint editor
2. Click **... More** menu
3. Select **Export**
4. Choose save location

**Exported data includes:**
- HTTP method and URL path
- Headers (custom and organization)
- Query parameters
- Request body template
- Variable definitions

**Excluded:**
- Environment association
- Execution history
- Data files
- Authentication tokens

### Export Folder

Export all endpoints within a folder:

1. Right-click folder in sidebar
2. Select **Export Folder**
3. Choose save location
4. File saved as `{folder-name}-export.json`

### Export Environment

**From sidebar:**
1. Right-click environment
2. Select **Export Environment**
3. Choose save location
4. File saved as `{environment-name}-env.json`

**Exported data includes:**
- Environment name and type
- Base URL
- Description
- Mock mode setting
- Authentication method (type only)
- OAuth configuration (URLs and scopes only)

**Excluded for security:**
- JWT tokens
- OAuth client secrets
- Access tokens
- Refresh tokens
- Organization IDs

**Note:** Recipients must provide their own authentication credentials after importing.

### Export Workspace

Export everything from current workspace:

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Dobermann: Export Workspace"
3. Select command
4. Choose save location

**Contains:**
- All endpoints
- All folders and hierarchy
- All environments (excluding sensitive data)
- Global settings

## Importing Data

### Import Endpoint

**From sidebar:**
1. Click **... More** in Endpoints section header
2. Select **Import Endpoint**
3. Browse to `.json` file
4. Endpoint is created in "Imported" folder

**After import:**
- Review endpoint configuration
- Assign to appropriate folder
- Associate with environment
- Test with single execution

### Import Folder

Import multiple endpoints at once:

1. Click **... More** in Endpoints section header
2. Select **Import Folder**
3. Browse to `{folder-name}-export.json`

**Import behavior:**
- New folder created with original name
- If folder exists, number is appended (e.g., "API Endpoints (2)")
- All endpoints imported under new folder

### Import Environment

**From sidebar:**
1. Click **+** next to Environments
2. Select **Import Environment**
3. Browse to `{environment-name}-env.json`

**After import:**
- Verify base URL is correct
- Configure authentication (provide credentials)
- Test connection

### Import Workspace

Import complete workspace export:

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Type "Dobermann: Import Workspace"
3. Choose import mode

**Import modes:**

**Merge:**
- Imports new items
- Skips existing items (by ID)
- Preserves current workspace
- Safe for incremental updates

**Replace:**
- Deletes all existing data
- Imports all items from file
- Use for clean migration
- Warning: Cannot be undone

## File Formats

### Endpoint JSON Structure

```json
{
  "id": "uuid-here",
  "name": "Location Update",
  "method": "POST",
  "path": "/api/locations/{{locationId}}",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json",
      "enabled": true
    }
  ],
  "body": {
    "type": "json",
    "content": "{\"capacity\": {{capacity:number}}}"
  },
  "consoleViews": {
    "success": { "activeView": "PO Lines", "defaultView": "PO Lines", "views": [ /* … */ ] },
    "errors":  { "activeView": "Root",     "defaultView": "Root",     "views": [ /* … */ ] }
  }
}
```

**Console views travel with the endpoint.** Any [Named Views](/docs/console/#named-views) you've saved on the Completed/Errors tabs are exported alongside the endpoint and applied automatically on import. Share an endpoint with a teammate and they get not just the request configuration but also the column layouts, row bases, and sort preferences you've curated.

### Environment JSON Structure

```json
{
  "id": "uuid-here",
  "name": "Production",
  "type": "production",
  "baseUrl": "https://api.example.com",
  "description": "Live production API",
  "authMethod": "oauth",
  "oauthConfig": {
    "authorizationUrl": "/oauth/authorize",
    "tokenUrl": "/oauth/token",
    "scopes": "read write"
  }
}
```

**Note:** Sensitive fields like `clientSecret`, `jwtToken`, `accessToken` are never exported.

## Sharing with Teams

### Best Practices

**Exporting for team:**
1. Export workspace or specific folders
2. Document any required setup steps
3. Note any environment-specific requirements
4. Share via Git, SharePoint, or cloud storage

**Receiving imports:**
1. Review all imported items before use
2. Verify URLs match target environment
3. Update any customer-specific values
4. Test with single execution first
5. Configure authentication separately

### Version Control

Dobermann export files are Git-friendly:
- JSON format (easy diff)
- No sensitive data
- Deterministic output
- Human-readable structure

### Security Considerations

**What's safe to share:**
- Endpoint configurations
- Request templates
- Variable definitions

**Never share:**
- JWT tokens
- OAuth client secrets
- Access/refresh tokens
- API keys in headers
- Production credentials

**Recommendation:**
Use environment-specific variables for sensitive data:
```json
{
  "headers": [
    {
      "key": "X-API-Key",
      "value": "{{API_KEY}}"
    }
  ]
}
```
Team members provide their own `API_KEY` value.

## Migration Scenarios

### Moving to New Machine

1. Export workspace on old machine
2. Copy export file to new machine
3. Install Dobermann extension
4. Import workspace
5. Configure environment authentication
6. Test critical endpoints

### Sharing with Contractor

1. Export specific folder (not full workspace)
2. Create separate environment for contractor
3. Share folder export + environment export
4. Provide authentication separately
5. Contractor imports and configures auth

## Related Topics

- [Environments](/docs/environments/) - Authentication and connection setup
- [Endpoints](/docs/endpoints/) - Creating and managing API configurations
- [Batch Preparation](/docs/batch-preparation/) - Loading CSV data for batch execution
