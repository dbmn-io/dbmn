---
title: Shortcuts
layout: default
nav_order: 9
parent: Documentation
---

# Keyboard Shortcuts

Dobermann's shortcuts work inside the Hub and its tabs. On a Mac, read Cmd for Ctrl.

## Hub Tabs

| Shortcut | Action |
|----------|--------|
| `Ctrl+W` | Close the active Hub tab (endpoint editor, Console, Run Batch, and so on) |
| `?` | Turn [help mode](/docs/help-mode/) on or off, when you are not typing in a field |
| `Esc` | Leave help mode; leave a full-window editor; in a transaction window, close it |

`Ctrl+W` honours unsaved changes — if the active tab is dirty, you'll get the standard **Save / Discard / Cancel** dialog before it closes. The shortcut only fires when the Hub itself is focused; in any other editor it falls back to VS Code's built-in close-editor behaviour.

This is the only shortcut Dobermann registers with VS Code, so it is the only one you can rebind in **Preferences: Open Keyboard Shortcuts** (search for "DBMN"). The rest below are built into the editors.

---

## Endpoint Editor

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save endpoint |
| `Ctrl+V` | On a new, unsaved endpoint: paste a shared endpoint from the clipboard |

### Request body editor

| Shortcut | Action |
|----------|--------|
| `Ctrl+M` | Cycle the line's value: value → `{{Input}}` → `{{ENV:}}` → `{{A8:}}` → original |
| `Ctrl+Shift+M` | Insert `{{}}` at the cursor, or remove the `{{…}}` the cursor is in |
| `Ctrl+/` | Toggle line comment (`//`), on the line or the selection |
| `Ctrl+D` | Delete the line — or, on a line that opens `{` or `[`, the whole block |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Esc` | Exit full-window mode |

### Ctrl+M Line Variable Cycling

The `Ctrl+M` shortcut provides the fastest way to convert JSON values into template variables:

1. **Place cursor** on any JSON key-value line (e.g., `"quantity": 100`)
2. **Press `Ctrl+M`** to cycle through variable states:
   - Value → `"{{quantity:number}}"` (type auto-detected, original saved in a comment)
   - → `"{{ENV:}}"` (autocomplete triggers for environment variables)
   - → `"{{A8:}}"` (autocomplete triggers for generated variables)
   - → Original value restored
3. **Use `Ctrl+Z`** to undo if you cycle past your target

The **Line Variable** dropdown on the toolbar jumps straight to **Input**, **Environment** or **Generated (A8)**.

**Note:** A8 = **A**utomatic. These variables are system-generated and you will NOT be prompted for them during execution.

### Comments in JSON Templates

The editor supports JSONC (JSON with Comments). Use comments to:
- Document template variables and their expected values
- Temporarily disable JSON properties during testing
- Add notes about API requirements

---

## Run API Form

| Shortcut | Action |
|----------|--------|
| `Ctrl+V` | In any field: fill every field from a copied spreadsheet row (header row + data row). See [Run API — Paste a row](/docs/run-api/#paste-a-row) |
| `Esc` | Close the form |

---

## Run Batch Data Grid

When using the data entry grid on **Validate**, these shortcuts enable fast data entry:

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell. From the last cell of the last row, adds a new row |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move down to the same column in the next row; on the last row, adds a row |
| `Shift+Enter` | Move up to the same column in the previous row |
| `Arrow Up / Down` | Move between rows |
| `Ctrl+D` | Copy the value from the cell above (fill-down) |
| `Escape` | Clear the current cell |
| `Ctrl+Z` | Undo the last paste into the grid |

### Progressive Tab Copy (Nested Templates)

For templates with nested structures (e.g., orders with line items), the grid speeds up repetitive entry: after Tab adds a new row, a hint beside **Add Row** offers to copy the header-level values from the row above. Press Tab again to take them; start typing to enter your own.

**Example:** For a shipment with multiple items:
- Row 1: Enter `DEST-001`, `SKU-A`, `10`
- Tab from last cell → new row added
- Tab again → `DEST-001` copied (same shipment)
- Type `SKU-B` → unique SKU for this item

---

## Console

| Shortcut | Action |
|----------|--------|
| `Esc` | Leave a full-window pane; in a **View transaction** window, close it |

Click a column header to sort: ascending, descending, then off. See [Console — Search](/docs/console/#search) for the search operators.

---

## Related Topics

- [Getting Started](/docs/getting-started/) - Initial setup and first steps
- [The Hub](/docs/hub/) - Tabs and navigation
- [Endpoints](/docs/endpoints/) - Endpoint configuration and the editor toolbar
- [Batch Preparation](/docs/batch-preparation/) - CSV upload and column mapping
- [Template Variables](/docs/template-variables/) - Variable syntax and modifiers
