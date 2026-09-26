---
lesson_id: lesson_5
number: 5
slug: own-template
title: Your Own Template
goal: Build an endpoint and a nested data load from scratch, using data you extracted yourself
estimate: ~25 minutes
completion:
  criteria: Five or more purchase orders of your own, across four or more suppliers — at least one with a single line and at least one with many
  summary: one purchase order per supplier, from your own template
checkpoint:
  pass: Good dog. You built the endpoint, you shaped the data, you loaded it. There is nothing left for us to teach you — go and do it on something that matters.
  fail: We can't see all your purchase orders yet. Check the batch ran, and that the Error tab is empty — a template that isn't quite right shows up there with the reason.
review:
  endpoint: My Replenishment Orders
  prompt: >
    Before you load anything, let's look at what you built. In Dobermann, open
    {icon:nav-api-catalogue} **API Catalogue**, open **My Replenishment Orders** and click
    **Copy to Share** — then paste it below. Same button your team will use; same format
    they'll receive.
  pass: >
    Good dog. That template will hold — numbers are numbers, the lines are nested, and
    nothing is left to chance. Go and load some orders.
  fail: >
    Not quite. A template that isn't right fails once per row, so it's worth fixing before
    it gets the chance.
note_to_reviewer: >
  Shape (decided 2026-09-17): ONE PURCHASE ORDER PER SUPPLIER. Step 2 copies ONE order out of the
  GET response, trims it and POSTs it back to prove the endpoint (it links the look to the
  build, and teaches "what an API returns is not what it accepts"); the first real order (supplier A, one line) goes through Run API; the
  other four suppliers go through ONE batch, four requests, ~180 lines each (measured: 170-196). Six POSTs.
  Why it works out: the Golden Retriever DC's low-stock rows in inventory-67k.csv cover exactly
  five products (WOOF-001/005/009/013/017), and vs-dbmn migration
  20260917000002_playground_product_suppliers.sql deals suppliers so those five differ.
  The final template, the five-column mapping and the 4-request grouping were run through the
  real JsonGenerator; the Run API paste row through shared/row-paste.js (8 of 8 fields).
  DEPENDS ON, all unreleased/undeployed as of writing: (1) that migration, (2) the playground
  function returning product.supplier/reorderQty/supplierSku and `lines` on the PO list,
  (3) check_lesson_completion for lesson_5 (migration 20260917000003), (4) the extension fix
  that makes `|opt` omit keys in NESTED templates — before it, blank part numbers go out as
  "" and Step 6's "no supplierSku key" is false, (5) Run API row paste (issue #302), (6) the playground function's PO reads without the
  embedded `buyer`/`supplier` objects (2026-09-25). With the old function, Step 2's pasted order
  fails on the `buyer` column, not the duplicate `id` the lesson quotes, (7) Ctrl+D deleting a
  whole `{`/`[` block (extension, shared/line-block.js), (8) vs-dbmn migration
  20260926000001_playground_po_parties.sql: our sites are buyer trading partners (so
  `buyerGln` ← `location.gln` passes the FK) and the API fills buyerName/supplierName from
  the GLNs — the template carries GLNs only. Lesson 4's view gained `location.gln` for it.
  GROUPING RULE (changed 2026-09-17, needs the extension release): Dobermann starts a new
  request when ANY header variable changes. It used to be the FIRST one only, in template
  order — `buyerName` above `supplierName` gave ONE order with every line under the first
  row's supplier, and no error. Step 3 now teaches the rule as "the header is true of every
  line"; template order no longer matters.
---

Everything so far has handed you a template. This lesson does not.

You have a low-stock report from Lesson 4. The warehouse needs replenishing, which means
turning that flat table into **purchase orders** — a nested structure, one order per
**supplier**, one line per product.

Flat data in, nested data out. That is the job, on every project, forever.

## Step 1 — Look Before You Build

Never write a template against an API you haven't looked at. Create a quick endpoint and
run it:

```json
// Name: Puppy School — List Purchase Orders
// Method: GET
// Path: /purchase-orders
// QueryParam: size: 1 [enabled]
```

Open the **Raw** tab. A GET returns a page of orders: a `data` array inside an envelope. A
POST creates **one** order. So copy just the one order in the array, not the page around it.

