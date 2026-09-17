---
lesson_id: lesson_4
number: 4
slug: reporting
title: Reporting
goal: Turn a nested API response into the exact spreadsheet somebody asked you for
estimate: ~20 minutes
completion:
  criteria: Your filtered report, copied from the Console, pasted into the lesson and verified
  summary: a verified copy of your filtered report
checkpoint:
  pass: Good dog. You've pulled it, shaped it, and shipped it. Lesson 5 is unlocked.
  fail: We haven't verified your report yet. Filter the table, use Copy, and paste it into Step 6 — it tells you straight away if something's off.
verify:
  endpoint: /course/verify/lesson_4
  prompt: >
    Show us the report. Paste the table you just copied — headers and all.
  pass: >
    Good dog. Every row is what the warehouse asked for, and none are missing.
  fail: >
    Not quite — here's what we noticed.
note_to_reviewer: >
  COMPLETION (decided 2026-09-17): "paste it back". The learner uses Copy in the Console and
  pastes the table into the page; the page POSTs it to the playground function
  (/course/verify/lesson_4), which checks it SERVER-SIDE against that learner's own rows and
  logs pass/fail to activity_log; check_lesson_completion('lesson_4') passes on a logged 2xx.
  Nothing is stored but the outcome. The rules — which status, which site, how many rows —
  live only in supabase/functions/playground/course-verify.ts. They must never appear in this
  file's rendered output, the page, or its scripts; the verify.* copy above is deliberately
  answer-free, and so are the findings the function returns. This replaces the old export
  telemetry dependency (recordExport was never wired up). No Excel upload — paste covers it.
  "Fetch all pages" and 16 concurrent requests are full-licence features. Decision
  2026-09-17: no gate on the Training Ground — every signed-in user gets full access there
  (vs-dbmn migration 20260917000001_open_environments.sql, must be deployed first).
  The search counts in Step 4 (10,046 / 831 / 706) were run through shared/search-matcher.js
  against inventory-67k.csv; they hold for a learner who loaded that file exactly once.
  Unquoted -CS returns ZERO rows (it matches "Electronics"); the quoted form is deliberate.
  Copy -> Excel stops at 1,000 rows. 831 fits; a learner who loaded the file twice has 1,662
  and the verifier tells them so (COPY_CAP) rather than just failing.
  The four product.* columns marked for Lesson 5 need vs-dbmn migration
  20260917000002_playground_product_suppliers.sql and the updated playground function.
---

Loading data is half the job. The other half is the sentence you hear on every project:
*"can you just send me that in a spreadsheet?"*

Today's version: **the Golden Retriever Distribution Center wants everything that's running
low on stock, in Excel.**

Everything you need is already in The Training Ground — you put it there in Lesson 2.

## Step 1 — Fetch Everything

Start by getting all of it. Shaping and filtering come afterwards, and they happen in
Dobermann — so they work the same on every API you'll ever meet, whatever that API can or
can't do for itself.

Copy this, open {icon:nav-api-catalogue} **API Catalogue**, and click {icon:paste-endpoint}
**Paste Endpoint**:

```json
// Name: Puppy School — Inventory Report
// Method: GET
// Path: /inventory
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
// QueryParam: size: {{A8:SIZE:500:pageSize}} [enabled]
```

No API hands over 67,000 records in one response, so this one comes in pages. Those two
values are Dobermann's **pagination variables**:

- `{{A8:PAGE:0:totalCount}}` — start at page `0`, and read `totalCount` from each response to
  work out how many pages there are
- `{{A8:SIZE:500:pageSize}}` — ask for `500` records a page, and read `pageSize` back to check
  the API agreed

You'll rarely type these. On an endpoint without them, the **Pagination** button you're about
to meet has a **Settings** tab that reads a real response and writes them for you.

Save, and hit **Run API**. The Console opens with **page one only** — 500 rows of 67,000-odd.
Dobermann never walks a whole API without being asked.

