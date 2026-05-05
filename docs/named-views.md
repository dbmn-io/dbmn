---
title: Named Views
layout: default
nav_order: 0
parent: Console
grand_parent: Documentation
---

# Named Views

Modern REST responses are deeply nested — a Manhattan shipment GET can wrap shipments inside a body, lines inside shipments, taxes inside lines. The same response can be presented many useful ways: one row per shipment, one row per line, one row per tax. **Named Views** lets you save each of those layouts, switch between them in a click, and export from any of them — all without changing your endpoint or re-running anything.

A view is a saved configuration that controls:

- **Which columns appear** in the Completed and Errors tabs, and the order they're in
- **Which array in the response produces one row each** — the *row basis*
- **Sort state** for that view

Views save **on the endpoint**, so they ride along with endpoint export/import — share an endpoint and your views go with it. Multiple views per tab; switch instantly; the most recently saved view becomes the default.

---

## Why this matters

Without views, every nested response forces a tradeoff: see the parent shipments, *or* see the line items, but not both — and rebuilding the layout each time is tedious.

With views you can:

- Keep a **Shipments** view (one row per shipment, summary columns)
- Keep an **Items** view (one row per line item, with the parent shipment ID and carrier repeated per row)
- Keep a **Taxes** view (one row per tax, with shipment and item context repeated)

Save once, switch with a dropdown, export the right shape every time. **Save As** lets you fork an existing view to experiment without losing the original.

---

## The Views Dropdown
{: #the-views-dropdown }

Click the `View: <name> ▼` button in the toolbar to switch views or create a new one.

- The active view's name and row basis are shown in the dropdown.
- Click a row to **switch** to that view.
- Click the **Edit** button on a row to open the editor for that view.
- Click **+ Create View…** to start a new view (defaulted to `View1`, `View2`, etc.).

---

## The View Editor
{: #the-view-editor }

Click **+ Create View…** or **Edit** to open the editor. Three regions:

**1. Available Columns (left panel)** — the full response tree.
- Search box at the top filters columns by name (substring, case-insensitive). Matches show their full path so you can disambiguate.
- Groups (objects/arrays) are expand-collapse toggles; clicking the chevron drills in.
- Groups containing already-selected leaves auto-expand on open.
- Tick a leaf checkbox to add it to the view.

**2. Selected Columns (right panel)** — what's actually in the view.
- Each row shows the column name (last segment) with a tooltip on the full path.
- Click a row to select it (highlight outline). Then:
  - **↑ / ↓** — move the selected column up/down by one position within its scope.
  - **Shift + ↑ / ↓** — jump the selected column to the top/bottom of its scope.
- Or drag-reorder with the mouse — same scope-local rule (you can reorder siblings within a wrapper, but can't drag a leaf out of its parent group).
- Click `×` to remove.

**3. Row Basis** — sits in the Selected panel header. The dropdown lists every selected array path plus `root`. The deepest selected array is picked by default; choose `root` to get one row per response. Changing the row basis re-derives which columns are *current* (read per-row) vs *ancestor* (read from the parent object and repeated per row).

**Save** writes the view to the endpoint. The saved view becomes the **default** for that tab — opening the console later lands on it.

**Save As** clones the current view to a new name — fork an existing view to experiment without losing the original.

---

## Row Basis — what it controls
{: #row-basis }

The row basis is the JSON path whose items become rows. Every other selected leaf is read either *relative to the row* (when the leaf path sits inside the row basis) or *as an ancestor* (read from a parent object and repeated for every row in that group).

**Example response:**
```json
{
  "body": [
    {
      "ShipmentId": "SHIP-A",
      "OlpnDetail": [
        { "ItemId": "ITM-A1", "Quantity": 3 },
        { "ItemId": "ITM-A2", "Quantity": 1 }
      ]
    },
    {
      "ShipmentId": "SHIP-B",
      "OlpnDetail": [{ "ItemId": "ITM-B1", "Quantity": 2 }]
    }
  ]
}
```

| Row Basis | Selected leaves | Result |
|-----------|-----------------|--------|
| `root` | `body` (as expand-cell) | 1 row per response; `body` cell shows `▸ N records` |
| `body` | `ShipmentId`, `OlpnDetail` | 1 row per shipment; `OlpnDetail` shows `▸ N records` |
| `body.OlpnDetail` | `body.ShipmentId` (ancestor), `body.OlpnDetail.ItemId`, `body.OlpnDetail.Quantity` | 3 rows; ShipmentId repeats per item from the parent shipment |

Per-row ancestor reads understand array boundaries — when row basis is `body.OlpnDetail`, the `body.ShipmentId` for each item resolves to *that item's* parent shipment, not all shipments.

---

## Set as Row from an Expand-cell
{: #set-as-row }

When a column renders as `▸ N records` (an expand-cell array), clicking the **Set as Row** button next to it drills the active view into that array — row basis swaps to that path, current/ancestor sources are recomputed, table re-renders. No new view created; same view, deeper drill.

If you want a brand-new view rooted at that array instead, click **Edit** on the active view and change the row basis there, or click **Save As** to fork the current view first.

---

## Default View
{: #default-view }

The most recently saved view becomes the default for that tab. Reopening the console (or switching tabs back) lands on the default. Saving any view promotes it to default.

---

## Hide a Column
{: #hide-a-column }

Click the `×` on a column header to remove it from the active view. The change persists immediately. Same for sub-table columns when an expand-cell is open.

---

## Views travel with the endpoint
{: #views-travel-with-endpoints }

Because views save on the endpoint definition, they're included whenever you:

- **Share an endpoint** (Share button → clipboard → paste in a teammate's Dobermann)
- **Export endpoints** to a `.dbmn.zip` file via Import/Export
- **Duplicate an endpoint**

This means a senior team member can build out the right Shipments / Items / Taxes views once, share the endpoint, and everyone on the team gets the same lens on the same data — without screenshots, screen-shares, or instructions.

---

## Exports match the active view
{: #exports-match-the-view }

CSV, Excel, and clipboard exports (Copy / Export menus) operate on **whatever the active view is showing**:

- The same columns, in the same order
- The same row basis (one row per shipment, one row per item, etc.)
- Filtered by the active search if one is set
- Sorted by the active sort if one is set

Switch to the view you want to export from, then export. No reshaping needed in Excel afterwards.

---

## Related Topics

- [Console](/docs/console/) — Run requests, monitor progress, analyse results
- [Endpoints](/docs/endpoints/) — Where views are saved
- [Import/Export](/docs/import-export/) — Sharing endpoints (and their views) with teammates
