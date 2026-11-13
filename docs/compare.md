---
title: Compare
layout: default
nav_order: 5.5
parent: Documentation
---

# Compare
{: #overview }

Added in v0.4.0
{: .label .label-green }

Is TEST the same as PROD? What changed in the item master since last week? Did the load land the
way the spreadsheet said?

**Compare** answers those questions in a few clicks. Start from a result in the Console, pick up
to three other results of the same endpoint, and Dobermann lines up their records and shows you,
cell by cell, what is different, what is missing and what is the same.

- **Environments side by side.** DEV, SIT, UAT and PROD, from the same GET, in one grid.
- **One environment over time.** This morning's run against last week's: what moved.
- **Before and after a load.** Pull the data, run your batch, pull it again, compare.

Compare reads results you already have in **History**. **Nothing is sent**: no request goes to
any API, so you can compare production data as often as you like.

> **Compare is in Beta.** It works, it's fast at any size, and it's still settling. Tell us what
> you find on [GitHub](https://github.com/dbmn-io/dbmn/issues): what's confusing, what's missing,
> what's wrong.
{: #beta }

## Start a compare
{: #start }

A compare always starts from a result.

1. Open a finished run's Console and go to the **Completed** tab.
2. Choose the [view](/docs/named-views/) whose columns you want compared. Compare reads every
   result through this view, so pick or edit it first.
3. Click **Compare**, beside **Chain**. The Compare tab opens on its first step, **Select**.
4. Choose **Other results from this endpoint**, then tick up to three results to compare.
5. Click **Next**.

The result you started from is the **Baseline**, **BL**: everything is measured against it. Pick
another in the **Baseline** column if you'd rather. The others are **C1**, **C2** and **C3**, in the
order you ticked them. The four slots across the top fill as you pick, each result in its own
colour, and stay there on every step.

Compare reads the results, then opens **Match**. The step bar at the bottom shows how far it has
got, on the step it leads to. **Back** and **Next**, beside it, move between the steps.

- A run's environment shows beside each result, with any [header values](/docs/environments/#variables)
  it ran with (`DEV 880`, `DEV 840`), so one environment run for two companies is two results you
  can tell apart.
- A result marked **Incomplete** didn't fetch every page: its slot is striped. The records on the
  pages it missed will show as missing.
- **Compare** is on the **Completed** tab only, and comes on once the run has ended.
- With only one result for the endpoint there is nothing to compare: run it again, or run it in
  another environment.
- **Other results from any endpoint** and **A file from your computer** are coming soon.

## Match
{: #match }

Match decides which record in one result is the same record in another. It opens as soon as you
click **Next**, while the results are read; the step bar shows how far that has got.

Under **Match on**, on the right, tick the columns that identify a record: a business key such as
`sku` or `itemCode`, or a few columns together. Each column shows a sample value from BL. A database
id usually won't work: each environment numbers its records for itself. Compare checks the match as
you tick.

**How BL matches C1** (or **each result**, with more than one), on the left, shows what the key does
over every record. It lines up under the slots: each row's picture sits under **BL** (hover it for
its name), and each result's count sits under that result's slot.

| | |
|---|---|
| **One to one** | Records that pair up. These are compared |
| **Repeated in C1** | One to many: BL has a value once (or not at all) and C1 has it on several records. These are compared too: BL's record against each of C1's |
| **Only in BL** | In the Baseline and not the other. They show as **Missing C1** in Results |
| **Only in C1** | In the other and not the Baseline. They show as **Missing BL** in Results |

The Baseline is always the "one". A value on more than one of BL's records stops the compare, in a
box headed **Match more than one record: can't be compared**: **Repeated in BL** and **Repeated in
both**. Tick another column so BL holds each value once, or make the other result the Baseline.

In the repeated rows a cell shows BL's records, the picture, then that result's: `36 ●< 200` is 36
records in BL and 200 in C1 on the same values. Large counts are shortened (`105K`); hover the cell
for the exact numbers and how many values they share.

When some values repeat but nothing stops the compare, the verdict says so in amber: BL's record is
compared with each of them. Go on to **Columns**.

### See the repeated records
{: #repeated }

Click a count in a repeated row to see those records:

- One row per value, the "one" side's record: BL's for **Repeated in C1**. The toggle at its start
  (**2 in C1**) opens the other side's records for that value alone, in that result's colour.
- **Repeated in both** lists the values; opening one shows both sides' records.
- Values the "one" side doesn't have are missing as well as repeated, so they're left out. Tick
  **Show the … values BL doesn't have** to list them too.
- **Open BL in the Console** and **Open C1 in the Console** show a result in full, every field
  included.
- **‹** and **›** page through the values, 25 at a time.

When one value is on thousands of records (a user id on every record, say), the window says why that
can't be a key and lists the values with how many records each side holds.

### The slots' menu
{: #slots }

From **Match** on, click a slot for its menu: **Make Baseline** (it swaps places with BL, and the key
is checked again), **Remove from the compare** (the results after it move up a place), and **Open in
the Console**. On **Results** the menu also has **Hide** and **Show**.

**Back** returns to **Select**, to pick a different Baseline or other results.

## Columns
{: #compare }

**Columns** lists the view's columns: the ones to compare, and the ones only to show. For each one:

- **Show** puts the column in Results.
- **Compare** says how its values are compared:

| | |
|---|---|
| **Strict** | The default. The value and its JSON type must be the same: `"00123"` is not `123`, and `"12.50"` is not `"12.5"`. Nothing is reformatted, because a dropped leading zero is exactly the kind of change you're looking for |
| **Relaxed** | Spaces at either end, repeated spaces and letter case don't count; a number equals the same text (`12.5` and `"12.5"`); blank, null and missing are one value. Leading zeros still count |
| **Don't compare** | The column shows in Results, but a difference in it is never a **DIFF**. Use it for ids and timestamps you want to see beside each record |

The key columns are always compared strictly.

**Which rows?** chooses the rows Results starts with:

- **Everything**: every record, matched or not.
- **All of BL**: every Baseline record, with what the others have of it.
- **All of C1**: every record of the other result.
- **Matching only**: records found on both sides.

It only sets the starting filter. Every row is still counted, and the **Status** filter in Results
changes it at any time.

Click **Generate** to build Results.

## Results
{: #results }

One grid, one row per record.

The **Status** column says what Compare found:

| | |
|---|---|
| **Same** | Every compared column matches |
| **DIFF** | At least one compared column differs. With three or four results, the letters say which: **DIFF BL** means the others agree and the Baseline is the odd one out; **DIFF C2** means C2 differs from the Baseline |
| **Missing** | A result doesn't have the record: **Missing C1**, **Missing BL** |

A column's heading shows a count of the rows that differ in it. A cell that differs is marked in its
result's colour.

A value repeated in a result (one to many) is a row for each of that result's records, each compared
with BL's one record, so one can be **Same** and another **DIFF**. The other results' records for
the value repeat on every one of those rows. Add `id` as a shown column if you need to tell the rows
apart.

**Relationship**, between the key and **Status**, shows how each row's key meets the results, as
Match's pictures: one to one, one to many, not in every result, not in BL. Hover a picture for its
name. It appears when the rows don't all have the same relationship.

Across the top, beside the slots (under them, in a narrow window):

- **The slots**, BL first. Click **C1**, **C2** or **C3** for its menu: **Hide** (it isn't compared
  while hidden) or **Show**, **Make Baseline** (it swaps places with BL), and **Open in the
  Console**. Click **BL** to make another result the Baseline, or to open it. A striped slot didn't
  fetch every page; its menu says so. Hiding a result that repeats values folds its extra rows
  away, as if it weren't in the compare; **Show** brings them back.
- **Side by side** gives each column one sub-column per result. **Compact** gives each column one
  cell, with the values that differ in pills. Hover over the headings to see which result is which.
- **All columns** or **Diffs**. **Diffs** hides the compared columns that no row differs in, so a
  wide record shows only what changed. It only hides them from view: they are
  still compared, and one comes back as soon as a row differs in it. The key and the columns you
  set to **Don't compare** always show.
- {icon:filters} clears every filter. It's lit while a filter is on.
- {icon:compare-columns} **Columns**: tick the columns in the compare. A column you set to **Don't
  compare** is marked **show only**. Unticking a column removes it from the compare, so the counts
  change with it.
- **Search** finds rows, with the same syntax as the [Console's search](/docs/console/#search),
  `@column` terms included: `@status=active`, `@quantityOnHand>10`. Type `@` to pick a column.
  **Status** and **Relationship** aren't searched: their own filters do that.
- The count of rows shown.
- {icon:compare-export} **Export** saves to Excel (see [Export](#export)).

Click a column heading to sort.

### Filter the rows
{: #filters }

- **Status**: click the arrow beside **Status**. Each line has a tick box under **Show**, to add or
  remove it, and a radio under **Only**, to see that line alone: **Only** on **DIFF** shows just the
  differences. Click **Only** again on the line that's alone to see every line again. The counts
  say how many rows each line has.
- **Relationship**: click the arrow beside its picture. It works as **Status** does: **Show**,
  **Only**, and how many rows each relationship has. **Only** on one to many shows just the
  repeated rows.
- **A column's count**: click the count in a column's heading to show only the rows that differ
  there. Click several and you see the rows that differ in all of them.

A filter that's on shows a small {icon:filters} beside it. Click it to clear that filter alone,
without opening its menu.

### A record in full
{: #record }

Click a row, or right-click anywhere on it, to open that record from every result:

- **Table** lists the view's columns, one result per column, with the differences marked.
- **JSON** shows each record exactly as its system sent it, side by side, lines aligned.
- **DIFF: All** marks differences in the columns you aren't comparing too, more faintly. **Selected**
  marks only the compared ones.
- {icon:window-maximise} fills the window, for wide records.

A long value, or one holding JSON, is cut short in the grid. Click it to open that value in full,
formatted, as in the Console.

## Export
{: #export }

{icon:compare-export} **Export** saves what Results shows, as an Excel workbook: a **Summary** sheet (the results compared, the key,
the columns and the counts), then the **Details**, one row per record shown, with the filters and
search applied. Past Excel's row limit, the rows run on into **Details 2**, **Details 3** and so on.

Values keep their type: text stays text, leading zeros and all, and numbers stay numbers.

## Saved compares
{: #saved }

A compare is saved once **Next** on **Select** picks its results, then as you build it: the results, the key, the columns, Strict or Relaxed, which
rows, and the columns you hid. Change its results (add C3, say) and **Columns** and **Results** wait
for **Match** again, even after you close and reopen it, until it has been compared with exactly
those results.

In the Hub, {icon:nav-reporting} **Reporting** lists them. Click one to open it on **Select**, with
everything as saved. Nothing is read until you move on: pick other results if you like, or click
**Results** in the step bar to go straight there. Compare reads, matches and compares the results
on the way, and the steps before Results tick as it goes. Right-click a compare for:

- **Open**.
- **Duplicate**: a copy to change.
- **Delete**: removes the compare only. The results stay in **History**.

## Related Topics

- [Console](/docs/console/): where a compare starts
- [Named Views](/docs/named-views/): the columns a compare reads
- [Viewing Results](/docs/viewing-results/): History and the saved results