So ask. In the Console footer, click **Pagination**. The **Execute** tab shows what it found —
the total, the page size, how many pages are left — and two choices. Pick **Fetch all pages**
and click **Run**.

Pages stream in several at a time, and the row count at the bottom of the table climbs as
they land. Dobermann loves to fetch.

## Step 2 — Find the Data in the Response

Open the **Raw** tab and look at any one response. It's an envelope again, with your records
inside it:

```json
{
  "totalCount": 67991,
  "pageSize": 500,
  "page": 0,
  "totalPages": 136,
  "data": [
    {
      "sku": "SKU-WOOF-001-00001",
      "description": "Premium Belly Rub Machine",
      "quantityOnHand": 12,
      "uom": "EA",
      "status": "low_stock",
      "location": { "gln": "0614141000012", "name": "Golden Retriever Distribution Center", "city": "Atlanta" },
      "product": {
        "gtin": "00012345600012", "category": "Grooming & Wellness", "unitPrice": 149.99,
        "reorderQty": 200, "supplierSku": "CTM-0001",
        "supplier": { "gln": "4012345000016", "name": "Chew Toy Manufacturing Inc" }
      }
    }
  ]
}
```

Your counts will differ from the example — they depend on how much you loaded in Lessons 2
and 3.

Two things worth noticing. The records are in `data`, as before, and back on the
**Completed** tab Dobermann has already made each one a row — across every page, as one
table. And each record carries **nested objects** — `location`, `product`, and a `supplier`
inside the product — because the API resolves the reference data for you rather than
leaving you with bare codes.

## Step 3 — Build the View

The table shows everything, which is not the same as showing what was asked for. Nobody
wants forty columns of internal identifiers.

Click the **View:** dropdown in the toolbar, then **+ Create View…**

The **View Editor** opens with three regions:

- **Available Columns** on the left — the full response tree, searchable
- **Selected Columns** on the right — what ends up in your table
- **Row Basis** at the top of the Selected panel — which array produces one row each

Check the **Row Basis** is `data`, then tick these columns:

| Column | Where it comes from |
|---|---|
| `sku` | the record |
| `description` | the record |
| `quantityOnHand` | the record |
| `uom` | the record |
| `status` | the record — you're about to filter on it |
| `location.name` | the nested location object |
| `location.city` | the nested location object |
| `product.category` | the nested product object |
| `product.unitPrice` | the nested product object |
| `product.reorderQty` | the nested product object |
| `product.supplierSku` | the nested product object — blank for some suppliers, and that's fine |
| `product.supplier.name` | two levels down: the supplier, inside the product |
| `product.supplier.gln` | two levels down |

The last five are for Lesson 5, which turns this report into purchase orders.

Notice what you just did. `location.name` lives one level down in the JSON and
`product.supplier.name` two, and you've pulled them up alongside the record's own fields as
if they were flat columns. That is the whole point of a view — the API's shape and the reader's shape are
almost never the same, and this is where you reconcile them without touching either.

Name the view `Low Stock by Location` and save it.

Views save **on the endpoint**, so this one travels with it — export or share the endpoint
and whoever receives it gets your columns and your row basis, not just the request.

## Step 4 — Filter It in the Console

You have every inventory record on screen. The warehouse asked about one site's low stock.
You don't go back to the API for that — you ask the table.

Click into the search box above the table and type:

```text
low_stock
```

The row count drops to around ten thousand: every record, at every site, whose status is
low. Search looks across every column in the view, which is why `status` is one of them.

Now narrow it to the site that asked. A space and a `+` means **and**:

```text
low_stock +Golden
```

About eight hundred rows — low stock, at the Golden Retriever Distribution Center. That is
the report.

One more, because someone always asks. They don't reorder by the case, so leave the `CS`
rows out. A space and a `-` means **not**:

```text
low_stock +Golden -"CS"
```

The quotes matter. Search normally matches *part* of a cell, and the letters "cs" turn up
inside plenty of words — `Electronics`, `Logistics`. Quotes mean **the whole cell, exactly**,
so only a unit of measure of `CS` is excluded. Try it without them and watch the table
empty.

