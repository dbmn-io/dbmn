---
title: Chain
layout: default
nav_order: 3
parent: Console
grand_parent: Documentation
---

# Chain
{: #chain }

One API's results are often the next API's input: list the low-stock products, then raise a
purchase order for each. **Chain** sends the rows on a Console's **Completed** tab straight into
another endpoint's **Run Batch**. No copying to the clipboard, no file to save, and no limit on
the number of rows. Both runs remember the link, so you can always trace where a batch's data
came from.

## Chain a run's results
{: #chain-results }

1. Open a **completed** run's Console and go to the **Completed** tab.
2. Choose the view and type a search, so the table shows exactly the rows you want to send.
   Chain sends what the table shows: the view's columns and the rows that match the search.
3. Click **Chain**, beside **Copy** and **Export**.
4. In the **Chain from …** dialog, pick the endpoint to send them to, and click **Chain**.

**Run Batch** opens for that endpoint with the rows already loaded. Execute it as usual.

**Chain** is only on the **Completed** tab, and only once the run has completed.

## Choose the endpoint
{: #choose-endpoint }

The dialog first lists **Suggested** endpoints: those where every required variable has a
column of the same name, ignoring case and punctuation (`location.gln` fills
`{{location_gln}}`). A column the endpoint [remembered](/docs/batch-preparation/#remember-mapping)
counts too.

To send the rows somewhere else, type in **Send them to endpoint:**. The search matches the
endpoint's name and path.

Variables count wherever they are: in the path (`/orders/{{pk}}`), the query parameters, the
headers or the body. An endpoint with no variables at all has nothing for the rows to fill, so
**Chain** stays disabled for it.

If the rows came from a different environment or organisation than the active one, the dialog
says so. It is a warning: Run Batch always sends to the active environment.

## Mapping preview
{: #mapping-preview }

The preview lists the selected endpoint's variables and the column each one would take, with the
first row's value:

| Badge | Meaning |
|---|---|
| *(none)* | The column matches the variable's name |
| **guess** | Matched on part of the name. Check it on [Map & Transform](/docs/batch-preparation/#step-2-map-transform) |
| **⚠ missing** | No column fills this required variable. You map it on Map & Transform |
| **empty** | Optional variable (<code>&#124;opt</code>, <code>&#124;null</code>) with no column. It is left out of the request |

Generated `{{A8:…}}` and environment `{{ENV:…}}` variables fill themselves and are not listed.
Columns no variable uses are not listed either.

## The chained Run Batch
{: #chained-run-batch }

A chained Run Batch has no **Load Data** step: the rows are its input. A line at the top reads
**Chained from** the source run, and links back to its Console.

It then skips ahead the way every Run Batch does (see
[Skipping ahead](/docs/batch-preparation/#skip-ahead)): straight to **Review & Configure** when
every column maps and every row is valid, otherwise to the step that needs you. **Back** stops at
**Map & Transform**. To use different data, start a normal Run Batch.

If a Run Batch for that endpoint is already open, Dobermann asks before replacing what it holds.

The two runs are linked when you click **Execute**. Cancelling anywhere before that leaves no
link, and neither does a batch cancelled from the queue before it ran.

## The Links tab
{: #links-tab }

A run that has been chained, in either direction, has a **Links** tab in front of **Input**:

- **Came From** — the run whose rows became this batch's input.
- **Sent To** — every batch this run's rows were sent to.

| Column | |
|---|---|
| **Batch** | The linked run's ID. Click it to open that run's Console |
| **Endpoint** | Click it to open the endpoint |
| **Environment**, **When**, **Status** | The linked run's |
| **View**, **Rows** | The view the rows were taken from, and how many were sent |
| **Differences** | Where the linked run differs from this one |

### Differences
{: #differences }

**Differences** shows, as a warning, anything that changed between the two runs: the environment,
the organisation, or a request header both runs sent with different values (a **Location**, say).
**Same environment and headers** means nothing changed. Secrets such as `Authorization` are never
compared or shown.

## Related Topics

- [Console](/docs/console/) — the Completed tab, views and search
- [Named Views](/docs/named-views/) — choose the columns a chain sends
- [Batch Preparation](/docs/batch-preparation/) — mapping, review and execute
