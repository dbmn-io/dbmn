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
2. Once the batch finishes (or finishes with errors), click **Reprocess Batch** in the Console toolbar
3. Choose what to reprocess (errors only, incomplete, etc.)
4. Dobermann resets the selected transactions and re-executes them in the same batch

---

## Reprocess Options

When you click **Reprocess Batch**, a quick pick menu offers five options:

| Option | What it reprocesses |
|--------|-------------------|
| **Reprocess Errors Only** | Only transactions that returned an error response |
| **Reprocess Incomplete** | All non-completed transactions (errors + pending) |
| **Reprocess Pending Only** | Only transactions still in pending status |
| **Split Array Errors** | Splits failed array transactions into individual elements (see [Split Reprocess](#split-reprocess) below) |
| **Reprocess All** | Every transaction including completed ones — a full do-over (requires confirmation) |

Selected transactions are reset to pending and re-executed within the same batch. Completed transactions are left untouched (except with **Reprocess All**).

---

## Per-Card Retry

For quick fixes — like correcting a single record in your source data — you can retry individual transactions directly from the **RAW tab** without reprocessing the whole batch.

- Failed transaction cards show a **Retry** button
- Click it to re-execute just that one transaction
- The card updates in real-time as the retry executes
- A **retry count badge** appears showing how many times the transaction has been retried

Per-card retry works both during and after batch execution.

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

## Retry Count Badge

Each transaction tracks how many times it has been retried. After a retry, the RAW tab card shows a numbered badge instead of the retry icon:

- **No badge** — never retried
- **Badge with number** — retried that many times (e.g., "2" means retried twice)
- Completed cards that were previously retried show the badge as a disabled indicator

---

## When Reprocessing is Available

Reprocessing is available when a batch has reached a terminal state:

| Batch Status | Available Actions |
|-------------|-------------------|
| **Completed** | Reprocess Batch, Copy Batch |
| **Error** | Reprocess Batch, Copy Batch |
| **Cancelled** | Reprocess Batch |
| **Stopped / Paused** | Resume (not Reprocess) |
| **Running / Pending** | Per-card retry only (batch-level reprocess disabled) |
| **Paginated** | Reprocessing not available |

{: .note }
Stopped and paused batches show **Resume** instead of Reprocess, since the batch hasn't finished yet. Paginated batches cannot be reprocessed due to their sequential page-dependent nature.

---

## Related Topics

- [Console](/docs/console/) — Run requests, monitor progress, analyse results
- [Batch Preparation](/docs/batch-preparation/) — Data loading and column mapping
- [Pagination](/docs/pagination/) — Configure and run paginated API requests
