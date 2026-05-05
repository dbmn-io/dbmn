---
title: Shortcuts
layout: default
nav_order: 9
parent: Documentation
---

# Keyboard Shortcuts

Dobermann provides keyboard shortcuts for faster navigation and execution.

## Quick Access - Search and Execute Endpoints

**Shortcut:** `Alt+D E` (Windows/Linux/Mac)

The Quick Access feature provides fast, keyboard-driven endpoint search and execution.

**How it works:**
1. Press `Alt+D` then `E` (chord shortcut - two-step key sequence)
2. Type to search endpoints by name, method, path, or folder
3. Press `Enter` to select an endpoint
4. Choose action: **Run** or **Edit Endpoint**
5. Press `Enter` to execute

**Example workflow:**
- `Alt+D E` -> Type "create order" -> `Enter` -> Arrow to "Run" -> `Enter`

> **Note:** Run auto-detects the right mode — single API call or batch — based on whether the endpoint has template variables.

**Alternative access methods:**
- Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) -> "DBMN: Search Endpoints"

---

## Keyboard-Only Workflow Example

You can execute batch requests entirely with the keyboard:

1. **Open Quick Access:** `Alt+D E`
2. **Search endpoint:** Type endpoint name
3. **Select endpoint:** `Enter`
4. **Choose Batch:** Arrow down, `Enter`
5. **Load data:** `Tab` to file input, `Enter`, select file → click **Read Data**
6. **Map columns:** `Tab` through dropdowns, `Enter` to select → click **Next**
7. **Review & edit data:** Review grid, fix any issues → click **Next**
8. **Review JSON:** Confirm generated payloads → click **Next**
9. **Execute:** Click **Execute** to start the batch

---

## Chord Shortcuts Explained

Dobermann uses **chord shortcuts** (two-step key sequences) to avoid conflicts with VS Code and other extensions.

**Current pattern:** `Alt+D` followed by a second key
- `Alt+D E` - Endpoints Quick Access
- Future: Reserved for additional shortcuts (e.g., `Alt+D T` for Transactions)

**Why "D"?**
The "D" prefix represents **Dobermann** - creating a dedicated shortcut namespace for all Dobermann features.

**How to use:**
1. Press and release `Alt+D`
2. Press `E`
3. Quick Access opens

---

## Customizing Shortcuts

You can customize Dobermann shortcuts through VS Code's Keyboard Shortcuts editor:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Preferences: Open Keyboard Shortcuts"
3. Search for "Dobermann"
4. Click the pencil icon next to any command
5. Press your desired key combination
6. Press `Enter` to save

---

## Grid Data Entry Shortcuts

When using the manual data entry grid in Run Batch, these keyboard shortcuts enable fast data entry:

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell. From last cell, adds a new row. |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move down to same column in next row |
| `Shift+Enter` | Move up to same column in previous row |
| `Arrow Keys` | Navigate between cells |
| `Ctrl+D` | Copy value from cell above (fill-down) |
| `Escape` | Clear current cell |

### Progressive Tab Copy (Nested Templates)

For templates with nested structures (e.g., orders with line items), the grid supports **progressive Tab copy** to speed up repetitive data entry:

1. **Fill first row completely** with all values
2. **Tab from the last cell** to add a new empty row
3. **Tab again** (without typing) to copy root-level values (e.g., order ID, destination)
4. **Tab again** to copy next nesting level values
5. **Start typing** to cancel progressive copy and enter unique values

**Example:** For a shipment with multiple items:
- Row 1: Enter `DEST-001`, `SKU-A`, `10`
- Tab from last cell -> new row added
- Tab again -> `DEST-001` copied (same shipment)
- Type `SKU-B` -> unique SKU for this item

---

## JSON Editor Shortcuts

When editing the request body in the endpoint editor:

| Shortcut | Action |
|----------|--------|
| `Ctrl+M` / `Cmd+M` | Cycle line variable: Value -> Input -> ENV -> A8 -> restore |
| `Ctrl+S` / `Cmd+S` | Save endpoint |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Shift+Z` | Redo |
| `Ctrl+/` / `Cmd+/` | Toggle line comment (`//`) |

### Ctrl+M Line Variable Cycling

The `Ctrl+M` shortcut provides the fastest way to convert JSON values into template variables:

1. **Place cursor** on any JSON key-value line (e.g., `"quantity": 100`)
2. **Press `Ctrl+M`** to cycle through variable states:
   - Value -> `"{{quantity:number}}"` (type auto-detected, original saved in comment)
   - -> `"{{ENV:}}"` (autocomplete triggers for environment variables)
   - -> `"{{A8:}}"` (autocomplete triggers for Automatic variables)
   - -> Original value restored

3. **Use `Ctrl+Z`** to undo if you cycle past your target

**Note:** A8 = **A**utomatic. These variables are system-generated and you will NOT be prompted for them during execution.

### Comments in JSON Templates

The editor supports JSONC (JSON with Comments). Use comments to:
- Document template variables and their expected values
- Temporarily disable JSON properties during testing
- Add notes about API requirements

---

## Future Shortcuts

The `Alt+D` namespace is reserved for additional Dobermann shortcuts:
- `Alt+D T` - Quick Transaction search (planned)
- `Alt+D V` - Quick Environment switcher (planned)

---

## Related Topics

- [Getting Started](/docs/getting-started/) - Initial setup and first steps
- [Endpoints](/docs/endpoints/) - Endpoint configuration and execution
- [Batch Preparation](/docs/batch-preparation/) - CSV upload and column mapping
- [Template Variables](/docs/template-variables/) - Variable syntax and modifiers
