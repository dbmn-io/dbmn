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
  Shape (decided 2026-09-17): ONE PURCHASE ORDER PER SUPPLIER. A throwaway hand-written order
  proves the endpoint; the first real order (supplier A, one line) goes through Run API; the
  other four suppliers go through ONE batch, four requests, ~160 lines each. Six POSTs.
  Why it works out: the Golden Retriever DC's low-stock rows in inventory-67k.csv cover exactly
  five products (WOOF-001/005/009/013/017), and vs-dbmn migration
  20260917000002_playground_product_suppliers.sql deals suppliers so those five differ.
  The final template, the six-column mapping and the 4-request grouping were run through the
  real JsonGenerator; the Run API paste row through shared/row-paste.js (9 of 9 fields).
  DEPENDS ON, all unreleased/undeployed as of writing: (1) that migration, (2) the playground
  function returning product.supplier/reorderQty/supplierSku and `lines` on the PO list,
  (3) check_lesson_completion for lesson_5 (migration 20260917000003), (4) the extension fix
  that makes `|opt` omit keys in NESTED templates — before it, blank part numbers go out as
  "" and Step 6's "no supplierSku key" is false, (5) Run API row paste (issue #302).
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
// QueryParam: size: 5 [enabled]
```

In the Console, find a purchase order and expand its `lines` cell. A header — PO number,
supplier, buyer, status, currency — with a `lines` array hanging off it, each line carrying a
product, a quantity and a price.

That nesting is what you have to produce. The full field list is in the
[Training Ground API reference](/docs/playground/#po-upload) if you want it written down.

## Step 2 — Write One Purchase Order by Hand

Create a new endpoint. This time you're writing the body yourself, not pasting a template.

```json
// Name: My Replenishment Orders
// Method: POST
// Path: /purchase-orders
// Header: Content-Type: application/json [enabled]
```

In the body, write a single, complete, real purchase order with hardcoded values — two
lines, so you can see the nesting you're aiming for:

```json
{
  "poNumber": "PO-TEST-001",
  "supplierName": "Bark & Bite Supply Co",
  "supplierGln": "5012345000046",
  "buyerName": "Golden Retriever Distribution Center",
  "status": "submitted",
  "currency": "USD",
  "lines": [
    {
      "lineNumber": 1,
      "sku": "SKU-WOOF-002",
      "supplierSku": "BB-7781",
      "description": "Tennis Ball Launcher 3000",
      "orderedQty": 200,
      "unitPrice": 89.99,
      "uom": "EA"
    },
    {
      "lineNumber": 2,
      "sku": "SKU-WOOF-006",
      "supplierSku": "BB-7790",
      "description": "Indestructible Chew Toy (Ha Right)",
      "orderedQty": 500,
      "unitPrice": 24.99,
      "uom": "EA"
    }
  ]
}
```

Save, and hit **Run API**. Not because you need this order, but because a template built on
an untested body is a template that fails five thousand times in a row. Get one right first.
If it errors, the Console tells you which field it objected to — fix it, run again.

Now you know the endpoint works.

## Step 3 — Turn It Into a Template

Four moves.

**One line, not two.** Delete the whole second line object, and the comma before it. A
template holds **one** line. Dobermann repeats it once for every row of your data — two
rows or two thousand.

**Ctrl+M down the body.** Put your cursor on each line in turn and press **Ctrl+M**, skipping
`poNumber`, `status`, `currency` and `lineNumber`. Dobermann replaces each value with a
`{{variable}}`, names it from the key, types it from the value, and keeps the original in a
comment. Leave `status` and `currency` hardcoded — a field that never varies is clearer left
alone, and it's one less column to carry.

**Three edits by hand**, for the things no spreadsheet should have to supply:

- `poNumber` — press **Ctrl+M** three times to reach `{{A8:}}`, pick `sequence`, then type a
  prefix in front of it. `A8` variables are generated by Dobermann at run time, never asked
  for. Every order gets the next number, and no two runs can collide.
- `lineNumber` — the same, but `sequence:local`: it counts up inside each `lines` array and
  starts again at 1 for the next order.
- `supplierSku` — click inside the variable, open **Modifier**, and choose `opt`. Some
  suppliers have part numbers and some don't. Without `opt` a blank cell goes out as
  `"supplierSku": ""`. With it, the key is left out of that line altogether. To an API those
  are different things, and the second is nearly always the one you mean.

Your body is now:

```json
{
  "poNumber": "PO-REPLEN-{{A8:sequence}}",
  "supplierName": "{{supplierName:string}}", //Bark & Bite Supply Co
  "supplierGln": "{{supplierGln:string}}", //5012345000046
  "buyerName": "{{buyerName:string}}", //Golden Retriever Distribution Center
  "status": "submitted",
  "currency": "USD",
  "lines": [
    {
      "lineNumber": "{{A8:sequence:local}}",
      "sku": "{{sku:string}}", //SKU-WOOF-002
      "supplierSku": "{{supplierSku:string|opt}}", //BB-7781
      "description": "{{description:string}}", //Tennis Ball Launcher 3000
      "orderedQty": "{{orderedQty:number}}", //200
      "unitPrice": "{{unitPrice:number}}", //89.99
      "uom": "{{uom:string}}" //EA
    }
  ]
}
```

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

Click **Run API**. The form has nine fields — one per variable, and nothing for the two
`A8` values or the two you left hardcoded. Copy this, then click {icon:paste-row} **Paste**:

```csv
supplierName,supplierGln,buyerName,sku,supplierSku,description,orderedQty,unitPrice,uom
Chew Toy Manufacturing Inc,4012345000016,Golden Retriever Distribution Center,SKU-WOOF-001-00001,CTM-0001,Premium Belly Rub Machine,200,149.99,EA
```

Check the fields, then click **Run**.

One purchase order, with one line. And one line is all Run API will ever give you: the form
holds a single row, so it can fill the `lines` array exactly once. That's not a flaw to work
around — it's what the button is for. **Run API proves the template. Run Batch does the
work.**

Look at the response in the **Completed** tab: a generated PO number, `lineNumber` 1, and a
`supplier` object the API filled in from the GLN you sent.

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
from. Around 660 rows, four suppliers.

Open the **Copy** menu and choose **Excel**. The whole filtered table — headers included —
is on your clipboard. No file, no spreadsheet.

## Step 6 — Load It

Back on **My Replenishment Orders**, click **Run Batch**. In **Load Data**, switch to the
**Paste Text** tab, paste, and click **Import Data**.

**Map & Transform** is where your columns meet your variables. Three match by name and map
themselves — `sku`, `description`, `uom`. The other six came out of a nested response with
dotted names, so point each one at its column:

| Variable | Column |
|---|---|
| `supplierName` | `product.supplier.name` |
| `supplierGln` | `product.supplier.gln` |
| `buyerName` | `location.name` |
| `supplierSku` | `product.supplierSku` |
| `orderedQty` | `product.reorderQty` |
| `unitPrice` | `product.unitPrice` |

The columns you don't use — `status`, `quantityOnHand` and the rest — are simply ignored.

Click **Next** through to **Review JSON** and look carefully.

- **Total API calls: 4.** Six hundred-odd rows, four requests — one per supplier.
- Each request is a **single purchase order with well over a hundred lines**, the header
  taken once and the line repeated per row, `lineNumber` counting up from 1 inside each.
- Your rows weren't sorted by supplier. Dobermann sorted them before it folded them.
- Find an order for **K9 Precision Parts Corp**. Its lines have no `supplierSku` key at
  all. Find one for **Wagmore Components Ltd**. Every line has one. That's `opt`.

You copied a flat table and Dobermann rebuilt the nesting from it. That is the trick the
whole course has been walking towards. Nested APIs, flat source data, no scripting.

Click **Next**, and **Execute**. Four requests. Boom.

## Step 7 — Prove It Landed

Go back to **Puppy School — List Purchase Orders** and run it again.

Your orders are there, newest first: four with their lines nested underneath, one with a
single line, and on every one a `supplier` object resolved from the reference data. Build a
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
