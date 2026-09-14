---
lesson_id: lesson_2
number: 2
slug: the-big-load
title: The Big Load
goal: Load 67,000 records into The Training Ground — then load them a thousand times more efficiently
estimate: ~15 minutes
completion:
  criteria: Cumulative successful POST /inventory record count of 60,000 or more
  summary: 60,000 inventory records loaded
checkpoint:
  pass: Good dog. That's what Dobermann was built for. Lesson 3 is unlocked.
  fail: The bulk upload didn't quite make it. Check your file is loaded, your Reps are set, and the batch has finished running.
---

## Step 1 — Download the Inventory File

Download the sample inventory file: [inventory-67k.csv](/puppy-school/files/inventory-67k.csv)

67,000 inventory records — products, locations, quantities. Flat structure, one row per
record. Exactly the kind of export you get handed out of a WMS or ERP on day one of a
project, usually with no warning and a deadline attached.

## Step 2 — Create the Upload Endpoint

Create a new endpoint. Copy the template below, then click **Paste**.

```
// Name: Puppy School — Bulk Inventory Upload
// Method: POST
// Path: /inventory
// Header: Content-Type: application/json [enabled]

[
  {
    "gtin": "{{gtin}}",
    "sku": "{{sku}}",
    "description": "{{description}}",
    "locationGln": "{{locationGln}}",
    "locationName": "{{locationName}}",
    "quantityOnHand": "{{quantityOnHand:number}}",
    "uom": "{{uom}}",
    "status": "{{status}}"
  }
]
```

Look at what you just pasted. The body is an **array containing one object**, and every
value is a `{{template variable}}` rather than a fixed value. That is what makes this a
batch endpoint: Dobermann fills those variables from a spreadsheet, one row at a time.

Note `{{quantityOnHand:number}}` — the `:number` suffix tells Dobermann to send that value
as a JSON number rather than a quoted string. APIs care about that distinction more than
you'd like.

## Step 3 — Load One Record First

Never point a batch at a file until you've watched a single record land.

Save the endpoint. Notice the footer button now reads **Run Batch** — it changed from
**Run API** the moment the body gained template variables. Click it. In **Load Data**, click
**Enter Data**: Dobermann builds an empty grid with one column per variable in your template.

Type one row:

| gtin | sku | description | locationGln | locationName | quantityOnHand | uom | status |
|---|---|---|---|---|---|---|---|
| `00012345600012` | `SKU-PUPPY-001` | `Premium Belly Rub Machine` | `0614141000012` | `Golden Retriever Distribution Center` | `12` | `EA` | `active` |

Both codes are real — you saw them in Lesson 1's products and locations. Click **Next**,
glance at the generated JSON, then **Execute**.

One request, one record, one row in the **Completed** tab, with the `id` the API gave it.
Now you know the endpoint, the template and the API agree with each other. Everything from
here is the same thing, more times.

## Step 4 — Load Your Data

Click **Run Batch** again. This time, in **Load Data**, upload `inventory-67k.csv`.

Dobermann maps the CSV columns to your template variables automatically where the names
match — which, here, they all do. Click through to **Review JSON** and look at the generated
request. One record, wrapped in an array, exactly as the endpoint expects — the same shape
you just typed by hand.

## Step 5 — Run It the Slow Way

Set **Threads** to `4` and hit **Run**.

Watch the counter. Every single record is going out as its own HTTP request — 67,000 of
them, four at a time. It works. It is also the single most common way people misuse a batch
tool, and it is worth seeing with your own eyes.

Let it run for about thirty seconds, then hit **Pause**. You've made your point, and so has it.

## Step 6 — One Request, A Thousand Records

Go back to **Review JSON**. Select the array in your template, and set **Reps** to `1000`.

Look at what happens to the estimate above the button. The same 67,000 records now go out
as **67 requests** instead of 67,000 — because each request carries a thousand records in
its array instead of one.

Set **Threads** to `16` and run it.

That's the whole file, done, while you were reading this sentence.

Two separate dials, and most people only ever find the first one:

| Dial | What it changes |
|---|---|
| **Threads** | How many requests are in flight at the same time |
| **Reps** | How many records ride inside each request |

Threads make you faster. Reps make you *smaller* — fewer connections, less overhead, less
load on the API you're being trusted with. Turning both up is how a load that took an
afternoon takes a minute.

A thousand is not a universal answer, by the way — it's this API's published maximum. Every
API has its own limit, and the right number is the largest one it will accept without
complaining.

> **Need to start over?**
>
> Your Training Ground data is yours alone, and you can wipe it whenever you like — create
> an endpoint with method `DELETE` and path `/my-data`, and run it. Everything you've loaded
> disappears; the shared reference data stays. Handy if you want to re-run a lesson from
> clean.

> **🐾 Dobermann Philosophy**
>
> Dobermann was built because loading data one record at a time is not a workflow — it is a
> punishment. The batch engine was designed from the ground up for scale. Threads, batching,
> error tracking, pause and resume: all of it exists because real projects demand it, usually
> at four o'clock on a Friday.

> **🦴 Dig Deeper**
>
> Sending 67,000 requests instead of 67 doesn't just cost time — every request carries its
> own connection setup, headers and round trip, and most APIs are rate limited on requests
> rather than records. The speed gain from threads is never linear either; latency, server
> capacity and connection overhead all get a vote.
> [MDN's guide to HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) covers
> the fundamentals.
