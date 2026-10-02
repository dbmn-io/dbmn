---
title: Import/Export
layout: default
nav_order: 8
parent: Documentation
---

# Import/Export

Move endpoints and environments between machines, back them up, or hand a whole setup to a teammate as one file. Export writes a `.dbmn.zip`; Import reads it back — or reads a Postman collection.

Both live on the Hub rail: {icon:nav-export} **Export** and {icon:nav-import} **Import** each open as a tab.

## Export
{: #export }

1. Open {icon:nav-export} **Export** in the Hub
2. Tick the **Environments** and **Endpoints** to include — **Select All** / **Deselect All** for each list
3. Set the **Export Filename** (default `dobermann-export`; `.dbmn.zip` is added)
4. Click **Export Selected Items** and choose where to save

To export a handful of endpoints from the catalogue instead, turn on **Select** in {icon:nav-api-catalogue} **API Catalogue**, tick them, and click **Export** in the bar that appears.

### What's in the file

- Endpoints: method, path, description, tags, System, headers, query parameters, body template, and their saved [Console views](/docs/named-views/)
- Environments: name, type, System, base URL, description, mock setting, authentication method and its configuration, headers and variables
- Your Console display settings

Endpoints and environments carry their **System by name**, so a System is recreated on import if the other machine doesn't have it.

### What's left out
{: #credentials }

By default an export removes anything that can authenticate as you:

- Session tokens (access and refresh tokens) — **always** removed
- OAuth client secrets
- Google service-account private keys

Recipients enter their own after importing; the import tells them which environments need it.

**Include environment credentials**, a tick-box on the Export page, keeps the OAuth client secret and the service-account private key in the file. Only use it when you are sending the file somewhere you would send a password. A file exported this way is **not** safe to commit to git or paste into a chat — anyone holding it can authenticate as that service account or OAuth client.

{: .warning }
> Environment **headers and variables are exported as written.** If you keep an API key in one, it is in the file. Prefer an `{{ENV:…}}` variable that each person sets on their own environment.

## Import
{: #import }

1. Open {icon:nav-import} **Import** in the Hub
2. Drag a `.dbmn.zip` or a Postman `.json` collection onto the drop zone, or click **Browse Computer**
3. Review **Items to Import**: environments and endpoints, each with an editable name and a badge
4. Untick anything you don't want, then click **Import Configuration**

| Badge | Meaning |
|---|---|
| **CREATE** | New on this machine |
| **UPDATE** | An item with this name already exists and will be replaced — same identity, new configuration. Change the name to create a copy instead |

The badge updates as you edit the name, so you can see what each item will do before you import.

**Endpoint names must be unique.** A clash with an endpoint already here is renamed `Name (folder)` for you, and the item says so. Nothing is skipped silently: anything that could not be imported is listed under **Not Imported** at the end.

**Needs Attention** lists the environments whose credentials were stripped at export time — open each one and enter them before running against it.

Systems are matched by name, case-insensitively, and created if missing.

### Importing from Postman Collections
{: #importing-from-postman-collections }

Dobermann can import endpoints directly from a Postman v2.1 collection JSON file. This makes it easy to bring an existing API library into Dobermann without rebuilding each request by hand.

**How to use it:**

1. Open {icon:nav-import} **Import** in the Hub
2. Drag your Postman collection `.json` file onto the drop zone (or browse to it)
3. Use the Postman Import Options to choose how to bring the requests in
4. Tick the items you want and click **Import Configuration**

**Postman Import Options:**

- **Include headers from collection** *(off by default)* — when ticked, request headers from each Postman request are imported alongside the endpoint. Dobermann will warn you before enabling this, because in most cases you should leave headers on the Environment (so they apply to every endpoint that uses it). Only enable this if a specific endpoint genuinely needs different headers from its environment.
- **Folder destination** — either **Use folders from collection** (the immediate parent folder of each request becomes a tag) or **Import all into folder** of your choice.

#### What gets imported

Dobermann reads only the fields it can map directly to a Dobermann endpoint. Variables in `{{this}}` syntax pass through unchanged — they continue to resolve from your active environment, exactly as they did in Postman.

| Dobermann field | Source in Postman                         |
|-----------------|-------------------------------------------|
| Name            | `item.name`                               |
| Method          | `request.method`                          |
| Path            | `request.url.path` (host portion stripped)|
| Body            | `request.body.raw` (raw mode only)        |
| Tag             | Immediate parent folder name              |
| Query params    | `request.url.query`                       |
| Description     | `request.description`                     |
| Headers         | `request.header` *(optional, off by default)*  |

#### What is NOT imported (and why)
{: #what-is-not-imported-and-why }

Dobermann is not a Postman replacement — it's a focused tool for bulk data loads against REST APIs. Several things in a Postman collection have no equivalent in Dobermann and are deliberately dropped on import:

| Postman feature | Why it's not imported |
|-----------------|-----------------------|
| **Pre-request scripts** (`event[].listen: "prerequest"`) | Dobermann does not run JavaScript hooks. Use template variables, environment variables, or environment headers to compute values. |
| **Test scripts** (`event[].listen: "test"`) | Dobermann does not execute Postman test scripts. Check results in the Console after each run. |
| **Saved response examples** (`response[]`) | Dobermann captures live responses each run; saved examples from Postman are not preserved. |
| **Auth methods other than `bearer`** (OAuth 2.0, Basic, API Key, AWS Signature, NTLM, Hawk, etc.) | Auth is configured per-Environment in Dobermann (JWT, OAuth 2.0, Google Service Account, DBMN auth, or none). Reconfigure these on the Environment after import. |
| **Postman Bearer token (when headers are not included)** | Tokens belong on the Environment, not the endpoint. Set the bearer/JWT token once on your Environment and Dobermann attaches it to every request. |
| **Body modes other than `raw`** (form-data, urlencoded, binary, GraphQL) | Only raw bodies are imported. Other body modes are dropped silently. |
| **Collection-level variables** (`variable[]`) | Variables in `{{this}}` syntax pass through in URLs and bodies, but the *definitions* don't import. Set them on a Dobermann Environment instead. |
| **Postman Environment files** (`*.postman_environment.json`) | Not currently supported — re-create the environment in Dobermann (it's usually a one-time setup with much richer auth options). |
| **Folder hierarchy** | Dobermann uses tags, not folders. Each request is tagged with its *immediate* parent folder; deeper ancestors are flattened away. |
| **Cookies, certificates, proxy settings** | Not part of the Dobermann endpoint model. |

You don't need to memorise this list. When you upload a collection, Dobermann scans it and lists exactly which of these features it found at the top of the import preview, and flags each affected endpoint individually with a `⚠ data dropped` chip — hover the chip to see what specifically won't carry across for that request.

If your Postman workflow leans heavily on pre-request/test scripts or non-raw bodies, you may need to redesign that flow — see [Template Variables](/docs/template-variables/) and [Environments](/docs/environments/) for the Dobermann-native equivalents.

## Sharing with Teams

A `.dbmn.zip` is the way to hand over a whole setup: several endpoints, their environments, their Systems and their Console views in one file. For a single endpoint, [Copy to Share](/docs/sharing-endpoints/) is quicker — it goes through the clipboard, with no file at all.

By default an export is safe to commit to git: tokens, OAuth client secrets and Google service-account private keys are stripped, so the recipient always provides their own credentials after import. The exception is a file exported with **Include environment credentials** ticked — keep it out of git and share it only the way you would share a password.

For values that vary per person (API keys, user-specific tokens), use an environment variable in the header instead of hardcoding it:

```json
{ "key": "X-API-Key", "value": "{{ENV:API_KEY}}" }
```

Each team member sets `API_KEY` on their own environment, and the same exported endpoint works for everyone.

## Related Topics

- [Sharing Endpoints](/docs/sharing-endpoints/) - One endpoint, through the clipboard
- [Environments](/docs/environments/) - Authentication and connection setup
- [Endpoints](/docs/endpoints/) - Creating and managing API configurations
- [Named Views](/docs/named-views/) - The Console views that travel with an endpoint
- [Migration Guide](/docs/migration/) - Moving from the FlexionTech publisher
