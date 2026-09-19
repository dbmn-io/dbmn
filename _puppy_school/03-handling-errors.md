---
lesson_id: lesson_3
number: 3
slug: handling-errors
title: Handling Errors
goal: Break the load deliberately, find out why, fix the data, and reprocess the failures
estimate: ~15 minutes
completion:
  criteria: A failed POST /inventory followed by a later successful POST /inventory
  summary: errors triggered, then resolved
checkpoint:
  pass: Good dog. Errors found, reprocessed, resolved. That's real-world data migration right there.
  fail: We can see you've had a run — but we can't confirm the full error and reprocess cycle. Load the error file, fix the reference data, and reprocess the failed rows.
note_to_reviewer: >
  Ten steps, one action each, ~1,000 words — rewritten 2026-09-19 because seven long steps
  read as a wall and the loader's own Step 1-5 nested inside lesson Step 2. Never write
  "Step" inside a step: call the loader's screens by name (Load Data, Review & Edit Data,
  Review JSON, Execute Batch).
  THE REVEAL: Step 1 must NOT say how many records are broken. The learner earns the count —
  one caught by the loader, nine by the API — and the close adds it up to ten. A test asserts
  Step 1 names no number.
  The Step 3 check only fires because Lesson 2's template declares
  {{quantityOnHand:number|>=0}}; with a bare :number there is no rule, no dotted underline
  and no amber cell. Reps is 100, so all nine bad rows (the last ten rows of the file, minus
  the one corrected in the loader) land in ONE request and the API reports a single
  uom_check error for the hundred — which is what makes Split array errors worth teaching.
  After the split: 91 through, 9 individual errors (5 FK_VIOLATION + 4 INSERT_ERROR), then
  5 clear on reprocess and 4 fail again. vs-dbmn `npm run test:e2e:lessons` plays exactly
  this and checks every number.
  The "yours alone" line in Step 8 is only true once reference rows are user-scoped; until
  that migration lands, learners share reference tables and this lesson stops failing for
  the second learner onward.
---

## Step 1 — Get the File

Download [inventory-errors.csv](/puppy-school/files/inventory-errors.csv){:download="inventory-errors.csv"}

A thousand inventory records, and a handful of them are deliberately broken. Some point at
products and locations that don't exist. Others carry values the API won't accept. That is
not a contrived exercise — it is what a real extract looks like the first time you load it.

## Step 2 — Load It

Open the **Puppy School — Bulk Inventory Upload** endpoint you built in Lesson 2 and click
**Run Batch**.

In **Load Data**, drop the file onto the upload area and click **Import Data**.

**Map & Transform** matches your file's columns to the template's variables by name. All
eight match, so there is nothing to do here. Click **Next**.

You land on **Review & Edit Data**, a thousand rows in a grid. Most people click straight
through. Don't.

## Step 3 — Fix What Dobermann Caught

One cell is amber, and the footer names it:

```text
"quantityOnHand" has 1 invalid record — must be ≥ 0
```

Click **Filter Errors** to hide every row that is fine. One is left: row 999,
`SKU-WOOF-006-ERR`, with a quantity of `-50`.

Dobermann knows stock cannot be negative because you told it, back in Lesson 2:

```json
"quantityOnHand": "{{quantityOnHand:number|>=0}}"
```

That is also why the column header carries a dotted underline — hover it and Dobermann names
the rule.

Click the cell, change `-50` to `50`, and click **Next**. The highlight clears. Your file on
disk is untouched; the edit applies to this run.

## Step 4 — Send It

On **Review JSON**, set **Reps:** to `100`. A thousand records go out as ten requests of a
hundred — fast, and how you would really run a load this size.

On **Execute Batch**, check **Error Handling** is on **Continue processing**. **Stop on
first error** would abandon the whole run at the first bad request.

Hit **Execute**. Nine requests succeed. One fails.

## Step 5 — One Error for a Hundred Records

Nine hundred records are in. The **Error** tab holds a single row:

```json
{
  "error": "new row for relation \"playground_inventory\" violates check constraint \"playground_inventory_uom_check\"",
  "code": "INSERT_ERROR"
}
```

The API validates the array and rejects it as a unit, so one bad record takes the ninety-nine
around it down with it — and names only itself.

So you know a `uom` is wrong somewhere in the last hundred rows. You don't know which row.
You don't know whether it's the only one.

## Step 6 — Narrow It Down

Don't set **Reps: 1** and run the thousand again. Nine hundred records went in on nine
requests, and that speed is worth keeping. Open up the one request that failed instead.

In the Console footer click **Reprocess**, choose **Split array errors**, **Continue**, then
**Split**. Every element of the failed array becomes a transaction of its own.

Ninety-one go through. Nine fail — not one. Each carries its own error, against its own
record.

**Run coarse, split on failure.** You get the speed of big requests and the precision of
small ones, and you only pay for precision on the records that earned it.

## Step 7 — Read the Errors

