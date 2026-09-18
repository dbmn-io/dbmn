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

Download the sample inventory file: [inventory-67k.csv](/puppy-school/files/inventory-67k.csv){:download="inventory-67k.csv"}

67,000 inventory records — products, locations, quantities. Flat structure, one row per
record. Exactly the kind of export you get handed out of a WMS or ERP on day one of a
project, usually with no warning and a deadline attached.

## Step 2 — Create the Upload Endpoint

Copy the template below, then in the Hub open {icon:nav-api-catalogue} **API Catalogue**
and click {icon:paste-endpoint} **Paste Endpoint** — the same button you used in Lesson 1.

```json
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

Save the endpoint. The footer now shows two buttons, **Run API** and **Run Batch** — in the
API Catalogue they're the {icon:run-api} and {icon:run-batch} icons on the endpoint's row.
**Run Batch** drives the template from a file. **Run API** asks you for each value, one
field per `{{variable}}`.

Click **Run API**. A form opens with eight fields. Don't type them — copy this, then click
{icon:paste-row} **Paste** at the bottom of the form:

```csv
gtin,sku,description,locationGln,locationName,quantityOnHand,uom,status
00012345600012,SKU-PUPPY-001,Premium Belly Rub Machine,0614141000012,Golden Retriever Distribution Center,12,EA,active
```

Dobermann reads the header row, matches each column to its variable, and fills the whole
form from the data row. A row copied straight out of Excel works the same way, and so does
Ctrl+V in any field. Both codes are real — you saw them in Lesson 1's products and
locations.

Check the fields, then click **Run**.

One request, one record, one row in the **Completed** tab, with the `id` the API gave it.
Now you know the endpoint, the template and the API agree with each other. Everything from
here is the same thing, more times.

## Step 4 — Load Your Data

Click **Run Batch**. In **Load Data**, drop [inventory-67k.csv](/puppy-school/files/inventory-67k.csv){:download="inventory-67k.csv"}
onto the upload area and click **Import Data**.

Dobermann maps the CSV columns to your template variables automatically where the names
match — which, here, they all do. Click **Next** through to **Review JSON** and look at the
generated request. One record, wrapped in an array, exactly as the endpoint expects — the
same shape you just ran by hand.

## Step 5 — Run It the Slow Way

Click **Next** once more, to **Execute Batch**. Set **Processing Mode** to
`4 concurrent requests` and hit **Execute**.

Watch the counter. Every single record is going out as its own HTTP request — 67,000 of
them, four at a time. It works. It is also the single most common way people misuse a batch
tool, and it is worth seeing with your own eyes.

Let it run for about thirty seconds, then hit **Pause**. You've made your point, and so has
it. (The paused batch stays in {icon:nav-history} **History**. Leave it — you're about to
run the whole file properly.)

## Step 6 — One Request, A Thousand Records

Click **Run Batch** again and load the same file. This time, at **Review JSON**, pick the
array in the **Array:** dropdown and set **Reps:** to `1000`.

Look at what happens to the **Total API calls** figure. The same 67,000 records now go out
as **67 requests** instead of 67,000 — because each request carries a thousand records in
its array instead of one.

At **Execute Batch**, set **Processing Mode** to `16 concurrent requests` and hit
**Execute**.

That's the whole file, done, while you were reading this sentence.

Two separate dials, and most people only ever find the first one:

| Dial | What it changes |
|---|---|
| **Processing Mode** — threads | How many requests are in flight at the same time |
| **Reps** | How many records ride inside each request |

Threads make you faster. Reps make you *smaller* — fewer connections, less overhead, less
load on the API you're being trusted with. Turning both up is how a load that took an
afternoon takes a minute.

A thousand is not a universal answer, by the way — it's this API's published maximum. Every
API has its own limit, and the right number is the largest one it will accept without
complaining.

> **Need to start over?**
>
> Your Training Ground data is yours alone, and you can wipe it whenever you like. Paste
> this as a new endpoint and run it: everything you've loaded disappears, and the shared
> reference data stays. Handy if you want to re-run a lesson from clean.
>
> ```json
> // Name: Reset My Data
> // Method: DELETE
> // Path: /my-data
> // Description: Deletes everything you have loaded into the Training Ground
> ```

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
