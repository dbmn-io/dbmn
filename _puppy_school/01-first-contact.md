---
lesson_id: lesson_1
number: 1
slug: first-contact
title: First Contact
goal: Connect Dobermann to The Training Ground and run your first API requests
estimate: ~10 minutes
completion:
  criteria: Successful GETs against all four reference endpoints
  summary: carriers, locations, products and trading partners
checkpoint:
  pass: Good dog. All four reference endpoints fetched — Lesson 2 is unlocked.
  fail: Did the dog eat your homework? Looks like you haven't fetched all the reference data yet.
---

## Step 1 — Install and Sign In

Click the Dobermann icon in your VS Code activity bar.

Not installed yet? [Get it from the VS Code Marketplace.](https://marketplace.visualstudio.com/items?itemName=dbmn.dobermann)

Sign in with the same account you used to get here. No account yet? Open {icon:nav-account}
**Account** in the Hub and register there — it takes a minute. Once you're in, you're ready.

## Step 2 — Create Your Environment

An **environment** is where an API lives — its address and how you authenticate against it.
Set it up once, and every endpoint you build inside it inherits both.

In the Hub, open {icon:nav-environments} **Environments** and add a new one:

| Field | Value |
|---|---|
| Name | `DBMN Puppy School` |
| Base URL | `https://api.dbmn.io/functions/v1/playground` |
| Authentication | `DBMN` |

No tokens to copy. No headers to configure by hand. Dobermann injects your authentication
automatically at runtime, across every endpoint in this environment.

One more setting while you're here. Under **Execution Settings**, tick **Enable parallel
batch processing** and set **Max Concurrency** to **Extreme Parallel — 16 concurrent
requests**. You'll find out why in Lesson 2.

Click **Save Environment**. Then tell Dobermann to use it: at the top of the Hub, click the
environment selector {icon:env-switcher} — it reads `No environment` until you've picked
one — and choose `DBMN Puppy School`. Whatever that selector shows is where every request
you run will go.

> **In a hurry?**
>
> You can [download the starter file](/puppy-school/files/puppy-school-starter.dbmn.zip)
> and import via the dbmn hub menu — it creates this environment and every endpoint in
> the course. Do it by hand first if you can, though. Knowing how an environment is put
> together is worth the two minutes.

## Step 3 — Your First Request

Copy the template below. Then, in the Hub, open {icon:nav-api-catalogue} **API Catalogue**
and click {icon:paste-endpoint} **Paste Endpoint** — the clipboard button beside
{icon:add-endpoint} **Add Endpoint**. Dobermann reads the clipboard and fills in the name,
method and path for you. (Ctrl+V on any new, unsaved endpoint does the same.)

```json
// Name: Get Carriers
// Method: GET
// Path: /reference/carriers
```

Save it, then hit **Run API**. A Console tab opens by itself, and — all being well — your
results are waiting in its **Completed** tab.

## Step 4 — Reading the Console

The Console is where every response lands. It has several tabs — let's walk through the
ones that matter right now.

**The Completed tab** shows your successful responses as a table. It should open with one
row per carrier — SCAC codes, names, breeds, mottos — sortable and searchable. That's worth
a second look, because the API didn't send a table. It sent this, with the records "nested"
inside it:

```json
{
  "data": [
    {
      "scac": "BARK",
      "name": "BarkPost Express",
      "breed": "Golden Retriever",
      "motto": "Every package gets a tail wag"
    }
  ]
}
```

The carrier records are inside the `data` array, and Dobermann spotted that and made each
one a row. When it can't guess — or guesses wrong — you'll see a single row with a
`▸ N records` cell instead. Expand it and click **Set as Row**, and that array becomes the
rows. The choice is saved on the endpoint's **View**, so every future run of this endpoint
opens the same way. Views get a whole step of their own in Lesson 4; impatient puppies can
read [Named Views](/docs/named-views/) now.

**The Raw tab** shows the full HTTP conversation: the exact request sent and the complete
response received, syntax-highlighted. Click it now and have a look. This is where you go
when you need to know what actually went over the wire. Click {icon:filters} **Filters** to
show or hide the **Request** and **Response** halves. Each call's execution log is here as
well, for the day something misbehaves.

## Step 5 — Explore the Reference Data

Create an endpoint for each of the following. Copy each template, click
{icon:paste-endpoint} **Paste Endpoint** in the API Catalogue, save, then hit **Run API**.

```json
// Name: Get Locations
// Method: GET
// Path: /reference/locations
```

```json
// Name: Get Products
// Method: GET
// Path: /reference/products
```

```json
// Name: Get Trading Partners
// Method: GET
// Path: /reference/trading-partners
```

For each one, use what you just learned: check the **Completed** tab shows one row per
record, and if it doesn't, expand `data` and click **Set as Row**. That updates the
endpoint's **View**, and it sticks for every run from now on. Lesson 4 builds a view from
scratch; the reference is [Named Views](/docs/named-views/).

These four are your master data — carriers, warehouses, products and trading partners.
You'll reference them throughout Puppy School, and they behave exactly like the lookup
tables on a real implementation project: everything you load has to point at something
that already exists here. In Lesson 3 you'll find out what happens when it doesn't.

The full API reference lives at [dbmn.io/docs/playground](/docs/playground/) if you want to
see everything The Training Ground offers.

> **🐾 Dobermann Philosophy**
>
> Authentication should be configured once and forgotten. In Dobermann, auth lives at the
> environment level — every API request executed while connected to an environment inherits it automatically. If your
> session expires, Dobermann will take you through the login process, then execute your request automatically as soon as you are authenticated.

> **🦴 Dig Deeper**
>
> REST APIs use standard HTTP methods to declare intent — GET retrieves without modifying,
> POST creates, PUT updates, DELETE removes. Everything you just ran was a GET: read-only
> calls that leave the data exactly as you found it.
> [MDN's HTTP methods reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
> is worth bookmarking.
