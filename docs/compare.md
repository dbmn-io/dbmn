---
title: Compare
layout: default
nav_order: 5.5
parent: Documentation
---

# Compare
{: #overview }

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
3. Click **Compare**, beside **Chain**.
4. In the **Compare** dialog, choose **Other results from this endpoint**, then tick up to three
   results to compare with this one.
5. Click **Compare**.

The result you started from is the **Baseline**, **BL**: everything is measured against it. The
others are **C1**, **C2** and **C3**, in the order you ticked them. The tray at the top of the
dialog shows the four places as you fill them.

The Compare tab opens on its first step, **Match**.

- A run's environment shows beside each result, with any [header values](/docs/environments/#variables)
  it ran with (`DEV 880`, `DEV 840`), so one environment run for two companies is two results you
  can tell apart.
- A result marked **Incomplete** didn't fetch every page. The records on the pages it missed will
  show as missing.
- **Compare** is on the **Completed** tab only, and comes on once the run has ended.
- With only one result for the endpoint there is nothing to compare: run it again, or run it in
  another environment.
- **Other results from any endpoint** and **A file from your computer** are coming soon.

## Match
{: #match }

Match decides which record in one result is the same record in another.

**Comparing** lists the results, BL first, and the view. **Select results** opens the dialog
again, to pick a different Baseline or other results.

Under **Match on**, tick the columns that identify a record, then click **Check**. Choose a
business key such as `sku` or `itemCode`, or a few columns together. A database id usually won't
work: each environment numbers its records for itself.

**How BL matches C1** (or **each result**, with more than one) shows what the key does, over every
record:

| | |
|---|---|
| **One to one** | Records that pair up. These are compared |
| **Only in BL** | In the Baseline and not the other. They show as **Missing C1** in Results |
| **Only in C1** | In the other and not the Baseline. They show as **Missing BL** in Results |

If the key finds more than one record on either side, a second box lists them under **Match more
than one record: can't be compared**: **One BL to many C1**, **Many BL to one C1** and **Many to
many**. Click **Show** to see them, then tick another column so each record matches one.

The **Example** below the match shows one key's record from each side, so you can check the pairing
looks right. Step through keys with ◀ ▶, or type in **Find a key**.

Compare goes on only when the key is one to one in every result and pairs at least one record.

## Compare
{: #compare }

**Which columns do you want compared?** lists the view's columns. For each one:

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

The toolbar:

- **The results.** **BL** first: click it to make another result the Baseline. Click **C1**, **C2**
  or **C3** to hide a result (it isn't compared while hidden), and again to bring it back.
  {icon:compare-open-result} opens a result in its own Console.
- **Side by side** gives each column one sub-column per result. **Compact** gives each column one
  cell, with the values that differ in pills. Hover over the headings to see which result is which.
- **All columns** or **With differences**. **With differences** hides the compared columns that no
  row differs in, so a wide record shows only what changed. It only hides them from view: they are
  still compared, and one comes back as soon as a row differs in it. The key and the columns you
  set to **Don't compare** always show.
- {icon:filters} clears every filter. It's lit while a filter is on.
- {icon:compare-columns} **Columns**: tick the columns in the compare. A column you set to **Don't
  compare** is marked **show only**. Unticking a column removes it from the compare, so the counts
  change with it.
- **Search** finds rows, with the same syntax as the [Console's search](/docs/console/#search).
- The count of rows shown.
- {icon:compare-export} **Export** saves to Excel (see [Export](#export)).

Click a column heading to sort.

### Filter the rows
{: #filters }

- **Status**: click the arrow beside **Status**. Each line has a tick box under **Show**, to add or
  remove it, and a radio under **Only**, to see that line alone: **Only** on **DIFF** shows just the
  differences. Click **Only** again on the line that's alone to see every line again. The counts
  say how many rows each line has.
- **A column's count**: click the count in a column's heading to show only the rows that differ
  there. Click several and you see the rows that differ in all of them.

A filter that's on shows a small {icon:filters} beside it.

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

A compare is saved as you build it: the results, the key, the columns, Strict or Relaxed, which
rows, and the columns you hid.

In the Hub, {icon:nav-compare} **Compare** lists them. Click one to open its **Results**, with the
same results. Right-click it for:

- **Open**.
- **Edit**: pick the Baseline and the results again.
- **Duplicate**: a copy to change.
- **Delete**: removes the compare only. The results stay in **History**.

## Related Topics

- [Console](/docs/console/): where a compare starts
- [Named Views](/docs/named-views/): the columns a compare reads
- [Viewing Results](/docs/viewing-results/): History and the saved results
