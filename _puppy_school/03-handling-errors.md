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
  Step 2 walks all five loader steps because the pre-execution check is the most valuable
  thing in the lesson and was previously skipped. It only fires because Lesson 2's template
  declares {{quantityOnHand:number|>=0}} — with a bare :number there is no rule, no dotted
  underline and no amber cell. The counts below assume the learner makes the -50 correction
  the step tells them to: ten broken rows in the file, one caught in the loader, nine reach
  the API. Reps is 100, so all nine land in ONE request (the bad rows are the last ten rows
  of the file) and the API reports a single uom_check error for the hundred — which is what
  makes Split array errors worth teaching. After the split: 91 through, 9 individual errors
  (5 FK_VIOLATION + 4 INSERT_ERROR), then 5 clear on reprocess and 4 fail again.
  vs-dbmn `npm run test:e2e:lessons` plays exactly that and checks every number here.
  Written for the per-user reference data change. The "yours alone" line in Step 5 is only
  true once reference rows are user-scoped; until that migration lands, learners share
  reference tables and this lesson stops failing for the second learner onward.
---

## Step 1 — Download the Error File

Download the error inventory file: [inventory-errors.csv](/puppy-school/files/inventory-errors.csv){:download="inventory-errors.csv"}

A thousand inventory records, **ten of which are deliberately broken**. Some point at
products and locations that don't exist. Others carry values the API won't accept. A one
percent failure rate is not a contrived exercise — it is roughly what a real extract looks
like the first time you load it, and finding those ten rows is the entire skill.

## Step 2 — Walk the Loader

Use the **Puppy School — Bulk Inventory Upload** endpoint you built in Lesson 2 and click
**Run Batch**. The loader is five steps, and it will not let you past a problem it can
already see.

**Step 1: Load Data.** Drop [inventory-errors.csv](/puppy-school/files/inventory-errors.csv){:download="inventory-errors.csv"}
onto the upload area and click **Import Data**.

**Step 2: Map & Transform.** Dobermann matches the file's columns to your template variables
by name. All eight match, so there is nothing to do. Click **Next**.

**Step 3: Review & Edit Data.** This is the step most people click straight through. It has
just saved you a request.

Look at the `quantityOnHand` column header: it carries a dotted underline. That means the
column has a rule. Hover it and Dobermann names the rule — `≥0` — which it knows because
you wrote it into the template in Lesson 2:

```json
"quantityOnHand": "{{quantityOnHand:number|>=0}}"
```

One cell is highlighted amber, and the footer tells you which column and how many records:

```text
"quantityOnHand" has 1 invalid record — must be ≥ 0
```

Click **Filter Errors** to hide the rows that are fine. One is left — row 999,
`SKU-WOOF-006-ERR`, with a quantity of `-50`. Negative stock is not a rounding error, it is
a broken extract.

Click the cell, change `-50` to `50`, and click **Next**. The highlight clears and the
loader lets you through. Your file on disk is untouched; the edit applies to this run.

Now notice what it did *not* catch. Nine broken rows are still in there — a `uom` of
`BOXES`, a status of `expired`, GTINs for products that don't exist. Dobermann checked the
one rule your template declared, and nothing else. It has no idea which units this API
accepts or which products exist on the server, and it never will: that knowledge lives on
the API.

Which gives you the rule worth taking to every project: **state in the template whatever you
already know.** You get it checked on every row, for free, before you spend a request
finding out. Everything else, the API tells you — and that is the rest of this lesson.

**Step 4: Review JSON.** Set **Reps:** to `100`. A thousand records go out as ten requests
of a hundred — fast, and how you would really run a load this size.

**Step 5: Execute Batch.** Check **Error Handling** is on **Continue processing** — it is by
default. **Stop on first error** would abandon the run at the first bad request.

Hit **Execute**. Nine requests succeed. One fails.

## Step 3 — One Error Is Not Nine

Nine hundred records are in. One request failed, and the Error tab has exactly one row in
it:

```json
{
  "error": "new row for relation \"playground_inventory\" violates check constraint \"playground_inventory_uom_check\"",
  "code": "INSERT_ERROR"
}
```

One error, for a hundred records. The API validates the array and rejects it as a unit, so
one bad record takes the ninety-nine around it down too — and names only itself. You now
know a `uom` is wrong somewhere in the last hundred rows. That is the whole of what you know.

Don't reach for **Reps: 1** and run the thousand again. Those nine hundred records went in
on nine requests instead of nine hundred, and that speed is worth keeping. You just need to
open up the one request that failed.

In the Console footer click **Reprocess**, choose **Split array errors**, and **Continue**.
Dobermann explains what it is about to do — every element of the failed array becomes its
own transaction — so click **Split**.

The failed request is now a hundred transactions. Ninety-one go through. Nine fail, each
one carrying its own error, against its own record.

That is the move worth taking with you: **run coarse, split on failure.** You get the speed
of big requests and the precision of small ones, and you only pay for the precision on the
records that actually earned it.

## Step 4 — Inspect the Errors

The **Error** tab now holds nine rows, and each one names the record and the reason:

```json
{
  "error": "Invalid reference value: Key (gtin)=(99999999999999) is not present in table \"playground_products\". Use GET /reference/<type> to see valid values.",
  "code": "FK_VIOLATION"
}
```

Read the message, not just the code. It names the column and the value that's missing —
which is exactly what you'll need in Step 5.

Nine failures, and they split into two kinds — which is the distinction that matters most
in this entire course:

- **`FK_VIOLATION`** — five records pointing at a GTIN or location GLN that doesn't exist in
  the reference tables. The records are fine; the master data is missing. **You can fix these.**
- **`INSERT_ERROR`** — four records carrying values the API rejects outright: a `uom` of
  `BOXES` or `PALLETS` when only `EA`, `CS`, `PL` and `KG` are allowed, and a status of
  `expired` or `deleted`. **Bad data at source.**

Real migrations are always this mix. Five of these you can clear yourself in five minutes.
The other four have to go back to whoever produced the file, and no amount of retrying will
change their minds.

## Step 5 — Fix the Reference Data

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

## Step 6 — Turn a Single Request Into a Batch

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

## Step 7 — Reprocess the Failures

Open {icon:nav-history} **History** and open the failed inventory batch. In the Console
footer click **Reprocess**, choose **Errors only**, and **Continue**. This time it reprocesses
the nine individual transactions the split left behind — not the whole hundred.

Five clear. The products and locations they were pointing at now exist, so the records go
through untouched.

Four fail again, and that is the correct outcome — `BOXES`, `PALLETS`, `expired` and
`deleted` are still exactly as wrong as they were ten minutes ago.

Look closely at that last group and you'll spot something. `SKU-BAD-004` had a missing GTIN
*and* an invalid `uom` of `PALLETS`. You added the product for it in Step 6, and it still
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