Four moves cover most of what you'll ever need, and they light up in colour as you type so
you can see Dobermann has understood them:

| You type | It means |
|---|---|
| `low_stock +Golden` | both |
| `low_stock -Golden` | the first, without the second |
| `Golden,Labrador` | either |
| `"CS"` | the whole cell is exactly this |

There's more — wildcards, how the pieces combine — in [Console → Search](/docs/console/#search).

Take the `-"CS"` back off, then click the `quantityOnHand` header to sort ascending. The most
urgent records rise to the top.

Whatever you've got on screen is what gets exported: the same columns, the same order, the
same sort, the same search. There's no reshaping afterwards.

## Step 5 — Send It to Excel

Open the **Export** menu and choose **Excel**.

That's the spreadsheet the warehouse asked for: the right rows, the right columns, sensible
headers, straight out of a live API — and no manual step between the API and the file. Only
the rows your search left on screen are in it.

That's the file you'd send. For the course, there's a quicker way to show us.

## Step 6 — Copy It, and Show Us

Not everything needs a file. Next to **Export** is **Copy**, and it puts the same table —
same columns, same sort, same search — straight on your clipboard:

| Copy → | Pastes best into |
|---|---|
| **Standard** | Outlook, Teams, Word, Confluence — arrives as a formatted table |
| **Excel** | Excel, Google Sheets — keeps leading zeros on codes like GLNs |
| **CSV** | scripts and anything that wants plain text |
| **Markdown** | GitHub, Jira, Notion |

Make sure your search still reads `low_stock +Golden`, open the **Copy** menu, choose
**Excel**, and paste it here:

<!-- paste-it-back -->

We check it against what the API actually holds for you, and tell you straight away if a
row doesn't belong or one is missing. Pass, and Lesson 5 unlocks.

(Copy → Standard and Copy → Excel stop at 1,000 rows, because pasting more than that tends
to take the other application down with it. If yours is greyed out, the inventory file
probably went in twice — reset with `DELETE /my-data`, reload it once, and fetch again.)

## Bonus Credit — Ask the API a Narrower Question

You just pulled 67,000 records to keep 800. It worked, and it will work on any API — which is
why it came first. But when an API *can* filter, let it. Less data over the wire, fewer
pages, less load on a system you're a guest on.

The Training Ground can. Open **Puppy School — Inventory Report**, click **Duplicate**, and on
the copy use **Add** → {icon:add-query-param} **Query Parameter** twice:

```json
// Name: Puppy School — Low Stock Report
// Method: GET
// Path: /inventory
// QueryParam: status: low_stock [enabled]
// QueryParam: locationGln: 0614141000012 [enabled]
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
// QueryParam: size: {{A8:SIZE:500:pageSize}} [enabled]
```

Save, **Run API**, **Pagination** → **Fetch all pages**. Two pages instead of a hundred and
thirty-odd, and the same rows you filtered your way to in Step 4. The duplicate kept your
view, so the table already looks right.

`status` and `locationGln` are *this* API's parameter names. The next API will call them
something else, accept different values, or not offer them at all — its documentation is
where you find out. Ours is [here](/docs/playground/#pagination). The habit to keep is the
order you ask in: **filter at the API where you can, and in the Console where you can't.**

> **🐾 Dobermann Philosophy**
>
> An API response and a useful report are different shapes, and every tool makes you choose
> which one to live with. Named Views let you keep both — the raw response stays untouched,
> and you build as many lenses over it as you have audiences. Save them once and they belong
> to the endpoint, not to you, not to your laptop.

> **🦴 Dig Deeper**
>
> Paging exists because no sensible API hands you ten thousand records in one response —
> it protects the server's memory and yours. The awkward part is always knowing when to stop,
> which is why responses carry a total count. Dobermann's `{{A8:PAGE}}` variable reads that
> count and does the walking for you; see [Pagination](/docs/pagination/) for the full set.
