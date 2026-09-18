---
lesson_id: lesson_3
number: 3
slug: handling-errors
title: Handling Errors
goal: Break the load deliberately, find out why, fix the data, and reprocess the failures
estimate: ~10 minutes
completion:
  criteria: A failed POST /inventory followed by a later successful POST /inventory
  summary: errors triggered, then resolved
checkpoint:
  pass: Good dog. Errors found, reprocessed, resolved. That's real-world data migration right there.
  fail: We can see you've had a run — but we can't confirm the full error and reprocess cycle. Load the error file, fix the reference data, and reprocess the failed rows.
note_to_reviewer: >
  Written for the per-user reference data change. The "yours alone" line in Step 4 is only
  true once reference rows are user-scoped; until that migration lands, learners share
  reference tables and this lesson stops failing for the second learner onward.
---

## Step 1 — Download the Error File

Download the error inventory file: [inventory-errors.csv](/puppy-school/files/inventory-errors.csv){:download="inventory-errors.csv"}

A thousand inventory records, **ten of which are deliberately broken**. Some point at
products and locations that don't exist. Others carry values the API won't accept. A one
percent failure rate is not a contrived exercise — it is roughly what a real extract looks
like the first time you load it, and finding those ten rows is the entire skill.

## Step 2 — Run the Upload

Use the **Puppy School — Bulk Inventory Upload** endpoint you built in Lesson 2. Click
**Run Batch** and load [inventory-errors.csv](/puppy-school/files/inventory-errors.csv){:download="inventory-errors.csv"}.

Two settings to check before you run:

- At **Review JSON**, set **Reps:** back to `1`. With a thousand records per request, one
  bad record takes the whole request down with it — and right now you want to know exactly
  which rows failed, not lose 999 good ones alongside each bad one. Worth remembering as a
  rule: big Reps for speed, small Reps for precision.
- At **Execute Batch**, check **Error Handling** is on **Continue processing** — it is by
  default. **Stop on first error** would show you one error instead of ten.

Hit **Execute**. Ten records fail out of a thousand. That's the point.

## Step 3 — Inspect the Errors

In the Console, switch to the **Error** tab. Dobermann tells you which rows failed and
exactly why:

```json
{
  "error": "Invalid reference value: Key (gtin)=(99999999999999) is not present in table \"playground_products\". Use GET /reference/<type> to see valid values.",
  "code": "FK_VIOLATION"
}
```

Read the message, not just the code. It names the column and the value that's missing —
which is exactly what you'll need in Step 4.

Ten failures, and they split evenly into two kinds — which is the distinction that matters
most in this entire course:

- **`FK_VIOLATION`** — five records pointing at a GTIN or location GLN that doesn't exist in
  the reference tables. The records are fine; the master data is missing. **You can fix these.**
- **`INSERT_ERROR`** — five records carrying values the API rejects outright: a `uom` of
  `BOXES` or `PALLETS` when only `EA`, `CS`, `PL` and `KG` are allowed, a status of `expired`
  or `deleted`, and a quantity of `-50`. **Bad data at source.**

Real migrations are always this mix. Half your failures you can clear yourself in five
minutes. The other half have to go back to whoever produced the file, and no amount of
retrying will change their minds.

## Step 4 — Fix the Reference Data

Let's deal with the FK violations by adding the missing master data.

Reference records you add are **yours alone** — every learner gets their own view of the
reference tables, so you can add, break and fix freely without affecting anyone else.

Start with one product. Create a new endpoint:

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

Save it and hit **Run API**. You've just created a product in the reference table through
the API.

## Step 5 — Turn a Single Request Into a Batch

Three more GTINs are missing. Rather than hand-writing three more endpoints, let's convert
the one you have.

Open **Add Missing Product**. Put your cursor on the `"gtin"` line and press **Ctrl+M**:

```json
"gtin": "{{gtin:string}}", //99999999999999
```

Dobermann has replaced the hardcoded value with a template variable, named it from the key,
typed it from the value, and preserved the original in a comment so you don't lose it.

Do the same for every line. Your body becomes:

```json
{
  "gtin": "{{gtin:string}}", //99999999999999
  "sku": "{{sku:string}}", //SKU-FIX-001
  "description": "{{description:string}}", //Invisible Cat Repellent
  "unitPrice": "{{unitPrice:number}}" //9.99
}
```

Notice it worked out `unitPrice:number` on its own, from the fact the value was numeric.

Your static endpoint is now a batch template — the footer has grown a **Run Batch** button
beside **Run API**.

Save, click **Run Batch**, and in **Load Data** switch to the **Paste Text** tab. Copy the
CSV below, paste it in, and click **Import Data** — no file needed:

```csv
gtin,sku,description,unitPrice
00000000000000,SKU-FIX-002,Quantum Fetch Ball,14.99
11111111111111,SKU-FIX-003,Self-Walking Leash,29.99
55555555555555,SKU-FIX-004,Teleportation Dog Bed,199.99
```

Run the batch. Three products, one execution.

Now the missing locations. Same pattern — new endpoint:

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

Convert each line with **Ctrl+M**, save, then **Run Batch** → **Paste Text** with this CSV:

```csv
gln,name
9999999999999,Mystery Warehouse
0000000000000,Nonexistent Depot
8888888888888,Ghost Distribution Center
```

Run the batch.

That's the whole trick with template variables: any endpoint becomes a batch endpoint the
moment you replace its hardcoded values with `{{variables}}`.

## Step 6 — Reprocess the Failures

Open {icon:nav-history} **History** and open the failed inventory batch. In the Console
footer click **Reprocess**, choose **Errors only**, and **Continue**.

Five clear. The products and locations they were pointing at now exist, so the records go
through untouched.

Five fail again, and that is the correct outcome — `BOXES`, `PALLETS`, `expired`, `deleted`
and `-50` are still exactly as wrong as they were ten minutes ago.

Look closely at that last group and you'll spot something. `SKU-BAD-004` had a missing GTIN
*and* an invalid `uom` of `PALLETS`. You added the product for it in Step 5, and it still
fails — because it had a second problem that adding reference data was never going to solve.
Records with more than one thing wrong are completely normal, and they are why you always
re-read the error after a reprocess instead of assuming your fix worked.

You now have the complete loop: load, fail, diagnose, fix, reprocess. That loop is most of
what a data migration actually is.

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
