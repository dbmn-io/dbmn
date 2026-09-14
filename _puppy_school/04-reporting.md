---
lesson_id: lesson_4
number: 4
slug: reporting
title: Reporting
goal: Turn a nested API response into the exact spreadsheet somebody asked you for
estimate: ~15 minutes
completion:
  criteria: An Excel or CSV export recorded on or after the date Lesson 3 was completed
  summary: an export from a saved view
checkpoint:
  pass: Good dog. You've pulled it, shaped it, and shipped it. Lesson 5 is unlocked.
  fail: We haven't seen an export from you yet. Build your view, then use Export to send it to Excel — give it a moment to register and try again.
note_to_reviewer: >
  Completion depends on the extension recording exports as telemetry (recordExport is
  implemented but currently never called) and flushing promptly. Both are in the backend
  phase. The fail copy hints at the flush delay deliberately.
---

Loading data is half the job. The other half is the sentence you hear on every project:
*"can you just send me that in a spreadsheet?"*

Today's version: **the warehouse team wants everything that's running low on stock, with
the location it's held at, in Excel.**

Everything you need is already in The Training Ground — you put it there in Lesson 2.

## Step 1 — Ask the API a Narrower Question

You loaded 67,000 records. The warehouse wants the few thousand that are actually low.
Filtering at the API is always cheaper than filtering afterwards, so let's ask properly.

Create a new endpoint:

```
// Name: Puppy School — Low Stock Report
// Method: GET
// Path: /inventory
// QueryParam: status: low_stock [enabled]
// QueryParam: locationGln: 0614141000012 [enabled]
// QueryParam: size: 500 [enabled]
// QueryParam: page: {{A8:PAGE:0:totalCount}} [enabled]
```

Four query parameters, each doing a different job:

- `status: low_stock` filters server-side — only the records you actually want come back
- `locationGln: 0614141000012` narrows it to one warehouse, the Golden Retriever
  Distribution Center. (Change it to any GLN from your Lesson 1 locations call if you'd
  rather report on a different site.)
- `size: 500` asks for 500 records per page instead of the default 100
- `page: {{A8:PAGE:0:totalCount}}` is a **pagination variable**. It tells Dobermann to start
  at page 0 and keep requesting pages, reading `totalCount` from each response to work out
  when it has everything.

Filtering at the API instead of afterwards is the habit worth forming. One warehouse's
low stock is a report someone will read. Every low-stock record across every site is a file
someone will close.

Hit **Run**. Dobermann walks the pages on its own and collects the lot.

## Step 2 — Find the Data in the Response

Look at the **Completed** tab. The response is an envelope again, with your records inside it:

```json
{
  "totalCount": 837,
  "pageSize": 500,
  "page": 0,
  "totalPages": 2,
  "data": [
    {
      "sku": "SKU-WOOF-001-00001",
      "description": "Premium Belly Rub Machine",
      "quantityOnHand": 12,
      "uom": "EA",
      "status": "low_stock",
      "location": { "gln": "0614141000012", "name": "Golden Retriever Distribution Center", "city": "Atlanta" },
      "product": { "gtin": "00012345600012", "category": "Toys", "unitPrice": 24.99 }
    }
  ]
}
```

Your counts will differ from the example — they depend on how much you loaded in Lesson 2.

Two things worth noticing. The records are in `data`, as before. And each record carries
**nested objects** — `location` and `product` — because the API resolves the reference data
for you rather than leaving you with bare codes.

Expand `data` and click **Set as Row**. Now you have one row per inventory record.

## Step 3 — Build the View

The table now shows everything, which is not the same as showing what was asked for. Nobody
wants forty columns of internal identifiers.

Click the **View:** dropdown in the toolbar, then **+ Create View…**

The **View Editor** opens with three regions:

- **Available Columns** on the left — the full response tree, searchable
- **Selected Columns** on the right — what ends up in your table
- **Row Basis** at the top of the Selected panel — which array produces one row each

Set the **Row Basis** to `data`, then tick these columns:

| Column | Where it comes from |
|---|---|
| `sku` | the record |
| `description` | the record |
| `quantityOnHand` | the record |
| `uom` | the record |
| `location.name` | the nested location object |
| `location.city` | the nested location object |
| `product.category` | the nested product object |
| `product.unitPrice` | the nested product object — you'll want this in Lesson 5 |

Notice what you just did. `location.name` and `product.category` live one level down in the
JSON, and you've pulled them up alongside the record's own fields as if they were flat
columns. That is the whole point of a view — the API's shape and the reader's shape are
almost never the same, and this is where you reconcile them without touching either.

Name the view `Low Stock by Location` and save it.

Views save **on the endpoint**, so this one travels with it — export or share the endpoint
and whoever receives it gets your columns and your row basis, not just the request.

## Step 4 — Sort and Filter

Click the `quantityOnHand` header to sort ascending. The most urgent records rise to the top.

Use the search box to narrow further if you like — one warehouse, one category. Whatever
you've got on screen is what gets exported: the same columns, the same order, the same sort,
the same search. There's no reshaping afterwards.

## Step 5 — Send It to Excel

Open the **Export** menu and choose **Excel**.

That's the spreadsheet the warehouse asked for: the right rows, the right columns, sensible
headers, straight out of a live API — and no manual step between the API and the file.

Keep this export. You'll need it in Lesson 5.

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
