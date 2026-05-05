---
title: Template Variables
layout: default
nav_order: 1
parent: Endpoints
grand_parent: Documentation
---

# Template Variables

Template variables are what make Dobermann powerful. They turn a static JSON template into a dynamic engine that validates, transforms, and maps your spreadsheet data into perfectly structured API requests — row by row, at scale.

Variables work everywhere: request body, URL path, query parameters, and headers.

---

## The Template Editor

The fastest way to build templates is with the **body editor toolbar** — no need to type variable syntax by hand.

### Ctrl+M — Line Variable Cycling

Place your cursor on any JSON key-value line and press **Ctrl+M** (or Cmd+M on Mac). Dobermann cycles through four states:

**State 1 → Input Variable:**
```javascript
"quantity": 100
```
becomes:
```javascript
"quantity": "{{quantity:number}}", //100
```
Dobermann infers the variable name from the key and the type from the value. The original value is preserved in a comment so you can always get back.

**State 2 → Environment Variable:**
```javascript
"quantity": "{{ENV:}}", //100
```
Cursor lands after `ENV:` with autocomplete ready — type to pick from your environment's variables.

**State 3 → Auto Variable:**
```javascript
"quantity": "{{A8:}}", //100
```
Same behaviour — autocomplete suggests `sequence`, `date`, `datetime`.

**State 4 → Restore Original:**
```javascript
"quantity": 100
```
Back to the original value from the comment. Cycle too far? Just press Ctrl+Z to undo.

### Ctrl+Shift+M — Insert Variable Brackets

Press **Ctrl+Shift+M** to insert `{{}}` at the cursor position. If the cursor is already inside a variable, it removes the entire `{{...}}` instead. Autocomplete triggers immediately after insertion.

### Modifier Toolbar

When your cursor is inside a variable like `{{sku:string}}`, the **Modifier** dropdown becomes active. It shows context-aware options based on the variable's data type:

- **String variables:** `upper`, `lower`, length range (`3-50`), `noTrim`
- **Number variables:** `>0`, `>=0`, `int`, `rnd(2)`, `floor`, `ceil`
- **Date/DateTime variables:** `+1d`, `-1d`, `+4h`, `+30m` (date math)
- **All types:** `asString`, `opt`, `null`

Click a modifier and it's inserted before the closing `}}`:
```
{{sku:string}}  →  {{sku:string|upper}}
```

### Autocomplete

The editor provides intelligent suggestions as you type inside `{{...}}`:

