---
title: Help Mode
layout: default
nav_order: 1.6
parent: Documentation
---

# Help Mode
{: #help-mode }

Every control in Dobermann has a section on this site, and help mode is the shortest way from one to the other. Turn it on, click the button you are wondering about, and its page opens in your browser. There are no "?" icons to hunt for: help mode covers the whole Hub and every tab in it.

---

## Turn it on
{: #turn-on }

Two ways, anywhere in Dobermann:

- Click the {icon:help} **help button** at the right end of the Hub header. It is always there, even when the rail is collapsed.
- Press <kbd>?</kbd>, as long as you are not typing in a field or an editor.

A banner appears at the top of the Hub while help mode is on:

> **Help mode** Click an outlined control to read about it on dbmn.io. `Esc` to leave.

---

## What you see
{: #what-you-see }

Every documented control gets a **dotted outline**, and the pointer becomes a help cursor over it. Nothing moves and nothing else changes.

- **Click an outlined control** and its section opens here, in your browser. The control does not do its normal job.
- **Other buttons and links do nothing** while help mode is on, so you cannot run or save something by accident while looking for help.
- Clicks on plain text and empty space pass through as usual.
- In a list of repeated rows (the catalogue, History, a results table) only the first row on screen is outlined; the link is the same for every row.

---

## Where it works
{: #where-it-works }

Help mode is one state for the whole Hub. Turn it on anywhere and it is on everywhere:

| Surface | Covered |
|---|---|
| The Hub itself | Header, rail, API Catalogue, Environments, History, Import, Export, Account, Settings |
| Endpoint editor | Every section and footer button |
| Environment editor | Every tab, field group and footer button |
| Run Batch | The step bar, each step's controls, the footer |
| Console | Tabs, toolbar, Raw tab bar, Settings sections, footer buttons, the View editor and Pagination windows |

A tab opened while help mode is on starts in help mode too.

---

## Leave it
{: #leaving }

Press <kbd>Esc</kbd>, or click the {icon:help} help button again. The outlines and the banner go, and every control works normally.

---

## The one in-app explainer

Help mode links out to these docs. The one piece of help that stays inside Dobermann is the ⓘ on Run Batch's Review step — beside **Grouped by**, or **API calls** when nothing is grouped — which opens *How your rows become API requests* for the batch you are about to send. See [Batch Preparation](/docs/batch-preparation/#nested-grouping).

---

## Related Topics

- [The Hub](/docs/hub/) — Where the help button lives
- [Shortcuts](/docs/shortcuts/) — `?` and `Esc`, with every other key
- [Getting Started](/docs/getting-started/) — Your first environment, endpoint and run