> **Hint: copy one order**
>
> In the **RESPONSE** pane, click the arrow in the margin beside the `{` under `"data": [`.
> The whole order folds into one line. Select that line and press **Ctrl+C**, and
> everything inside the fold comes with it. If the line ends in a comma, leave it off.

## Step 2 — Send It Back

Create a new endpoint, paste the order into the body, Save, and click **Run API**:

```json
// Name: My Replenishment Orders
// Method: POST
// Path: /purchase-orders
```

It fails:

```text
duplicate key value violates unique constraint "playground_purchase_orders_pkey"
```

That order already exists. `id` is its primary key. Delete the `id` line (**Ctrl+D**) and the
API creates a new order with a new `id`. Or send your own, as long as it's a new UUID.

| Key | Why it goes |
|---|---|
| `id` | The order's primary key. Without it, the API creates a new order |

> **Extra credit: see it land**
>
> Open {icon:nav-history} **History** and click your **Puppy School — List Purchase Orders**
> run from Step 1. In the **Raw** tab, note the `totalCount`. Now click **Re-run** at the
> bottom. Same request, sent again. `totalCount` goes up by one. That one is yours.
{: .ps-boxout}

Save, **Run API**. `201`. The API has created a new purchase order and given it an `id` of
its own. The endpoint works.

## Step 3 — Turn It Into a Template

**One line.** Put your cursor on the `{` of the second line object and press **Ctrl+D** until
only the first is left. Dobermann repeats that one line for every row of your data.

**Clear out what shouldn't repeat.** **Ctrl+D** these:

| Key | Why it goes |
|---|---|
| `userId`, `isSeed`, `createdAt`, `orderDate`, `totalAmount` | The API sets them |
| `buyerName`, `supplierName` | The API fills them in from the GLNs |
| `lineTotal`, `gtin` | On the line. The API works out the total, and `gtin` would give every line the same product |

**Ctrl+M** on `buyerGln`, `supplierGln`, and on the line's `sku`, `uom`, `unitPrice`,
`description`, `orderedQty` and `supplierSku`. Dobermann turns each value into a typed
`{{variable}}` and keeps the original as a comment. `supplierSku` is `null`, and Ctrl+M
can't type a null, so type any part number over it first (`"KP-0004"`).

**Three edits by hand:**

- `poNumber`: press **Ctrl+M** three times to reach `{{A8:}}`, pick `sequence`, and type a
  prefix in front. Dobermann numbers each order at run time.
- `lineNumber`: the same, with `sequence:local`. It restarts at 1 in each order.
- `supplierSku`: click inside the variable, open **Modifier**, choose `opt`. A blank cell then
  leaves the key out instead of sending `""`.

Your body is now:

```json
{
  "poNumber": "PO-REPLEN-{{A8:sequence}}",
  "buyerGln": "{{buyerGln:string}}", //5012345000039
  "supplierGln": "{{supplierGln:string}}", //4012345000054
  "requestedDeliveryDate": "2026-02-18",
  "status": "draft",
  "currency": "USD",
  "lines": [
    {
      "sku": "{{sku:string}}", //SKU-WOOF-004
      "uom": "{{uom:string}}", //EA
      "unitPrice": "{{unitPrice:number}}", //349.99
      "description": "{{description:string}}", //Anti-Mailman Defense System
      "lineNumber": "{{A8:sequence:local}}",
      "orderedQty": "{{orderedQty:number}}", //376
      "supplierSku": "{{supplierSku:string|opt}}" //KP-0004
    }
  ]
}
```

Your comments show whichever order you copied.

**How Dobermann decides where one order ends and the next begins.** Everything above
`lines` is the order's **header**, and a header is a statement about every line beneath it.
So Dobermann starts a new order whenever **any header field changes** — here, a different
supplier or a different buyer. Rows that agree on all of them are one order; their lines
stack up underneath. The generated PO number isn't part of that. It's handed out *after*
the rows are grouped, one per order.

The consequence is worth holding on to: a header field should only ever hold something
that's true of the whole order. Put a per-line value up there by mistake — a quantity, a
SKU — and you'll get one order per row. That's Dobermann being right and the template being
wrong.

Save. The footer has grown a **Run Batch** button beside **Run API**. You built that.

<!-- share-it-back -->

## Step 4 — One Order, One Line

Same rule as Lesson 2: one record before a thousand.

