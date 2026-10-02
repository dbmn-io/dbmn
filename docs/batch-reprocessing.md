---
title: Batch Reprocessing
layout: default
nav_order: 2
parent: Console
grand_parent: Documentation
---

# Batch Reprocessing

When a batch finishes with errors, you don't need to re-run the entire batch. Dobermann lets you reprocess only the transactions that failed — keeping completed results intact and saving time.

---

## Quick Start

1. Run a batch from the [Console](/docs/console/)
2. Once the batch finishes (or finishes with errors), click **Reprocess** at the bottom of the Console
3. Choose what to reprocess (errors only, incomplete, etc.) and click **Continue**
4. Dobermann resets the selected transactions and re-executes them in the same batch

---

## Reprocess Options

When you click **Reprocess**, the **Reprocess Batch** window offers five options:

| Option | What it reprocesses |
|--------|-------------------|
| **Incomplete** | All non-completed transactions (errors + pending) |
| **Errors only** | Only transactions that returned an error response |
| **Pending only** | Only transactions still in pending status |
| **Split array errors** | Splits failed array transactions into individual elements (see [Split Reprocess](#split-reprocess) below). Not offered for a paginated batch |
| **All** | Every transaction including completed ones — a full do-over (asks you to confirm) |

Selected transactions are reset to pending and re-executed within the same batch. Completed transactions are left untouched (except with **Reprocess All**).

---

## Reprocess One Transaction
{: #reprocess-one }

For quick fixes — like correcting a single record in your source data — reprocess one transaction without touching the rest of the batch. Any of these works:

- The **Reprocess** button on its card in the **Raw** tab
- The **Reprocess** button in [View transaction](/docs/console/#view-transaction)
- Right-click its row on the **Error** or **Input** tab → **Reprocess**

The transaction updates in real time as it runs, and a **reprocess count badge** shows how many times it has been reprocessed.

This works during and after a batch run, and on a single Run API transaction too — Reprocess runs it again.

---

## Split Reprocess

When a batch request contains an array (e.g., creating multiple items in one API call), a single bad element can fail the entire request. **Split Array Errors** breaks each failed array transaction into individual requests — one per element — so you can isolate exactly which element caused the error.

**How it works:**
1. Choose **Split Array Errors** from the reprocess menu
2. Dobermann finds failed transactions that contain array data
3. Each array element becomes its own transaction
4. The new individual transactions execute automatically

This is useful for bulk data loads where a few bad records shouldn't block the rest.

---

## Reprocess Count Badge

Each transaction tracks how many times it has been reprocessed. Once it has, the 🔄 on its **Reprocess** button becomes a numbered badge:

- **No badge** — never reprocessed
- **Badge with number** — reprocessed that many times (e.g., "2" means twice)
- Completed transactions that were reprocessed keep the badge on a disabled button

---

## When Reprocessing is Available

Reprocessing is available when a batch has reached a terminal state:

| Batch Status | Available Actions |
|-------------|-------------------|
| **Completed** | Reprocess, Copy |
| **Error** | Reprocess, Copy |
| **Cancelled** | Reprocess, Resume |
| **Stopped / Paused** | Resume (not Reprocess) |
| **Running / Pending** | [Reprocess one transaction](#reprocess-one) only (batch-level reprocess disabled) |
| **Paginated** | Reprocess (no Split Array Errors) |

**Copy** makes a new batch from this one's input rows, so you can run the same load against another environment. Its Settings tab records where it was copied from.

{: .note }
Stopped and paused batches show **Resume** instead of Reprocess, since the batch hasn't finished yet. A paginated batch reprocesses its failed pages like any other batch: each page runs its own request again. **Split Array Errors** isn't offered there, because splitting would change how the next page is numbered.

---

## Related Topics

- [Console](/docs/console/) — Run requests, monitor progress, analyse results
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Pagination](/docs/pagination/) — Configure and run paginated API requests
