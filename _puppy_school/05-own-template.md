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
  other four go through two batches, both CHAINED from the learner's Lesson 4 Inventory Report
  run (no Copy, no paste): Wagmore alone (Step 5: one request, ~196 lines — one order,
  many lines), then the last three in one chain (Step 6: three requests, 170-187 lines each —
  many orders). Seven POSTs. The grouping rule is taught in Step 6, after the learner has seen
  one order fill up.
  Why it works out: the Golden Retriever DC's low-stock rows in inventory-67k.csv cover exactly
  five products (WOOF-001/005/009/013/017), and vs-dbmn migration
  20260917000002_playground_product_suppliers.sql deals suppliers so those five differ.
  The final template, the four-column mapping and the 1- and 3-request groupings were run through the
  real JsonGenerator; the Run API paste row through shared/row-paste.js (6 of 6 fields).
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
  the GLNs — the template carries GLNs only. Lesson 4's view gained `location.gln` for it,
  (9) vs-dbmn migration 20260926000002_playground_po_line_product.sql: a line's `gtin` is
  required and the API fills sku/description/unitPrice from the product — the line carries
  gtin, orderedQty, uom and an optional supplierSku. Lesson 4's view gained `gtin` for it,
  (10) Run Batch remembering the mapping per endpoint (vs-dbmn #307): Step 6 relies on Step 5's
  mapping being pre-filled, and (11) the Run Batch preview/JIT counting groups on every
  header field, and counting EVERY row rather than the 50-row typed preview sample — before
  them, Step 6's Review & Configure said one API call for three orders, (12) Chain and the
  Run Batch skip-ahead (vs-dbmn #247). Measured with the real chain-target-ranker on the
  course's endpoints and Lesson 4's view columns: Step 5's dialog SUGGESTS (and pre-selects)
  Bulk Inventory Upload, 8 of 8 by name (locationGln/locationName match location.gln/.name
  ignoring punctuation); My Replenishment Orders is 2 of 6, missing buyerGln, supplierGln,
  orderedQty, and supplierSku's partial guess is `sku` (hence the copy). Step 6, after the
  remembered mapping, suggests both, Bulk Inventory Upload first (8 matches beat 6), so the
  copy says to select ours. Step 6 skipping to Review & Configure relies on every mapping being
  remembered and every row valid (supplierSku blanks are |opt).
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

Never write a template against an API you haven't looked at. Copy this, open
{icon:nav-api-catalogue} **API Catalogue**, click {icon:paste-endpoint} **Paste Endpoint**, save,
and click **Run API**:

```json
// Name: Puppy School — List Purchase Orders
// Method: GET
// Path: /purchase-orders
// QueryParam: size: 1 [enabled]
```

In the Console, open the **Raw** tab. A GET returns a **page**: `totalCount` and the paging
fields, with the orders inside the `data` array. A POST creates **one** order. You'll send
the one order, not the page around it.

## Step 2 — Send One Back

Now the endpoint that becomes your template. Copy this and click **Paste Endpoint** again:

```json
// Name: My Replenishment Orders
// Method: POST
// Path: /purchase-orders
```

It opens with an empty **Request Body**. Switch back to the Console, copy the one order out
of the **Raw** tab, and come back. Click in the **Request Body**, press **Ctrl+V**, then click
**Format**.

> **Hint: copy one order**
>
> In the **Raw** tab, click the arrow in the margin beside the `{` just under `"data": [`.
> The whole order folds into one line. Select that line and press **Ctrl+C**. Everything
> inside the fold comes with it.

Save, **Run API**. It fails:

```text
duplicate key value violates unique constraint "playground_purchase_orders_pkey"
```

That order already exists. `id` is its primary key, and the first key in your body, just
under the opening `{`. Put your cursor on the `"id"` line and press **Ctrl+D** to delete it.
Without an `id`, the API creates a new order. Or send your own, as long as it's a new UUID.

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

Stay on **My Replenishment Orders**. The order you just sent is still in its **Request
Body**. You turn it into the template right there, one key at a time.

**Keep one order line.** The order has five lines, `lineNumber` 1 to 5, each in its own
`{ … }`. Put your cursor on the first `{`, line 16, just under `"lines": [`:

```javascript
  "lines": [
    {                          // line 16: cursor here
      "sku": "SKU-WOOF-004",
      …
```

Press **Ctrl+D** four times. Each press takes a whole order line, `{` to `},`, and the next
moves up into its place. The last one is left, with no comma to tidy.

> **One line in, hundreds out**
>
> The line you kept isn't one order line any more. It's the pattern for all of them. When you
> run a batch, Dobermann sorts your rows into orders (the header decides which; more on that
> in Step 6), then stamps out a copy of this line for each row in the order. Three rows,
> three lines. A hundred and eighty rows, a hundred and eighty lines. Your data stays a flat
> table, and the API still gets properly nested orders. That's why the other four could go: a
> template only ever needs one.
{: .ps-boxout}

Dobermann repeats that one line for every row of your data.

**Keep only what the API needs.** The GET brought back more than a POST needs: fields the
API works out for itself. Who owns the order, when it arrived, the names behind the GLNs,
the product details behind the `gtin`, the totals. The API fills those in on every new
order, so you don't send them. You'll see them filled in on your orders in Step 7.

Keep these. Put your cursor on every other key and press **Ctrl+D**.

In the header:

| Keep | What it is |
|---|---|
| `poNumber` | The order number. You'll generate it below |
| `buyerGln` | Who's buying: the warehouse's GLN |
| `supplierGln` | Who's supplying: the supplier's GLN |
| `orderDate` | When it was ordered. Keep it, but commented out (below) |
| `requestedDeliveryDate`, `status`, `currency` | Leave as they are |
| `lines` | The order line you kept |

In the order line:

| Keep | What it is |
|---|---|
| `gtin` | The product's unique identifier. **Required**: the API refuses a line without one |
| `orderedQty` | How many to order |
| `uom` | The unit: `EA`, `CS` or `PL` |
| `supplierSku` | The supplier's own part number. **Optional**: not every supplier has them |
| `lineNumber` | The line's place in the order |

**Comment out `orderDate`.** Put your cursor on it and press **Ctrl+/**. A commented line
isn't sent, so the API dates each order today. The line stays in the template, ready to
become a generated date later.

**Make them variables.** Put your cursor on `buyerGln`, `supplierGln`, `gtin`, `orderedQty`,
`uom` and `supplierSku` in turn and press **Ctrl+M** on each. Dobermann turns each value into
a typed `{{variable}}` and keeps the original as a comment. `supplierSku` is `null`, and
Ctrl+M can't type a null, so type any part number over it first (`"KP-0004"`).

**Three edits by hand:**

- `poNumber`: press **Ctrl+M** three times to reach `{{A8:}}`, pick `sequence`, and type a
  prefix in front. Dobermann numbers each order at run time.
- `lineNumber`: the same, with `sequence:local`. It restarts at 1 in each order.
- `supplierSku`: it's optional, so click inside the variable, open **Modifier**, choose `opt`.
  A blank cell then leaves the key out instead of sending `""`.

Your **Request Body** is now:

```json
{
  "poNumber": "PO-REPLEN-{{A8:sequence}}",
  "buyerGln": "{{buyerGln:string}}", //5012345000039
  "supplierGln": "{{supplierGln:string}}", //4012345000054
  // "orderDate": "2026-02-04T08:00:00+00:00",
  "requestedDeliveryDate": "2026-02-18",
  "status": "draft",
  "currency": "USD",
  "lines": [
    {
      "uom": "{{uom:string}}", //PL
      "gtin": "{{gtin:string}}", //00012345600081
      "lineNumber": "{{A8:sequence:local}}",
      "orderedQty": "{{orderedQty:number}}", //404
      "supplierSku": "{{supplierSku:string|opt}}" //KP-0004
    }
  ]
}
```

Your comments show whichever order you copied.

Save. The footer has grown a **Run Batch** button beside **Run API**. You built that.

<!-- share-it-back -->

## Step 4 — One Order, One Line

Same rule as Lesson 2: one record before a thousand.

Click **Run API**. The form has six fields — one per variable, and nothing for the two
`A8` values or the three you left hardcoded. Copy this, then click {icon:paste-row} **Paste**:

```csv
supplierGln,buyerGln,gtin,supplierSku,orderedQty,uom
4012345000016,0614141000012,00012345600012,CTM-0001,200,EA
```

Check the fields, then click **Run**.

One purchase order, with one line. And one line is all Run API will ever give you: the form
holds a single row, so it can fill the `lines` array exactly once. That's not a flaw to work
around — it's what the button is for. **Run API proves the template. Run Batch does the
work.**

Look at the response in the **Completed** tab: your generated PO number, `"lines": 1`, and
`supplierName` and `buyerName`, filled in by the API from the two GLNs you sent.

## Step 5 — One Order, Many Lines

Chew Toy Manufacturing has its order, with one line. Next, one order with many.

The lines are already sitting in Dobermann: you fetched them in Lesson 4. Open
{icon:nav-history} **History** and open your **Puppy School — Inventory Report** run.
Nothing is re-fetched; the Console reopens with every row you pulled. On the **Completed**
tab, make sure the view button shows `Low Stock by Location`, then search:

```text
low_stock +Golden +"Wagmore Components Ltd"
```

Low stock, at this warehouse, from one supplier. About 200 rows.

In Lesson 4 you copied rows out. This time you **chain** them: click **Chain**, beside
**Copy** and **Export**. It sends the rows on screen, in the view's columns, straight into
another endpoint's Run Batch. No clipboard, no file.

**Suggested** offers **Puppy School — Bulk Inventory Upload**. Every one of its variables
has a column here, so the rows would fit, but you'd be reloading stock. A fit isn't a
purpose. In **Send them to endpoint:**, type `Replenishment`, select **My Replenishment
Orders** and click **Chain**.

Run Batch opens with the rows already loaded, **Chained from** your report run, on
**Map & Transform**. Two match by name and map themselves — `gtin`, `uom`. The other four
came out of a nested response with dotted names, so point each one at its column:

| Variable | Column |
|---|---|
| `supplierGln` | `product.supplier.gln` |
| `buyerGln` | `location.gln` |
| `supplierSku` | `product.supplierSku` |
| `orderedQty` | `product.reorderQty` |

`supplierSku` arrives as a guess, `sku`. That's the product's own code, not the supplier's,
so change it. The columns you don't use — `status`, `quantityOnHand` and the rest — are
simply ignored. No `gtin` or `location.gln` column? Your view is older than this lesson:
tick them in the view (Lesson 4, Step 3) and chain again.

Click **Next**, and Dobermann remembers this mapping: the next batch on this endpoint maps
these columns for you. Leave **Update Endpoint Template** unticked: it would rename your
variables after the columns, and `buyerGln` says what the field means to the API.

Click **Next** through to **Review & Configure**.

- **1 API call.** About two hundred rows, one request.
- It's **one purchase order**: the header once, and your one line repeated for every row,
  `lineNumber` counting up from 1.

Every row has the same buyer and the same supplier, so every row belongs to the same order.
That's the one line from Step 3 at work.

Click **Next**, and **Execute**. One request, one order, a couple of hundred lines.

## Step 6 — Many Orders, One Chain

**How Dobermann decides where one order ends and the next begins.** Everything above
`lines` is the order's **header**, and a header is a statement about every line beneath it.
So Dobermann starts a new order whenever **any header field changes** — here, a different
supplier or a different buyer. Rows that agree on all of them are one order; their lines
stack up underneath. That's Step 5: every row agreed, so you got one order. The generated PO
number isn't part of that. It's handed out *after* the rows are grouped, one per order.

The consequence is worth holding on to: a header field should only ever hold something
that's true of the whole order. Put a per-line value up there by mistake — a quantity, a
`gtin` — and you'll get one order per row. That's Dobermann being right and the template
being wrong.

Three suppliers to go, in one batch. Back in the report's Console (the **Chained from** link
takes you there), search:

```text
low_stock +Golden -"Chew Toy Manufacturing Inc" -"Wagmore Components Ltd"
```

Everyone except the two suppliers you've already ordered from. Around 540 rows, three
suppliers. Click **Chain**.

**My Replenishment Orders** is under **Suggested** now: it remembered Step 5's mapping.
Select it and click **Chain**. With every column mapped and every row valid, Run Batch skips
ahead to **Review & Configure**:

- **3 API calls.** Five hundred-odd rows, three requests — one per supplier. Click the ⓘ
  beside **API calls** to see why: your rows grouped by `buyerGln` and `supplierGln`, one
  request per combination.
- Each request is a **single purchase order with well over a hundred lines**, `lineNumber`
  starting again at 1 in each.
- Your rows weren't sorted by supplier. Dobermann sorted them before it folded them.
- Find the order with `supplierGln` `4012345000054`, K9 Precision Parts Corp. Its lines have
  no `supplierSku` key at all. Find `4012345000030`, Boop & Snoot Supply Co. Every line has
  one. That's `opt`.

A flat table went in, and Dobermann rebuilt the nesting from it. That is the trick the whole
course has been walking towards. Nested APIs, flat source data, no scripting.

Click **Next**, and **Execute**. Three requests. Boom.

## Step 7 — Prove It Landed

Go back to **Puppy School — List Purchase Orders**, set `size` to `6`, and run it again.

Your orders are there, newest first: the three from Step 6 and the one from Step 5 with
their lines nested underneath, the one-line order from Run API, and the copy you sent back in Step 2. Every
line has its `sku`, `description` and `unitPrice`, filled in by the API from its `gtin`. Build a
view over it if you want to see them properly — you know how now.

Now open your Step 6 batch from {icon:nav-history} **History**. Its Console has a **Links**
tab: **Came From** names your Inventory Report run, the view, and how many rows it sent.
Open the report run and its **Links** tab lists both batches under **Sent To**. When someone
asks where an order's lines came from, that's the answer.

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
