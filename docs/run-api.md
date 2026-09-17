---
title: Run API
layout: default
nav_order: 3.5
parent: Documentation
---

# Run API

**Run API** sends one request, now. Use it to prove an endpoint works, to try a template against a single real row before you point a file at it, or for the one-off call that doesn't deserve a spreadsheet.

Its sibling is **Run Batch**, which drives the same endpoint from a file — see [Batch Preparation](/docs/batch-preparation/). Every endpoint has Run API. Run Batch appears beside it once the endpoint has `{{template variables}}`.

---

## Where to find it
{: #where }

| From | How |
|------|-----|
| **Endpoint editor** | **Run API** in the footer. Disabled while there are unsaved changes — save first, so what runs is what you're looking at. |
| **API Catalogue** | The {icon:run-api} icon on the endpoint's row. ({icon:run-batch} is Run Batch.) |
| **Quick Access** | **Alt+D E**, pick the endpoint, choose **Run**. See [Shortcuts](/docs/shortcuts/). |

The request goes to the **active environment**. If that environment is typed Production you're asked to confirm first — see [Environments](/docs/environments/#environment-type).

---

## Endpoints with no variables

Nothing to ask, so nothing is asked. The request fires and the [Console](/docs/console/) opens with the result.

---

## Endpoints with template variables — the values form
{: #values-form }

When the endpoint has `{{template variables}}`, Run API opens a form titled **Run: _endpoint name_** with one field per variable. Fill it in and click **Run**.

Each field follows the variable's type:

| Variable type | Field |
|---------------|-------|
| `string` (or untyped) | Text |
| `number` | Number |
| `boolean` | `true` / `false` dropdown |
| `date` | Text, pre-filled with today |
| `datetime` | Text, pre-filled with now. Enter it in your own timezone; Dobermann converts it to the environment's [target timezone](/docs/environments/#target-timezone). |
| `time` | Text, pre-filled with the current time |

With more than five variables the form switches to two columns so **Run** stays on screen.

### What the form never asks for

- **`{{ENV:…}}` variables** — read from the active environment. If one is missing, the run stops and tells you which.
- **`{{A8:…}}` variables** — generated at run time (sequences, dates, pagination).
- Anything already given a value on the environment or the endpoint.

See [Template Variables](/docs/template-variables/) for all three kinds.

### Validation
{: #validation }

Clicking **Run** checks every value against its variable's type and [modifiers](/docs/template-variables/) — lengths, ranges, `int`, date formats — using **the same rules as a batch**. Anything that fails is marked on its field and the form stays open with what you typed. Nothing is sent until every field passes.

---

## Paste a row
{: #paste-a-row }

Typing eight values by hand is slow, and the values are usually sitting in a spreadsheet already.

1. In Excel or a CSV, copy the **header row and one data row**.
2. Click {icon:paste-row} **Paste** at the bottom-left of the form. **Ctrl+V** in any field does the same.

```csv
gtin,sku,description,locationGln,quantityOnHand
00012345600012,SKU-PUPPY-001,Premium Belly Rub Machine,0614141000012,12
```

Every field whose name matches a column is filled at once, and a line under the form tells you how it went — `Filled 5 of 5 fields from the pasted row.`

**The rules:**

- **Columns match variables by name.** Case and `_`, `-`, `.` or spaces don't matter — `location_gln` and `Location GLN` both fill `locationGln`.
- **Only the first data row is used**, however many you copied.
- **Extra columns are ignored** and listed. **Fields with no column are left alone** and listed.
- **Tab, comma and semicolon** are all understood, and so are quoted cells — `"Chew Toy, Large"` stays one value.
- **No header?** A single line with exactly as many cells as there are fields fills them in order.
- **Dropdowns** only take a value they offer, so a `boolean` accepts `true` / `TRUE` / `false`.
- **Anything that isn't a row** pastes into the field you're in, as normal. The Paste button says so if the clipboard holds nothing it can use.

Pasted values go through the same [validation](#validation) as typed ones when you click **Run**. That makes this the quickest way to find out whether a template and a source file agree — before you load sixty thousand rows of it.

---

## After it runs

The [Console](/docs/console/) opens with the response. **Completed** shows it as a table, **Raw** shows exactly what went over the wire, and **Error** appears if the API refused it. The run is kept under **History** in the Hub.

---

## Related Topics

- [Endpoints](/docs/endpoints/) — Build the request Run API sends
- [Template Variables](/docs/template-variables/) — Types, modifiers, `ENV:` and `A8:` variables
- [Batch Preparation](/docs/batch-preparation/) — Run the same endpoint from a file
- [Console](/docs/console/) — Read the result