The **Error** tab now holds nine rows, each naming a record and a reason:

```json
{
  "error": "Invalid reference value: Key (gtin)=(99999999999999) is not present in table \"playground_products\". Use GET /reference/<type> to see valid values.",
  "code": "FK_VIOLATION"
}
```

Read the message, not just the code. It names the column and the value that is missing.

The nine split into two kinds, and this is the distinction that matters most in the course:

- **`FK_VIOLATION`** — five records pointing at a GTIN or location GLN that doesn't exist in
  the reference tables. The records are fine; the master data is missing. **You can fix these.**
- **`INSERT_ERROR`** — four records carrying values the API rejects outright: a `uom` of
  `BOXES` or `PALLETS` when only `EA`, `CS`, `PL` and `KG` are allowed, and a status of
  `expired` or `deleted`. **Bad data at source.**

Five you can clear yourself in five minutes. Four go back to whoever produced the file.

## Step 8 — Add One Product

Reference records you add are **yours alone** — every learner gets their own view of the
reference tables, so you can add, break and fix freely.

Create a new endpoint and hit **Run API**:

```json
// Name: Add Missing Product
// Method: POST
// Path: /reference/products
// Header: Content-Type: application/json [enabled]

{
  "gtin": "99999999999999",
  "sku": "SKU-FIX-001",
  "description": "Invisible Cat Repellent",
  "unitPrice": 9.99
}
```

One product, created through the API.

## Step 9 — Turn That Into a Batch

Three more GTINs are missing. Convert the endpoint you already have rather than writing three
more.

Open **Add Missing Product**, put your cursor on the `"gtin"` line and press **Ctrl+M**:

```json
"gtin": "{{gtin:string}}", //99999999999999
```

Dobermann replaced the hardcoded value with a variable, named it from the key, typed it from
the value, and kept the original in a comment. Do the same for every line:

```json
{
  "gtin": "{{gtin:string}}", //99999999999999
  "sku": "{{sku:string}}", //SKU-FIX-001
  "description": "{{description:string}}", //Invisible Cat Repellent
  "unitPrice": "{{unitPrice:number}}" //9.99
}
```

It worked out `unitPrice:number` on its own, from the value. The footer has grown a **Run
Batch** button beside **Run API**.

Save, click **Run Batch**, and in **Load Data** switch to the **Paste Text** tab. Paste this
and click **Import Data** — no file needed:

```csv
gtin,sku,description,unitPrice
00000000000000,SKU-FIX-002,Quantum Fetch Ball,14.99
11111111111111,SKU-FIX-003,Self-Walking Leash,29.99
55555555555555,SKU-FIX-004,Teleportation Dog Bed,199.99
```

Run it. Three products, one execution.

Now the missing locations. Same pattern — a new endpoint:

```json
// Name: Add Missing Location
// Method: POST
// Path: /reference/locations
// Header: Content-Type: application/json [enabled]

{
  "gln": "9999999999999",
  "name": "Mystery Warehouse"
}
```

**Ctrl+M** each line, save, then **Run Batch** → **Paste Text** with this:

```csv
gln,name
9999999999999,Mystery Warehouse
0000000000000,Nonexistent Depot
8888888888888,Ghost Distribution Center
```

Run it. Any endpoint becomes a batch endpoint the moment its values become `{{variables}}`.

## Step 10 — Reprocess

Open {icon:nav-history} **History** and open the failed inventory batch. In the Console
footer click **Reprocess**, choose **Errors only**, then **Continue**. It reprocesses the
nine transactions the split left behind, not the whole hundred.

Five clear. The products and locations they pointed at now exist.

Four fail again, and that is the correct outcome — `BOXES`, `PALLETS`, `expired` and
`deleted` are still exactly as wrong as they were ten minutes ago.

Look at `SKU-BAD-004`. It had a missing GTIN *and* an invalid `uom` of `PALLETS`. You added
its product in Step 9 and it still fails, because it had a second problem that master data
was never going to solve. Always re-read the error after a reprocess instead of assuming
your fix worked.

Ten broken records, then. One you caught before sending anything, nine the API caught, five
you fixed yourself, and four that go back to whoever produced the file. Load, fail, diagnose,
fix, reprocess — that loop is most of what a data migration actually is.

> **🐾 Dobermann Philosophy**
>
> Errors are not failures — they are information. Dobermann surfaces exactly what went wrong,
> against which record, with enough detail to act on. The reprocess flow exists because in a
> real migration, fixing and rerunning individual failures *is* the job. Dobermann makes that
> precise and repeatable, instead of a spreadsheet full of guesswork.

> **🦴 Dig Deeper**
>
> `FK_VIOLATION` is a foreign key constraint error: a value in your data points at a record
> that doesn't exist in a related table. Databases use foreign keys to guarantee referential
> integrity — no inventory against a product nobody has ever heard of.
> [MDN's HTTP response codes reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
> covers the 400-range errors you'll meet working with any REST API.