| You type | Suggestions shown |
|----------|-------------------|
| `{{` | `A8:` and `ENV:` prefixes |
| `{{A8:` | `sequence`, `date`, `datetime` |
| `{{varName:` | `string`, `number`, `boolean`, `date`, `datetime` |
| `{{varName:date:` | `iso`, `YYYY-MM-DD`, `DD-MM-YYYY`, etc. |
| <code>{{varName:string&#124;</code> | `upper`, `lower`, `3-50`, `opt`, `null`, etc. |
| <code>{{varName:number&#124;</code> | `>0`, `>=0`, `int`, `rnd(2)`, `floor`, `ceil`, etc. |
| <code>{{varName:date&#124;</code> | `+1d`, `-1d`, `+4h`, `+30m`, etc. |

### Syntax Highlighting

Variables are colour-coded in the editor so you can spot issues at a glance:

| Element | Colour |
|---------|--------|
| `{{ }}` brackets | Dim grey |
| User variables | Cyan/Blue |
| A8 and ENV prefixes | Green |
| Data types | Blue |
| Format specifiers | Orange |
| Validation modifiers | Yellow/Gold |
| Transform modifiers | Purple |
| Errors | Red underline |

---

## Basic Templates

### Data Types

Specify a type after the colon to enable validation and proper JSON output:

| Type | Syntax | Input Examples | JSON Output |
|------|--------|--------------------|-------------|
| **string** | `{{Name:string}}` | Any text | `"Hello"` |
| **number** | `{{Qty:number}}` | `123`, `45.67`, `-5` | `123` (unquoted) |
| **boolean** | `{{Active:boolean}}` | `true`, `yes`, `1`, `on` | `true` (unquoted) |
| **date** | `{{OrderDate:date}}` | `2024-01-15`, `15/01/2024` | `"20240115"` |
| **datetime** | `{{Created:datetime}}` | `2024-01-15T14:30:00` | `"2024-01-15T14:30:00"` |

String is the default — `{{Name}}` is the same as `{{Name:string}}`.

### Example Template

```json
{
    "Data": [
        {
            "ItemId": "PRE-{{sku:string}}",
            "Quantity": "{{quantity:number}}",
            "IsActive": "{{activeFlag:boolean}}",
            "LoadDate": "{{loadDate:date}}"
        }
    ]
}
```

When you run a batch, Dobermann maps each source data column to a variable, validates the values against the declared types, and generates one API request per row — with numbers as real numbers, booleans as real booleans, and dates in the right format.

### Where Variables Work

| Location | Example | Encoding |
|----------|---------|----------|
| **Request Body** | `"itemId": "{{sku:string}}"` | As-is (no encoding) |
| **URL Path** | `/api/orders/{{orderId}}/status` | Automatically URL-encoded |
| **Query Parameters** | `limit={{maxResults:number}}` | Automatically URL-encoded |
| **Headers** | `Authorization: Bearer {{token}}` | As-is (no encoding) |

---

## Environment Variables (ENV)

Reference values from your active environment using the `ENV:` prefix:

```json
{
    "organization": "{{ENV:org}}",
    "host": "{{ENV:host}}",
    "warehouse": "{{ENV:warehouse}}"
}
```

**Key behaviours:**
- ENV variables are **not** prompted during Run API
- ENV variables **don't** appear in the data entry grid during Run Batch
- They're resolved automatically from your active environment's variable list
- If a variable is missing, execution fails with a clear error

Set environment variables in your Environment settings (Environments tree → select environment → Variables section).

---

## Automatic Variables (A8)

System-generated values computed at execution time. You're never prompted for these — they just work.

| Variable | Output | Description |
|----------|--------|-------------|
| `{{A8:sequence}}` | `1001`, `1002`, ... | Auto-incrementing number per endpoint |
| `{{A8:date}}` | `20260217` | Current date (YYYYMMDD) |
| `{{A8:datetime}}` | `2026-02-17T14:30:00` | Current UTC timestamp |
| `{{A8:PAGE}}` | `0`, `1`, `2`, ... | Page number for [pagination](/docs/pagination/) |
| `{{A8:SIZE}}` | `100` | Page size for [pagination](/docs/pagination/) |

### A8 Date Formats

| Syntax | Output |
|--------|--------|
| `{{A8:date}}` | `20260217` |
| `{{A8:date:iso}}` | `2026-02-17` |
| `{{A8:datetime}}` | `2026-02-17T14:30:00` |
| `{{A8:datetime:iso}}` | `2026-02-17T14:30:00.000Z` |
| `{{A8:datetime:date}}` | `2026-02-17` |
| `{{A8:datetime:time}}` | `14:30:00` |
| `{{A8:datetime:HH:mm}}` | `14:30` |

### Sequence Modifiers (Nested Arrays)

When templates have nested arrays, control how sequences behave:

| Modifier | Syntax | Behaviour |
|----------|--------|-----------|
| Default | `{{A8:sequence}}` | Same value for the entire request |
| Local | `{{A8:sequence:local}}` | Unique within each array, resets per array |
| Global | `{{A8:sequence:global}}` | Unique per item, persisted per array path |
| Parent | `{{A8:sequence:parent}}` | Reuse the parent element's sequence value |

**Example — Order with Line Items:**
```json
{
    "OrderId": "ORDER-{{A8:sequence}}",
    "Lines": [
        {
            "LineId": "{{A8:sequence:local}}",
            "ParentRef": "{{A8:sequence:parent}}"
        }
    ]
}
```

---

## Advanced Templates — Modifiers

Modifiers are where things get powerful. Chain them with the pipe (`|`) character to validate, transform, and control how values are processed — **before** the API request is sent.

**Syntax:** `{{variableName:type|modifier1|modifier2|modifier3}}`

**Key rule:**
- **Colon (`:`)** = FORMAT (dates only): `{{Date:date:iso}}`
- **Pipe (`|`)** = MODIFIER (all types): `{{Name:string|upper}}`

### Empty Value Modifiers

These control what happens when a value is empty or missing. They work with **all** data types.

| Modifier | Syntax | What Happens When Empty |
|----------|--------|------------------------|
| *(default)* | `{{Name:string}}` | String → `""`, Number → `0` |
| **opt** | <code>{{Code:string&#124;opt}}</code> | Entire key is **omitted** from JSON |
| **null** | <code>{{Qty:number&#124;null}}</code> | Value is **null** in JSON |
| **asString** | <code>{{Qty:number&#124;asString}}</code> | Number/boolean output as a JSON string (e.g. `"123"` instead of `123`) |

#### The opt Modifier — Conditional Key Omission

This is incredibly useful for APIs that treat missing keys differently from empty values:

```javascript
// Template
{
    "code": "{{Code:string|opt}}",
    "name": "{{Name:string}}"
}
```

| Code value | Name value | JSON Output |
|------------|------------|-------------|
| `"ABC"` | `"Test"` | `{ "code": "ABC", "name": "Test" }` |
| *(empty)* | `"Test"` | `{ "name": "Test" }` — code key completely removed |

#### The null Modifier

```javascript
// Template
{ "qty": "{{Qty:number|null}}", "name": "{{Name:string}}" }

// Qty is empty → { "qty": null, "name": "Test" }
// Qty is "5"   → { "qty": 5, "name": "Test" }
```

#### The asString Modifier

Forces the output as a JSON string, regardless of type:

```
{{Qty:number|asString}}      → 123 outputs as "123"
{{Flag:boolean|asString}}    → true outputs as "true"
{{A8:sequence|asString}}     → 1001 outputs as "1001"
```

Useful when your API expects string representations of numbers or booleans.

### String Modifiers

| Modifier | Syntax | Description |
|----------|--------|-------------|
| Trim | *(default)* | Whitespace trimmed automatically |
| No trim | `noTrim` | Preserve leading/trailing spaces |
| Exact length | `n` | <code>{{Code:string&#124;3}}</code> — exactly 3 characters |
| Min length | `n-` | <code>{{Name:string&#124;3-}}</code> — at least 3 characters |
| Max length | `-n` | <code>{{Code:string&#124;-10}}</code> — at most 10 characters |
| Range | `n-m` | <code>{{Desc:string&#124;5-100}}</code> — between 5 and 100 characters |
| Uppercase | `upper` | <code>{{SKU:string&#124;upper}}</code> — converts to UPPERCASE |
| Lowercase | `lower` | <code>{{Email:string&#124;lower}}</code> — converts to lowercase |

**Chaining example:** `{{SKU:string|5-10|upper}}` — validates length between 5-10 characters AND converts to uppercase.

### Number Modifiers

| Modifier | Syntax | Description |
|----------|--------|-------------|
| Greater than | `>n` | <code>{{Qty:number&#124;>0}}</code> — must be > 0 |
| Greater/equal | `>=n` | <code>{{Stock:number&#124;>=0}}</code> — must be >= 0 |
| Less than | `<n` | <code>{{Discount:number&#124;<100}}</code> — must be < 100 |
| Less/equal | `<=n` | <code>{{Pct:number&#124;<=100}}</code> — must be <= 100 |
| Integer | `int` | <code>{{Count:number&#124;int}}</code> — whole numbers only |
| Round | `rnd(n)` | <code>{{Price:number&#124;rnd(2)}}</code> — round to 2 decimal places |
| Floor | `floor` | <code>{{Qty:number&#124;floor}}</code> — round down |
| Ceil | `ceil` | <code>{{Qty:number&#124;ceil}}</code> — round up |

**Chaining example:** `{{Price:number|>=0|rnd(2)}}` — must be non-negative AND rounded to 2 decimals.

### Date/DateTime Format Modifiers

Control the output format of date and datetime values using the colon syntax:

**Date formats:**

| Syntax | Output | Description |
|--------|--------|-------------|
| `{{COL:date}}` | `20240104` | Default — YYYYMMDD (compact) |
| `{{COL:date:iso}}` | `2024-01-04` | ISO format with dashes |
| `{{COL:date:DD-MM-YYYY}}` | `04-01-2024` | European format |
| `{{COL:date:MM-DD-YYYY}}` | `01-04-2024` | US format |
| `{{COL:date:YYYY/MM/DD}}` | `2024/01/04` | Custom with slashes |

**DateTime formats:**

| Syntax | Output | Description |
|--------|--------|-------------|
| `{{COL:datetime}}` | `2024-01-04T14:30:00` | Default — UTC, no milliseconds |
| `{{COL:datetime:iso}}` | `2024-01-04T14:30:00.000Z` | Full ISO 8601 |
| `{{COL:datetime:date}}` | `2024-01-04` | Date portion only |
| `{{COL:datetime:time}}` | `14:30:00` | Time portion only |
| `{{COL:datetime:HH:mm}}` | `14:30` | Custom time format |

**Format tokens:** `YYYY` (year), `YY` (2-digit year), `MM` (month), `DD` (day), `HH` (24h hour), `hh` (12h hour), `mm` (minutes), `ss` (seconds), `A` (AM/PM).

### Date Math Modifiers

Add or subtract time from date values — works with both source data dates and A8 system variables:

| Unit | Example | Description |
|------|---------|-------------|
| Days | `+2d`, `-1d` | Add/subtract days |
| Weeks | `+1w`, `-2w` | Add/subtract weeks |
| Months | `+2M`, `-1M` | Add/subtract months (**capital M**) |
| Years | `+1y`, `-1y` | Add/subtract years |
| Hours | `+4h`, `-2h` | Add/subtract hours |
| Minutes | `+30m`, `-15m` | Add/subtract minutes (**lowercase m**) |

**Important:** `M` (months) vs `m` (minutes) — case matters!

**Examples:**
```
{{ShipDate:date|+2d}}              — Ship date plus 2 days
{{A8:datetime:iso|+4h}}            — Current time plus 4 hours, ISO format
{{OrderDate:date:DD-MM-YYYY|+30d}} — Custom format plus 30 days
{{Reminder:datetime|+30m}}         — Current time plus 30 minutes
```

### Modifier Execution Order

When multiple modifiers are chained, they execute in a fixed order (regardless of how you write them):

1. **Pre-transform** — String transforms: trim, upper, lower
2. **Type conversion** — Convert the string value to the target type
3. **Post-transform** — Type-specific: rnd, floor, ceil, date math
4. **Validate** — Check constraints: length ranges, comparisons, int

This means `{{Price:number|rnd(2)|>0}}` and `{{Price:number|>0|rnd(2)}}` produce identical results.

### Validation Behaviour

Modifiers validate data **before** API execution:

- **Run API mode:** Validation errors shown inline before the request fires
- **Run Batch mode:** All rows validated after column mapping — execution is blocked if any row fails, with clear error messages showing which rows have problems

**Example validation errors:**
```
Row 15: Variable 'Name' value 'AB' failed validation: minimum length is 3 characters
Row 23: Variable 'Amount' value '-5' failed validation: must be greater than 0
Row 47: Variable 'Qty' value '3.14' failed validation: must be an integer
```

---

## Real-World Template

Putting it all together — a template that validates, transforms, and handles missing data:

```json
{
    "Data": [
        {
            "ItemId": "{{ItemId:string|5-50|upper}}",
            "Description": "{{Desc:string|-500}}",
            "UOMCode": "{{UOM:string|2-10|upper}}",
            "Quantity": "{{Qty:number|int|>0}}",
            "Weight": "{{Weight:number|>=0|rnd(3)|null}}",
            "Cost": "{{Cost:number|>=0|rnd(2)}}",
            "AlternateCode": "{{AltCode:string|10|opt}}",
            "TransactionDate": "{{A8:datetime}}",
            "ShipByDate": "{{A8:datetime:iso|+2d}}",
            "CreatedBy": "{{ENV:username}}"
        }
    ]
}
```

This template:
- Validates ItemId is 5-50 characters and forces uppercase
- Limits Description to 500 characters max
- Requires Quantity as a positive integer
- Rounds Weight to 3 decimals, outputs `null` if empty
- Rounds Cost to 2 decimals
- Omits AlternateCode entirely if empty (opt modifier)
- Auto-generates timestamp and a ship-by date 2 days in the future
- Pulls the username from the active environment

---

## Empty Value Reference

Quick reference for how empty values are handled across all types:

| Type | Default | With <code>&#124;opt</code> | With <code>&#124;null</code> |
|------|---------|-------------|---------------|
| string | `""` | Key omitted | `null` |
| number | `0` | Key omitted | `null` |
| boolean | Error | Key omitted | `null` |
| date | Error | Key omitted | `null` |
| datetime | Error | Key omitted | `null` |

---

## Shorthand Syntax
{: #shorthand }

{: .note }
> Shorthand is a convenience for simple templates. For most use cases, the **Ctrl+M** toolbar workflow is faster and less error-prone.

In JSON request bodies, you can use empty brackets `{{}}` where the JSON key name becomes the variable name automatically:

```javascript
{
    "ItemId": "{{}}",           // Equivalent to: {{ItemId:string}}
    "Quantity": "{{:number}}",  // Equivalent to: {{Quantity:number}}
    "IsActive": "{{:boolean}}"  // Equivalent to: {{IsActive:boolean}}
}
```

**Limitations:**
- Only works in JSON body templates (not URL, query params, or headers)
- The JSON key must be a valid variable name
- Doesn't support modifiers — switch to explicit syntax for validation and transforms

---

## Related Topics

- [Endpoints](/docs/endpoints/) — Endpoint configuration and editor toolbar
- [Batch Preparation](/docs/batch-preparation/) — Loading data and column mapping
- [Shortcuts](/docs/shortcuts/) — All keyboard shortcuts