Click **Run API**. The form has eight fields — one per variable, and nothing for the two
`A8` values or the three you left hardcoded. Copy this, then click {icon:paste-row} **Paste**:

```csv
supplierGln,buyerGln,sku,supplierSku,description,orderedQty,unitPrice,uom
4012345000016,0614141000012,SKU-WOOF-001-00001,CTM-0001,Premium Belly Rub Machine,200,149.99,EA
```

Check the fields, then click **Run**.

One purchase order, with one line. And one line is all Run API will ever give you: the form
holds a single row, so it can fill the `lines` array exactly once. That's not a flaw to work
around — it's what the button is for. **Run API proves the template. Run Batch does the
work.**

Look at the response in the **Completed** tab: your generated PO number, `"lines": 1`, and
`supplierName` and `buyerName`, filled in by the API from the two GLNs you sent.

## Step 5 — Fetch the Other Four Suppliers

Chew Toy Manufacturing has its order. Four suppliers to go, and their lines are already
sitting in Dobermann — you fetched them in Lesson 4.

Open {icon:nav-history} **History** and open your **Puppy School — Inventory Report** run.
Nothing is re-fetched; the Console reopens with every row you pulled. Make sure the
**View:** dropdown shows `Low Stock by Location`, then search:

```text
low_stock +Golden -"Chew Toy Manufacturing Inc"
```

Low stock, at this warehouse, from everyone except the supplier you've already ordered
from. Around 730 rows, four suppliers.

Open the **Copy** menu and choose **Excel**. The whole filtered table — headers included —
is on your clipboard. No file, no spreadsheet.

## Step 6 — Load It

Back on **My Replenishment Orders**, click **Run Batch**. In **Load Data**, switch to the
**Paste Text** tab, paste, and click **Import Data**.

**Map & Transform** is where your columns meet your variables. Three match by name and map
themselves — `sku`, `description`, `uom`. The other five came out of a nested response with
dotted names, so point each one at its column:

| Variable | Column |
|---|---|
| `supplierGln` | `product.supplier.gln` |
| `buyerGln` | `location.gln` |
| `supplierSku` | `product.supplierSku` |
| `orderedQty` | `product.reorderQty` |
| `unitPrice` | `product.unitPrice` |

The columns you don't use — `status`, `quantityOnHand` and the rest — are simply ignored.

Click **Next** through to **Review JSON** and look carefully.

- **Total API calls: 4.** Seven hundred-odd rows, four requests — one per supplier.
- Each request is a **single purchase order with well over a hundred lines**, the header
  taken once and the line repeated per row, `lineNumber` counting up from 1 inside each.
- Your rows weren't sorted by supplier. Dobermann sorted them before it folded them.
- Find the order with `supplierGln` `4012345000054`, K9 Precision Parts Corp. Its lines have
  no `supplierSku` key at all. Find `4012345000023`, Wagmore Components Ltd. Every line has
  one. That's `opt`.

You copied a flat table and Dobermann rebuilt the nesting from it. That is the trick the
whole course has been walking towards. Nested APIs, flat source data, no scripting.

Click **Next**, and **Execute**. Four requests. Boom.

## Step 7 — Prove It Landed

Go back to **Puppy School — List Purchase Orders**, set `size` to `6`, and run it again.

Your orders are there, newest first: the four from the batch with their lines nested
underneath, the one-line order from Run API, and the copy you sent back in Step 2. Build a
view over it if you want to see them properly — you know how now.

---

That's Puppy School. You can connect to an API, load data at volume, deal with the failures,
get data back out in a shape a human can use, and build your own templates for structures
nobody handed you.

The rest is just other people's APIs.

> **🐾 Dobermann Philosophy**
>
> Every tool can do the demo. The test is whether it can do the thing nobody demoed — an
> endpoint you've never seen, a structure invented by a committee, a spreadsheet from a
> system that was decommissioned in 2011. Dobermann is built so the answer is always the same
> handful of moves: look at the shape, write one, make it a template, load the data.

> **🦴 Dig Deeper**
>
> Flat-to-nested is the oldest problem in data integration and the reason most projects end
> up with a folder of one-off scripts. The general shape is always the same: decide which
> column identifies the parent, group the rows by it, and nest the rest.
> [Template Variables](/docs/template-variables/) and
> [Batch Preparation](/docs/batch-preparation/) cover everything Dobermann can do with it.
